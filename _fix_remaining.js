const fs = require('fs');

// ======== ADD CANVAS JS TO THANH-VIEN.HTML ========
let tv = fs.readFileSync('thanh-vien.html', 'utf8');

// Find the DOMContentLoaded handler and add canvas + navbar init
const domReady = "document.addEventListener(\"DOMContentLoaded\", function() {";
const domReadyIdx = tv.indexOf(domReady);

if (domReadyIdx === -1) {
    console.error('Could not find DOMContentLoaded in thanh-vien.html');
    process.exit(1);
}

// Add preloader hidden class instead of display none
tv = tv.replace(
    "document.getElementById('preloader').style.display = 'none';",
    "document.getElementById('preloader').classList.add('hidden');"
);

// Add Canvas + Navbar scroll init functions BEFORE DOMContentLoaded
const canvasCode = `
        // ============================================
        // GLOBAL LOGISTICS NETWORK CANVAS (same as index.html)
        // ============================================
        function initParticles() {
            const canvas = document.getElementById('particleCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let time = 0;
            let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;

            function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
            resize();
            window.addEventListener('resize', resize);
            document.addEventListener('mousemove', (e) => {
                targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            });

            const HUB_COUNT = 10;
            const COLORS = {
                green: { r: 27, g: 138, b: 74 },
                orange: { r: 245, g: 130, b: 32 },
                yellow: { r: 255, g: 193, b: 7 }
            };

            class Hub {
                constructor(i) {
                    this.baseX = 0.08 + Math.random() * 0.84;
                    this.baseY = 0.08 + Math.random() * 0.84;
                    this.x = this.baseX * canvas.width;
                    this.y = this.baseY * canvas.height;
                    this.radius = 3 + Math.random() * 3;
                    this.radarRadius = 0;
                    this.radarSpeed = 0.3 + Math.random() * 0.5;
                    this.radarMax = 40 + Math.random() * 30;
                    const cKeys = ['green', 'orange', 'yellow'];
                    this.color = COLORS[cKeys[i % 3]];
                    this.pulsePhase = Math.random() * Math.PI * 2;
                    this.depth = 0.5 + Math.random() * 0.5;
                }
                update(t) {
                    this.x = this.baseX * canvas.width - mouseX * 15 * this.depth;
                    this.y = this.baseY * canvas.height - mouseY * 15 * this.depth;
                    this.radarRadius += this.radarSpeed;
                    if (this.radarRadius > this.radarMax) this.radarRadius = 0;
                }
                draw(t) {
                    const pulse = 0.6 + 0.4 * Math.sin(t * 0.02 + this.pulsePhase);
                    const {r, g, b} = this.color;
                    if (this.radarRadius > 0) {
                        const ra = (1 - this.radarRadius / this.radarMax) * 0.25;
                        ctx.beginPath(); ctx.arc(this.x, this.y, this.radarRadius, 0, Math.PI * 2);
                        ctx.strokeStyle = 'rgba('+r+','+g+','+b+','+ra+')'; ctx.lineWidth = 1; ctx.stroke();
                    }
                    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6);
                    grad.addColorStop(0, 'rgba('+r+','+g+','+b+','+(0.2*pulse)+')');
                    grad.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * 6, 0, Math.PI * 2);
                    ctx.fillStyle = grad; ctx.fill();
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba('+Math.min(255,r+60)+','+Math.min(255,g+60)+','+Math.min(255,b+60)+','+(0.7*pulse)+')';
                    ctx.fill();
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * 0.4 * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,'+(0.6*pulse)+')'; ctx.fill();
                }
            }

            const ROUTE_AIR = 0, ROUTE_SEA = 1, ROUTE_LAND = 2;
            class Route {
                constructor(a, b, type) { this.hubA = a; this.hubB = b; this.type = type; this.vehicles = []; this.timer = Math.random()*200; this.interval = 120+Math.random()*180; }
                draw(t) {
                    const ax=this.hubA.x,ay=this.hubA.y,bx=this.hubB.x,by=this.hubB.y;
                    const dx=bx-ax,dy=by-ay,dist=Math.sqrt(dx*dx+dy*dy);
                    if(dist>canvas.width*0.65)return;
                    const fade=Math.max(0,1-dist/(canvas.width*0.6));
                    const {r,g,b}=this.hubA.color;
                    ctx.save();
                    if(this.type===ROUTE_AIR){const cpx=(ax+bx)/2+dy*0.3,cpy=(ay+by)/2-Math.abs(dx)*0.15;ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo(cpx,cpy,bx,by);ctx.strokeStyle='rgba('+r+','+g+','+b+','+(fade*0.1)+')';ctx.lineWidth=0.8;ctx.stroke();}
                    else if(this.type===ROUTE_SEA){ctx.beginPath();for(let i=0;i<=40;i++){const p=i/40,lx=ax+dx*p,ly=ay+dy*p,px2=-dy/dist,py2=dx/dist,w=Math.sin(p*Math.PI*4+t*0.015)*5;const px=lx+px2*w,pyy=ly+py2*w;i===0?ctx.moveTo(px,pyy):ctx.lineTo(px,pyy);}ctx.strokeStyle='rgba('+r+','+g+','+b+','+(fade*0.08)+')';ctx.lineWidth=0.8;ctx.stroke();}
                    else{ctx.beginPath();ctx.setLineDash([6,8]);ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.strokeStyle='rgba('+r+','+g+','+b+','+(fade*0.08)+')';ctx.lineWidth=0.7;ctx.stroke();ctx.setLineDash([]);}
                    ctx.restore();
                }
                spawn(t) {
                    this.timer++;
                    const ax=this.hubA.x,ay=this.hubA.y,bx=this.hubB.x,by=this.hubB.y;
                    if(Math.sqrt((bx-ax)**2+(by-ay)**2)>canvas.width*0.6)return;
                    if(this.timer>=this.interval){this.timer=0;const d=Math.random()>0.5;this.vehicles.push(new Vehicle(d?this.hubA:this.hubB,d?this.hubB:this.hubA,this.type));}
                }
            }

            class Vehicle {
                constructor(from, to, rt) {
                    this.fromX=from.x;this.fromY=from.y;this.toX=to.x;this.toY=to.y;
                    this.rt=rt;this.progress=0;this.speed=0.003+Math.random()*0.004;this.alive=true;this.tailLength=0.08+Math.random()*0.06;
                    const cs=[COLORS.green,COLORS.orange,COLORS.yellow];this.color=cs[rt%3];
                    this.icon=rt===0?'\\u2708':rt===1?'\\u{1F6A2}':'\\u{1F69B}';
                }
                getPos(p) {
                    p=Math.max(0,Math.min(1,p));const ax=this.fromX,ay=this.fromY,bx=this.toX,by=this.toY;
                    if(this.rt===0){const dx=bx-ax,dy=by-ay,cpx=(ax+bx)/2+dy*0.3,cpy=(ay+by)/2-Math.abs(dx)*0.15,mt=1-p;return{x:mt*mt*ax+2*mt*p*cpx+p*p*bx,y:mt*mt*ay+2*mt*p*cpy+p*p*by};}
                    else if(this.rt===1){const dx=bx-ax,dy=by-ay,dist=Math.sqrt(dx*dx+dy*dy)||1,lx=ax+dx*p,ly=ay+dy*p,w=Math.sin(p*Math.PI*4+time*0.015)*5;return{x:lx+(-dy/dist)*w,y:ly+(dx/dist)*w};}
                    return{x:ax+(bx-ax)*p,y:ay+(by-ay)*p};
                }
                update(){this.progress+=this.speed;if(this.progress>1+this.tailLength)this.alive=false;}
                draw(){
                    const{r,g,b}=this.color;const head=this.getPos(Math.min(this.progress,1));const tail=this.getPos(Math.max(this.progress-this.tailLength,0));
                    const grad=ctx.createLinearGradient(tail.x,tail.y,head.x,head.y);
                    grad.addColorStop(0,'rgba('+r+','+g+','+b+',0)');grad.addColorStop(0.7,'rgba('+r+','+g+','+b+',0.35)');
                    grad.addColorStop(1,'rgba('+Math.min(255,r+80)+','+Math.min(255,g+80)+','+Math.min(255,b+80)+',0.7)');
                    ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(head.x,head.y);ctx.strokeStyle=grad;ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();
                    const hG=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,8);
                    hG.addColorStop(0,'rgba(255,255,255,0.5)');hG.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
                    ctx.beginPath();ctx.arc(head.x,head.y,8,0,Math.PI*2);ctx.fillStyle=hG;ctx.fill();
                    if(this.progress>0.05&&this.progress<0.95){ctx.font='10px sans-serif';ctx.fillText(this.icon,head.x+5,head.y-5);}
                }
            }

            const hubs=[],routes=[],dusts=[];
            for(let i=0;i<HUB_COUNT;i++)hubs.push(new Hub(i));
            for(let i=0;i<hubs.length;i++)for(let j=i+1;j<hubs.length;j++){
                const dx=hubs[i].baseX-hubs[j].baseX,dy=hubs[i].baseY-hubs[j].baseY;
                if(Math.sqrt(dx*dx+dy*dy)<0.4)routes.push(new Route(hubs[i],hubs[j],(i+j)%3));
            }
            for(let i=0;i<25;i++)dusts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-0.5)*0.15,vy:(Math.random()-0.5)*0.15,r:0.5+Math.random(),a:0.1+Math.random()*0.2,d:0.3+Math.random()*0.7});

            function animate() {
                time++;mouseX+=(targetMouseX-mouseX)*0.05;mouseY+=(targetMouseY-mouseY)*0.05;
                ctx.clearRect(0,0,canvas.width,canvas.height);
                routes.forEach(r=>{r.draw(time);r.spawn(time);r.vehicles=r.vehicles.filter(v=>v.alive);r.vehicles.forEach(v=>{v.update();v.draw();});});
                hubs.forEach(h=>{h.update(time);h.draw(time);});
                dusts.forEach(d=>{d.x+=d.vx-mouseX*3*d.d;d.y+=d.vy-mouseY*3*d.d;if(d.x<-10)d.x=canvas.width+10;if(d.x>canvas.width+10)d.x=-10;if(d.y<-10)d.y=canvas.height+10;if(d.y>canvas.height+10)d.y=-10;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle='rgba(200,210,230,'+d.a+')';ctx.fill();});
                requestAnimationFrame(animate);
            }
            animate();
        }

        function initNavbarScroll() {
            const header = document.querySelector('header');
            if (!header) return;
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
            });
        }

`;

