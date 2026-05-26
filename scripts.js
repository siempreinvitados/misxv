/* ─── BG CANVAS STARS + PARTICLES ─── */
(function () {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [], particles = [];

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize);

    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * 2000, y: Math.random() * 4000,
            r: Math.random() * 1.5 + .3,
            a: Math.random() * .7 + .1,
            sp: Math.random() * .005 + .002
        });
    }
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * 2000, y: Math.random() * 4000,
            r: Math.random() * 2 + 1,
            a: Math.random() * .4 + .05,
            sp: Math.random() * .003 + .001,
            hue: Math.random() * 30 + 330
        });
    }

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        let scrollY = window.scrollY;

        stars.forEach(s => {
            let px = (s.x % W);
            let py = (s.y - scrollY * .15) % H;
            if (py < 0) py += H;
            let alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.sp * 30));
            ctx.beginPath();
            ctx.arc(px, py, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240,220,235,${alpha})`;
            ctx.fill();
        });

        particles.forEach(p => {
            let px = (p.x % W);
            let py = (p.y - scrollY * .08) % H;
            if (py < 0) py += H;
            let alpha = p.a * (0.5 + 0.5 * Math.sin(t * p.sp * 20 + p.x));
            ctx.beginPath();
            ctx.arc(px, py, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},70%,85%,${alpha})`;
            ctx.fill();
        });

        t++;
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ─── GSAP ANIMATIONS ─── */
gsap.registerPlugin(ScrollTrigger);

// Hero entrance
gsap.timeline({ delay: .3 })
    .to('.eyebrow', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0)
    .to('.hero-title', { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '.3')
    .to('.hero-name', { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '.6')
    .to('.divider-line', { opacity: 1, scaleX: 1, duration: 1, ease: 'power2.out' }, '.9')
    .to('.hero-phrase', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '1.1')
    .to('.families', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '1.3');

// Set initial states
gsap.set(['.eyebrow', '.hero-title', '.hero-name', '.divider-line', '.hero-phrase', '.families'], { opacity: 0, y: 30 });

// Sections reveal
document.querySelectorAll('.glass-card,.gift-card,.envelope-card,.music-player,.countdown-wrap,.dresscode-note').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
});

document.querySelectorAll('.section-title,.section-heading,.section-phrase,.rsvp-phrase').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
});

// Gallery items
document.querySelectorAll('.gallery-item').forEach((el, i) => {
    gsap.to(el, {
        opacity: 1, y: 0, duration: .9, delay: i * .1, ease: 'power2.out',
        scrollTrigger: { trigger: '#galeria', start: 'top 75%', toggleActions: 'play none none none' }
    });
});

/* ─── DRESS PARALLAX ─── */
const dress = document.getElementById('dress');
const musicaSection = document.getElementById('musica');
const eventoSection = document.getElementById('evento');

gsap.to(dress, {
    x: '75vw',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
    }
});

ScrollTrigger.create({
    trigger: musicaSection,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => { dress.style.opacity = '1'; },
    onLeave: () => { dress.style.opacity = '0'; },
    onEnterBack: () => { dress.style.opacity = '1'; },
    onLeaveBack: () => { dress.style.opacity = '0'; }
});

/* ─── GALLERY BUILD ─── */
const emojis = ['🌸', '🌷', '💐', '✨', '🦋', '🌺', '💫', '🌹', '🎀'];
const grid = document.getElementById('galleryGrid');
for (let i = 0; i < 9; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const hue = 330 + Math.random() * 30;
    item.style.background = `linear-gradient(${135 + i * 20}deg,hsl(${hue},60%,93%),hsl(${hue + 15},50%,88%))`;
    item.innerHTML = `<div class="gallery-placeholder">${emojis[i]}</div>`;
    grid.appendChild(item);
}

/* ─── COUNTDOWN ─── */
const target = new Date('2025-06-14T17:00:00');
function updateCd() {
    const now = new Date();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 864e5);
    diff %= 864e5;
    const h = Math.floor(diff / 36e5);
    diff %= 36e5;
    const m = Math.floor(diff / 6e4);
    diff %= 6e4;
    const s = Math.floor(diff / 1e3);
    document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
    document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}
updateCd(); setInterval(updateCd, 1000);

/* ─── CALENDAR ─── */
function addToCalendar() {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:XV Años de Valentina\nDTSTART:20250614T170000\nDTEND:20250615T020000\nLOCATION:Salón Jardines del Valle, Pachuca\nDESCRIPTION:¡Celebra los XV años de Valentina!\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'xv_valentina.ics'; a.click();
}

/* ─── RSVP ─── */
let rsvpChoice = null;
function selectOption(el, val) {
    document.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected'); rsvpChoice = val;
}
function submitRSVP() {
    const name = document.getElementById('rsvpName').value.trim();
    if (!name || !rsvpChoice) { alert('Por favor completa todos los campos 🌸'); return; }
    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
}