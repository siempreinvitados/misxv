/* ── Firebase ── */
const firebaseConfig = { apiKey: "AIzaSyC6Xrc9EqMyXKH_gNFaOGuAX-ItudzZAVs", authDomain: "bautizo-sofia.firebaseapp.com", databaseURL: "https://bautizo-sofia-default-rtdb.firebaseio.com", projectId: "bautizo-sofia", storageBucket: "bautizo-sofia.firebasestorage.app", messagingSenderId: "981839514602", appId: "1:981839514602:web:981d3b9a4dcde418c84093", measurementId: "G-TVQSGB0FWT" };
let db = null;
try { firebase.initializeApp(firebaseConfig); db = firebase.database(); } catch(e) {}

/* ── Visit counter ── */
(function () { if (db && !localStorage.getItem('visita')) { localStorage.setItem('visita', '1'); db.ref('contadoresGali/visitas').transaction(c => (c || 0) + 1); } })();

/* ── BG canvas ── */
(function () { const canvas = document.getElementById('bg-canvas'), ctx = canvas.getContext('2d'); let W, H, stars = [], particles = []; function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight } resize(); window.addEventListener('resize', resize); for (let i = 0; i < 120; i++)stars.push({ x: Math.random() * 2000, y: Math.random() * 4000, r: Math.random() * 1.5 + .3, a: Math.random() * .7 + .1, sp: Math.random() * .005 + .002 }); for (let i = 0; i < 60; i++)particles.push({ x: Math.random() * 2000, y: Math.random() * 4000, r: Math.random() * 2 + 1, a: Math.random() * .4 + .05, sp: Math.random() * .003 + .001, hue: Math.random() * 30 + 330 }); let t = 0; function draw() { ctx.clearRect(0, 0, W, H); let scrollY = window.scrollY; stars.forEach(s => { let px = s.x % W, py = (s.y - scrollY * .15) % H; if (py < 0) py += H; let alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.sp * 30)); ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(240,220,235,${alpha})`; ctx.fill() }); particles.forEach(p => { let px = p.x % W, py = (p.y - scrollY * .08) % H; if (py < 0) py += H; let alpha = p.a * (0.5 + 0.5 * Math.sin(t * p.sp * 20 + p.x)); ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.hue},70%,85%,${alpha})`; ctx.fill() }); t++; requestAnimationFrame(draw) } draw(); })();

/* ── GSAP ── */
try {
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const mm = gsap.matchMedia();
mm.add({ mobile: "(max-width:767px)", tablet: "(min-width:768px) and (max-width:1023px)", desktop: "(min-width:1024px)" }, (context) => { const { tablet, desktop } = context.conditions; let slowEnd = '30vw', endValue = '+=1200'; if (tablet) { slowEnd = '40vw'; endValue = '+=1400'; } if (desktop) { slowEnd = '50vw'; endValue = '+=1400'; } const tl = gsap.timeline({ scrollTrigger: { trigger: 'body', start: 'top top', end: endValue, scrub: 1, invalidateOnRefresh: true } }); tl.to('#dress', { left: slowEnd, duration: 1, ease: 'none' }); tl.to('#dress', { opacity: 0, duration: 0.5, ease: 'none' }, "-=0.3"); });
gsap.matchMedia().add({ mobile: "(max-width:767px)", tablet: "(min-width:768px) and (max-width:1023px)", desktop: "(min-width:1024px)" }, (context) => { const { tablet, desktop } = context.conditions; const exitX = desktop ? '160px' : tablet ? '120px' : '80px'; const endDist = desktop ? '+=1600' : tablet ? '+=1400' : '+=1200'; gsap.timeline({ scrollTrigger: { trigger: 'body', start: 'top top', end: endDist, scrub: 1.2, invalidateOnRefresh: true } }).to('#frame-top', { x: exitX, opacity: 0, ease: 'none', duration: 1 }); });
gsap.matchMedia().add({ mobile: "(max-width:767px)", tablet: "(min-width:768px) and (max-width:1023px)", desktop: "(min-width:1024px)" }, (context) => { const { tablet, desktop } = context.conditions; const exitY = desktop ? '-220px' : tablet ? '-160px' : '-120px'; const endDist = desktop ? '+=1600' : tablet ? '+=1400' : '+=1200'; gsap.timeline({ scrollTrigger: { trigger: 'body', start: 'top top', end: endDist, scrub: 1.2, invalidateOnRefresh: true } }).to('#flower', { y: exitY, opacity: 0, ease: 'none', duration: 1 }); });

gsap.set('.hero-content', { opacity: 0 });
gsap.set(['.eyebrow', '.hero-title', '.hero-name', '.divider-line', '.hero-phrase', '.families'], { opacity: 0, y: 30 });
gsap.timeline({ delay: .3 }).to('.hero-content', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0).to('.eyebrow', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.2).to('.hero-title', { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '.5').to('.hero-name', { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '.8').to('.divider-line', { opacity: 1, scaleX: 1, duration: 1, ease: 'power2.out' }, '1.1').to('.hero-phrase', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '1.3').to('.families', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '1.5');

document.querySelectorAll('.gift-card,.envelope-card,.music-player,.countdown-wrap,.dresscode-note,.evento-card,.dc-photo-wrap,.musica-info-card').forEach(el => { gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }); });
document.querySelectorAll('.section-title,.section-heading,.section-phrase,.rsvp-phrase,.closing-phrase-text').forEach(el => { gsap.fromTo(el, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }); });
} catch(e) { document.querySelectorAll('.hero-content,.eyebrow,.hero-title,.hero-name,.divider-line,.hero-phrase,.families').forEach(function(el){el.style.opacity='1';el.style.transform='none';}); }

