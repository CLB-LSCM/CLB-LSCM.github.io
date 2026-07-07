const fs = require('fs');

// ======== THANH-VIEN.HTML ========
let tv = fs.readFileSync('thanh-vien.html', 'utf8');

// 1. Add Space Grotesk font + AOS if missing
if (!tv.includes('Space+Grotesk')) {
    tv = tv.replace(
        '<link href="https://fonts.googleapis.com/css2?family=Inter',
        '<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter'
    );
}

// 2. Replace the entire <style> block
const styleStart = tv.indexOf('<style>');
const styleEnd = tv.indexOf('</style>') + '</style>'.length;

const newCSS = `<style>
        /* ============================================
           DESIGN SYSTEM — "Deep Space Logistics"
           ============================================ */
        :root {
            --bg-primary: #050B18;
            --bg-secondary: #081222;
            --bg-card: rgba(255,255,255,0.025);
            --bg-card-hover: rgba(255,255,255,0.05);
            --accent-green: #1B8A4A;
            --accent-green-glow: rgba(27,138,74,0.3);
            --accent-orange: #F58220;
            --accent-orange-glow: rgba(245,130,32,0.25);
            --accent-yellow: #FFC107;
            --text-primary: #E8ECF4;
            --text-secondary: #7E8CA0;
            --text-muted: #4A5568;
            --glass-bg: rgba(255,255,255,0.03);
            --glass-border: rgba(255,255,255,0.06);
            --glass-border-hover: rgba(255,255,255,0.12);
            --gradient-sunset: linear-gradient(135deg, #F58220 0%, #FF6B35 50%, #FFC107 100%);
            --gradient-glass: linear-gradient(135deg, rgba(27,138,74,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(245,130,32,0.04) 100%);
            --radius-sm: 8px; --radius-md: 16px; --radius-lg: 24px;
            --transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(180deg, #050B18 0%, #081222 50%, #0A1628 100%);
            background-attachment: fixed;
            color: var(--text-primary); line-height: 1.6;
            overflow-x: hidden; position: relative;
        }
        body::before {
            content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background:
                radial-gradient(ellipse 70% 50% at 50% 40%, rgba(27,138,74,0.07) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 50% 45%, rgba(245,130,32,0.05) 0%, transparent 55%);
            animation: auraBreath 10s ease-in-out infinite alternate;
        }
        @keyframes auraBreath { 0% { opacity: 0.8; } 100% { opacity: 1; } }
        a { text-decoration: none; color: inherit; }
        img { max-width: 100%; border-radius: var(--radius-sm); }
        ::selection { background: var(--accent-green); color: white; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg-primary); }
        ::-webkit-scrollbar-thumb { background: var(--accent-green); border-radius: 3px; }

        /* PRELOADER */
        #preloader {
            position: fixed; inset: 0; z-index: 99999;
            background: radial-gradient(ellipse at center, #0C1A2E 0%, #050B18 70%);
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        #preloader.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
        .pl-logo {
            width: 90px; border-radius: 20px; margin-bottom: 24px;
            animation: plPulse 2.5s ease-in-out infinite;
            box-shadow: 0 0 40px var(--accent-green-glow);
        }
        .pl-text {
            font-family: 'Space Grotesk', sans-serif;
            color: var(--text-primary); font-size: 20px; font-weight: 700;
            letter-spacing: 8px; text-transform: uppercase;
            text-shadow: 0 0 15px var(--accent-green-glow);
        }
        @keyframes plPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 35px var(--accent-green-glow); }
            50% { transform: scale(1.06); box-shadow: 0 0 50px var(--accent-orange-glow); }
        }

        /* CANVAS */
        #particleCanvas {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 0; pointer-events: none; opacity: 0.85;
        }

        /* NAVBAR — Floating Glass */
        header {
            position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
            width: calc(100% - 40px); max-width: 1420px; z-index: 1000;
            background: rgba(8,18,34,0.6);
            backdrop-filter: blur(24px) saturate(1.3);
            -webkit-backdrop-filter: blur(24px) saturate(1.3);
            border: 1px solid rgba(27,138,74,0.08);
            border-radius: var(--radius-lg); padding: 0 28px;
            transition: var(--transition);
            box-shadow: 0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03);
        }
        header.scrolled {
            background: rgba(8,18,34,0.88);
            box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 1px rgba(27,138,74,0.25);
            border-color: rgba(27,138,74,0.12);
        }
        .nav-container {
            display: flex; justify-content: space-between; align-items: center;
            height: 68px; gap: 24px;
        }
        .logo-area {
            display: flex; align-items: center; gap: 12px; cursor: pointer; flex-shrink: 0;
        }
        .logo-area img { width: 38px; border-radius: 10px; }
        .logo-text .title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px; font-weight: 700; color: var(--text-primary);
        }
        .logo-text .sub { font-size: 10px; color: var(--text-secondary); letter-spacing: 2px; text-transform: uppercase; }
        .nav-links { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
        .nav-link {
            background: none; border: none; color: var(--text-secondary);
            font-size: 13px; font-weight: 600; padding: 8px 14px;
            border-radius: 10px; cursor: pointer; white-space: nowrap;
            transition: var(--transition);
        }
        .nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        .nav-link.active { color: var(--accent-green); background: rgba(27,138,74,0.1); }
        .btn-login {
            background: rgba(27,138,74,0.12); border: 1px solid rgba(27,138,74,0.25);
            color: var(--accent-green); padding: 8px 20px; border-radius: 12px;
            font-weight: 700; font-size: 13px; cursor: pointer; white-space: nowrap;
            transition: var(--transition);
        }
        .btn-login:hover { background: rgba(27,138,74,0.2); transform: translateY(-1px); }

        /* TAB SYSTEM */
        main { position: relative; z-index: 1; padding-top: 90px; }
        .page-tab { display: none; animation: fadeIn 0.4s ease; }
        .page-tab.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .sec-header { text-align: center; margin: 50px 0 30px; }
        .sec-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 32px; font-weight: 700; text-transform: uppercase;
            letter-spacing: 2px; color: var(--text-primary);
        }
        .sec-line {
            width: 60px; height: 3px; margin: 12px auto 0; border-radius: 3px;
            background: var(--gradient-sunset);
            box-shadow: 0 0 12px var(--accent-orange-glow);
        }

        /* HERO */
        .hero-wrapper { position: relative; overflow: hidden; }
        .hero {
            min-height: 45vh; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(180deg, #050B18 0%, #081828 50%, #0A1E30 100%);
            position: relative; overflow: hidden;
        }
        .hero::after {
            content: ''; position: absolute; inset: 0;
            background:
                radial-gradient(ellipse 55% 45% at 50% 50%, rgba(27,138,74,0.08) 0%, transparent 70%),
                radial-gradient(ellipse 40% 35% at 50% 50%, rgba(245,130,32,0.05) 0%, transparent 60%);
            pointer-events: none; z-index: 1;
        }
        .hero-content { position: relative; z-index: 2; text-align: center; padding: 0 20px; }
        .hero-badge {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(27,138,74,0.1); border: 1px solid rgba(27,138,74,0.2);
            color: var(--accent-green); padding: 8px 24px; border-radius: 30px;
            font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
            margin-bottom: 16px;
        }
        .hero-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: clamp(28px, 5vw, 48px); font-weight: 800;
            line-height: 1.2; margin-bottom: 8px;
        }
        .hero-title span { color: var(--accent-orange); }
        .hero-slogan-box { margin-top: 8px; }
        .hero-slogan { font-size: 15px; font-weight: 600; letter-spacing: 3px; color: var(--text-secondary); }
        .hero-sub { font-size: 13px; color: var(--text-muted); margin-top: 6px; }

        /* ABOUT (dynamic) */
        #dynamic-about-container { max-width: 1200px; margin: auto; padding: 0 20px; }
        .info-row {
            display: flex; gap: 40px; padding: 40px;
            background: var(--gradient-glass);
            border: 1px solid var(--glass-border); border-radius: var(--radius-lg);
            margin-bottom: 30px; flex-wrap: wrap;
            backdrop-filter: blur(16px); transition: var(--transition);
            position: relative; overflow: hidden;
        }
        .info-row::before {
            content: ''; position: absolute; top: 0; left: 0;
            width: 3px; height: 100%;
            background: linear-gradient(180deg, var(--accent-green), var(--accent-orange));
        }
        .info-row:hover { border-color: rgba(27,138,74,0.18); transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        .info-left { flex: 1; min-width: 250px; }
        .info-tag { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
            color: var(--accent-green); margin-bottom: 8px; }
        .info-title { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; margin-bottom: 16px; }
        .info-right { flex: 1.5; min-width: 300px; color: var(--text-secondary); font-size: 15px; line-height: 1.8; }

        /* BOARD CARDS */
        .board-grid-4, .board-grid-3, .board-grid-2 {
            display: grid; gap: 24px; max-width: 1200px; margin: 0 auto 30px; padding: 0 20px;
        }
        .board-grid-4 { grid-template-columns: repeat(4, 1fr); }
        .board-grid-3 { grid-template-columns: repeat(3, 1fr); }
        .board-grid-2 { grid-template-columns: repeat(2, 1fr); max-width: 700px; }
        @media (max-width: 1024px) {
            .board-grid-4 { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
            .board-grid-3 { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        }
        @media (max-width: 600px) {
            .board-grid-4, .board-grid-3 {
                display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
                gap: 16px; padding: 0 20px;
            }
            .board-card { min-width: 200px; scroll-snap-align: start; }
        }
        .board-container { max-width: 1200px; margin: auto; padding: 0 20px; }
        .board-row-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;
            color: var(--accent-green); margin: 30px 0 16px; padding: 0 20px;
        }
        .board-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: var(--radius-md); overflow: hidden; cursor: pointer;
            transition: var(--transition); text-align: center;
        }
        .board-card:hover { transform: translateY(-6px); border-color: rgba(27,138,74,0.2);
            box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
        .bc-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 0; }
        .bc-info { padding: 14px 12px; }
        .bc-role { font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
            color: var(--accent-orange); font-weight: 700; margin-bottom: 4px; }
        .bc-name { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; }

        /* CONTACT SECTION */
        .contact-section { max-width: 1200px; margin: 60px auto; padding: 0 20px; }
        .contact-box {
            display: flex; gap: 40px; background: var(--gradient-glass);
            border: 1px solid var(--glass-border); border-radius: var(--radius-lg);
            padding: 40px; flex-wrap: wrap; backdrop-filter: blur(16px);
        }
        .contact-left, .contact-right { flex: 1; min-width: 300px; }
        .direct-contact { display: flex; flex-direction: column; gap: 16px; margin: 20px 0; }
        .dc-item { display: flex; align-items: center; gap: 14px; }
        .dc-icon {
            width: 42px; height: 42px; border-radius: 12px;
            background: rgba(27,138,74,0.1); display: flex; align-items: center; justify-content: center;
            color: var(--accent-green); font-size: 16px;
        }
        .dc-text h4 { font-size: 13px; color: var(--text-secondary); font-weight: 600; }
        .dc-text p { font-size: 14px; color: var(--text-primary); font-weight: 500; }
        .soc-btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 24px; border-radius: 12px; font-size: 13px; font-weight: 700;
            border: 1px solid var(--glass-border); color: white; transition: var(--transition);
        }
        .soc-btn.fb { background: rgba(66,103,178,0.2); }
        .soc-btn.tt { background: rgba(0,0,0,0.3); }
        .contact-form { display: flex; flex-direction: column; gap: 14px; }
        .contact-form input, .contact-form textarea {
            background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
            border-radius: 12px; padding: 14px 18px; color: var(--text-primary);
            font-size: 14px; font-family: 'Inter', sans-serif; transition: var(--transition);
        }
        .contact-form input:focus, .contact-form textarea:focus {
            outline: none; border-color: var(--accent-green);
            box-shadow: 0 0 0 3px rgba(27,138,74,0.1);
        }
        .contact-form textarea { min-height: 100px; resize: vertical; }
        .contact-form button {
            background: var(--gradient-sunset); border: none; color: white;
            padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px;
            cursor: pointer; transition: var(--transition);
        }
        .contact-form button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-orange-glow); }

        /* DEPARTMENTS */
        .dept-container { max-width: 1200px; margin: auto; padding: 0 20px; }
        .dept-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
        .dept-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg); padding: 30px; text-align: center;
            cursor: pointer; transition: var(--transition);
        }
        .dept-card:hover { transform: translateY(-6px); border-color: rgba(27,138,74,0.2);
            box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
        .dept-icon { font-size: 36px; margin-bottom: 14px; filter: drop-shadow(0 0 8px var(--accent-green-glow)); }
        #dept-detail-view { display: none; max-width: 1200px; margin: auto; padding: 20px; }
        .btn-back {
            background: rgba(27,138,74,0.1); border: 1px solid rgba(27,138,74,0.2);
            color: var(--accent-green); padding: 10px 22px; border-radius: 12px;
            font-weight: 700; cursor: pointer; margin-bottom: 20px; transition: var(--transition);
        }
        .dept-intro-box {
            background: var(--gradient-glass); border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg); padding: 30px; margin-bottom: 30px;
            backdrop-filter: blur(16px);
        }

        /* MEMBERS */
        .group-container { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
        .group-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px; font-weight: 700; margin-bottom: 16px;
            display: flex; align-items: center; gap: 10px;
        }
        .group-count { font-size: 12px; color: var(--accent-orange); font-weight: 700; }
        .members-grid-6 {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px;
        }
        .mem-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: var(--radius-md); overflow: hidden; cursor: pointer;
            transition: var(--transition); text-align: center;
        }
        .mem-card:hover { transform: translateY(-4px); border-color: rgba(27,138,74,0.15);
            box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
        .mem-img { width: 100%; aspect-ratio: 1; object-fit: cover; }
        .mem-name { font-size: 12px; font-weight: 700; padding: 10px 8px 4px; }
        .mem-ban { font-size: 10px; color: var(--accent-orange); padding: 0 8px 10px; }

        /* NEWS */
        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px; max-width: 1200px; margin: auto; padding: 0 20px; }
        .news-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition);
            cursor: pointer;
        }
        .news-card:hover { transform: translateY(-5px); border-color: rgba(27,138,74,0.15);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .news-img-box { position: relative; overflow: hidden; }
        .news-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .news-date-badge {
            position: absolute; top: 12px; left: 12px; background: rgba(27,138,74,0.85);
            padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; color: white;
        }
        .news-info { padding: 20px; }
        .news-title { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 8px; }
        .news-desc-short { font-size: 13px; color: var(--text-secondary); line-height: 1.6;
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        /* MODALS */
        .modal-overlay {
            display: none; position: fixed; inset: 0; z-index: 9999;
            background: rgba(5,11,24,0.85); backdrop-filter: blur(8px);
            justify-content: center; align-items: center;
        }
        .modal-overlay.show { display: flex; }
        .pro-modal {
            background: rgba(12,26,46,0.95); border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg); max-width: 500px; width: 90%;
            overflow: hidden; position: relative;
        }
        .btn-close {
            position: absolute; top: 16px; right: 16px; z-index: 10;
            background: rgba(255,255,255,0.06); border: none; color: var(--text-secondary);
            width: 36px; height: 36px; border-radius: 50%; font-size: 16px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
        }
        .pro-header { height: 120px; background: linear-gradient(135deg, rgba(27,138,74,0.2), rgba(245,130,32,0.15)); }
        .pro-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover;
            border: 3px solid rgba(27,138,74,0.3); margin: -50px auto 0; display: block;
            box-shadow: 0 0 20px var(--accent-green-glow); }
        .pro-body { padding: 20px 28px 28px; text-align: center; }
        .pro-name { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 6px; }
        .pro-role { font-size: 12px; color: var(--accent-orange); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
        .pro-slogan { font-style: italic; color: var(--text-secondary); margin: 14px 0; font-size: 14px; }
        .pro-bio { color: var(--text-secondary); font-size: 13px; line-height: 1.7; margin-bottom: 16px; }
        .pro-fb {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(66,103,178,0.15); color: #8B9DC3; padding: 10px 20px;
            border-radius: 12px; font-size: 13px; font-weight: 600;
        }
        .article-modal {
            background: rgba(12,26,46,0.95); border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg); max-width: 700px; width: 90%;
            max-height: 80vh; overflow-y: auto; position: relative;
        }
        .article-header { padding: 28px; border-bottom: 1px solid var(--glass-border); }
        .article-body { padding: 28px; color: var(--text-secondary); line-height: 1.8; }
        .article-body img { border-radius: var(--radius-md); margin: 16px 0; }
        .member-form-box {
            background: rgba(12,26,46,0.95); border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg); max-width: 500px; width: 90%;
            padding: 32px; position: relative;
        }
        .member-form-box h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; margin-bottom: 20px; }
        .member-form-box input, .member-form-box textarea {
            width: 100%; background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
            border-radius: 10px; padding: 12px 16px; color: var(--text-primary);
            font-size: 14px; margin-bottom: 12px; font-family: 'Inter', sans-serif;
        }
        .member-form-box input:focus, .member-form-box textarea:focus {
            outline: none; border-color: var(--accent-green); box-shadow: 0 0 0 3px rgba(27,138,74,0.1);
        }
        .member-form-box button {
            background: var(--gradient-sunset); border: none; color: white;
            padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer;
            width: 100%; transition: var(--transition);
        }

        /* FOOTER */
        footer {
            display: flex; justify-content: space-between; align-items: center;
            padding: 30px 40px; margin-top: 60px;
            border-top: 1px solid var(--glass-border);
        }
        .footer-text { font-size: 12px; color: var(--text-muted); }
        .footer-logos { display: flex; gap: 12px; }
        .footer-logos img { height: 36px; border-radius: 8px; opacity: 0.6; }

        /* ANIMATED LINE */
        .animated-line {
            width: 100%; height: 1px; margin: 60px 0;
            background: linear-gradient(90deg, transparent, var(--accent-green), var(--accent-orange), transparent);
            opacity: 0.2;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
            .nav-container { overflow-x: auto; justify-content: flex-start; gap: 30px; }
            .nav-container::-webkit-scrollbar { display: none; }
            .logo-area, .nav-links { flex-shrink: 0; }
        }
        @media (max-width: 768px) {
            footer { flex-direction: column; text-align: center; gap: 16px; }
            .footer-logos { justify-content: center; }
            .contact-box { flex-direction: column; }
        }
    </style>`;

tv = tv.substring(0, styleStart) + newCSS + tv.substring(styleEnd);

// 3. Add canvas element if not present
if (!tv.includes('particleCanvas')) {
    tv = tv.replace('<body>', '<body>\n\n    <canvas id="particleCanvas"></canvas>\n');
}

fs.writeFileSync('thanh-vien.html', tv, 'utf8');
console.log('thanh-vien.html CSS rewritten successfully!');
