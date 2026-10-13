# real photo -> white-balanced RGBA cutout from a hand-traced polygon
import sys, json, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src,dst,poly=sys.argv[1],sys.argv[2],json.loads(sys.argv[3])
im=Image.open(src).convert('RGB'); a=np.asarray(im).astype(float)
bg=a[40:300,100:1900].reshape(-1,3).mean(0); g=bg.mean()/bg
print('bg',bg.round(1),'gain',g.round(3))
a=np.clip(a*g,0,255)
m=Image.new('L',im.size,0); ImageDraw.Draw(m).polygon([tuple(p) for p in poly],fill=255)
m=m.filter(ImageFilter.GaussianBlur(1.2))
out=Image.fromarray(a.astype(np.uint8)).convert('RGBA'); out.putalpha(m)
x0=min(p[0] for p in poly);x1=max(p[0] for p in poly);y0=min(p[1] for p in poly);y1=max(p[1] for p in poly)
out.crop((x0-4,y0-4,x1+4,y1+4)).save(dst)