/* ── Gallery ── */
const galleryImages = [{ url: './resources/img1.jpg', emoji: '🌸' }, { url: './resources/img2.jpg', emoji: '🌷' }, { url: './resources/img3.jpg', emoji: '💐' }, { url: './resources/img4.jpg', emoji: '✨' }, { url: './resources/img5.jpg', emoji: '🦋' }, { url: './resources/img6.jpg', emoji: '🌺' }, { url: './resources/img7.jpg', emoji: '💫' }, { url: './resources/img8.jpg', emoji: '🌹' }, { url: './resources/img9.jpg', emoji: '🌹' }];

function buildCarouselRow(trackId, images, wide) {
    const track = document.getElementById(trackId);
    const doubled = [...images, ...images];
    doubled.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = 'car-item' + (wide && i % 4 === 2 ? ' wide' : '');
        item.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
        const el = document.createElement('img');
        el.src = img.url; el.alt = 'Foto galería'; el.loading = 'lazy';
        el.draggable = false;
        el.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
        el.onerror = function () { this.parentElement.innerHTML = `<div class="car-item-placeholder">${img.emoji}</div>`; };
        item.appendChild(el); track.appendChild(item);
    });
}
buildCarouselRow('track1', galleryImages.slice(0, 6), false);
buildCarouselRow('track2', galleryImages.slice(5), true);

/* Gallery section: block drag on images */
(function () {
    const gal = document.getElementById('galeria');
    if (!gal) return;
    gal.addEventListener('dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') { e.preventDefault(); return false; } });
    gal.addEventListener('contextmenu', function (e) { if (e.target && (e.target.tagName === 'IMG' || e.target.closest('.car-item'))) { e.preventDefault(); return false; } });
})();

/* ── Countdown ── */
const target = new Date('2026-08-08T14:00:00');
function updateCd() { const now = new Date(); let diff = Math.max(0, target - now); const d = Math.floor(diff / 864e5); diff %= 864e5; const h = Math.floor(diff / 36e5); diff %= 36e5; const m = Math.floor(diff / 6e4); diff %= 6e4; const s = Math.floor(diff / 1e3); document.getElementById('cd-d').textContent = String(d).padStart(2, '0'); document.getElementById('cd-h').textContent = String(h).padStart(2, '0'); document.getElementById('cd-m').textContent = String(m).padStart(2, '0'); document.getElementById('cd-s').textContent = String(s).padStart(2, '00'); }
updateCd(); setInterval(updateCd, 1000);

/* ── Calendar modal ── */
function addToCalendar() { document.getElementById('calModal').classList.add('visible'); document.body.style.overflow = 'hidden'; }
function closeCalModal() { document.getElementById('calModal').classList.remove('visible'); document.body.style.overflow = ''; }
function handleCalOverlayClick(e) { if (e.target === document.getElementById('calModal')) closeCalModal(); }
function padN(n) { return String(n).padStart(2, '0'); }
function toICSLocal(d) { return `${d.getFullYear()}${padN(d.getMonth() + 1)}${padN(d.getDate())}T${padN(d.getHours())}${padN(d.getMinutes())}00`; }

