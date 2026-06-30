let current=0;
const screens=[...document.querySelectorAll(".screen")];

function go(n){
  screens.forEach(s=>s.classList.remove("active"));
  current=n;
  screens[n].classList.add("active");
  burstSparks(innerWidth/2, innerHeight/2, 18);
}

function restart(){go(0)}

function sparkCenter(){burstSparks(innerWidth/2, innerHeight/2, 30)}

document.addEventListener("pointerdown",(e)=>{
  if(e.target.closest("button") || e.target.closest(".cake") || e.target.closest(".envelope")) return;
  burstSparks(e.clientX,e.clientY,8);
});

function burstSparks(x,y,count){
  for(let i=0;i<count;i++){
    const s=document.createElement("div");
    s.className="spark";
    s.style.left=x+"px";s.style.top=y+"px";
    const a=Math.random()*Math.PI*2,d=45+Math.random()*95;
    s.style.setProperty("--dx",Math.cos(a)*d+"px");
    s.style.setProperty("--dy",Math.sin(a)*d+"px");
    document.body.appendChild(s);setTimeout(()=>s.remove(),800);
  }
}

/* Star unlock */
const stars=[...document.querySelectorAll(".star")];
let unlocked=[];
stars.forEach((star,i)=>{
  star.addEventListener("click",(e)=>{
    e.stopPropagation();
    star.classList.add("done");
    if(!unlocked.includes(i)) unlocked.push(i);
    document.getElementById("starMsg").textContent=star.dataset.msg;
    drawLines();
    burstSparks(e.clientX,e.clientY,18);
    if(unlocked.length===5){
      document.getElementById("starNext").classList.remove("locked");
      document.getElementById("starNext").textContent="Open memories";
    }
  });
});
function drawLines(){
  const svg=document.getElementById("lines");
  svg.innerHTML="";
  for(let i=1;i<unlocked.length;i++){
    const a=stars[unlocked[i-1]].getBoundingClientRect();
    const b=stars[unlocked[i]].getBoundingClientRect();
    const c=document.getElementById("starMap").getBoundingClientRect();
    const line=document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1",a.left+a.width/2-c.left);line.setAttribute("y1",a.top+a.height/2-c.top);
    line.setAttribute("x2",b.left+b.width/2-c.left);line.setAttribute("y2",b.top+b.height/2-c.top);
    line.setAttribute("stroke","#d8c3ff");line.setAttribute("stroke-width","2");
    svg.appendChild(line);
  }
}

/* Deck */
document.querySelectorAll(".deck").forEach(deck=>{
  const cards=[...deck.querySelectorAll(".card")];
  let idx=0,start=0;
  function render(){
    cards.forEach((card,i)=>{
      card.classList.remove("active","prev","next");
      if(i===idx) card.classList.add("active");
      else if(i===(idx-1+cards.length)%cards.length) card.classList.add("prev");
      else if(i===(idx+1)%cards.length) card.classList.add("next");
    });
  }
  function move(dir){idx=(idx+dir+cards.length)%cards.length;render();burstSparks(innerWidth/2,innerHeight/2,10)}
  deck.addEventListener("click",()=>move(1));
  deck.addEventListener("touchstart",e=>start=e.touches[0].clientX,{passive:true});
  deck.addEventListener("touchend",e=>{
    const diff=e.changedTouches[0].clientX-start;
    if(Math.abs(diff)>40) move(diff<0?1:-1);
  },{passive:true});
  render();
});

/* Hold reveal */
const hold=document.getElementById("holdPhoto");
let holdTimer;
hold.addEventListener("pointerdown",()=>{
  holdTimer=setTimeout(()=>{hold.classList.add("revealed");confettiBurst(50)},700);
});
hold.addEventListener("pointerup",()=>clearTimeout(holdTimer));
hold.addEventListener("pointerleave",()=>clearTimeout(holdTimer));

function openMemory(img,text){
  document.getElementById("modalImg").src="assets/images/"+img;
  document.getElementById("modalText").textContent=text;
  document.getElementById("memoryModal").classList.add("active");
  confettiBurst(25);
}
function closeMemory(){
  document.getElementById("memoryModal").classList.remove("active");
}

function blowCandle(){
  document.getElementById("cake").classList.add("blown");
  confettiBurst(160);
  navigator.vibrate && navigator.vibrate([60,40,80]);
  setTimeout(()=>go(6),1200);
}

function openLetter(){
  document.querySelector(".envelope").classList.add("open");
  confettiBurst(60);
}

function confettiBurst(count){
  for(let i=0;i<count;i++) setTimeout(confetti,i*5);
}
function confetti(){
  const c=document.createElement("div");
  c.className="confetti";
  c.style.left=Math.random()*100+"vw";
  c.style.width="10px";c.style.height="16px";
  c.style.background=["#6f2da8","#c7a7ff","#fff","#ffd166","#b58eff"][Math.floor(Math.random()*5)];
  c.style.animationDuration=1.8+Math.random()*2+"s";
  document.body.appendChild(c);setTimeout(()=>c.remove(),4000);
}

/* canvas particles */
const canvas=document.getElementById("fx"),ctx=canvas.getContext("2d");
let w,h,particles=[];
function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";}
addEventListener("resize",resize);resize();
for(let i=0;i<140;i++)particles.push({x:Math.random()*w,y:Math.random()*h,r:(.8+Math.random()*2)*devicePixelRatio,a:.2+Math.random()*.5,vy:(.2+Math.random()*.4)*devicePixelRatio});
function draw(){
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{p.y+=p.vy;if(p.y>h)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(199,167,255,${p.a})`;ctx.fill();});
  requestAnimationFrame(draw);
}
draw();
