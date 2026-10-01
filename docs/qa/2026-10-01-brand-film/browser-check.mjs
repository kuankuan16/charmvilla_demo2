import { chromium } from 'playwright';
import fs from 'node:fs';
const base=process.env.BASE_URL||'http://localhost:3134';
const out=new URL('./',import.meta.url).pathname;
const browser=await chromium.launch({channel:'chrome',headless:true});
const report=[];
for(const [name,width,height,path,motion] of [['zh-desktop',1440,900,'/','no-preference'],['en-mobile',390,844,'/en','no-preference'],['zh-reduced-motion',390,844,'/','reduce']]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:motion});
 const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+path,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.documentElement.classList.contains('is-loaded'));
 const initial=await page.locator('#brand-film video').evaluate(v=>({paused:v.paused,readyState:v.readyState,currentTime:v.currentTime,src:v.currentSrc}));
 await page.locator('#brand-film').evaluate(el=>el.scrollIntoView({block:'center'}));
 if(motion==='reduce'){
  await page.waitForTimeout(700);
  const paused=await page.locator('#brand-film video').evaluate(v=>v.paused&&v.currentTime===0);
  if(!paused)throw Error('Reduced-motion unexpectedly autoplays');
  await page.locator('#brand-film video').evaluate(v=>v.play());
 }
 await page.waitForFunction(()=>{const v=document.querySelector('#brand-film video');return !v.paused&&v.currentTime>.2&&v.videoWidth===1920});
 const playing=await page.locator('#brand-film video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration,paused:v.paused,muted:v.muted,inline:v.playsInline,controls:v.controls,src:v.currentSrc,rect:{width:v.clientWidth,height:v.clientHeight},label:v.getAttribute('aria-label')}));
 if(Math.abs(playing.rect.width/playing.rect.height-16/9)>.03)throw Error('Video aspect ratio changed');
 await page.locator('#brand-film video').evaluate(v=>v.pause());
 await page.waitForTimeout(200);
 const manualPause=await page.locator('#brand-film video').evaluate(v=>v.paused);
 await page.locator('#brand-film video').evaluate(v=>{v.currentTime=10;});
 await page.waitForFunction(()=>Math.abs(document.querySelector('#brand-film video').currentTime-10)<.1);
 await page.screenshot({path:out+name+'.png'});
 await page.locator('#brand-film video').evaluate(v=>v.play());
 await page.locator('#hero').evaluate(el=>el.scrollIntoView({block:'start'}));
 await page.waitForFunction(()=>document.querySelector('#brand-film video').paused);
 const offscreenPause=await page.locator('#brand-film video').evaluate(v=>v.paused);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 if(!manualPause||!offscreenPause||overflow||errors.length)throw Error(JSON.stringify({manualPause,offscreenPause,overflow,errors}));
 report.push({name,initial,playing,manualPause,offscreenPause,overflow,errors});
 await context.close();
}
const req=await browser.newContext();
const res=await req.request.get(base+'/media/hero/film/earring-to-tea-v2.mp4',{headers:{Range:'bytes=0-1023'}});
report.push({mp4Range:{status:res.status(),type:res.headers()['content-type'],length:(await res.body()).length}});
if(res.status()!==206)throw Error('Range requests not supported');
fs.writeFileSync(out+'browser-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));await browser.close();