function confirmCalendar() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const eventDate = new Date(2026, 7, 8, 14, 0, 0);
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(reminderDate.getDate() - 7);
    reminderDate.setHours(9, 0, 0, 0);
    if (isAndroid) {
        const endDate = new Date(reminderDate); endDate.setHours(endDate.getHours() + 1);
        const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('XV Años Galilea') + '&dates=' + toICSLocal(reminderDate) + '/' + toICSLocal(endDate) + '&details=' + encodeURIComponent('Recordatorio XV Años Galilea el 8 de agosto') + '&location=' + encodeURIComponent('Mineral del Monte, Hidalgo');
        window.open(googleUrl, '_blank');
    } else {
        const endDate = new Date(reminderDate); endDate.setHours(endDate.getHours() + 1);
        const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//XV Años Galilea//ES', 'BEGIN:VEVENT', `UID:recordatorio-xv-${Date.now()}`, 'SUMMARY:Recordatorio XV Años Galilea', `DTSTART:${toICSLocal(reminderDate)}`, `DTEND:${toICSLocal(endDate)}`, 'DESCRIPTION:Recordatorio XV Años Galilea el 8 de agosto.', 'LOCATION:Mineral del Monte, Hidalgo, México', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'xv_galilea.ics'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
    closeCalModal();
}

/* ── Envelope rain ── */
(function () { const canvas = document.getElementById('envelopeCanvas'), ctx = canvas.getContext('2d'); let envelopes = [], animating = false, raf; function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; } function spawnEnvelope() { envelopes.push({ x: Math.random() * canvas.width, y: -30, vy: Math.random() * 1.2 + 0.5, vx: (Math.random() - .5) * .6, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - .5) * .04, size: Math.random() * 14 + 14, alpha: Math.random() * .35 + .12 }); } function drawEnvelope(x, y, size, rot, alpha) { ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(rot); const w = size, h = size * .68; ctx.beginPath(); if (ctx.roundRect) { ctx.roundRect(-w / 2, -h / 2, w, h, 3); } else { ctx.rect(-w / 2, -h / 2, w, h); } ctx.fillStyle = '#f9dde4'; ctx.strokeStyle = '#e8a0b0'; ctx.lineWidth = 1; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, 2); ctx.lineTo(w / 2, -h / 2); ctx.strokeStyle = '#e8a0b0'; ctx.lineWidth = .8; ctx.stroke(); ctx.restore(); } function animate() { resize(); ctx.clearRect(0, 0, canvas.width, canvas.height); if (Math.random() < .08) spawnEnvelope(); envelopes = envelopes.filter(e => e.y < canvas.height + 40); envelopes.forEach(e => { e.y += e.vy; e.x += e.vx; e.rot += e.rotV; drawEnvelope(e.x, e.y, e.size, e.rot, e.alpha); }); raf = requestAnimationFrame(animate); } const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting && !animating) { animating = true; animate(); } else if (!entry.isIntersecting && animating) { animating = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, canvas.width, canvas.height); } }); }, { threshold: 0.2 }); observer.observe(document.getElementById('regalos')); })();

/* ── RSVP with localStorage persistence ── */
const RSVP_KEY = 'rsvpGali_confirmed';
(function () {
    const already = localStorage.getItem(RSVP_KEY);
    if (already) {
        const stepper = document.getElementById('rsvpStepper');
        const confirmed = document.getElementById('rsvpAlreadyConfirmed');
        if (stepper) stepper.style.display = 'none';
        if (confirmed) confirmed.style.display = 'block';
    }
})();

let rsvpChoice = null, guestCount = 1, currentStep = 0;

function selectAttend(val) { rsvpChoice = val; document.getElementById('opt-si').classList.toggle('selected', val === 'si'); document.getElementById('opt-no').classList.toggle('selected', val === 'no'); document.getElementById('guestGroup').style.display = val === 'no' ? 'none' : ''; }
function changeGuests(delta) { guestCount = Math.max(1, Math.min(10, guestCount + delta)); document.getElementById('guestNum').textContent = guestCount; }
function toggleAnon(cb) { const nameInput = document.getElementById('rsvpName'); if (cb.checked) { nameInput.value = ''; nameInput.disabled = true; } else { nameInput.disabled = false; nameInput.focus(); } }

