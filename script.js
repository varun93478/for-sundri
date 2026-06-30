const scenes=[...document.querySelectorAll(".scene")];
const aurora=document.querySelector(".aurora");
const progress=document.getElementById("progressBar");
let current=0;
let typed=false;

function updateScene(){
  scenes.forEach(s=>s.classList.remove("active"));
  const active=scenes[current];
  active.classList.add("active");
  aurora.className="aurora";
  const type=active.dataset.type;
  if(active.classList.contains("light")) aurora.classList.add("light");
  if(type==="ocean") aurora.classList.add("ocean");
  if(type==="holi") aurora.classList.add("holi");
  progress.style.width=(current/(scenes.length-1))*100+"%";
  if(type==="wedding") petals(24);
  if(type==="text") typeStory();
  if(type==="final") heartBurst();
}

function nextScene(){
  if(current < scenes.length-1){
    current++;
    updateScene();
    burstSparks(innerWidth/2, innerHeight/2, 18);
  }
}

document.getElementById("app").addEventListener("click",(e)=>{
  if(e.target.closest("button") || e.target.closest("#cake")) return;
  nextScene();
});

function restartExperience(e){
  e.stopPropagation();
  current=0;
  document.getElementById("cake").classList.remove("blown");
  updateScene();
}

function typeStory(){
  if(typed) return;
  typed=true;
  const text=`Hey Sundri...

Happy Birthday ❤️

I wanted to buy you something.

Then I realized...

The best gift is remembering everything that made us... us.`;
  const el=document.getElementById("typedStory");
  let i=0;
  function type(){
    if(i<=text.length){
      el.textContent=text.slice(0,i);
      i++;
      setTimeout(type,42);
    }
  }
  type();
}

document.getElementById("cake").addEventListener("click",(e)=>{
  e.stopPropagation();
  document.getElementById("cake").classList.add("blown");
  navigator.vibrate && navigator.vibrate([60,40,80]);
  burst(160);
  setTimeout(nextScene,1200);
});

function openSkip(e){
  e.stopPropagation();
  document.getElementById("skipNote").classList.add("active");
  burstSparks(innerWidth/2, innerHeight/2, 18);
}
function closeSkip(e){
  e.stopPropagation();
  document.getElementById("skipNote").classList.remove("active");
}

document.addEventListener("pointerdown",(e)=>{
  if(e.target.closest("button")) return;
  burstSparks(e.clientX,e.clientY,8);
});

function burstSparks(x,y,count){
  for(let i=0;i<count;i++){
    const s=document.createElement("div");
    s.className="spark";
    s.style.left=x+"px";
    s.style.top=y+"px";
    const a=Math.random()*Math.PI*2;
    const d=40+Math.random()*95;
    s.style.setProperty("--dx",Math.cos(a)*d+"px");
    s.style.setProperty("--dy",Math.sin(a)*d+"px");
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),800);
  }
}

function burst(count){
  for(let i=0;i<count;i++) setTimeout(confetti,i*5);
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

function heartBurst(){
  for(let i=0;i<48;i++){
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

/* Canvas star + cursor trail */
const canvas=document.getElementById("scene");
const ctx=canvas.getContext("2d");
let w,h,stars=[],trails=[];
function resize(){
  w=canvas.width=innerWidth*devicePixelRatio;
  h=canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+"px";
  canvas.style.height=innerHeight+"px";
}
addEventListener("resize",resize);
resize();

for(let i=0;i<160;i++){
  stars.push({
    x:Math.random()*w,
    y:Math.random()*h,
    z:.25+Math.random()*1.2,
    r:(.6+Math.random()*1.8)*devicePixelRatio,
    a:.2+Math.random()*.55
  });
}

document.addEventListener("pointermove",(e)=>{
  trails.push({x:e.clientX*devicePixelRatio,y:e.clientY*devicePixelRatio,life:1});
  if(trails.length>40) trails.shift();
});

function draw(){
  ctx.clearRect(0,0,w,h);
  stars.forEach(s=>{
    s.y += s.z*.18*devicePixelRatio;
    s.x += Math.sin(Date.now()*0.0005+s.y)*.08*devicePixelRatio;
    if(s.y>h) {s.y=0;s.x=Math.random()*w}
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(199,167,255,${s.a})`;
    ctx.fill();
  });

  trails.forEach((t,i)=>{
    t.life-=.035;
    if(t.life<0)t.life=0;
    ctx.beginPath();
    ctx.arc(t.x,t.y,18*devicePixelRatio*t.life,0,Math.PI*2);
    ctx.fillStyle=`rgba(216,195,255,${.12*t.life})`;
    ctx.fill();
  });
  trails=trails.filter(t=>t.life>0);

  requestAnimationFrame(draw);
}
draw();

/* simple generated soft sound */
let audioCtx,timer,playing=false;
document.getElementById("soundBtn").addEventListener("click",(e)=>{
  e.stopPropagation();
  playing?stopSound():startSound();
});
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
    gain.gain.exponentialRampToValueAtTime(.032,audioCtx.currentTime+.08);
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
updateScene();
