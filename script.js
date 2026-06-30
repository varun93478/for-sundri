let current=0;
const screens=[...document.querySelectorAll(".screen")];
const progress=document.getElementById("progress");
progress.innerHTML="<span></span>";
const bar=progress.querySelector("span");

function show(index){
  screens.forEach(s=>s.classList.remove("active"));
  screens[index].classList.add("active");
  const scene=screens[index].dataset.scene;
  document.querySelector(".bg-orbs").classList.toggle("dark",scene==="dark"||scene==="heart");
  document.querySelector(".bg-orbs").classList.toggle("ocean",scene==="ocean");
  bar.style.width=((index)/(screens.length-1))*100+"%";
  if(scene==="petals") petals(26);
  if(scene==="heart") heartBurst();
}

function next(){
  if(current<screens.length-1){
    current++;
    show(current);
    burstSparks(innerWidth/2, innerHeight/2, 18);
  }
}

function restart(){
  current=0;
  document.getElementById("cake").classList.remove("blown");
  show(current);
}

function fakeSkip(){
  document.getElementById("skipModal").classList.add("active");
  burstSparks(innerWidth/2, innerHeight/2, 16);
}

function closeSkip(){
  document.getElementById("skipModal").classList.remove("active");
}

document.addEventListener("pointerdown",(e)=>{
  if(e.target.closest("button")) return;
  burstSparks(e.clientX,e.clientY,10);
});

function burstSparks(x,y,count){
  for(let i=0;i<count;i++){
    const s=document.createElement("div");
    s.className="spark";
    s.style.left=x+"px";
    s.style.top=y+"px";
    const a=Math.random()*Math.PI*2;
    const d=40+Math.random()*90;
    s.style.setProperty("--dx",Math.cos(a)*d+"px");
    s.style.setProperty("--dy",Math.sin(a)*d+"px");
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),800);
  }
}

document.querySelectorAll("[data-carousel]").forEach((carousel)=>{
  const cards=[...carousel.querySelectorAll(".photo-card")];
  let index=0,startX=0,endX=0;
  function render(){
    cards.forEach((card,i)=>{
      card.classList.remove("active","prev","next");
      if(i===index) card.classList.add("active");
      else if(i===((index-1+cards.length)%cards.length)) card.classList.add("prev");
      else if(i===((index+1)%cards.length)) card.classList.add("next");
    });
  }
  function move(dir){
    index=(index+dir+cards.length)%cards.length;
    render();
    footprints();
    flash();
  }
  carousel.addEventListener("click",(e)=>{if(!e.target.closest("button"))move(1)});
  carousel.addEventListener("touchstart",(e)=>{startX=e.touches[0].clientX},{passive:true});
  carousel.addEventListener("touchend",(e)=>{
    endX=e.changedTouches[0].clientX;
    const diff=endX-startX;
    if(Math.abs(diff)>40) move(diff<0?1:-1);
  },{passive:true});
  carousel.addEventListener("pointermove",(e)=>{
    const active=carousel.querySelector(".photo-card.active");
    if(!active) return;
    const r=active.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    active.style.transform=`translateX(0) rotate(${-1.5 + x*4}deg) rotateX(${y*-6}deg) rotateY(${x*8}deg) scale(1)`;
  });
  carousel.addEventListener("pointerleave",()=>{
    const active=carousel.querySelector(".photo-card.active");
    if(active) active.style.transform="";
  });
  render();
});

function flash(){
  const f=document.createElement("div");
  f.style.cssText="position:fixed;inset:0;background:white;z-index:25;pointer-events:none;opacity:.35;animation:fadeFlash .35s ease forwards";
  document.body.appendChild(f);
  setTimeout(()=>f.remove(),400);
}
const style=document.createElement("style");
style.textContent="@keyframes fadeFlash{to{opacity:0}}";
document.head.appendChild(style);

function blowCandle(){
  document.getElementById("cake").classList.add("blown");
  burst(150);
  navigator.vibrate && navigator.vibrate([60,40,80]);
  setTimeout(()=>{current++;show(current)},1100);
}

function burst(count){
  for(let i=0;i<count;i++) setTimeout(confetti,i*6);
}

function confetti(){
  const c=document.createElement("div");
  c.className="confetti";
  c.style.left=Math.random()*100+"vw";
  c.style.width="10px";
  c.style.height="16px";
  c.style.background=["#6f2da8","#c7a7ff","#ffffff","#ffd166","#b58eff"][Math.floor(Math.random()*5)];
  c.style.animationDuration=1.8+Math.random()*2+"s";
  document.body.appendChild(c);
  setTimeout(()=>c.remove(),4000);
}

function petals(count){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const p=document.createElement("div");
      p.className="petal";
      p.textContent=["🌸","💜","🤍"][Math.floor(Math.random()*3)];
      p.style.left=Math.random()*100+"vw";
      p.style.fontSize=14+Math.random()*16+"px";
      p.style.animationDuration=3+Math.random()*3+"s";
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),6000);
    },i*70);
  }
}

function footprints(){
  for(let i=0;i<4;i++){
    setTimeout(()=>{
      const f=document.createElement("div");
      f.className="petal";
      f.textContent="🐾";
      f.style.left=(30+i*10+Math.random()*10)+"vw";
      f.style.fontSize="18px";
      f.style.animationDuration="2.5s";
      document.body.appendChild(f);
      setTimeout(()=>f.remove(),3000);
    },i*80);
  }
}

function heartBurst(){
  for(let i=0;i<40;i++){
    setTimeout(()=>{
      const h=document.createElement("div");
      h.className="petal";
      h.textContent=["💜","✨","🤍"][Math.floor(Math.random()*3)];
      h.style.left=Math.random()*100+"vw";
      h.style.fontSize=16+Math.random()*18+"px";
      h.style.animationDuration=3+Math.random()*3+"s";
      document.body.appendChild(h);
      setTimeout(()=>h.remove(),6000);
    },i*45);
  }
}

/* Canvas particles */
const canvas=document.getElementById("fxCanvas");
const ctx=canvas.getContext("2d");
let w,h,particles=[];
function resize(){
  w=canvas.width=innerWidth*devicePixelRatio;
  h=canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+"px";
  canvas.style.height=innerHeight+"px";
}
addEventListener("resize",resize);
resize();

for(let i=0;i<95;i++){
  particles.push({x:Math.random()*w,y:Math.random()*h,r:(1+Math.random()*2.4)*devicePixelRatio,vx:(Math.random()-.5)*.28*devicePixelRatio,vy:(Math.random()-.5)*.28*devicePixelRatio,a:.18+Math.random()*.42});
}

function draw(){
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(111,45,168,${p.a})`;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();

let audioCtx,timer,playing=false;
document.getElementById("soundBtn").addEventListener("click",()=>playing?stopSound():startSound());

function startSound(){
  audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  playing=true;
  document.getElementById("soundBtn").textContent="Pause ✦";
  const notes=[392,523.25,659.25,783.99,659.25,523.25,440,587.33];
  let i=0;
  function play(){
    if(!playing)return;
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.type="sine";
    osc.frequency.value=notes[i%notes.length];
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.08);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.72);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime+.78);
    i++;
    timer=setTimeout(play,500);
  }
  play();
}

function stopSound(){
  playing=false;
  clearTimeout(timer);
  if(audioCtx) audioCtx.close();
  document.getElementById("soundBtn").textContent="Sound ✦";
}

show(0);