function goStep(n) {
    if (n === 1 && currentStep === 0) { if (!rsvpChoice) { shake('step0'); return; } }
    if (n === 2 && currentStep === 1) { buildSummary(); }
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('dot' + currentStep).classList.remove('active');
    document.getElementById('dot' + currentStep).classList.add('done');
    currentStep = n;
    document.getElementById('step' + currentStep).classList.add('active');
    for (let i = 0; i < 3; i++) { const dot = document.getElementById('dot' + i); dot.classList.remove('active', 'done'); if (i < currentStep) dot.classList.add('done'); else if (i === currentStep) dot.classList.add('active'); }
}

function buildSummary() {
    const isAnon = document.getElementById('rsvpAnon').checked;
    const name = isAnon ? 'Anónimo(a)' : (document.getElementById('rsvpName').value.trim() || 'Invitado(a)');
    const asiste = rsvpChoice === 'si';
    let html = `<div class="confirm-row"><span class="confirm-row-icon">${asiste ? '🌸' : '🥹'}</span><div class="confirm-row-text"><div class="confirm-row-label">Asistencia</div><div class="confirm-row-val">${asiste ? 'Sí asistiré' : 'No podré ir'}</div></div></div><div class="confirm-row"><span class="confirm-row-icon">👤</span><div class="confirm-row-text"><div class="confirm-row-label">Nombre</div><div class="confirm-row-val">${name}</div></div></div>`;
    if (asiste) html += `<div class="confirm-row"><span class="confirm-row-icon">🎊</span><div class="confirm-row-text"><div class="confirm-row-label">Invitados</div><div class="confirm-row-val">${guestCount} ${guestCount === 1 ? 'persona' : 'personas'}</div></div></div>`;
    document.getElementById('confirmSummary').innerHTML = html;
}

function shake(id) { const el = document.getElementById(id); if (!el) return; el.style.animation = 'none'; el.offsetHeight; el.style.animation = 'stepIn .3s ease'; if (typeof gsap !== 'undefined') gsap.fromTo(el, { x: -8 }, { x: 0, duration: .4, ease: 'elastic.out(1,0.3)' }); }

