const scenes=[...document.querySelectorAll(".scene")];
const bg=document.getElementById("worldBg");
const progress=document.getElementById("progress");
let current=0;

function setScene(index){
  scenes.forEach(s=>s.classList.remove("active"));
  const scene=scenes[index];
  scene.classList.add("active");
  bg.className="";
  bg.classList.add(scene.dataset.bg || "night");
  progress.style.width=(index/(scenes.length-1))*100+"%";

  gsap.fromTo(scene.querySelectorAll(".copy, .photo-world, .elephant-guide, .letter, .cake, .heart-constellation"), 
    {y:35, opacity:0, scale:.96},
    {y:0, opacity:1, scale:1, duration:.9, stagger:.08, ease:"power3.out"}
  );

  if(scene.classList.contains("wedding")) petals(28);
  if(scene.classList.contains("punch")) punch();
  if(scene.classList.contains("holi")) colorBurst();
  if(scene.classList.contains("final")) heartBurst();
}

function next(){
  if(current < scenes.length-1){
    current++;
    setScene(current);
    burstSparks(innerWidth/2, innerHeight/2, 20);
  }
}

document.getElementById("story").addEventListener("click",(e)=>{
  if(e.target.closest("button") || e.target.closest("#cake")) return;
  next();
});

function restartStory(e){
  e.stopPropagation();
  current=0;
  document.getElementById("cake").classList.remove("blown");
  setScene(0);
}

function openSkip(e){
  e.stopPropagation();
  document.getElementById("modal").classList.add("active");
  burstSparks(innerWidth/2, innerHeight/2, 20);
}
function closeSkip(e){
  e.stopPropagation();
  document.getElementById("modal").classList.remove("active");
}

document.getElementById("cake").addEventListener("click",(e)=>{
  e.stopPropagation();
  document.getElementById("cake").classList.add("blown");
  burst(170);
  navigator.vibrate && navigator.vibrate([60,40,80]);
  setTimeout(next,1200);
});

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

function punch(){
  gsap.fromTo(".impact",{scale:.2,opacity:0,rotation:-20},{scale:1.4,opacity:.7,rotation:10,duration:.25,yoyo:true,repeat:1});
  navigator.vibrate && navigator.vibrate(70);
}

function colorBurst(){
  burstSparks(innerWidth/2,innerHeight/2,45);
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
  for(let i=0;i<55;i++){
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

/* Canvas VFX */
const canvas=document.getElementById("fx");
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

for(let i=0;i<180;i++){
  stars.push({x:Math.random()*w,y:Math.random()*h,z:.25+Math.random()*1.2,r:(.6+Math.random()*1.8)*devicePixelRatio,a:.18+Math.random()*.55});
}

document.addEventListener("pointermove",(e)=>{
  trails.push({x:e.clientX*devicePixelRatio,y:e.clientY*devicePixelRatio,life:1});
  if(trails.length>44) trails.shift();
});

function draw(){
  ctx.clearRect(0,0,w,h);
  stars.forEach(s=>{
    s.y += s.z*.18*devicePixelRatio;
    s.x += Math.sin(Date.now()*0.0005+s.y)*.08*devicePixelRatio;
    if(s.y>h){s.y=0;s.x=Math.random()*w}
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(199,167,255,${s.a})`;
    ctx.fill();
  });
  trails.forEach(t=>{
    t.life-=.035;
    ctx.beginPath();
    ctx.arc(t.x,t.y,18*devicePixelRatio*t.life,0,Math.PI*2);
    ctx.fillStyle=`rgba(216,195,255,${.14*t.life})`;
    ctx.fill();
  });
  trails=trails.filter(t=>t.life>0);
  requestAnimationFrame(draw);
}
draw();

/* Sound */
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

setScene(0);
