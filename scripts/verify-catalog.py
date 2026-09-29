#!/usr/bin/env python3
"""Crawl public HTML and assets without browser automation or production mutation."""
import concurrent.futures
import datetime
import hashlib
import json
import pathlib
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

base = sys.argv[1].rstrip("/")
output = pathlib.Path(sys.argv[2])
canonical_base = "https://charmvilla-gallery-site.vercel.app"


def fetch(path):
    url = base + path
    try:
        with urllib.request.urlopen(url, timeout=60) as response:
            return response.status, response.read(), response.headers.get("Content-Type", "")
    except urllib.error.HTTPError as error:
        return error.code, error.read(), error.headers.get("Content-Type", "")


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.links, self.assets, self.canonicals, self.ids, self.schemas = [], [], [], [], []
        self.h1 = self.shells = 0
        self.schema = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "a":
            self.links.append(a.get("href", ""))
        if tag == "img":
            src = a.get("src", "")
            if src.startswith("/_next/image?"):
                src = urllib.parse.parse_qs(urllib.parse.urlsplit(src).query)["url"][0]
            if src.startswith("/"):
                self.assets.append(src)
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href"))
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "h1":
            self.h1 += 1
        if "catalog-shell" in a.get("class", "").split():
            self.shells += 1
        if tag == "script" and a.get("type") == "application/ld+json":
            self.schema = ""

    def handle_data(self, data):
        if self.schema is not None:
            self.schema += data

    def handle_endtag(self, tag):
        if tag == "script" and self.schema is not None:
            self.schemas.append(json.loads(self.schema))
            self.schema = None


status, xml, _ = fetch("/sitemap.xml")
assert status == 200, "Sitemap unavailable"
paths = [urllib.parse.urlsplit(node.text).path for node in ET.fromstring(xml).iter() if node.tag.endswith("}loc")]
assert len(paths) == 26 and len(set(paths)) == 26, paths
known = set(paths)
assets, pages, failures = set(), [], []
home_products = set()


def inspect(path):
    status, body, _ = fetch(path)
    page = Page(body.decode())
    issues = []
    if status != 200: issues.append(f"HTTP {status}")
    if page.h1 != 1: issues.append(f"h1 count {page.h1}")
    if path != "/" and page.canonicals != [canonical_base + path]: issues.append("canonical mismatch")
    if path != "/" and page.shells != 1: issues.append("catalog shell count")
    if len(page.ids) != len(set(page.ids)): issues.append("duplicate IDs")
    product_links = set()
    for href in page.links:
        parsed = urllib.parse.urlsplit(href)
        if parsed.netloc: continue
        if parsed.path.startswith(("/products/", "/collections/")):
            if parsed.path not in known: issues.append(f"broken destination: {href}")
            if parsed.path.startswith("/products/"): product_links.add(parsed.path)
        if href.startswith("#") and urllib.parse.unquote(href[1:]) not in page.ids:
            issues.append(f"missing anchor: {href}")
    if path.startswith("/products/"):
        if len(page.schemas) != 1 or page.schemas[0].get("@type") != "Product": issues.append("missing Product schema")
        if any("offers" in schema or "aggregateRating" in schema for schema in page.schemas): issues.append("unapproved commerce facts")
        if not {"product-details", "product-visit"}.issubset(set(page.ids)): issues.append("missing detail or inquiry")
    return path, page, product_links, {"path": path, "status": status, "h1": page.h1, "canonical": page.canonicals, "productLinks": len(product_links), "issues": issues}


with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for path, page, product_links, result in pool.map(inspect, paths):
        pages.append(result)
        assets.update(page.assets)
        failures.extend(f"{path}: {issue}" for issue in result["issues"])
        if path == "/": home_products = product_links
if len(home_products) != 20: failures.append(f"Homepage has {len(home_products)} product destinations, expected 20")


def inspect_asset(path):
    status, body, content_type = fetch(path)
    return {"path": path, "status": status, "contentType": content_type, "bytes": len(body), "sha256": hashlib.sha256(body).hexdigest()}


with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    asset_results = list(pool.map(inspect_asset, sorted(assets)))
for result in asset_results:
    if result["status"] != 200 or not result["contentType"].startswith("image/"):
        failures.append(f"Asset failed: {result['path']}")

missing = []
for path in ["/products/does-not-exist", "/collections/does-not-exist", "/does-not-exist"]:
    status, body, _ = fetch(path)
    page = Page(body.decode())
    result = {"path": path, "status": status, "shells": page.shells, "recoveryLink": "/collections/all" in page.links}
    missing.append(result)
    if status != 404 or page.shells != 1 or not result["recoveryLink"]: failures.append(f"404 recovery failed: {path}")

report = {"checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "base": base, "passed": not failures, "pages": pages, "homepageProductDestinations": sorted(home_products), "assets": asset_results, "notFound": missing, "failures": failures}
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"passed": report["passed"], "routes": len(pages), "assets": len(asset_results), "homepageProducts": len(home_products), "notFound": missing, "failures": failures}, ensure_ascii=False))
sys.exit(bool(failures))
