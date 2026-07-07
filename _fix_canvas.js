const fs = require('fs');
const path = 'index.html';
let c = fs.readFileSync(path, 'utf8');

// Find the old canvas system boundaries
const startMarker = '        // ============================================\n        // 3. ETHEREAL CANVAS';
const endMarker = '        // ============================================\n        // 4. PARALLAX EFFECT';

const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find canvas boundaries!');
    console.log('Start found:', startIdx !== -1);
    console.log('End found:', endIdx !== -1);
    // Try alternative search
    const alt1 = c.indexOf('3. ETHEREAL CANVAS');
    const alt2 = c.indexOf('4. PARALLAX EFFECT');
    console.log('Alt start:', alt1);
    console.log('Alt end:', alt2);
    process.exit(1);
}

const newCanvas = `        // ============================================
        // 3. GLOBAL LOGISTICS NETWORK — Sci-Fi Radar Canvas
        // ============================================
        function initParticles() {
            const canvas = document.getElementById('particleCanvas');
            const ctx = canvas.getContext('2d');
            let time = 0;
            let mouseX = 0, mouseY = 0;
            let targetMouseX = 0, targetMouseY = 0;

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            // Mouse tracking for parallax
            document.addEventListener('mousemove', (e) => {
                targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            });

            // === HUB DEFINITIONS (Logistics nodes — ports/airports) ===
            const HUB_COUNT = 10;
            const COLORS = {
                green: { r: 27, g: 138, b: 74 },
                orange: { r: 245, g: 130, b: 32 },
                yellow: { r: 255, g: 193, b: 7 },
                white: { r: 200, g: 210, b: 230 }
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
                    this.phase = Math.random() * Math.PI * 2;
                    const cKeys = ['green', 'orange', 'yellow'];
                    const ck = cKeys[i % 3];
                    this.color = COLORS[ck];
                    this.pulsePhase = Math.random() * Math.PI * 2;
                    this.depth = 0.5 + Math.random() * 0.5; // for parallax
                }
                update(t) {
                    this.x = this.baseX * canvas.width;
                    this.y = this.baseY * canvas.height;
                    // Parallax offset
                    const px = -mouseX * 15 * this.depth;
                    const py = -mouseY * 15 * this.depth;
                    this.x += px;
                    this.y += py;
                    // Radar wave
                    this.radarRadius += this.radarSpeed;
                    if (this.radarRadius > this.radarMax) this.radarRadius = 0;
                }
                draw(t) {
                    const pulse = 0.6 + 0.4 * Math.sin(t * 0.02 + this.pulsePhase);
                    const {r, g, b} = this.color;

                    // Radar ring
                    if (this.radarRadius > 0) {
                        const radarAlpha = (1 - this.radarRadius / this.radarMax) * 0.25;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.radarRadius, 0, Math.PI * 2);
                        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + radarAlpha + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }

                    // Outer glow
                    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6);
                    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.2 * pulse) + ')');
                    grad.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.05 * pulse) + ')');
                    grad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * 6, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();

                    // Core dot
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + Math.min(255, r + 60) + ',' + Math.min(255, g + 60) + ',' + Math.min(255, b + 60) + ',' + (0.7 * pulse) + ')';
                    ctx.fill();

                    // Inner bright core
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * 0.4 * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,' + (0.6 * pulse) + ')';
                    ctx.fill();
                }
            }

            // === ROUTE TYPES ===
            const ROUTE_AIR = 0;   // Bezier curves (airline)
            const ROUTE_SEA = 1;   // Wavy sine lines (shipping)
            const ROUTE_LAND = 2;  // Dashed lines (trucking)

            class Route {
                constructor(hubA, hubB, type) {
                    this.hubA = hubA;
                    this.hubB = hubB;
                    this.type = type;
                    this.vehicles = [];
                    this.spawnTimer = Math.random() * 200;
                    this.spawnInterval = 120 + Math.random() * 180;
                }
                draw(t) {
                    const ax = this.hubA.x, ay = this.hubA.y;
                    const bx = this.hubB.x, by = this.hubB.y;
                    const dx = bx - ax, dy = by - ay;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > canvas.width * 0.65) return; // Too far, don't draw

                    const fade = Math.max(0, 1 - dist / (canvas.width * 0.6));
                    const {r, g, b} = this.hubA.color;

                    ctx.save();
                    if (this.type === ROUTE_AIR) {
                        // Bezier curve (flight path)
                        const cpx = (ax + bx) / 2 + dy * 0.3;
                        const cpy = (ay + by) / 2 - Math.abs(dx) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(ax, ay);
                        ctx.quadraticCurveTo(cpx, cpy, bx, by);
                        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (fade * 0.1) + ')';
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    } else if (this.type === ROUTE_SEA) {
                        // Wavy sine line (shipping lane)
                        ctx.beginPath();
                        const steps = 40;
                        for (let i = 0; i <= steps; i++) {
                            const p = i / steps;
                            const lx = ax + dx * p;
                            const ly = ay + dy * p;
                            const perpX = -dy / dist;
                            const perpY = dx / dist;
                            const wave = Math.sin(p * Math.PI * 4 + t * 0.015) * 5;
                            const px = lx + perpX * wave;
                            const py = ly + perpY * wave;
                            if (i === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (fade * 0.08) + ')';
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    } else {
                        // Dashed line (land route)
                        ctx.beginPath();
                        ctx.setLineDash([6, 8]);
                        ctx.moveTo(ax, ay);
                        ctx.lineTo(bx, by);
                        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (fade * 0.08) + ')';
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                    ctx.restore();
                }
                spawnVehicle(t) {
                    this.spawnTimer++;
                    const ax = this.hubA.x, ay = this.hubA.y;
                    const bx = this.hubB.x, by = this.hubB.y;
                    const dist = Math.sqrt((bx-ax)**2 + (by-ay)**2);
                    if (dist > canvas.width * 0.6) return;
                    if (this.spawnTimer >= this.spawnInterval) {
                        this.spawnTimer = 0;
                        const dir = Math.random() > 0.5;
                        this.vehicles.push(new Vehicle(
                            dir ? this.hubA : this.hubB,
                            dir ? this.hubB : this.hubA,
                            this.type
                        ));
                    }
                }
            }

            // === VEHICLE (light trail with icon) ===
            class Vehicle {
                constructor(from, to, routeType) {
                    this.fromX = from.x; this.fromY = from.y;
                    this.toX = to.x; this.toY = to.y;
                    this.routeType = routeType;
                    this.progress = 0;
                    this.speed = 0.003 + Math.random() * 0.004;
                    this.alive = true;
                    this.tailLength = 0.08 + Math.random() * 0.06;
                    const colors = [COLORS.green, COLORS.orange, COLORS.yellow];
                    this.color = colors[routeType % 3];
                    // Icon for vehicle type
                    this.icon = routeType === ROUTE_AIR ? '✈' : routeType === ROUTE_SEA ? '🚢' : '🚛';
                }
                getPosition(p) {
                    p = Math.max(0, Math.min(1, p));
                    const ax = this.fromX, ay = this.fromY;
                    const bx = this.toX, by = this.toY;
                    if (this.routeType === ROUTE_AIR) {
                        const dx = bx - ax, dy = by - ay;
                        const cpx = (ax + bx) / 2 + dy * 0.3;
                        const cpy = (ay + by) / 2 - Math.abs(dx) * 0.15;
                        const t = p;
                        const mt = 1 - t;
                        return {
                            x: mt * mt * ax + 2 * mt * t * cpx + t * t * bx,
                            y: mt * mt * ay + 2 * mt * t * cpy + t * t * by
                        };
                    } else if (this.routeType === ROUTE_SEA) {
                        const dx = bx - ax, dy = by - ay;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const lx = ax + dx * p;
                        const ly = ay + dy * p;
                        const perpX = -dy / (dist || 1);
                        const perpY = dx / (dist || 1);
                        const wave = Math.sin(p * Math.PI * 4 + time * 0.015) * 5;
                        return { x: lx + perpX * wave, y: ly + perpY * wave };
                    } else {
                        return {
                            x: ax + (bx - ax) * p,
                            y: ay + (by - ay) * p
                        };
                    }
                }
                update() {
                    this.progress += this.speed;
                    if (this.progress > 1 + this.tailLength) this.alive = false;
                }
                draw() {
                    const {r, g, b} = this.color;
                    const head = this.getPosition(Math.min(this.progress, 1));
                    const tail = this.getPosition(Math.max(this.progress - this.tailLength, 0));

                    // Trail gradient
                    const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
                    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',0)');
                    grad.addColorStop(0.7, 'rgba(' + r + ',' + g + ',' + b + ',0.35)');
                    grad.addColorStop(1, 'rgba(' + Math.min(255,r+80) + ',' + Math.min(255,g+80) + ',' + Math.min(255,b+80) + ',0.7)');

                    ctx.beginPath();
                    ctx.moveTo(tail.x, tail.y);
                    ctx.lineTo(head.x, head.y);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // Head glow
                    const hGlow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8);
                    hGlow.addColorStop(0, 'rgba(255,255,255,0.5)');
                    hGlow.addColorStop(0.4, 'rgba(' + r + ',' + g + ',' + b + ',0.3)');
                    hGlow.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
                    ctx.fillStyle = hGlow;
                    ctx.fill();

                    // Vehicle icon (tiny)
                    if (this.progress > 0.05 && this.progress < 0.95) {
                        ctx.font = '10px sans-serif';
                        ctx.fillText(this.icon, head.x + 5, head.y - 5);
                    }
                }
            }

            // === AMBIENT PARTICLES (background dust) ===
            const DUST_COUNT = 30;
            class Dust {
                constructor() { this.reset(); }
                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 0.15;
                    this.vy = (Math.random() - 0.5) * 0.15;
                    this.radius = 0.5 + Math.random() * 1;
                    this.alpha = 0.1 + Math.random() * 0.2;
                    this.depth = 0.3 + Math.random() * 0.7;
                }
                update() {
                    this.x += this.vx - mouseX * 3 * this.depth;
                    this.y += this.vy - mouseY * 3 * this.depth;
                    if (this.x < -10) this.x = canvas.width + 10;
                    if (this.x > canvas.width + 10) this.x = -10;
                    if (this.y < -10) this.y = canvas.height + 10;
                    if (this.y > canvas.height + 10) this.y = -10;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(200,210,230,' + this.alpha + ')';
                    ctx.fill();
                }
            }

            // === INITIALIZE ===
            const hubs = [];
            const routes = [];
            const dusts = [];

            for (let i = 0; i < HUB_COUNT; i++) hubs.push(new Hub(i));
            for (let i = 0; i < DUST_COUNT; i++) dusts.push(new Dust());

            // Create routes between nearby hubs (varied types)
            for (let i = 0; i < hubs.length; i++) {
                for (let j = i + 1; j < hubs.length; j++) {
                    const dx = hubs[i].baseX - hubs[j].baseX;
                    const dy = hubs[i].baseY - hubs[j].baseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 0.4) {
                        const type = (i + j) % 3; // Distribute route types
                        routes.push(new Route(hubs[i], hubs[j], type));
                    }
                }
            }

            // === MAIN ANIMATION LOOP ===
            function animate() {
                time++;
                // Smooth mouse interpolation
                mouseX += (targetMouseX - mouseX) * 0.05;
                mouseY += (targetMouseY - mouseY) * 0.05;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 1. Draw routes (connections between hubs)
                routes.forEach(r => { r.draw(time); });

                // 2. Spawn & update vehicles
                routes.forEach(r => {
                    r.spawnVehicle(time);
                    r.vehicles = r.vehicles.filter(v => v.alive);
                    r.vehicles.forEach(v => { v.update(); v.draw(); });
                });

                // 3. Update & draw hubs
                hubs.forEach(h => { h.update(time); h.draw(time); });

                // 4. Draw ambient dust
                dusts.forEach(d => { d.update(); d.draw(); });

                requestAnimationFrame(animate);
            }
            animate();
        }

`;

// Replace the old canvas system
const before = c.substring(0, startIdx);
const after = c.substring(endIdx);
c = before + newCanvas + after;

fs.writeFileSync(path, c, 'utf8');
console.log('Canvas JS rewritten successfully!');
console.log('Routes types: Air (Bezier), Sea (Sine wave), Land (Dashed)');
console.log('Vehicles: Plane, Ship, Truck with comet trails');
console.log('Hubs: Radar pulse rings');
console.log('Parallax: Mouse-based reverse offset');
