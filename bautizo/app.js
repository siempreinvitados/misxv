/* ══════════════════════════════════════════════════════════════
   CONSTANTES DE CONTENIDO — EDITA AQUÍ
   ══════════════════════════════════════════════════════════════ */

/* Fecha y hora del evento (usada por el countdown y el calendario) */
const EVENT_DATE = new Date('2026-11-14T12:00:00');
const EVENT_TITLE = 'Bautizo de Nombre del Bebé';
const EVENT_LOCATION = 'Nombre de la Parroquia, Ciudad';

/* Número de WhatsApp de la FAMILIA que recibe las confirmaciones de RSVP.
   Formato: código de país + número, sin signos ni espacios (ej. 521XXXXXXXXXX).
   *** EDITA este valor antes de publicar la invitación *** */
const FAMILY_WHATSAPP = '521XXXXXXXXXX';

/* ── Firebase (config compartido en ../shared/firebase-config.js, ver README.md) ── */
let db = null;
try {
    if (typeof firebase !== 'undefined' && typeof window.firebaseConfig !== 'undefined') {
        firebase.initializeApp(window.firebaseConfig);
        db = firebase.database();
    }
} catch (e) { /* sin Firebase, el RSVP sigue funcionando solo por WhatsApp */ }

const INVITATION_ID = 'bautizo';

(function () {
    if (db && !localStorage.getItem('visita_bautizo')) {
        localStorage.setItem('visita_bautizo', '1');
        db.ref(`invitations/${INVITATION_ID}/contadores/visitas`).transaction(c => (c || 0) + 1);
    }
})();

/* Galería: agrega tus fotos en resources/gallery/ y actualiza las rutas.
   Mientras no exista el archivo, se muestra un emoji de reemplazo. */
const galleryImages = [
    { url: './resources/gallery/foto1.jpg', emoji: '🧸' },
    { url: './resources/gallery/foto2.jpg', emoji: '🎈' },
    { url: './resources/gallery/foto3.jpg', emoji: '☁️' },
    { url: './resources/gallery/foto4.jpg', emoji: '🧸' },
    { url: './resources/gallery/foto5.jpg', emoji: '✨' },
    { url: './resources/gallery/foto6.jpg', emoji: '🎈' },
    { url: './resources/gallery/foto7.jpg', emoji: '☁️' },
];

/* ══════════════════════════════════════════════════════════════
   FONDO — canvas de estrellas / partículas (paralaje por scroll)
   ══════════════════════════════════════════════════════════════ */
(function () {
    const canvas = document.getElementById('bg-canvas'), ctx = canvas.getContext('2d');
    let W, H, stars = [], particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 35; i++) stars.push({ x: Math.random() * 2000, y: Math.random() * 4000, r: Math.random() * 1.5 + .3, a: Math.random() * .7 + .1, sp: Math.random() * .005 + .002 });
    for (let i = 0; i < 12; i++) particles.push({ x: Math.random() * 2000, y: Math.random() * 4000, r: Math.random() * 2 + 1, a: Math.random() * .35 + .05, sp: Math.random() * .003 + .001, hue: Math.random() * 40 + 200 });
    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        const scrollY = window.scrollY;
        stars.forEach(s => {
            let px = s.x % W, py = (s.y - scrollY * .15) % H; if (py < 0) py += H;
            const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.sp * 30));
            ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(230,238,248,${alpha})`; ctx.fill();
        });
        particles.forEach(p => {
            let px = p.x % W, py = (p.y - scrollY * .08) % H; if (py < 0) py += H;
            const alpha = p.a * (0.5 + 0.5 * Math.sin(t * p.sp * 20 + p.x));
            ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},55%,82%,${alpha})`; ctx.fill();
        });
        t++;
        if (!reduceMotion) requestAnimationFrame(draw);
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    draw();
})();

/* ══════════════════════════════════════════════════════════════
   GSAP — globo gigante de fondo, globos de #simbolo, y revelado de secciones
   ══════════════════════════════════════════════════════════════ */
