/* ══════════════════════════════════════════════════════════════
   CONSTANTES DE CONTENIDO — EDITA AQUÍ
   El resto del texto (nombre, fecha, misa, recepción, dedicatoria)
   vive directamente en index.html — busca "EDITA" en ese archivo.
   ══════════════════════════════════════════════════════════════ */

/* Galería: agrega tus fotos en resources/gallery/ con estos mismos nombres.
   Mientras el archivo no exista, se muestra un emoji de reemplazo. */
const galleryImages = [
    { url: './resources/gallery/foto1.jpg', emoji: '🧸' },
    { url: './resources/gallery/foto2.jpg', emoji: '🤍' },
    { url: './resources/gallery/foto3.jpg', emoji: '🩵' },
    { url: './resources/gallery/foto4.jpg', emoji: '⭐' },
    { url: './resources/gallery/foto5.jpg', emoji: '✨' },
    { url: './resources/gallery/foto6.jpg', emoji: '🦋' },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════════════
   GALERÍA — grid con reemplazo automático por emoji si falta la foto
   ══════════════════════════════════════════════════════════════ */
function buildGalleryGrid(containerId, images) {
    const grid = document.getElementById(containerId);
    images.forEach(img => {
        const cell = document.createElement('div');
        cell.className = 'gal-cell';
        const el = document.createElement('img');
        el.src = img.url;
        el.alt = 'Foto de la galería';
        el.loading = 'lazy';
        el.draggable = false;
        el.onerror = function () {
            cell.innerHTML = `<div class="gal-cell-placeholder">${img.emoji}</div>`;
        };
        cell.appendChild(el);
        grid.appendChild(cell);
    });
}
buildGalleryGrid('galleryGrid', galleryImages);

/* ══════════════════════════════════════════════════════════════
   TEXTO LETRA POR LETRA — separa en <span class="word"><span class="char">
   Los espacios entre palabras quedan como texto plano para que el
   navegador siga partiendo línea normalmente en pantallas angostas.
   ══════════════════════════════════════════════════════════════ */
function splitToChars(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const words = text.split(' ');
    words.forEach((word, i) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        [...word].forEach(ch => {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            wordSpan.appendChild(c);
        });
        el.appendChild(wordSpan);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.char');
}

/* ══════════════════════════════════════════════════════════════
   ANIMACIONES POR PANTALLA (GSAP, con respaldo si el CDN falla)
   ══════════════════════════════════════════════════════════════ */
let playScreen1, playScreen2, playScreen3, playScreen4, playScreen5;

try {
    if (typeof gsap === 'undefined') throw new Error('GSAP no disponible');

    playScreen1 = function (section) {
        if (reduceMotion) { gsap.set(section.querySelectorAll('*'), { opacity: 1, scale: 1 }); return; }
        const lines = ['.p1-eyebrow', '.p1-title', '.p1-subtitle', '.p1-daughter']
            .map(sel => splitToChars(section.querySelector(sel)));
        gsap.set([].concat(...lines.map(l => [...l])), { opacity: 0, scale: .3 });
        gsap.set(section.querySelector('.p1-name'), { opacity: 0, scale: .6 });
        gsap.set(section.querySelectorAll('.deco-corner, .deco-bow'), { opacity: 0, scale: .8 });
        gsap.set(section.querySelector('.p1-mascot'), { opacity: 0, scale: .7 });

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.to(section.querySelectorAll('.deco-corner, .deco-bow'),
            { opacity: .85, scale: 1, duration: 1, stagger: .15 }, 0)
            .to(section.querySelector('.p1-mascot'),
                { opacity: 1, scale: 1, duration: 1 }, .2);
        lines.forEach(chars => {
            tl.to(chars, { opacity: 1, scale: 1, duration: .45, stagger: .032, ease: 'back.out(1.6)' }, '+=0.05');
        });
        tl.to(section.querySelector('.p1-name'),
            { opacity: 1, scale: 1, duration: .8, ease: 'back.out(1.4)' }, '+=0.1');
    };

    playScreen2 = function (section) {
        const lines = section.querySelectorAll('.ded-line');
        const decos = section.querySelectorAll('.deco-corner, .deco-bow');
        const mascot = section.querySelector('.p2-mascot');
        if (reduceMotion) { gsap.set([...lines, ...decos, mascot], { opacity: 1, x: 0, scale: 1 }); return; }
        gsap.set(lines, { opacity: 0, x: -60 });
        gsap.set(decos, { opacity: 0, scale: .85 });
        gsap.set(mascot, { opacity: 0, scale: .8 });
        gsap.timeline({ defaults: { ease: 'power2.out' } })
            .to(decos, { opacity: .85, scale: 1, duration: 1, stagger: .15 }, 0)
            .to(lines, { opacity: 1, x: 0, duration: .85, stagger: .35 }, .3)
            .to(mascot, { opacity: 1, scale: 1, duration: .9 }, '-=0.3');
    };

    playScreen3 = function (section) {
        const items = section.querySelectorAll('.ev3-reveal');
        const decos = section.querySelectorAll('.deco-corner');
        const lines = section.querySelectorAll('.silver-line');
        if (reduceMotion) { gsap.set([...items, ...decos, ...lines], { opacity: 1, y: 0, scale: 1, scaleX: 1 }); return; }
        gsap.set(items, { opacity: 0, y: 40 });
        gsap.set(decos, { opacity: 0, scale: .85 });
        gsap.set(lines, { opacity: 0, scaleX: 0 });
        gsap.timeline({ defaults: { ease: 'power2.out' } })
            .to(decos, { opacity: .85, scale: 1, duration: 1, stagger: .15 }, 0)
            .to(lines, { opacity: 1, scaleX: 1, duration: 1 }, .1)
            .to(items, { opacity: 1, y: 0, duration: .8, stagger: .22 }, .2);
    };

    playScreen4 = function (section) {
        const heading = section.querySelector('.p4-heading');
        const cells = section.querySelectorAll('.gal-cell');
        if (reduceMotion) { gsap.set([heading, ...cells], { opacity: 1, y: 0 }); return; }
        gsap.set(heading, { opacity: 0, y: 30 });
        gsap.set(cells, { opacity: 0, y: 30 });
        gsap.timeline({ defaults: { ease: 'power2.out' } })
            .to(heading, { opacity: 1, y: 0, duration: .8 }, 0)
            .to(cells, { opacity: 1, y: 0, duration: .6, stagger: .08 }, .3);
    };

    playScreen5 = function (section) {
        const decos = section.querySelectorAll('.deco-corner');
        const mascot = section.querySelector('.p5-mascot');
        const title = section.querySelector('.p5-title');
        const bow = section.querySelector('.bow-bottom');
        if (reduceMotion) { gsap.set([...decos, mascot, title, bow], { opacity: 1, scale: 1 }); return; }
        gsap.set(decos, { opacity: 0, scale: .85 });
        gsap.set(mascot, { opacity: 0, scale: .8 });
        gsap.set(title, { opacity: 0, scale: .7 });
        gsap.set(bow, { opacity: 0, scale: .8 });
        gsap.timeline({ defaults: { ease: 'power2.out' } })
            .to(decos, { opacity: .85, scale: 1, duration: 1, stagger: .15 }, 0)
            .to(mascot, { opacity: 1, scale: 1, duration: .9 }, .2)
            .to(title, { opacity: 1, scale: 1, duration: .9, ease: 'back.out(1.4)' }, .6)
            .to(bow, { opacity: 1, scale: 1, duration: .7 }, .9);
    };
} catch (e) {
    /* Respaldo: si GSAP no carga, deja todo el contenido visible sin animar */
    const fallback = fn => (section) => {
        section.querySelectorAll('.p1-eyebrow,.p1-title,.p1-subtitle,.p1-daughter,.p1-name,.ded-line,.ev3-reveal,.gal-cell,.p4-heading,.p5-title,.deco-corner,.deco-bow,.p1-mascot,.p2-mascot,.p5-mascot,.silver-line')
            .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    };
    playScreen1 = playScreen2 = playScreen3 = playScreen4 = playScreen5 = fallback();
}

/* ══════════════════════════════════════════════════════════════
   OBSERVADOR DE PANTALLAS — dispara cada animación una sola vez
   ══════════════════════════════════════════════════════════════ */
const screenPlayers = {
    'screen-portada': () => playScreen1(document.getElementById('screen-portada')),
    'screen-dedicatoria': () => playScreen2(document.getElementById('screen-dedicatoria')),
    'screen-evento': () => playScreen3(document.getElementById('screen-evento')),
    'screen-galeria': () => playScreen4(document.getElementById('screen-galeria')),
    'screen-despedida': () => playScreen5(document.getElementById('screen-despedida')),
};

const seenScreens = new Set();
const snapContainer = document.getElementById('snap-container');

const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !seenScreens.has(entry.target.id)) {
            seenScreens.add(entry.target.id);
            screenPlayers[entry.target.id]?.();
            io.unobserve(entry.target);
        }
    });
}, { root: snapContainer, threshold: 0.5 });

document.querySelectorAll('.screen').forEach(el => io.observe(el));

/* ══════════════════════════════════════════════════════════════
   PISTA "DESLIZA" — se oculta al primer scroll o tras unos segundos
   ══════════════════════════════════════════════════════════════ */
const scrollHint = document.getElementById('scrollHint');
let hintDismissed = false;
function dismissHint() {
    if (hintDismissed) return;
    hintDismissed = true;
    scrollHint.classList.add('is-hidden');
}
snapContainer.addEventListener('scroll', dismissHint, { once: true, passive: true });
setTimeout(dismissHint, 4500);
