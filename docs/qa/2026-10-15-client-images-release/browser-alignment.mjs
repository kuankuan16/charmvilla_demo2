const fs = await import('node:fs/promises');
const dir='/Users/kuan/Documents/Codex/charmvilla-release-20261015/docs/qa/2026-10-15-client-images-release';
const {base,phase}=JSON.parse(await fs.readFile(`${dir}/alignment-phase.json`,'utf8'));
const p=(await taskSpace(44)).page('p1');
await p.cdp('Runtime.enable');await p.cdp('Network.enable');await p.events();
const results=[];
for(const lang of ['zh','en']) for(const [width,height,reduce] of [[1440,900,false],[1800,1125,false],[1024,768,false],[390,844,false],[1440,900,true],[390,844,true]]){
 await p.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width===390});
 await p.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]});
 await p.goto(`${base}${lang==='zh'?'/zh':''}/products/reunion-paper-gift-box`);
 await p.evaluate(async()=>{await document.fonts.ready;localStorage.setItem('cv-newsletter-popup-seen','1');});
 const target=await p.evaluate(()=>{
   const v=document.querySelector('.brew-visual'), list=document.querySelector('.brew-steps'), last=list.lastElementChild;
   const top=parseFloat(getComputedStyle(v).top)||0;
   if(innerWidth<768){const node=last.querySelector('.brew-node');return scrollY+node.getBoundingClientRect().top+node.offsetHeight/2-(top+v.offsetHeight+48);}
   return scrollY+last.getBoundingClientRect().bottom-(top+v.offsetHeight);
 });
 await p.evaluate(y=>scrollTo(0,y+1),target);
 if(!reduce)await p.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.brew-process')).getPropertyValue('--brew-stage'))>=3.99,undefined,{timeout:10000});
 await p.waitForFunction(()=>+getComputedStyle(document.querySelector('.brew-photo')).opacity===1 && +getComputedStyle(document.querySelector('.brew-steps li:last-child .brew-step-content')).opacity===1);
 const measured=await p.evaluate(()=>{
   const v=document.querySelector('.brew-visual'), rows=[...document.querySelectorAll('.brew-steps li')];
   const r=v.getBoundingClientRect(),last=rows.at(-1).getBoundingClientRect();
   return {width:innerWidth,height:innerHeight,photo:{top:r.top,bottom:r.bottom,height:r.height},last:{top:last.top,bottom:last.bottom},bottomDelta:last.bottom-r.bottom,steps:rows.map(e=>e.getBoundingClientRect().height),stage:getComputedStyle(document.querySelector('.brew-process')).getPropertyValue('--brew-stage'),overflow:document.documentElement.scrollWidth>innerWidth,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
 });
 if(measured.width!==width||measured.overflow||(width>=768&&(Math.abs(measured.bottomDelta)>1||measured.photo.top<70||measured.photo.bottom>height))||(width===390&&measured.last.top+40<measured.photo.bottom))throw Error(JSON.stringify({lang,width,reduce,measured}));
 const shot=await p.cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await fs.writeFile(`${dir}/${phase}-${lang}-${width}-${reduce?'reduced':'motion'}-aligned.png`,Buffer.from(shot.data,'base64'));
 const logo=await p.evaluate(()=>document.querySelector('header a[aria-label*="CHARM"]')?.getAttribute('aria-label'));
 await p.click(`loc=css:header a[aria-label="${logo}"]`);await p.waitForFunction(()=>Boolean(document.querySelector('.orbit-title')));
 const errors=(await p.events()).filter(e=>e.method==='Runtime.exceptionThrown'||(e.method==='Runtime.consoleAPICalled'&&e.params.type==='error')||(e.method==='Network.responseReceived'&&e.params.response.status>=400)||(e.method==='Network.loadingFailed'&&!e.params.canceled));
 if(errors.length)throw Error(JSON.stringify(errors));
 results.push({lang,width,reduce,...measured,errors:[]});console.log({lang,width,reduce,bottomDelta:measured.bottomDelta,stage:measured.stage,errors:0});
}
await fs.writeFile(`${dir}/${phase}-alignment.json`,JSON.stringify(results,null,2)+'\n');
await p.cdp('Emulation.setEmulatedMedia',{features:[]});await p.cdp('Emulation.clearDeviceMetricsOverride');