try {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    /* ── Globo aerostático gigante: cruza lento de un lado a otro (solo eje X;
       la altura la fija el CSS) a lo largo de todo el scroll de la página ── */
    gsap.fromTo('.mega-balloon',
        { x: '0vw' },
        {
            x: '165vw', ease: 'none',
            scrollTrigger: { trigger: '.page-wrap', start: 'top top', end: 'bottom bottom', scrub: 0.5 }
        }
    );

    /* Sube desde su posición base (bottom:-40vh en CSS) un poco antes de
       llegar a #evento, y sigue subiendo el resto del scroll (junto con el
       cruce en X de arriba) hasta el final de la página — efecto de ir
       ascendiendo en diagonal mientras avanza hacia la derecha. */
    gsap.fromTo('.mega-balloon',
        { y: '0vh' },
        {
            y: '-95vh', ease: 'none',
            scrollTrigger: {
                trigger: '#evento', start: 'top bottom+=15%',
                endTrigger: '#despedida', end: 'bottom bottom',
                scrub: 1
            }
        }
    );

    gsap.matchMedia().add(
        { mobile: '(max-width:767px)', tablet: '(min-width:768px) and (max-width:1023px)', desktop: '(min-width:1024px)' },
        (context) => {
            const { desktop } = context.conditions;
            const speedMul = desktop ? 1 : 0.65;

            /* ── Globos de #simbolo: suben y se desvanecen mientras la sección
               atraviesa el viewport, cada uno a su propio ritmo (distinto
               scrub/distancia) para que no asciendan en sincronía ── */
            const riseRuns = [
                { sel: '.rb-1', dist: -90, scrub: 0.25 },
                { sel: '.rb-2', dist: -130, scrub: 0.4 },
                { sel: '.rb-3', dist: -70, scrub: 0.5 },
                { sel: '.rb-4', dist: -150, scrub: 0.3 },
            ];
            riseRuns.forEach(cfg => {
                const el = document.querySelector(cfg.sel);
                if (!el) return;
                gsap.fromTo(el, { y: '0vh', opacity: 1 }, {
                    y: cfg.dist + 'vh', opacity: 0, ease: 'none',
                    scrollTrigger: { trigger: '#simbolo', start: 'top bottom', end: 'bottom top', scrub: cfg.scrub * speedMul }
                });
            });
        }
    );

    /* ── Hero: pantalla completa que se desliza hacia arriba y se desvanece
       durante la primera pantalla de scroll ── */
    gsap.to('#hero', {
        yPercent: -45,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#hero-spacer', start: 'top top', end: 'bottom top', scrub: 0.35 }
    });

    /* ── Hero: entrada al cargar ── */
    gsap.set('.hero-content', { opacity: 0 });
    gsap.set(['.eyebrow', '.hero-title', '.hero-name', '.divider-line', '.hero-phrase', '.families'], { opacity: 0, y: 30 });
    gsap.timeline({ delay: .3 })
        .to('.hero-content', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0)
        .to('.eyebrow', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.2)
        .to('.hero-title', { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '.5')
        .to('.hero-name', { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '.8')
        .to('.divider-line', { opacity: 1, scaleX: 1, duration: 1, ease: 'power2.out' }, '1.1')
        .to('.hero-phrase', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '1.3')
        .to('.families', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '1.5');

    /* ── Revelado de tarjetas/secciones al hacer scroll ── */
    document.querySelectorAll('.simbolo-card,.countdown-wrap,.dresscode-visual,.evento-card').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
    });
    document.querySelectorAll('.section-title,.section-heading,.closing-phrase-text,.onesie-deco').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
    });
} catch (e) {
    document.querySelectorAll('.hero-content,.eyebrow,.hero-title,.hero-name,.divider-line,.hero-phrase,.families').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}

/* ══════════════════════════════════════════════════════════════
   GALERÍA
   ══════════════════════════════════════════════════════════════ */
