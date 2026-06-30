let current=0;
const screens=[...document.querySelectorAll(".screen")];

function show(index){
  screens.forEach(screen=>screen.classList.remove("active"));
  screens[index].classList.add("active");
  if(index===1) typeIntro();
  if(index===3 || index===4) petals(18);
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

let typed=false;
function typeIntro(){
  if(typed) return;
  typed=true;
  const text=`Hey Sundri...

Happy Birthday ❤️

I wanted to buy you something.

Then I realized...

The best gift is remembering everything that made us... us.`;
  const el=document.getElementById("typingText");
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

document.querySelectorAll("[data-carousel]").forEach((carousel)=>{
  const cards=[...carousel.querySelectorAll(".memory-page")];
  let index=0,startX=0,endX=0;
  function render(){
    cards.forEach((card,i)=>{
      card.classList.remove("active","prev","next");
      if(i===index)card.classList.add("active");
      else if(i===((index-1+cards.length)%cards.length))card.classList.add("prev");
      else if(i===((index+1)%cards.length))card.classList.add("next");
    });
  }
  function move(dir){
    index=(index+dir+cards.length)%cards.length;
    render();
  }
  carousel.addEventListener("click",(e)=>{if(!e.target.closest("button"))move(1)});
  carousel.addEventListener("touchstart",(e)=>{startX=e.touches[0].clientX},{passive:true});
  carousel.addEventListener("touchend",(e)=>{
    endX=e.changedTouches[0].clientX;
    const diff=endX-startX;
    if(Math.abs(diff)>40)move(diff<0?1:-1);
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
  c.style.background=["#ff5da2","#ffd166","#9b5cff","#ffffff","#7dd3fc"][Math.floor(Math.random()*5)];
  c.style.animationDuration=1.8+Math.random()*2+"s";
  c.style.transform="rotate("+Math.random()*360+"deg)";
  document.body.appendChild(c);
  setTimeout(()=>c.remove(),4000);
}

function petals(count){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const p=document.createElement("div");
      p.className="petal";
      p.textContent=["🌸","🌺","💮"][Math.floor(Math.random()*3)];
      p.style.left=Math.random()*100+"vw";
      p.style.fontSize=16+Math.random()*16+"px";
      p.style.animationDuration=3+Math.random()*3+"s";
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),6000);
    },i*90);
  }
}

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
  if(audioCtx)audioCtx.close();
  document.getElementById("soundBtn").textContent="Sound ✦";
}

/* Three.js heart stars */
let scene,camera,renderer,particles,heartParticles;
initThree();
animateThree();

function initThree(){
  const canvas=document.getElementById("threeCanvas");
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1000);
  camera.position.z=36;
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  const starGeo=new THREE.BufferGeometry();
  const starCount=900;
  const starPos=new Float32Array(starCount*3);
  for(let i=0;i<starCount;i++){
    starPos[i*3]=(Math.random()-.5)*95;
    starPos[i*3+1]=(Math.random()-.5)*95;
    starPos[i*3+2]=(Math.random()-.5)*95;
  }
  starGeo.setAttribute("position",new THREE.BufferAttribute(starPos,3));
  const starMat=new THREE.PointsMaterial({color:0xffffff,size:.08,transparent:true,opacity:.72});
  particles=new THREE.Points(starGeo,starMat);
  scene.add(particles);

  const heartGeo=new THREE.BufferGeometry();
  const count=320;
  const pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const t=(i/count)*Math.PI*2;
    const x=16*Math.pow(Math.sin(t),3);
    const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    pos[i*3]=x*.55 + (Math.random()-.5)*.35;
    pos[i*3+1]=y*.55 + (Math.random()-.5)*.35;
    pos[i*3+2]=(Math.random()-.5)*2;
  }
  heartGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const heartMat=new THREE.PointsMaterial({color:0xff5da2,size:.13,transparent:true,opacity:.9});
  heartParticles=new THREE.Points(heartGeo,heartMat);
  heartParticles.position.y=2;
  scene.add(heartParticles);

  window.addEventListener("resize",()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
}

function animateThree(){
  requestAnimationFrame(animateThree);
  if(particles){
    particles.rotation.y+=.0007;
    particles.rotation.x+=.0002;
  }
  if(heartParticles){
    heartParticles.rotation.z=Math.sin(Date.now()*0.001)*0.035;
    heartParticles.scale.setScalar(1+Math.sin(Date.now()*0.002)*0.035);
  }
  renderer.render(scene,camera);
}
