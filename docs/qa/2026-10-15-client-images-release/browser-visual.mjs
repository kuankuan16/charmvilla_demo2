const fs = await import('node:fs/promises');
const dir = '/Users/kuan/Documents/Codex/charmvilla-release-20261015/docs/qa/2026-10-15-client-images-release';
const config = JSON.parse(await fs.readFile(`${dir}/browser-phase.json`, 'utf8'));
const page = (await taskSpace(44)).page('p1');
await page.cdp('Runtime.enable'); await page.cdp('Network.enable'); await page.cdp('Log.enable');
await page.events();
const results = [];
for (const lang of ['zh', 'en']) for (const width of [1440, 390]) {
  const height = width === 390 ? 844 : 900, prefix = lang === 'zh' ? '/zh' : '';
  await page.cdp('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:width === 390});
  await page.goto(`${config.base}${prefix}/products/snowflake-gift-box`);
  const record = {lang,width,images:[]};
  for (let index=0;index<4;index++) {
    await page.click(`loc=css:.product-thumbnails button:nth-of-type(${index+1})`);
    await page.waitForFunction(i=>{const el=document.querySelectorAll('.product-slide')[i],img=el?.querySelector('img');return el?.dataset.active === 'true' && img?.complete && img.naturalWidth>0 && +getComputedStyle(el).opacity===1;}, index, {timeout:15000});
    const image = await page.evaluate(()=>{const img=document.querySelector('.product-slide[data-active="true"] img');return {src:img.currentSrc,decoded:img.naturalWidth,overflow:document.documentElement.scrollWidth>innerWidth,viewport:innerWidth};});
    if (image.overflow||image.viewport!==width||!image.src.includes(index===3?'unboxed-2-hd-v5':'smooth-bg-v5')) throw new Error(JSON.stringify(image));
    record.images.push(image);
  }
  await page.evaluate(()=>scrollTo(0,0));
  const shot = await page.cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await fs.writeFile(`${dir}/${config.phase}-${lang}-${width}-image.png`,Buffer.from(shot.data,'base64'));
  await page.goto(`${config.base}${prefix}/products/kyoto-gift-box`);
  record.brew = await page.evaluate(()=>({padding:getComputedStyle(document.querySelector('.brew-steps')).getPropertyValue('--brew-row-padding').trim(),minHeight:getComputedStyle(document.querySelector('.brew-steps li')).minHeight,steps:document.querySelectorAll('.brew-steps li').length}));
  if(record.brew.padding!==(width===390?'40px':'64px')||record.brew.steps!==5||(width===1440&&record.brew.minHeight!=='240px')) throw new Error(JSON.stringify(record));
  await page.evaluate(()=>{const e=document.querySelector('.brew-steps li:last-child');scrollTo(0,scrollY+e.getBoundingClientRect().top-innerHeight*.35+30);});
  await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.brew-process')).getPropertyValue('--brew-stage'))>=3.99,undefined,{timeout:10000});
  record.brew.stage=await page.evaluate(()=>getComputedStyle(document.querySelector('.brew-process')).getPropertyValue('--brew-stage'));
  const brewShot=await page.cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await fs.writeFile(`${dir}/${config.phase}-${lang}-${width}-brew.png`,Buffer.from(brewShot.data,'base64'));
  // Exercise the colleague's latest navigation fix after an active brew animation.
  const headerLogo=await page.evaluate(()=>document.querySelector('header a[aria-label*="CHARM"]')?.getAttribute('aria-label'));
  if(!headerLogo)throw new Error('Header logo not found');
  await page.click(`loc=css:header a[aria-label="${headerLogo}"]`);
  await page.waitForFunction(()=>Boolean(document.querySelector('.orbit-title')),undefined,{timeout:15000});
  record.home=await page.url();
  record.errors=(await page.events()).filter(e=>e.method==='Runtime.exceptionThrown'||(e.method==='Runtime.consoleAPICalled'&&e.params.type==='error')||(e.method==='Log.entryAdded'&&e.params.entry.level==='error')||(e.method==='Network.responseReceived'&&e.params.response.status>=400)||(e.method==='Network.loadingFailed'&&!e.params.canceled)).map(e=>({method:e.method,text:e.params.exceptionDetails?.text||e.params.entry?.text||e.params.errorText,url:e.params.response?.url}));
  if(record.errors.length)throw new Error(JSON.stringify(record.errors));
  results.push(record); console.log({lang,width,images:4,brew:record.brew,home:record.home,errors:0});
}
await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await page.goto(`${config.base}/zh/products/snowflake-gift-box`);
await page.click('loc=css:.product-thumbnails button:nth-of-type(4)');
await page.waitForFunction(()=>document.querySelector('.product-slide[data-active="true"] img')?.complete);
const reduced=await page.evaluate(()=>({enabled:matchMedia('(prefers-reduced-motion: reduce)').matches,src:document.querySelector('.product-slide[data-active="true"] img')?.currentSrc,overflow:document.documentElement.scrollWidth>innerWidth}));
await fs.writeFile(`${dir}/${config.phase}-visual.json`,JSON.stringify({results,reduced},null,2)+'\n');
await page.cdp('Emulation.setEmulatedMedia',{features:[]});await page.cdp('Emulation.clearDeviceMetricsOverride');