// Insert canvas code before DOMContentLoaded
tv = tv.substring(0, domReadyIdx) + canvasCode + tv.substring(domReadyIdx);

// Now add initParticles() and initNavbarScroll() calls inside DOMContentLoaded
const newDomReady = tv.indexOf(domReady);
const afterDomReady = newDomReady + domReady.length;
tv = tv.substring(0, afterDomReady) + '\n            initParticles();\n            initNavbarScroll();\n' + tv.substring(afterDomReady);

fs.writeFileSync('thanh-vien.html', tv, 'utf8');
console.log('Canvas JS added to thanh-vien.html!');

// ======== ADMIN.HTML CSS REWRITE ========
let ad = fs.readFileSync('admin.html', 'utf8');

// Add Google Fonts if not present
if (!ad.includes('Space+Grotesk')) {
    ad = ad.replace('<style>', '<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n    <style>');
}

// Find and replace the style block
const adStyleStart = ad.indexOf('<style>');
const adStyleEnd = ad.indexOf('</style>') + '</style>'.length;

const adminCSS = `<style>
        /* ============================================
           ADMIN DASHBOARD — "Sci-Fi Command Center"
           ============================================ */
        :root {
            --bg-deep: #050B18; --bg-mid: #081222; --bg-surface: #0C1A2E;
            --accent-green: #1B8A4A; --accent-green-glow: rgba(27,138,74,0.3);
            --accent-orange: #F58220; --accent-orange-glow: rgba(245,130,32,0.25);
            --accent-yellow: #FFC107; --danger: #EF4444; --success: #22C55E;
            --text-primary: #E8ECF4; --text-secondary: #7E8CA0; --text-muted: #4A5568;
            --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(255,255,255,0.06);
            --transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #050B18 0%, #081222 50%, #0A1628 100%);
            color: var(--text-primary); display: flex; height: 100vh; overflow: hidden;
            position: relative;
        }
        body::before {
            content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background:
                radial-gradient(ellipse 80% 60% at 30% 50%, rgba(27,138,74,0.05) 0%, transparent 70%),
                radial-gradient(ellipse 60% 50% at 70% 50%, rgba(245,130,32,0.04) 0%, transparent 70%);
        }
        ::selection { background: var(--accent-green); color: white; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg-deep); }
        ::-webkit-scrollbar-thumb { background: var(--accent-green); border-radius: 3px; }
        a { text-decoration: none; color: inherit; }

        /* SIDEBAR */
        .sidebar {
            width: 260px; height: 100vh; position: fixed; left: 0; top: 0; z-index: 10;
            background: rgba(8,18,34,0.85);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-right: 1px solid var(--glass-border);
            display: flex; flex-direction: column;
            box-shadow: inset -1px 0 0 rgba(255,255,255,0.03);
        }
        .sidebar-header {
            padding: 24px 20px; display: flex; align-items: center; gap: 14px;
            border-bottom: 1px solid var(--glass-border);
        }
        .sidebar-header img { width: 40px; border-radius: 12px; box-shadow: 0 0 15px var(--accent-green-glow); }
        .sidebar-header h2 {
            font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700;
        }
        .sidebar-header span { font-size: 10px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; display: block; }
        .sidebar-menu { flex: 1; padding: 16px 12px; overflow-y: auto; }
        .menu-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; padding: 16px 12px 6px; font-weight: 700; }
        .menu-item {
            display: flex; align-items: center; gap: 12px;
            padding: 12px 16px; border-radius: 10px; cursor: pointer;
            color: var(--text-secondary); font-size: 13px; font-weight: 600;
            transition: var(--transition); margin-bottom: 2px; border: none; background: none; width: 100%; text-align: left;
        }
        .menu-item:hover { color: var(--text-primary); background: rgba(27,138,74,0.08); }
        .menu-item.active {
            color: var(--accent-green); background: rgba(27,138,74,0.12);
            border-left: 3px solid var(--accent-green);
            box-shadow: inset 0 0 15px rgba(27,138,74,0.05);
        }
        .menu-item i { width: 18px; text-align: center; font-size: 14px; }
        .sidebar-footer { padding: 16px; border-top: 1px solid var(--glass-border); }
        .btn-logout {
            width: 100%; padding: 10px; border-radius: 10px; border: none;
            background: rgba(239,68,68,0.1); color: var(--danger);
            font-weight: 700; font-size: 13px; cursor: pointer; transition: var(--transition);
        }
        .btn-logout:hover { background: rgba(239,68,68,0.2); }

        /* MAIN CONTENT */
        .main-content {
            margin-left: 260px; flex: 1; height: 100vh; overflow-y: auto;
            position: relative; z-index: 1;
        }
        .topbar {
            position: sticky; top: 0; z-index: 5;
            background: rgba(8,18,34,0.7); backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--glass-border);
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 30px; height: 65px;
        }
        .topbar-title {
            font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700;
        }
        .admin-profile { display: flex; align-items: center; gap: 10px; }
        .admin-profile i { color: var(--accent-green); font-size: 18px; }
        .admin-profile span { font-size: 14px; font-weight: 600; }
        .content-area { padding: 30px; }

        /* TAB SYSTEM */
        .tab-content { display: none; animation: fadeIn 0.3s ease; }
        .tab-content.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* PANELS */
        .panel {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 16px; padding: 28px; margin-bottom: 24px;
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        }
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .panel-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; }

        /* STAT CARDS */
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .stat-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 16px; padding: 24px; text-align: center;
            transition: var(--transition);
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); border-color: rgba(27,138,74,0.15); }
        .stat-number {
            font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 800;
            background: linear-gradient(135deg, #F58220, #FFC107);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .stat-label { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-top: 6px; }

        /* TABLES */
        table { width: 100%; border-collapse: separate; border-spacing: 0 4px; }
        th {
            background: rgba(255,255,255,0.04); padding: 14px 16px; text-align: left;
            font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
            color: var(--text-secondary);
        }
        th:first-child { border-radius: 10px 0 0 10px; }
        th:last-child { border-radius: 0 10px 10px 0; }
        td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; }
        tbody tr { transition: var(--transition); }
        tbody tr:hover { background: rgba(27,138,74,0.04); }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; display: inline-block; }
        .badge-active { background: rgba(34,197,94,0.12); color: #22C55E; }
        .badge-ctv { background: rgba(245,130,32,0.12); color: #F58220; }
        .badge-alumni { background: rgba(126,140,160,0.12); color: #7E8CA0; }

        /* BUTTONS */
        .btn-action {
            padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
            cursor: pointer; border: none; transition: var(--transition); display: inline-flex; align-items: center; gap: 4px;
        }
        .btn-action:hover { transform: translateY(-1px); }
        .btn-edit { background: rgba(245,130,32,0.1); color: #F58220; }
        .btn-edit:hover { background: rgba(245,130,32,0.2); }
        .btn-delete { background: rgba(239,68,68,0.1); color: #EF4444; }
        .btn-delete:hover { background: rgba(239,68,68,0.2); }
        .btn-success { background: rgba(34,197,94,0.1); color: #22C55E; }
        .btn-success:hover { background: rgba(34,197,94,0.2); }

        /* FORMS */
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group.full { grid-column: span 2; }
        .input-group label {
            font-size: 12px; font-weight: 700; color: var(--text-secondary);
            text-transform: uppercase; letter-spacing: 1px;
        }
        .input-group input, .input-group select, .input-group textarea {
            background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
            border-radius: 10px; padding: 12px 16px; color: var(--text-primary);
            font-size: 14px; font-family: 'Inter', sans-serif; transition: var(--transition);
        }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
            outline: none; border-color: var(--accent-green);
            box-shadow: 0 0 0 3px rgba(27,138,74,0.1); background: rgba(255,255,255,0.06);
        }
        .input-group select option { background: var(--bg-surface); color: var(--text-primary); }
        .security-box {
            background: rgba(245,130,32,0.05); border: 1px solid rgba(245,130,32,0.15);
            border-radius: 12px; padding: 20px;
        }

        /* SUBMIT/DANGER BUTTONS */
        .btn-submit, button[type="submit"] {
            background: linear-gradient(135deg, #1B8A4A, #0D6B35); border: none;
            color: white; padding: 12px 28px; border-radius: 10px; font-weight: 700;
            font-size: 14px; cursor: pointer; transition: var(--transition);
            box-shadow: 0 4px 15px var(--accent-green-glow);
        }
        .btn-submit:hover, button[type="submit"]:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-green-glow); }
        .btn-danger {
            background: linear-gradient(135deg, #EF4444, #DC2626); border: none;
            color: white; padding: 12px 28px; border-radius: 10px; font-weight: 700;
            font-size: 14px; cursor: pointer; transition: var(--transition);
        }

        /* CONTENT ITEMS (about sections, news list) */
        .content-item, .list-item {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 12px; padding: 20px; margin-bottom: 12px;
            transition: var(--transition);
        }
        .content-item:hover, .list-item:hover { border-color: rgba(27,138,74,0.15); }
        .content-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .content-item h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; }
        .content-item p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-top: 8px; }
        .btn-sm { padding: 5px 12px; font-size: 11px; border-radius: 6px; cursor: pointer; border: none; font-weight: 700; }
        .list-item { display: flex; align-items: center; gap: 16px; }
        .list-item img { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; border: 2px solid rgba(255,255,255,0.06); }
        .list-item-content h3 { font-size: 14px; font-weight: 700; }
        .list-item-content p { font-size: 12px; color: var(--text-secondary); }

        /* APPROVAL CARDS */
        .approval-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 12px; padding: 20px; margin-bottom: 12px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .approval-info h4 { font-size: 15px; font-weight: 700; }
        .approval-info p { font-size: 12px; color: var(--text-secondary); }
        .approval-actions { display: flex; gap: 8px; }

        /* TOAST */
        .toast-container { position: fixed; top: 20px; right: 20px; z-index: 99999; }
        .toast {
            background: rgba(12,26,46,0.9); border: 1px solid var(--glass-border);
            backdrop-filter: blur(12px); border-radius: 12px; padding: 14px 20px;
            margin-bottom: 10px; min-width: 280px; animation: slideIn 0.3s ease;
            font-size: 13px; font-weight: 600;
        }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .toast.success { border-left: 3px solid #22C55E; }
        .toast.error { border-left: 3px solid #EF4444; }
        .toast.info { border-left: 3px solid #F58220; }

        /* MODAL */
        .modal-overlay {
            display: none; position: fixed; inset: 0; z-index: 9999;
            background: rgba(5,11,24,0.9); backdrop-filter: blur(8px);
            justify-content: center; align-items: center;
        }
        .modal-overlay.show { display: flex; }
        .modal {
            background: rgba(12,26,46,0.95); border: 1px solid var(--glass-border);
            border-radius: 20px; max-width: 560px; width: 90%; padding: 32px;
            animation: modalIn 0.3s ease;
        }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .modal-header { margin-bottom: 20px; }
        .modal-body { margin-bottom: 24px; }
        .modal-footer { display: flex; gap: 12px; justify-content: flex-end; }

        /* MESSAGES */
        .msg-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 12px; padding: 20px; margin-bottom: 12px;
        }
        .msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .msg-name { font-weight: 700; font-size: 15px; }
        .msg-email { font-size: 12px; color: var(--accent-green); }
        .msg-date { font-size: 11px; color: var(--text-muted); }
        .msg-content { color: var(--text-secondary); font-size: 13px; line-height: 1.7; }

        .empty-state { text-align: center; padding: 40px; color: var(--text-muted); font-size: 14px; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); width: 240px; z-index: 100; }
            .main-content { margin-left: 0; }
            .stat-grid { grid-template-columns: repeat(2, 1fr); }
            .form-grid { grid-template-columns: 1fr; }
            .input-group.full { grid-column: span 1; }
        }
    </style>`;

ad = ad.substring(0, adStyleStart) + adminCSS + ad.substring(adStyleEnd);

fs.writeFileSync('admin.html', ad, 'utf8');
console.log('admin.html CSS rewritten successfully!');
console.log('All 3 files updated!');
