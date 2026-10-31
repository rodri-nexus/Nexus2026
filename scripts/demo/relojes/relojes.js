// Dibuja los relojes ilustrativos de la demo de Valmont (reloj.html) en /tmp/claude-0/valmont/relojes. Uso: node scripts/demo/relojes/relojes.js
const path=require('path');const{chromium}=require('playwright');
const MOD={
 heritage:{caja:'oro',malla:'cuero',dial:['#fffdf6','#ece4d2'],ind:'#7a5f2a',sub:'#f3ecdc',manos:'#5a4520',seg:'#9b2c2c',fecha:true},
 noir:{caja:'negro',malla:'goma',dial:['#1c1c1c','#050505'],ind:'#c9a961',sub:'#111',manos:'#e9e2d4',seg:'#c9a961',bisel:'#0f0f0f',fecha:true},
 chrono:{caja:'acero',malla:'acero',dial:['#2c4e8c','#0f2245'],ind:'#eef2f8',sub:'#0c1c3a',manos:'#ffffff',seg:'#e9b949',cron:true},
 classic:{caja:'acero',malla:'cueroNegro',dial:['#f3f4f5','#c9ccd1'],ind:'#2a2d33',sub:'#e5e7ea',manos:'#1e2228',seg:'#1e2228'},
 royal:{caja:'oro',malla:'oro',dial:['#1a1a1a','#030303'],ind:'#e2c47a',sub:'#0a0a0a',manos:'#f3dc9a',seg:'#e2c47a',fecha:true}
};
(async()=>{const b=await chromium.launch();
 const shot=async(m,f,file,s=1024,transp=false)=>{const p=await b.newPage({viewport:{width:s,height:s}});await p.addInitScript(([M,F,S])=>{window.M=M;window.F=F;window.S=S},[MOD[m],f,s]);
  await p.goto('file://'+path.join(__dirname,'reloj.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path:path.join(__dirname,'relojes',file),...(transp?{type:'png',omitBackground:true}:{type:'jpeg',quality:90})});await p.close();};
 for(const m of Object.keys(MOD)){await shot(m,'estudio',`${m}-1.jpg`);await shot(m,'claro',`${m}-2.jpg`);}
 await shot('royal','none','hero-royal.png',1024,true);
 await b.close();})();