function submitRSVP() {
    const isAnon = document.getElementById('rsvpAnon').checked;
    const rawName = document.getElementById('rsvpName').value.trim();
    const name = isAnon || !rawName ? 'Anonimo' : rawName;
    const asiste = rsvpChoice === 'si';

    const now = new Date();
    const formattedDate =
        String(now.getDate()).padStart(2, '0') + '/' +
        String(now.getMonth() + 1).padStart(2, '0') + '/' +
        now.getFullYear() + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');

    if (db) {
        if (!asiste) {
            db.ref('contadoresGali/noConfirmados').transaction(c => (c || 0) + 1);
            db.ref('contadoresGali/asistentes').transaction(c => { const arr = Array.isArray(c) ? c : []; arr.push({ nombre: name, personas: guestCount, date: formattedDate, asiste: 0 }); return arr; });
        } else {
            db.ref('contadoresGali/asistentes').transaction(c => { const arr = Array.isArray(c) ? c : []; arr.push({ nombre: name, personas: guestCount, date: formattedDate, asiste: 1 }); return arr; });
            db.ref('contadoresGali/confirmados').transaction(c => (c || 0) + guestCount);
        }
    }

    try { localStorage.setItem(RSVP_KEY, '1'); } catch (e) { }

    document.getElementById('rsvpStepper').style.display = 'none';
    document.getElementById('successName').textContent = name;
    if (!asiste) {
        document.getElementById('successSub').innerHTML = 'Lamentamos que no puedas acompañarnos.<br>Si cambias de opinión, con mucho gusto te recibiremos.';
    } else {
        document.getElementById('successSub').innerHTML = 'Tu confirmación fue registrada.<br>Mi familia y yo te esperamos para celebrar juntos este gran día.';
    }
    document.getElementById('successMsg').style.display = 'block';
    if (typeof gsap !== 'undefined') gsap.fromTo('#successMsg', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' });
}

/* ── Lyrics ── */
const audio = document.getElementById('bgAudio');
const lyricsLines = document.querySelectorAll('.lyrics-line');
const totalLines = lyricsLines.length;
let lyricsTimers = [], currentLineIndex = -1, lyricsFinished = false, lyricStartTime = 0, lyricRemainingTime = 0;

function showNextLyric() {
    const lyricCurrent = document.getElementById('lyricCurrent');
    currentLineIndex++;
    if (currentLineIndex < totalLines) {
        const el = lyricsLines[currentLineIndex];
        lyricCurrent.innerHTML = el.innerHTML;
        lyricCurrent.classList.remove('visible');
        void lyricCurrent.offsetWidth;
        lyricCurrent.classList.add('visible');
        const duration = (parseFloat(el.getAttribute('data-duration')) || 3) * 1000;
        lyricRemainingTime = duration; lyricStartTime = Date.now();
        const t = setTimeout(() => { lyricRemainingTime = 0; showNextLyric(); }, duration);
        lyricsTimers.push(t);
    } else if (currentLineIndex === totalLines) {
        lyricCurrent.classList.remove('visible'); lyricsFinished = true;
        const t = setTimeout(() => { musicPlayer.classList.remove('expanded'); }, 1000);
        lyricsTimers.push(t);
    }
}
function startLyrics() { currentLineIndex = -1; lyricRemainingTime = 0; document.getElementById('lyricCurrent').classList.remove('visible'); const t = setTimeout(() => { showNextLyric(); }, 600); lyricsTimers.push(t); }
function resumeLyrics() { if (lyricsFinished) return; if (currentLineIndex >= 0 && currentLineIndex < totalLines && lyricRemainingTime > 0) { lyricStartTime = Date.now(); const t = setTimeout(() => { lyricRemainingTime = 0; showNextLyric(); }, lyricRemainingTime); lyricsTimers.push(t); } else { startLyrics(); } }
function pauseLyrics() { lyricsTimers.forEach(t => clearTimeout(t)); lyricsTimers = []; if (currentLineIndex >= 0 && currentLineIndex < totalLines && lyricRemainingTime > 0) { const elapsed = Date.now() - lyricStartTime; lyricRemainingTime = Math.max(0, lyricRemainingTime - elapsed); } }
function resetLyrics() { pauseLyrics(); currentLineIndex = -1; lyricRemainingTime = 0; document.getElementById('lyricCurrent').classList.remove('visible'); }

const musicPlayer = document.getElementById('musicPlayer');
const barSticks = document.querySelectorAll('#playerBars .bar-stick');
audio.addEventListener('ended', () => { document.getElementById('playBtn').classList.remove('playing'); setPlayerVisualState(false); musicPlayer.classList.remove('expanded'); resetLyrics(); lyricsFinished = false; });
function setPlayerVisualState(playing) { barSticks.forEach(s => playing ? s.classList.add('playing') : s.classList.remove('playing')); }
function togglePlay(btn) { if (audio.paused) { audio.play().then(() => { btn.classList.add('playing'); setPlayerVisualState(true); if (!lyricsFinished) { musicPlayer.classList.add('expanded'); resumeLyrics(); } }).catch(() => { btn.classList.add('playing'); setPlayerVisualState(true); if (!lyricsFinished) { musicPlayer.classList.add('expanded'); resumeLyrics(); } }); } else { audio.pause(); btn.classList.remove('playing'); setPlayerVisualState(false); if (!lyricsFinished) { musicPlayer.classList.remove('expanded'); pauseLyrics(); } } }

/* ── Sticky player ── */
(function () { const container = document.getElementById('musicPlayerContainer'), player = document.getElementById('musicPlayer'); function handleScroll() { const rect = container.getBoundingClientRect(); if (rect.top <= 15) player.classList.add('sticky'); else player.classList.remove('sticky'); } window.addEventListener('scroll', handleScroll, { passive: true }); window.addEventListener('resize', handleScroll, { passive: true }); handleScroll(); })();

/* ── ESC closes modals ── */
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCalModal(); closeContactModal(); } });

/* ── Contact modal ── */
function openContactModal() { document.getElementById('contactModal').classList.add('visible'); document.body.style.overflow = 'hidden'; }
function closeContactModal() { document.getElementById('contactModal').classList.remove('visible'); document.body.style.overflow = ''; }
function handleContactOverlayClick(e) { if (e.target === document.getElementById('contactModal')) closeContactModal(); }
