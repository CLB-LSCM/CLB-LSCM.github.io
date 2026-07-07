const fs = require('fs');
const path = 'index.html';
let c = fs.readFileSync(path, 'utf8');

// 1. Badge icon
c = c.replace('fa-lock', 'fa-globe');

// 2. Badge text
c = c.replace(/Xin chào! Đăng nhập ngay/, 'KẾT NỐI \u2014 HỢP TÁC \u2014 PHÁT TRIỂN');

// 3. Eyebrow → H2 with LSCM | EST. 2021
c = c.replace(
    /<div class="hero-eyebrow">Trường Đại học Tài nguyên & Môi trường Hà Nội<\/div>/,
    '<h2 class="hero-eyebrow" style="color: var(--accent-orange); font-size: 18px; letter-spacing: 6px; font-weight: 700;">LSCM | EST. 2021</h2>'
);

// 4. Title accent
c = c.replace('hero-title-accent">LSCM', 'hero-title-accent">Quản lý Chuỗi Cung Ứng');

// 5. Slogan swap
c = c.replace(
    /hero-slogan">Kết Nối — Hợp Tác — Phát Triển/,
    'hero-slogan">Connect \u2022 Cooperate \u2022 Develop'
);
c = c.replace(
    /hero-sub">Connect • Cooperate • Develop/,
    'hero-sub">Xây dựng mạng lưới logistics thế hệ mới'
);

fs.writeFileSync(path, c, 'utf8');
console.log('Hero HTML updated successfully!');

// Verify
const lines = c.split('\n');
for (let i = 1268; i < 1285 && i < lines.length; i++) {
    console.log(`${i+1}: ${lines[i].trim()}`);
}
