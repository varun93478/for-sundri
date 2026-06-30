const scenes=[...document.querySelectorAll(".scene")];
let current=0;
let gateIndex=0;

function setWorld(type){
  const sky=document.querySelector(".sky");
  sky.className="sky";
  if(type) sky.classList.add(type);
}

function show(i){
  scenes.forEach(s=>s.classList.remove("active"));
  scenes[i].classList.add("active");
  setWorld(scenes[i].dataset.world);
  burstSparks(innerWidth/2, innerHeight/2, 12);
}

function openGate(){
  current++;
  show(current);
}

function enterMemory(gate){
  const gateEl=document.querySelector(".scene.active .gate");
  if(gateEl){
    gateEl.classList.add("open");
    petals(24);
    setTimeout(()=>{current++;show(current)},900);
  } else {
    current++;
    show(current);
  }
}

function nextScene(){
  current++;
  show(current);
}

function restart(){
  current=0;
  document.getElementById("cake").classList.remove("blown");
  document.querySelectorAll(".gate").forEach(g=>g.classList.remove("open"));
  show(current);
}

document.querySelectorAll("[data-carousel]").forEach((carousel)=>{
  const cards=[...carousel.querySelectorAll(".memory-card")];
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
    burstSparks(innerWidth/2, innerHeight/2, 10);
  }
  carousel.addEventListener("click",()=>move(1));
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
  confettiBurst(160);
  navigator.vibrate && navigator.vibrate([70,40,100]);
  setTimeout(()=>{current++;show(current)},1100);
}

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

document.addEventListener("pointerdown",(e)=>{
  if(e.target.closest("button") || e.target.closest("[data-carousel]")) return;
  burstSparks(e.clientX,e.clientY,8);
});

function confettiBurst(count){
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
      p.textContent=["🌸","💜","🤍","✨"][Math.floor(Math.random()*4)];
      p.style.left=Math.random()*100+"vw";
      p.style.fontSize=14+Math.random()*16+"px";
      p.style.animationDuration=3+Math.random()*3+"s";
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),6000);
    },i*70);
  }
}

function footprints(){
  for(let i=0;i<5;i++){
    setTimeout(()=>{
      const f=document.createElement("div");
      f.className="petal";
      f.textContent="🐾";
      f.style.left=(25+i*12+Math.random()*10)+"vw";
      f.style.fontSize="18px";
      f.style.animationDuration="2.5s";
      document.body.appendChild(f);
      setTimeout(()=>f.remove(),3000);
    },i*80);
  }
}

/* Canvas world: fireflies / stars / bubbles */
const canvas=document.getElementById("world");
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

for(let i=0;i<120;i++){
  particles.push({
    x:Math.random()*w,
    y:Math.random()*h,
    r:(1+Math.random()*2.4)*devicePixelRatio,
    vx:(Math.random()-.5)*.32*devicePixelRatio,
    vy:(Math.random()-.5)*.32*devicePixelRatio,
    a:.18+Math.random()*.55
  });
}

function draw(){
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${p.a})`;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();

show(0);
