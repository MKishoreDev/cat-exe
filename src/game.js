/* CAT.EXE — MIT. Tweak constants (gravity .45, jump 7.6, speed 2.4–5.4, FISH, ACH) to customise. */
(()=>{
const W=320,H=180,GY=146,R=Math.random,$=s=>document.querySelector(s);
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const FISH=[['Midnight Sardine','Swims only when the streetlights hum.','#7778C8'],['Moonfish','Tastes faintly of silver.','#C8D1E0'],['Sleepy Tuna','Has been napping since Tuesday.','#6f8fb8'],['Ghost Carp','Probably not here. Probably.','#9195A3'],['Tiny Goldfish','Small, shiny and very proud.','#E6D7A7'],['Cloud Koi','Drifts between chimney smoke.','#d8b4c0']];
const ACH={first:['First Steps','Finish your first run'],owl:['Night Owl','Score 500 in one run'],star:['Star Collector','Collect 50 stars'],fish:['Fish Friend','Discover a fish'],awake:['Still Awake?','Play 10 rounds'],all:['Gone Fishing','Discover all six fish']};
let S={best:0,games:0,stars:0,fish:[],ach:[],mute:0};
try{const j=JSON.parse(localStorage.getItem('catexe')||'null');if(j&&typeof j=='object'){S.best=Math.max(0,+j.best|0);S.games=Math.max(0,+j.games|0);S.stars=Math.max(0,+j.stars|0);S.mute=j.mute?1:0;S.fish=(Array.isArray(j.fish)?j.fish:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<6);S.ach=(Array.isArray(j.ach)?j.ach:[]).filter(k=>k in ACH)}}catch(e){}
const save=()=>{try{localStorage.setItem('catexe',JSON.stringify(S))}catch(e){}};
let ac;
function snd(fq,d,ty,v,f2){if(S.mute)return;try{ac=ac||new AudioContext();const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type=ty||'square';o.frequency.setValueAtTime(fq,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v||.03,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(ac.destination);o.start();o.stop(t+d)}catch(e){}}
const cv=$('canvas'),x=cv.getContext('2d');x.imageSmoothingEnabled=false;
const f=(a,b,c,d,e)=>{x.fillStyle=e;x.fillRect(a|0,b|0,c,d)};
const disc=(cx,cy,r,c)=>{for(let d=-r;d<=r;d++){const w=Math.sqrt(r*r-d*d)|0;f(cx-w,cy+d,2*w+1,1,c)}};
const WR=640;
const mk=(a0,b0,c0,d0)=>{const a=[];let p=0;while(p<WR){const w=a0+(R()*(b0-a0)|0),h=c0+(R()*(d0-c0)|0);a.push({x:p,w,h,ant:R()<.2,wn:Array.from({length:12},()=>R()<.3)});p+=w+(R()*6|0)}return a};
const L1=mk(18,40,30,70),L2=mk(24,50,45,95);
const SS=Array.from({length:40},()=>({x:R()*W|0,y:R()*80|0,p:R()*6}));
const T=[[10,18,0],[12,8,1],[16,12,2],[14,22,3]];
let st='MENU',sc2=0,idle=0,rt=0,lastT=0,acc=0,jr=0,fr=0,evT=300,ss=null,oc=null,p,ob,it,pt,bonus,dist,spd,nx,score=0,newBest=0;
function reset(){p={y:0,vy:0,g:1,sq:0};ob=[];it=[];pt=[];dist=0;bonus=0;spd=2.4;nx=360;score=0}
reset();
let tm;const toast=s=>{const t=$('#tt');t.textContent=s;clearTimeout(tm);tm=setTimeout(()=>t.textContent='',3200)};
function ach(k){if(S.ach.includes(k))return;S.ach.push(k);toast('Achievement: '+ACH[k][0]+(k=='owl'?' \u2014 \u201CSomewhere, a developer is probably debugging something.\u201D':''));snd(523,.3,'triangle',.05,1046);save()}
function chk(){if(S.games>=1)ach('first');if(score>=500)ach('owl');if(S.stars>=50)ach('star');if(S.fish.length)ach('fish');if(S.games>=10)ach('awake');if(S.fish.length>=6)ach('all')}
const burst=(a,b,c)=>{for(let k=0;k<8&&pt.length<40;k++)pt.push({x:a,y:b,vx:(R()-.5)*2.5,vy:-R()*2,l:20,c})};
function spawn(){
 const n=1+(score>150&&R()<.3?1:0),x0=W+10;let xx=x0,mh=0;
 for(let i=0;i<n;i++){const t=T[(R()*Math.min(4,1+(score/60|0)))|0];ob.push({x:xx,t:t[2],w:t[0],h:t[1]});mh=Math.max(mh,t[1]);xx+=t[0]+8}
 const gw=xx-8-x0;nx=gw+spd*(40+R()*35);
 if(R()<.55){const y=GY-mh-24-(R()*8|0);if(R()<.16){const un=[0,1,2,3,4,5].filter(i=>!S.fish.includes(i)),i=un.length?un[R()*un.length|0]:R()*6|0;it.push({x:x0+gw/2-4,y,k:'f',i})}else it.push({x:x0+gw/2-4,y,k:'s'})}
 if(R()<.5)it.push({x:xx+nx/2,y:GY-14-(R()*20|0),k:'s'});
}
function collect(i){
 if(i.k=='f'){bonus+=25;if(!S.fish.includes(i.i)){S.fish.push(i.i);toast('New fish: '+FISH[i.i][0]);save()}snd(660,.2,'triangle',.05,1100);burst(i.x+4,i.y+4,FISH[i.i][2])}
 else{bonus+=5;S.stars++;snd(880,.08,'square',.03,1320);burst(i.x+4,i.y+4,'#E6D7A7')}
 chk();
}
function die(){st='OVER';S.games++;newBest=score>S.best;if(newBest)S.best=score;chk();save();snd(220,.4,'sawtooth',.05,60);ui()}
function start(){if(st=='PLAYING'||st=='READY')return;reset();st='READY';rt=50;ui()}
const pause=()=>{if(st=='PLAYING'){st='PAUSED';ui()}},resume=()=>{if(st=='PAUSED'){st='PLAYING';ui()}};
function step(){
 fr++;
 if(!RM&&st!='PAUSED'){if(--evT<=0){evT=400+R()*900|0;if(R()<.5)ss={x:80+R()*200,y:R()*40,l:30};else if(!oc)oc={x:W+6}}}
 if(st!='PAUSED'){if(ss){ss.x-=4;ss.y+=2;if(--ss.l<=0)ss=null}if(oc){oc.x-=.25+(st=='PLAYING'?spd*.15:0);if(oc.x<-20)oc=null}}
 if(st=='MENU'||st=='COL'){sc2+=.4;if(st=='MENU')idle++}
 else if(st=='READY'){sc2+=1.5;if(--rt<=0){st='PLAYING';ui()}}
 else if(st=='PLAYING'){
  score=(dist/10|0)+bonus;spd=Math.min(5.4,2.4+score/260);dist+=spd;sc2+=spd;
  if(jr>0){jr--;if(p.g){p.vy=7.6;p.g=0;jr=0;snd(380,.12,'square',.04,760)}}
  p.vy-=.45;p.y+=p.vy;
  if(p.y<=0){if(!p.g){p.sq=8;snd(120,.06,'triangle',.05)}p.y=0;p.vy=0;p.g=1}
  if(p.sq>0)p.sq--;
  nx-=spd;if(nx<=0)spawn();
  for(const o of ob)o.x-=spd;for(const i of it)i.x-=spd;
  ob=ob.filter(o=>o.x+o.w>-10);it=it.filter(i=>!i.d&&i.x>-16);
  const cx=43,cy=GY-p.y-12;
  for(const o of ob)if(cx<o.x+o.w-1&&cx+9>o.x+1&&cy+11>GY-o.h+1){die();return}
  for(const i of it)if(cx<i.x+(i.k=='f'?13:9)&&cx+9>i.x&&cy<i.y+9&&cy+11>i.y){i.d=1;collect(i)}
  for(const q of pt){q.x+=q.vx;q.y+=q.vy;q.vy+=.1;q.l--}pt=pt.filter(q=>q.l>0);
 }
}
function lay(L,k,col,win){const o=-((sc2*k)%WR);for(const rep of[0,WR])for(const b of L){const bx=b.x+o+rep;if(bx>W||bx+b.w<0)continue;f(bx,GY-b.h,b.w,b.h,col);if(b.ant)f(bx+b.w/2,GY-b.h-8,1,8,col);if(win)b.wn.forEach((on,i)=>{if(on)f(bx+3+(i%4)*((b.w-6)/4|0),GY-b.h+5+(i/4|0)*10,2,3,'#8f8560')})}}
function cat(X,Y,m,sq){
 X|=0;Y|=0;const B='#2b2f48',H2='#4a4f7a',E='#E6D7A7',C='#D9776B';
 if(m=='sleep'){const b=(fr/25|0)%2;f(X,Y+7-b,13,7+b,B);f(X+1,Y+7-b,10,1,H2);f(X+9,Y+6,6,6,B);f(X+9,Y+4,2,2,B);f(X+13,Y+4,2,2,B);f(X+11,Y+9,3,1,'#7778C8');f(X-3,Y+10,4,3,B);return}
 const q=sq>0?1:0,w=(fr>>3)&1,ty=m=='jump'?1:(m=='run'&&w?2:4);
 f(X-3,Y+ty,3,2,B);f(X-4,Y+ty-2,2,3,B);
 f(X+1-q,Y+5+q,11+2*q,6-q,B);f(X+2,Y+5+q,9,1,H2);
 f(X+8,Y+1,7,6,B);f(X+8,Y-1,2,2,B);f(X+13,Y-1,2,2,B);
 if(m=='dead'){f(X+11,Y+3,3,1,C);f(X+12,Y+2,1,3,C)}else if(fr%200<6)f(X+12,Y+4,2,1,E);else f(X+12,Y+3,2,2,E);
 if(m=='jump'){f(X-1,Y+10,4,2,B);f(X+11,Y+10,4,2,B)}
 else if(m=='run'){if(w){f(X+2,Y+11,2,3,B);f(X+9,Y+11,2,3,B)}else{f(X+4,Y+11,2,3,B);f(X+7,Y+11,2,3,B)}}
 else{f(X+3,Y+11,2,3,B);f(X+9,Y+11,2,3,B)}
}
function obst(o){const B='#2a2e45',h=o.h,y=GY-h,X=o.x|0;
 if(o.t==0){f(X,y,o.w,h,B);f(X-1,y,o.w+2,3,'#3a3f63')}
 else if(o.t==1){f(X,y+3,o.w,h-3,B);f(X+2,y,o.w-4,3,'#3a3f63')}
 else if(o.t==2){f(X,y,o.w,h,B);f(X+2,y+2,o.w-4,2,'#171A24');f(X+2,y+6,o.w-4,2,'#171A24')}
 else{f(X,y,o.w,h-6,B);f(X,y,o.w,2,'#3a3f63');f(X+2,y+h-6,2,6,B);f(X+o.w-4,y+h-6,2,6,B)}}
const FB=[[3,6],[1,8],[0,9],[0,9],[0,9],[1,8],[3,6]],FT=[[11,12],[10,12],[10,11],[10,10],[10,11],[10,12],[11,12]];
function fish(X,Y,c){X|=0;Y|=0;for(let r=0;r<7;r++){f(X+FB[r][0],Y+r,FB[r][1]-FB[r][0]+1,1,c);f(X+FT[r][0],Y+r,FT[r][1]-FT[r][0]+1,1,c)}f(X+4,Y-1,3,1,c);f(X+1,Y+4,8,2,'#ffffff55');f(X+4,Y+3,2,1,'#00000066');f(X+2,Y+2,2,2,'#08090D');f(X+2,Y+2,1,1,'#fff')}
function draw(){
 f(0,0,W,H,'#08090D');
 SS.forEach(s=>f(s.x,s.y,1,1,(fr/30+s.p)%6<5.4?'#E6D7A7':'#5a5a6a'));
 const mp=st=='PLAYING'||st=='PAUSED'||st=='OVER'?score:S.best;
 disc(268,34,10,'#C8D1E0');if(mp<200)disc(272,33,10,'#08090D');else if(mp<500)f(268,24,11,21,'#08090D');
 if(ss)for(let k=0;k<7;k++)f(ss.x+k*3,ss.y-k*1.5,2,1,k?'#9195A3':'#F0F0F0');
 lay(L1,.1,'#10131D',0);
 if(oc){f(oc.x-4,100,16,60,'#13161f');const o=oc.x|0;f(o,92,7,6,'#6b6f8d');f(o,90,2,2,'#6b6f8d');f(o+5,90,2,2,'#6b6f8d');f(o+4,93,2,1,'#7778C8');f(o-3,95,3,2,'#6b6f8d')}
 lay(L2,.25,'#141824',1);
 f(0,GY,W,H-GY,'#171A24');f(0,GY,W,2,'#2a2e45');
 for(let k=0;k<14;k++)f(((k*24-sc2)%336+336)%336-8,GY+8+(k%3)*7,6,1,'#232738');
 for(const i of it){const y=i.y+Math.sin(fr/10+i.x)*2;if(i.k=='f')fish(i.x,y,FISH[i.i][2]);else{f(i.x+3,y+1,3,7,'#E6D7A7');f(i.x+1,y+3,7,3,'#E6D7A7');f(i.x+4,y+4,1,1,'#F0F0F0')}}
 ob.forEach(obst);
 const play=st=='PLAYING'||st=='READY'||st=='PAUSED'||st=='OVER';
 if(play){const m=st=='OVER'?'dead':p.g?(st=='READY'?'idle':'run'):'jump';cat(40,GY-14-p.y+(m=='dead'?2:0),st=='PAUSED'&&p.g?'idle':m,p.sq)}
 else cat(152,GY-14,idle>600?'sleep':'idle',0);
 if(!play&&idle>600){x.font='bold 8px ui-monospace,monospace';for(let k=0;k<3;k++){const t=(fr/3+k*14)%42;x.globalAlpha=1-t/42;x.fillStyle='#C8D1E0';x.fillText('z',166+k*4+Math.sin(t/6)*2,GY-14-t);}x.globalAlpha=1}
 for(const q of pt)f(q.x,q.y,2,2,q.c);
 if(play){x.font='bold 10px ui-monospace,monospace';x.fillStyle='#F0F0F0';x.fillText(String(score).padStart(5,'0'),8,14);x.fillStyle='#9195A3';x.fillText('BEST '+S.best,8,26);x.fillText('STARS '+S.stars,8,38);
  x.textAlign='center';if(st=='READY')x.fillText('GET READY',160,70);else if(st=='PLAYING'&&dist<400)x.fillText('SPACE / TAP TO JUMP',160,70);x.textAlign='left'}
}
const ov=$('#ov'),pz=$('#pz');
const fsvg=(c,u)=>`<svg viewBox="0 -1 13 8" width="39" height="24" shape-rendering="crispEdges" aria-hidden="true"><g fill="${u?'#2b2f48':c}">${FB.concat(FT).map((r,i)=>`<rect x="${r[0]}" y="${i%7}" width="${r[1]-r[0]+1}" height="1"/>`).join('')}<rect x="4" y="-1" width="3" height="1"/></g>${u?'':'<rect x="2" y="2" width="2" height="2" fill="#08090D"/><rect x="2" y="2" width="1" height="1" fill="#fff"/>'}</svg>`;
function ui(){
 let h='',c='cx-ov';ov.hidden=st=='PLAYING'||st=='READY';pz.hidden=st!='PLAYING';
 if(st=='MENU'){c+=' m';h=`<h1>CAT.EXE</h1><p>A tiny cat. A long night. One more run.</p><div class="row"><button class="p" data-a="play">Play</button><button data-a="col">Collection</button><button data-a="snd">Sound: ${S.mute?'off':'on'}</button></div><p>Best ${S.best}. Jump with Space, \u2191, W or a tap. P pauses.</p>`}
 else if(st=='PAUSED')h=`<h2>Paused</h2><div class="row"><button class="p" data-a="resume">Resume</button><button data-a="play">Restart</button><button data-a="menu">Main menu</button></div>`;
 else if(st=='OVER'){const m=score<50?'The rooftops will wait.':score<200?'Almost had that chimney.':score<500?'Nine lives, one run.':'Legend of the night shift.';h=`<h2>${score} points</h2><p>${newBest?'New best!':'Best '+S.best}</p><p>${m}</p><div class="row"><button class="p" data-a="play">Restart</button><button data-a="menu">Main menu</button></div>`}
 else if(st=='COL'){h=`<h2>Fish collection</h2><div class="g">${FISH.map((q,i)=>{const d=S.fish.includes(i);return `<div class="cd">${fsvg(q[2],!d)}<b>${d?q[0]:'???'}</b><small>${d?q[1]:'Not found yet.'}</small></div>`}).join('')}</div><div class="al">${Object.keys(ACH).map(k=>S.ach.includes(k)?`<b>Unlocked: ${ACH[k][0]}</b> (${ACH[k][1]})<br>`:`Locked: ${ACH[k][1]}<br>`).join('')}</div><p>Stars collected: ${S.stars}. Games played: ${S.games}.</p><div class="row"><button class="p" data-a="menu">Back</button><button data-a="clr">Clear saved progress</button></div>`}
 ov.className=c;ov.innerHTML=h;
 if(!ov.hidden){const b=ov.querySelector('button.p');if(b)b.focus({preventScroll:true})}
}
function act(a){
 if(a=='play')start();
 else if(a=='menu'){reset();st='MENU';idle=0;ui()}
 else if(a=='resume')resume();
 else if(a=='col'){st='COL';ui()}
 else if(a=='snd'){S.mute^=1;save();snd(600,.05);ui()}
 else if(a=='clr'&&confirm('Clear all saved progress?')){S={best:0,games:0,stars:0,fish:[],ach:[],mute:S.mute};save();ui()}
}
ov.addEventListener('click',e=>{const b=e.target.closest('button');if(b)act(b.dataset.a)});
pz.addEventListener('click',pause);
addEventListener('pointerdown',e=>{idle=0;if(st=='PLAYING'&&!e.target.closest('button')){e.preventDefault();jr=6}});cv.addEventListener('contextmenu',e=>e.preventDefault());addEventListener('blur',pause);
addEventListener('keydown',e=>{
 const k=e.code,b=e.target.tagName=='BUTTON';idle=0;
 if(k=='Space'||k=='ArrowUp'||k=='KeyW'){if(st=='PLAYING'){e.preventDefault();jr=6}else if(st=='MENU'&&!b){e.preventDefault();start()}}
 else if(k=='Enter'&&!b){if(st=='MENU'||st=='OVER')start();else if(st=='PAUSED')resume()}
 else if(k=='KeyP'||k=='Escape'){if(st=='PLAYING')pause();else if(st=='PAUSED'&&k=='KeyP')resume();else if(st=='PAUSED')act('menu');else if(st=='COL')act('menu')}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
function loop(t){requestAnimationFrame(loop);acc+=Math.min(t-lastT,100);lastT=t;while(acc>=16.667){step();acc-=16.667}draw()}
ui();requestAnimationFrame(t=>{lastT=t;loop(t)});
})();