function buildCarouselRow(trackId, images, wide) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const doubled = [...images, ...images];
    doubled.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = 'car-item' + (wide && i % 4 === 2 ? ' wide' : '');
        item.addEventListener('contextmenu', e => { e.preventDefault(); return false; });
        const el = document.createElement('img');
        el.src = img.url; el.alt = 'Foto galería'; el.loading = 'lazy'; el.draggable = false;
        el.addEventListener('contextmenu', e => { e.preventDefault(); return false; });
        el.onerror = function () { this.parentElement.innerHTML = `<div class="car-item-placeholder">${img.emoji}</div>`; };
        item.appendChild(el); track.appendChild(item);
    });
}
buildCarouselRow('track1', galleryImages.slice(0, 5), false);
buildCarouselRow('track2', galleryImages.slice(2), true);

(function () {
    const gal = document.getElementById('galeria');
    if (!gal) return;
    gal.addEventListener('dragstart', e => { if (e.target && e.target.tagName === 'IMG') { e.preventDefault(); return false; } });
    gal.addEventListener('contextmenu', e => { if (e.target && (e.target.tagName === 'IMG' || e.target.closest('.car-item'))) { e.preventDefault(); return false; } });
})();

/* ══════════════════════════════════════════════════════════════
   COUNTDOWN
   ══════════════════════════════════════════════════════════════ */
function updateCd() {
    const now = new Date();
    let diff = Math.max(0, EVENT_DATE - now);
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4); diff %= 6e4;
    const s = Math.floor(diff / 1e3);
    document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
    document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}
updateCd(); setInterval(updateCd, 1000);

/* ══════════════════════════════════════════════════════════════
   CALENDARIO (modal + ICS / Google Calendar)
   ══════════════════════════════════════════════════════════════ */
function addToCalendar() { document.getElementById('calModal').classList.add('visible'); document.body.style.overflow = 'hidden'; }
function closeCalModal() { document.getElementById('calModal').classList.remove('visible'); document.body.style.overflow = ''; }
function handleCalOverlayClick(e) { if (e.target === document.getElementById('calModal')) closeCalModal(); }
function padN(n) { return String(n).padStart(2, '0'); }
function toICSLocal(d) { return `${d.getFullYear()}${padN(d.getMonth() + 1)}${padN(d.getDate())}T${padN(d.getHours())}${padN(d.getMinutes())}00`; }

function confirmCalendar() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const reminderDate = new Date(EVENT_DATE);
    reminderDate.setDate(reminderDate.getDate() - 7);
    reminderDate.setHours(9, 0, 0, 0);
    const endDate = new Date(reminderDate); endDate.setHours(endDate.getHours() + 1);

    if (isAndroid) {
        const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(EVENT_TITLE) + '&dates=' + toICSLocal(reminderDate) + '/' + toICSLocal(endDate) + '&details=' + encodeURIComponent('Recordatorio: ' + EVENT_TITLE) + '&location=' + encodeURIComponent(EVENT_LOCATION);
        window.open(googleUrl, '_blank');
    } else {
        const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bautizo//ES', 'BEGIN:VEVENT', `UID:recordatorio-bautizo-${Date.now()}`, `SUMMARY:Recordatorio: ${EVENT_TITLE}`, `DTSTART:${toICSLocal(reminderDate)}`, `DTEND:${toICSLocal(endDate)}`, `DESCRIPTION:Recordatorio del bautizo.`, `LOCATION:${EVENT_LOCATION}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bautizo.ics'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
    closeCalModal();
}

/* ══════════════════════════════════════════════════════════════
   RSVP — sin backend. El botón final abre WhatsApp con el mensaje
   ya redactado hacia el número de la familia (FAMILY_WHATSAPP).
   ══════════════════════════════════════════════════════════════ */
let rsvpChoice = null, guestCount = 1, currentStep = 0;

