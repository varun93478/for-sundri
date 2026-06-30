let current=0;
const screens=[...document.querySelectorAll(".screen")];

function show(index){
  screens.forEach(s=>s.classList.remove("active"));
  screens[index].classList.add("active");
  if(index===4 || index===5) petals(22);
}

function next(){
  if(current<screens.length-1){
    current++;
    show(current);
  }
}

function restart(){
  current=0;
  document.getElementById("cake").classList.remove("blown");
  show(current);
}

function fakeSkip(){
  document.getElementById("skipModal").classList.add("active");
}

function closeSkip(){
  document.getElementById("skipModal").classList.remove("active");
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
  }
  carousel.addEventListener("click",(e)=>{if(!e.target.closest("button"))move(1)});
  carousel.addEventListener("touchstart",(e)=>{startX=e.touches[0].clientX},{passive:true});
  carousel.addEventListener("touchend",(e)=>{
    endX=e.changedTouches[0].clientX;
    const diff=endX-startX;
    if(Math.abs(diff)>40) move(diff<0?1:-1);
  },{passive:true});
  render();
});

function blowCandle(){
  document.getElementById("cake").classList.add("blown");
  burst(140);
  setTimeout(()=>{current++;show(current)},1100);
}

function burst(count){
  for(let i=0;i<count;i++) setTimeout(confetti,i*7);
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
    },i*80);
  }
}

function footprints(){
  for(let i=0;i<4;i++){
    setTimeout(()=>{
      const f=document.createElement("div");
      f.className="petal";
      f.textContent="🐾";
      f.style.left=(35+i*8+Math.random()*10)+"vw";
      f.style.fontSize="18px";
      f.style.animationDuration="2.5s";
      document.body.appendChild(f);
      setTimeout(()=>f.remove(),3000);
    },i*90);
  }
}

/* Simple canvas sparkle + elephant balloon ambience */
const canvas=document.getElementById("magicCanvas");
const ctx=canvas.getContext("2d");
let w,h,particles=[];
function resize(){
  w=canvas.width=window.innerWidth*devicePixelRatio;
  h=canvas.height=window.innerHeight*devicePixelRatio;
  canvas.style.width=window.innerWidth+"px";
  canvas.style.height=window.innerHeight+"px";
}
window.addEventListener("resize",resize);
resize();

for(let i=0;i<70;i++){
  particles.push({
    x:Math.random()*w,
    y:Math.random()*h,
    r:(1+Math.random()*2)*devicePixelRatio,
    vx:(Math.random()-.5)*.25*devicePixelRatio,
    vy:(Math.random()-.5)*.25*devicePixelRatio,
    a:.25+Math.random()*.45
  });
}

function draw(){
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
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
