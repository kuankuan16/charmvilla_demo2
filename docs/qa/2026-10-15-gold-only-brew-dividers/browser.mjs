const fs=await import('node:fs/promises');
const dir='/Users/kuan/Documents/Codex/10-02-charmvilla-demo2/docs/qa/2026-10-15-gold-only-brew-dividers';
const {base,phase}=JSON.parse(await fs.readFile(`${dir}/phase.json`,'utf8'));
const p=(await taskSpace(44)).page('p1');
await p.cdp('Runtime.enable');await p.cdp('Network.enable');await p.events();
const results=[];
for(const lang of ['zh','en']) for(const [width,height,reduce] of [[1440,900,false],[390,844,false],[1440,900,true],[390,844,true]]){
 await p.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width===390});
 await p.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]});
 await p.goto(`${base}${lang==='zh'?'/zh':''}/products/reunion-paper-gift-box`);
 await p.evaluate(async()=>{await document.fonts.ready;});
 await p.waitForFunction(()=>/Sold out|已售罄/.test(document.querySelector('.product-buy')?.textContent||''));
 const product=await p.evaluate(async()=>{
  const data=(await (await fetch('/api/products')).json()).products['reunion-paper-gift-box'];
  return {buttons:[...document.querySelectorAll('.product-variants input,.product-split-options select')].length,
    buyDisabled:document.querySelector('.product-buy').disabled,buyText:document.querySelector('.product-buy').textContent,
    data,overflow:document.documentElement.scrollWidth>innerWidth};
 });
 if(product.buttons!==0||!product.buyDisabled||product.data.variants.length!==1||!product.data.variants[0].id.endsWith('/67632284598636')||product.overflow) throw Error(JSON.stringify(product));
 await p.focus('.product-preorder-notice summary'); await p.keyboard.press('Enter');
 const keyboard=await p.evaluate(()=>document.querySelector('.product-preorder-notice details').open);
 if(!keyboard)throw Error('Keyboard details toggle failed');
 if(!reduce){const shot=await p.cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); await fs.writeFile(`${dir}/${phase}-${lang}-${width}-gold.png`,Buffer.from(shot.data,'base64'));}
 const target=await p.evaluate(()=>{
   const v=document.querySelector('.brew-visual'),last=document.querySelector('.brew-steps').lastElementChild;
   const top=parseFloat(getComputedStyle(v).top)||0;
   if(innerWidth<768){const node=last.querySelector('.brew-node');return scrollY+node.getBoundingClientRect().top+node.offsetHeight/2-(top+v.offsetHeight+48);}
   return scrollY+last.getBoundingClientRect().bottom-(top+v.offsetHeight);
 });
 await p.evaluate(y=>scrollTo(0,y+1),target);
 if(!reduce)await p.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.brew-process')).getPropertyValue('--brew-stage'))>=3.99,undefined,{timeout:10000});
 await p.waitForFunction(()=>+getComputedStyle(document.querySelector('.brew-photo')).opacity===1 && +getComputedStyle(document.querySelector('.brew-steps li:last-child .brew-step-content')).opacity===1);
 const brew=await p.evaluate(()=>{
  const rows=[...document.querySelectorAll('.brew-steps li')],photo=document.querySelector('.brew-visual').getBoundingClientRect(),last=rows.at(-1).getBoundingClientRect();
  return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,bottomDelta:last.bottom-photo.bottom,
    before:rows.map(r=>getComputedStyle(r.querySelector('.brew-step-content'),'::before').content),after:rows.map(r=>getComputedStyle(r.querySelector('.brew-step-content'),'::after').content),
    heights:rows.map(r=>r.getBoundingClientRect().height),padding:rows.map(r=>getComputedStyle(r.querySelector('.brew-step-content')).paddingTop)};
 });
 if(brew.before[0]!=='none'||brew.before.slice(1).some(x=>x!=='""')||brew.after.some(x=>x!=='none')||brew.overflow|| (width===1440&&Math.abs(brew.bottomDelta)>1))throw Error(JSON.stringify(brew));
 const shot=await p.cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await fs.writeFile(`${dir}/${phase}-${lang}-${width}-${reduce?'reduced':'motion'}-brew.png`,Buffer.from(shot.data,'base64'));
 const errors=(await p.events()).filter(e=>e.method==='Runtime.exceptionThrown'||(e.method==='Runtime.consoleAPICalled'&&e.params.type==='error')||(e.method==='Network.responseReceived'&&e.params.response.status>=400)||(e.method==='Network.loadingFailed'&&!e.params.canceled));
 if(errors.length)throw Error(JSON.stringify(errors));
 results.push({lang,width,reduce,product,keyboard,brew,errors:[]});console.log({phase,lang,width,reduce,goldOnly:true,innerDividers:4,bottomDelta:brew.bottomDelta,errors:0});
}
await fs.writeFile(`${dir}/${phase}-browser.json`,JSON.stringify(results,null,2));
await p.cdp('Emulation.setEmulatedMedia',{features:[]}); await p.cdp('Emulation.clearDeviceMetricsOverride');
await p.goto(`${base}/zh/products/reunion-paper-gift-box`);