function selectAttend(val) {
    rsvpChoice = val;
    document.getElementById('opt-si').classList.toggle('selected', val === 'si');
    document.getElementById('opt-no').classList.toggle('selected', val === 'no');
    document.getElementById('guestGroup').style.display = val === 'no' ? 'none' : '';
}
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
    let html = `<div class="confirm-row"><span class="confirm-row-icon">${asiste ? '🧸' : '💙'}</span><div class="confirm-row-text"><div class="confirm-row-label">Asistencia</div><div class="confirm-row-val">${asiste ? 'Sí asistiré' : 'No podré ir'}</div></div></div><div class="confirm-row"><span class="confirm-row-icon">👤</span><div class="confirm-row-text"><div class="confirm-row-label">Nombre</div><div class="confirm-row-val">${name}</div></div></div>`;
    if (asiste) html += `<div class="confirm-row"><span class="confirm-row-icon">🎈</span><div class="confirm-row-text"><div class="confirm-row-label">Invitados</div><div class="confirm-row-val">${guestCount} ${guestCount === 1 ? 'persona' : 'personas'}</div></div></div>`;
    document.getElementById('confirmSummary').innerHTML = html;
}

function shake(id) {
    const el = document.getElementById(id); if (!el) return;
    el.style.animation = 'none'; el.offsetHeight; el.style.animation = 'stepIn .3s ease';
    if (typeof gsap !== 'undefined') gsap.fromTo(el, { x: -8 }, { x: 0, duration: .4, ease: 'elastic.out(1,0.3)' });
}

function submitRSVP() {
    const isAnon = document.getElementById('rsvpAnon').checked;
    const rawName = document.getElementById('rsvpName').value.trim();
    const name = isAnon || !rawName ? 'Anónimo(a)' : rawName;
    const asiste = rsvpChoice === 'si';

    if (db && !localStorage.getItem('rsvp_bautizo_confirmed')) {
        const now = new Date();
        const formattedDate = `${padN(now.getDate())}/${padN(now.getMonth() + 1)}/${now.getFullYear()} ${padN(now.getHours())}:${padN(now.getMinutes())}`;
        const base = db.ref(`invitations/${INVITATION_ID}/contadores`);
        base.child('asistentes').transaction(c => {
            const arr = Array.isArray(c) ? c : [];
            arr.push({ nombre: name, personas: guestCount, date: formattedDate, asiste: asiste ? 1 : 0 });
            return arr;
        });
        if (asiste) {
            base.child('confirmados').transaction(c => (c || 0) + guestCount);
        } else {
            base.child('noConfirmados').transaction(c => (c || 0) + 1);
        }
        localStorage.setItem('rsvp_bautizo_confirmed', '1');
    }

    const lines = [`Hola, soy ${name}.`];
    lines.push(asiste ? `Confirmo que SÍ asistiré al bautizo (${guestCount} ${guestCount === 1 ? 'persona' : 'personas'}). 🧸🎈` : 'Lamento informarles que no podré asistir al bautizo. 💙');
    const waText = encodeURIComponent(lines.join(' '));
    window.open(`https://wa.me/${FAMILY_WHATSAPP}?text=${waText}`, '_blank');

    document.getElementById('rsvpStepper').style.display = 'none';
    document.getElementById('successName').textContent = name;
    document.getElementById('successSub').innerHTML = asiste
        ? 'Abrimos WhatsApp con tu mensaje de confirmación listo para enviar a la familia.<br>¡Nos vemos en este día tan especial!'
        : 'Abrimos WhatsApp con tu mensaje listo para enviar a la familia.<br>Gracias por avisarnos, te extrañaremos.';
    document.getElementById('successMsg').style.display = 'block';
    if (typeof gsap !== 'undefined') gsap.fromTo('#successMsg', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' });
}

/* ══════════════════════════════════════════════════════════════
   MODALES: ESC para cerrar + modal de contacto
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCalModal(); closeContactModal(); } });
function openContactModal() { document.getElementById('contactModal').classList.add('visible'); document.body.style.overflow = 'hidden'; }
function closeContactModal() { document.getElementById('contactModal').classList.remove('visible'); document.body.style.overflow = ''; }
function handleContactOverlayClick(e) { if (e.target === document.getElementById('contactModal')) closeContactModal(); }
