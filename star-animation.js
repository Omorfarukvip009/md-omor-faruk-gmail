const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars=[];
for(let i=0;i<150;i++){
  stars.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*2+1, speed:Math.random()*1.5+0.5});
}

function animateStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#0ff';
  stars.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fill();
    s.y += s.speed;
    if(s.y>canvas.height){s.y=0; s.x=Math.random()*canvas.width;}
  });
  requestAnimationFrame(animateStars);
}
animateStars();
