/* Decorative network world, rendered locally without a library or network requests. */
(() => {
  const canvas = document.getElementById('network-world');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.getElementById('hero');
  let w = 0, h = 0, frame = 0, last = 0, phase = 0;
  let light = document.documentElement.dataset.theme === 'light';
  const tau = Math.PI * 2;
  // Stylized continental silhouettes, expressed as longitude / latitude.
  const continents = [
    [[-168,65],[-140,70],[-125,60],[-110,55],[-85,52],[-55,55],[-65,42],[-82,25],[-98,17],[-110,28],[-125,45],[-155,58]],
    [[-80,12],[-62,10],[-48,-4],[-35,-8],[-43,-24],[-55,-38],[-69,-55],[-76,-30],[-80,-5]],
    [[-18,35],[4,37],[30,31],[43,12],[50,0],[39,-16],[29,-34],[17,-35],[9,-12],[-8,5],[-17,15]],
    [[-10,36],[-9,57],[10,70],[30,60],[45,65],[70,73],[110,70],[150,60],[170,52],[140,35],[120,20],[105,0],[90,22],[77,8],[65,24],[43,30],[30,42],[10,38]],
    [[112,-12],[132,-10],[152,-25],[146,-39],[126,-35],[114,-24]],
    [[-52,60],[-42,60],[-20,77],[-40,83],[-60,76]],
    [[47,-13],[51,-16],[48,-26],[44,-24]]
  ];
  function inside(x, y, polygon) {
    let hit = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
    }
    return hit;
  }
  const land = [];
  for (let lat = -57; lat < 81; lat += 3.5) {
    for (let lon = -180; lon < 180; lon += 3.5 / Math.cos(lat * Math.PI / 180)) {
      if (continents.some(p => inside(lon, lat, p))) land.push([lon, lat]);
    }
  }
  function color(alpha, violet = false) { return light ? `rgba(${violet ? '83,98,180' : '0,111,141'},${alpha})` : `rgba(${violet ? '135,156,255' : '102,228,237'},${alpha})`; }
  function point(lon, lat, r, cx, cy) {
    const a = lon * Math.PI / 180 + phase * .075 - .35;
    const b = lat * Math.PI / 180;
    const x = Math.cos(b) * Math.sin(a), z = Math.cos(b) * Math.cos(a), y = -Math.sin(b);
    return { x: cx + r * x, y: cy + r * (y * .98 + z * .16), z };
  }
  function line(points, stroke, width = 1) {
    ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke();
  }
  function laptop(x, y, size, violet) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color(.65, violet); ctx.lineWidth = 1;
    ctx.fillStyle = light ? '#edf5fc' : '#0b1b2e';
    ctx.beginPath(); ctx.roundRect(-size / 2, -size / 3, size, size * .62, 4); ctx.fill(); ctx.stroke();
    line([{x: -size*.61,y:size*.4},{x:size*.61,y:size*.4},{x:size*.5,y:size*.29},{x:-size*.5,y:size*.29},{x:-size*.61,y:size*.4}], color(.65, violet));
    line([{x:-size*.27,y:-size*.1},{x:-size*.38,y:0},{x:-size*.27,y:size*.1}], color(.8, violet));
    line([{x:size*.27,y:-size*.1},{x:size*.38,y:0},{x:size*.27,y:size*.1}], color(.8, violet));
    line([{x:size*.08,y:-size*.13},{x:-size*.08,y:size*.13}], color(.65, violet)); ctx.restore();
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const mobile = w <= 900, rect = hero.getBoundingClientRect();
    const r = mobile ? Math.min(w * .26, 150) : Math.min(w * .205, h * .33, 310);
    const cx = mobile ? w * .55 : w * .79;
    const cy = mobile ? rect.bottom - 135 : Math.max(310, Math.min(h * .51, 500));
    const glow = ctx.createRadialGradient(cx, cy, r*.2, cx, cy, r*1.65);
    glow.addColorStop(0, color(light ? .035 : .075)); glow.addColorStop(1, color(0));
    ctx.fillStyle = glow; ctx.fillRect(0,0,w,h);
    // Quiet network nodes extend the live background beyond the hero.
    const nodes = Array.from({length: mobile ? 17 : 34}, (_,i) => ({x: ((i*239+53)%997)/997*w, y: ((i*157+37)%751)/751*h + Math.sin(phase*.3+i)*8}));
    nodes.forEach((p,i) => {
      ctx.beginPath(); ctx.arc(p.x,p.y,1.3,0,tau); ctx.fillStyle = color(.22); ctx.fill();
      nodes.slice(i+1).forEach(q => { const d = Math.hypot(p.x-q.x,p.y-q.y); if(d<180) line([p,q],color(.085*(1-d/180))); });
    });
    if (mobile && cy < -r*1.6) return;
    ctx.beginPath(); ctx.ellipse(cx,cy,r*1.28,r*.39,-.3,0,tau); ctx.strokeStyle=color(.18,true); ctx.stroke();
    // Front-facing latitude and longitude lines.
    for (let lat=-60;lat<=60;lat+=20) {
      let segment=[];
      for(let lon=-180;lon<=180;lon+=3) { const p=point(lon,lat,r,cx,cy); if(p.z>0) segment.push(p); else { if(segment.length) line(segment,color(.11)); segment=[]; } }
      if(segment.length) line(segment,color(.11));
    }
    for (let lon=-180;lon<180;lon+=20) {
      let segment=[];
      for(let lat=-90;lat<=90;lat+=3) { const p=point(lon,lat,r,cx,cy); if(p.z>0) segment.push(p); else { if(segment.length) line(segment,color(.11)); segment=[]; } }
      if(segment.length) line(segment,color(.11));
    }
    land.forEach(([lon,lat]) => { const p=point(lon,lat,r,cx,cy); if(p.z<-.1)return; ctx.beginPath(); ctx.arc(p.x,p.y,(mobile?1:1.4)*(.65+Math.max(0,p.z)*.5),0,tau); ctx.fillStyle=color(.16+Math.max(0,p.z)*.55); ctx.fill(); });
    ctx.beginPath();ctx.arc(cx,cy,r,0,tau);ctx.strokeStyle=color(.25);ctx.stroke();
    const hubs = [[-74,41],[0,51],[31,-18],[77,28],[139,36],[151,-33]];
    hubs.forEach(([lon,lat],i) => {
      const p=point(lon,lat,r,cx,cy); if(p.z<0)return;
      const angle=i*tau/hubs.length+phase*.025;
      const q={x:cx+Math.cos(angle)*r*1.28,y:cy+Math.sin(angle)*r*.97};
      const control={x:(p.x+q.x)/2,y:Math.min(p.y,q.y)-r*.25};
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(control.x,control.y,q.x,q.y);ctx.strokeStyle=color(.28,i%2);ctx.stroke();
      const t=(phase*.19+i*.17)%1, u=1-t;
      const px=u*u*p.x+2*u*t*control.x+t*t*q.x,py=u*u*p.y+2*u*t*control.y+t*t*q.y;
      ctx.beginPath();ctx.arc(px,py,2,0,tau);ctx.fillStyle=color(.95);ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,3,0,tau);ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,7+Math.sin(phase*2+i)*2,0,tau);ctx.strokeStyle=color(.28);ctx.stroke();
      laptop(q.x,q.y,mobile?25:38,i%2);
    });
  }
  function tick(now) { frame=0; if(document.hidden || reduced.matches)return; if(now-last>32) {phase+=Math.min((now-last)/1000,.05);last=now;draw();} frame=requestAnimationFrame(tick); }
  function restart() { cancelAnimationFrame(frame); frame=0; draw(); if(!document.hidden && !reduced.matches) {last=performance.now();frame=requestAnimationFrame(tick);} }
  function resize() { w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);restart(); }
  addEventListener('resize',resize,{passive:true});
  addEventListener('scroll',()=>{if(reduced.matches)draw();},{passive:true});
  document.addEventListener('visibilitychange',restart);
  reduced.addEventListener('change',restart);
  new MutationObserver(()=>{light=document.documentElement.dataset.theme==='light';draw();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  resize();
  // Keep mobile navigation state accessible while retaining its original handlers.
  const menu=document.getElementById('mobileMenu'), toggle=document.getElementById('hamburger');
  toggle.setAttribute('aria-controls','mobileMenu');toggle.setAttribute('aria-expanded','false');
  new MutationObserver(()=>toggle.setAttribute('aria-expanded',String(menu.classList.contains('open')))).observe(menu,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')) {menu.classList.remove('open');toggle.focus();}});
})();
