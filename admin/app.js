import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js';

/* ── Firebase principal (proyecto viejo "bautizo-sofia", usado por gali/sofi
   y por el resto de este admin). Config compartido en
   shared/firebase-config.legacy.js, cargado como window.firebaseConfigLegacy
   por un <script> clásico antes de este módulo en admin/index.html. ── */
const firebaseApp = initializeApp(window.firebaseConfigLegacy);
const db = getDatabase(firebaseApp);

/* ── Firebase de bautizo2/bautizo (proyecto nuevo "siempre-invitados",
   DISTINTO del de arriba — config compartido en shared/firebase-config.js,
   cargado como window.firebaseConfig igual que el de arriba). Nombre único
   como 2do argumento de initializeApp() para que coexista con la app
   principal. ── */
const bautizo2App = initializeApp(window.firebaseConfig, 'bautizo2');
const bautizo2Db = getDatabase(bautizo2App);

/* ══════════════════════════════════════════════════════════════
   REGISTRO LOCAL DE INVITACIONES — EDITA AQUÍ
   Solo para las 4 invitaciones "legacy", que no siguen el esquema
   nuevo de Firebase (ver más abajo). Cualquier invitación NUEVA no
   necesita entrada aquí: el admin la descubre sola leyendo
   invitations/{id} en Firebase.
   "paths" apunta a nodos reales de Firebase Realtime DB; usa null
   cuando esa invitación NO tiene ese dato (el dashboard mostrará
   "no disponible", nunca un 0 falso ni un error). "shapes" solo se
   llena cuando un campo no viene en la forma default (número plano
   para visitas/confirmados/noConfirmados, array u objeto-con-claves
   para asistentes, string plano para password).
   ══════════════════════════════════════════════════════════════ */
const INVITATIONS = {

    gali: {
        label: 'XV Años — Gali',
        siteUrl: 'https://siempreinvitados.github.io/misxv/gali/',
        eventDate: new Date('2026-08-08T14:00:00'),
        paths: {
            visitas: 'contadoresGali/visitas',
            confirmados: 'contadoresGali/confirmados',
            noConfirmados: 'contadoresGali/noConfirmados',
            asistentes: 'contadoresGali/asistentes',
            password: 'contadoresGali/password',
        },
        shapes: {},
        branding: { primary: '#c67a97', primaryDark: '#a85d78', accent: '#f5d9e3', logoUrl: null, initials: 'G' },
    },

    sofi: {
        label: 'Sofi',
        siteUrl: 'https://siempreinvitados.github.io/misxv/sofi/',
        eventDate: new Date('2026-07-11T13:00:00'),
        paths: {
            visitas: 'contadoresSofi/visitas', // OJO: forma {count:N}, no número plano
            confirmados: null,   // sofi todavía no persiste confirmaciones en Firebase
            noConfirmados: null,
            asistentes: null,
            password: null,      // sin nodo de password -> login no disponible para este id
        },
        shapes: { visitas: 'count-object' },
        branding: { primary: '#3f6fa8', primaryDark: '#1f3f66', accent: '#dce9f7', logoUrl: null, initials: 'S' },
    },

    bautizo2: {
        label: 'Bautizo — Miguel Sebastián',
        siteUrl: 'https://siempreinvitados.github.io/misxv/bautizo2/',
        eventDate: new Date('2026-10-17T13:30:00'),
        // proyecto de Firebase distinto al resto (siempre-invitados, no
        // bautizo-sofia) — ver bautizo2App/bautizo2Db arriba
        db: bautizo2Db,
        paths: {
            // bautizo2/app.js ya escribe aquí (contador de visitas +
            // registro de RSVP), siguiendo el esquema nuevo de README.md
            // (invitations/{id}/contadores/...), no el legacy de gali.
            visitas: 'invitations/bautizo2/contadores/visitas',
            confirmados: 'invitations/bautizo2/contadores/confirmados',
            noConfirmados: 'invitations/bautizo2/contadores/noConfirmados',
            asistentes: 'invitations/bautizo2/contadores/asistentes',
            // sin nodo de password -> login no disponible para este id
            // (bautizo2 no escribe una contraseña desde el cliente)
            password: null,
        },
        shapes: {},
        branding: { primary: '#c9a659', primaryDark: '#a3803a', accent: '#f3ead9', logoUrl: null, initials: 'M' },
    },

    bautizo: {
        label: 'Bautizo v1',
        siteUrl: 'https://siempreinvitados.github.io/misxv/bautizo/',
        eventDate: new Date('2026-11-14T12:00:00'),
        // mismo proyecto de Firebase que bautizo2 (siempre-invitados) — reusa bautizo2Db
        db: bautizo2Db,
        paths: {
            visitas: 'invitations/bautizo/contadores/visitas',
            confirmados: 'invitations/bautizo/contadores/confirmados',
            noConfirmados: 'invitations/bautizo/contadores/noConfirmados',
            asistentes: 'invitations/bautizo/contadores/asistentes',
            password: null,
        },
        shapes: {},
        branding: { primary: '#8a8a8a', primaryDark: '#5a5a5a', accent: '#eeeeee', logoUrl: null, initials: 'B' },
    },

};

/* ══════════════════════════════════════════════════════════════
   ADAPTADOR DE DATOS — normaliza cada campo para que el renderizado
   nunca toque formas crudas de Firebase. Trabaja sobre un
   "descriptor" (ver más abajo), no sobre un id crudo, así que no le
   importa si la invitación es local o descubierta en Firebase.
   ══════════════════════════════════════════════════════════════ */
async function readRaw(path, dbRef = db) {
    const snap = await get(ref(dbRef, path));
    return snap.exists() ? snap.val() : null;
}

function normalizeCount(raw, shape) {
    if (raw == null) return 0;
    if (shape === 'count-object') return raw.count ?? 0;
    return raw;
}

function normalizeGuestList(raw) {
    if (raw == null) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return Object.keys(raw).map(k => raw[k]);
}

/**
 * Lee y normaliza UN campo lógico de una invitación.
 * available=false -> paths[field] es null (no rastreado para este id)
 * available=true  -> value ya normalizado y listo para pintar
 */
async function readField(descriptor, field) {
    const path = descriptor.paths[field];
    if (path == null) return { available: false, value: null };
    const raw = await readRaw(path, descriptor.db || db);
    if (field === 'asistentes') return { available: true, value: normalizeGuestList(raw) };
    if (field === 'password') return { available: true, value: raw };
    return { available: true, value: normalizeCount(raw, descriptor.shapes[field]) };
}

/** Carga visitas/confirmados/noConfirmados/asistentes en paralelo. */
async function loadInvitationData(descriptor) {
    const fields = ['visitas', 'confirmados', 'noConfirmados', 'asistentes'];
    const results = await Promise.all(fields.map(f => readField(descriptor, f)));
    return Object.fromEntries(fields.map((f, i) => [f, results[i]]));
}

/** configured=false -> no hay nodo password para este id. */
async function checkPassword(descriptor, candidate) {
    const pw = await readField(descriptor, 'password');
    if (!pw.available) return { configured: false, valid: false };
    return { configured: true, valid: candidate === pw.value };
}

/** Devuelve el branding ya resuelto por resolveInvitation() — para
    invitaciones "firebase" viene de invitations/{id}/branding+caratula;
    para "local" sigue siendo el placeholder del registro de arriba. */
async function getBranding(descriptor) {
    return { ...descriptor.branding, label: descriptor.label };
}

function applyBranding(branding) {
    const root = document.documentElement.style;
    root.setProperty('--brand-primary', branding.primary);
    root.setProperty('--brand-primary-dark', branding.primaryDark);
    root.setProperty('--brand-accent', branding.accent);
}

function avatarHtml(branding) {
    return branding.logoUrl
        ? `<img src="${escapeHtml(branding.logoUrl)}" alt="">`
        : escapeHtml(branding.initials || '?');
}

/* ══════════════════════════════════════════════════════════════
   DESCUBRIMIENTO DINÁMICO — cualquier invitación bajo invitations/{id}
   en Firebase aparece sola en el buscador del admin, sin tocar este
   archivo. Esquema esperado (documentado también en README.md):
     invitations/{id}/nombre        -> string, para buscarla
     invitations/{id}/fecha         -> fecha del evento (ISO)
     invitations/{id}/caratula      -> URL de imagen, usada como avatar
     invitations/{id}/password      -> string plano
     invitations/{id}/branding      -> {primary, primaryDark, accent}
     invitations/{id}/contadores/{visitas,confirmados,noConfirmados,asistentes}
   normalizeFirebaseInvitation() convierte esto al mismo "descriptor"
   que usan las invitaciones locales (label, siteUrl, eventDate,
   branding, paths, shapes) — el resto del código nunca distingue
   entre una invitación local o de Firebase.
   ══════════════════════════════════════════════════════════════ */
function parseEventDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

function normalizeFirebaseInvitation(id, raw) {
    if (!raw) return null;
    const branding = raw.branding || {};
    return {
        source: 'firebase',
        id,
        label: raw.nombre || id,
        siteUrl: null, // el esquema nuevo no define un link propio a la invitación
        eventDate: parseEventDate(raw.fecha),
        branding: {
            primary: branding.primary || '#6c63ff',
            primaryDark: branding.primaryDark || '#4f47cc',
            accent: branding.accent || '#eceaff',
            logoUrl: raw.caratula || null,
            initials: (raw.nombre || id).trim().charAt(0).toUpperCase() || '?',
        },
        paths: {
            visitas: `invitations/${id}/contadores/visitas`,
            confirmados: `invitations/${id}/contadores/confirmados`,
            noConfirmados: `invitations/${id}/contadores/noConfirmados`,
            asistentes: `invitations/${id}/contadores/asistentes`,
            password: `invitations/${id}/password`,
        },
        shapes: {},
    };
}

/** null mientras no ha cargado; {} u objeto de descriptores una vez lista. */
let firebaseInvitationsCache = null;

async function loadFirebaseInvitations() {
    try {
        const raw = await readRaw('invitations');
        const entries = raw ? Object.entries(raw) : [];
        firebaseInvitationsCache = Object.fromEntries(
            entries
                .map(([id, data]) => [id, normalizeFirebaseInvitation(id, data)])
                .filter(([, inv]) => inv != null)
        );
    } catch (err) {
        console.error(err);
        firebaseInvitationsCache = {};
    }
}

function localDescriptor(id) {
    const inv = INVITATIONS[id];
    return inv ? { source: 'local', id, ...inv } : null;
}

/** Combina el registro local + lo ya descubierto en Firebase (para el buscador). */
function allKnownInvitations() {
    const local = Object.keys(INVITATIONS).map(localDescriptor);
    const fb = firebaseInvitationsCache ? Object.values(firebaseInvitationsCache) : [];
    return [...local, ...fb];
}

/** Búsqueda sin red: local + lo que ya esté en caché de Firebase. */
function getKnownInvitation(id) {
    return localDescriptor(id) || (firebaseInvitationsCache && firebaseInvitationsCache[id]) || null;
}

const VALID_ID_RE = /^[A-Za-z0-9_-]+$/;

/**
 * Resuelve un id a su descriptor completo. Primero intenta sin red
 * (local + caché); si no lo encuentra, hace una lectura puntual a
 * invitations/{id} — así una invitación recién creada, o un enlace
 * directo antes de que la caché terminara de cargar, funciona igual.
 */
async function resolveInvitation(id) {
    const known = getKnownInvitation(id);
    if (known) return known;
    if (!VALID_ID_RE.test(id)) return null;
    const raw = await readRaw(`invitations/${id}`);
    return normalizeFirebaseInvitation(id, raw);
}

/* ── Auth / sesión (sessionStorage por id: sobrevive un reload en la
   misma pestaña, se limpia al cerrarla) ── */
function authKey(id) { return `admin_auth_${id}`; }
function isAuthenticated(id) { return sessionStorage.getItem(authKey(id)) === '1'; }
function setAuthenticated(id) { sessionStorage.setItem(authKey(id), '1'); }
function logout(id) { sessionStorage.removeItem(authKey(id)); route(); }

/* ── Utilidades ── */
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
}

let toastTimer = null;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
}

function showView(name) {
    ['picker', 'login', 'dashboard'].forEach(v => {
        document.getElementById('view-' + v).classList.toggle('hidden', v !== name);
    });
}

function getInvitationIdFromUrl() {
    return new URLSearchParams(location.search).get('id');
}

/* ══════════════════════════════════════════════════════════════
   VISTA: PICKER (buscador — nunca lista todo sin que se escriba algo)
   ══════════════════════════════════════════════════════════════ */
function formatEventDate(date) {
    if (!date) return 'Sin fecha';
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Coincidencia de id o label; id exacto primero, luego por fecha de evento ascendente. */
function searchInvitations(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allKnownInvitations()
        .filter(inv => inv.id.toLowerCase().includes(q) || inv.label.toLowerCase().includes(q))
        .sort((a, b) => {
            const aExact = a.id.toLowerCase() === q ? 0 : 1;
            const bExact = b.id.toLowerCase() === q ? 0 : 1;
            if (aExact !== bExact) return aExact - bExact;
            const aTime = a.eventDate ? a.eventDate.getTime() : Infinity;
            const bTime = b.eventDate ? b.eventDate.getTime() : Infinity;
            return aTime - bTime;
        });
}

function renderSearchResults() {
    const input = document.getElementById('invitationSearch');
    const resultsEl = document.getElementById('searchResults');

    if (!input.value.trim()) {
        resultsEl.innerHTML = '';
        resultsEl.classList.add('hidden');
        return;
    }

    const matches = searchInvitations(input.value);
    resultsEl.classList.remove('hidden');

    if (matches.length === 0) {
        resultsEl.innerHTML = '<div class="empty-state">Sin resultados.</div>';
        return;
    }

    resultsEl.innerHTML = matches.map(inv => {
        const noLogin = inv.paths.password == null;
        return `
            <a class="result-row" href="?id=${encodeURIComponent(inv.id)}">
                <div class="picker-avatar" style="background:${inv.branding.primary}">${avatarHtml(inv.branding)}</div>
                <div class="result-info">
                    <div class="picker-label">${escapeHtml(inv.label)}</div>
                    <div class="result-date">${formatEventDate(inv.eventDate)}</div>
                </div>
                ${noLogin
                ? '<span class="badge-warn">Sin login configurado</span>'
                : '<span class="badge-ok">Panel disponible</span>'}
            </a>
        `;
    }).join('');
}

function renderPicker() {
    showView('picker');
    const input = document.getElementById('invitationSearch');
    const resultsEl = document.getElementById('searchResults');
    input.value = '';
    resultsEl.innerHTML = '';
    resultsEl.classList.add('hidden');

    if (firebaseInvitationsCache === null) {
        input.disabled = true;
        input.placeholder = 'Cargando invitaciones…';
    } else {
        input.disabled = false;
        input.placeholder = 'Ej. gali, o “XV Años”…';
    }
    input.focus();
}

/* ══════════════════════════════════════════════════════════════
   VISTA: LOGIN
   ══════════════════════════════════════════════════════════════ */
function renderLogin(descriptor, branding) {
    showView('login');
    const card = document.getElementById('loginCard');
    const notConfigured = descriptor.paths.password == null;

    if (notConfigured) {
        const anyPath = Object.values(descriptor.paths).find(p => p != null);
        const prefix = anyPath ? anyPath.split('/')[0] : `invitations/${descriptor.id}`;
        card.innerHTML = `
            <div class="login-avatar" style="background:${branding.primary}">${avatarHtml(branding)}</div>
            <h2>${escapeHtml(branding.label)}</h2>
            <p class="login-msg">El acceso a esta invitación aún no está configurado.
                Agrega una contraseña en Firebase (<code>${escapeHtml(prefix)}/password</code>) para habilitarlo.</p>
            <a class="btn-secondary" href="index.html">← Volver</a>
        `;
        return;
    }

    card.innerHTML = `
        <div class="login-avatar" style="background:${branding.primary}">${avatarHtml(branding)}</div>
        <h2>${escapeHtml(branding.label)}</h2>
        <p class="login-msg">Ingresa la contraseña para ver el panel de esta invitación.</p>
        <form id="loginForm">
            <input type="password" id="passwordInput" placeholder="Contraseña" autocomplete="current-password" required />
            <button type="submit" class="btn-primary">Entrar</button>
            <div class="login-error hidden" id="loginError"></div>
        </form>
        <a class="btn-link" href="index.html">← Volver</a>
    `;

    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const errEl = document.getElementById('loginError');
        errEl.classList.add('hidden');
        btn.disabled = true;
        btn.textContent = 'Verificando...';
        try {
            const value = document.getElementById('passwordInput').value;
            const result = await checkPassword(descriptor, value);
            if (result.valid) {
                setAuthenticated(descriptor.id);
                await renderDashboard(descriptor, branding);
            } else {
                errEl.textContent = 'Contraseña incorrecta.';
                errEl.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Entrar';
            }
        } catch (err) {
            console.error(err);
            errEl.textContent = 'Error al conectar con Firebase.';
            errEl.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Entrar';
        }
    });
}

/* ══════════════════════════════════════════════════════════════
   VISTA: DASHBOARD
   ══════════════════════════════════════════════════════════════ */
const STAT_DEFS = [
    { key: 'visitas', label: 'Visitas', icon: '👀' },
    { key: 'confirmados', label: 'Confirmados', icon: '✅' },
    { key: 'noConfirmados', label: 'No Confirmados', icon: '🙁' },
    { key: 'totalRespuestas', label: 'Total Respuestas', icon: '📋' },
];

function renderStatsSkeleton() {
    document.getElementById('statsGrid').innerHTML = STAT_DEFS.map(s => `
        <div class="stat-card">
            <div class="stat-icon">${s.icon}</div>
            <div class="stat-label">${s.label}</div>
            <div class="stat-value"><span class="skeleton">&nbsp;</span></div>
        </div>
    `).join('');
}

function renderStats(data) {
    const totalRespuestas = data.asistentes.available
        ? { available: true, value: data.asistentes.value.length }
        : { available: false, value: null };
    const values = { ...data, totalRespuestas };

    document.getElementById('statsGrid').innerHTML = STAT_DEFS.map(s => {
        const field = values[s.key];
        const display = field.available ? field.value : 'No disponible';
        return `
            <div class="stat-card${field.available ? '' : ' stat-unavailable'}">
                <div class="stat-icon">${s.icon}</div>
                <div class="stat-label">${s.label}</div>
                <div class="stat-value">${display}</div>
            </div>
        `;
    }).join('');
}

let currentGuests = [];
let currentFilter = 'todos';

function setupTable(asistentesField) {
    const toolbar = document.querySelector('.table-toolbar');
    const exportBtn = document.getElementById('exportBtn');

    if (!asistentesField.available) {
        toolbar.classList.add('hidden');
        exportBtn.disabled = true;
        currentGuests = [];
        document.getElementById('tableWrap').innerHTML =
            '<div class="empty-state">Esta invitación no registra asistentes en Firebase todavía.</div>';
        return;
    }

    toolbar.classList.remove('hidden');
    currentGuests = asistentesField.value;
    exportBtn.disabled = !currentGuests.some(g => Number(g.asiste) === 1);
    renderTable();
}

function renderTable() {
    const wrap = document.getElementById('tableWrap');
    const search = document.getElementById('searchInput').value.trim().toLowerCase();

    let rows = currentGuests;
    if (currentFilter === 'si') rows = rows.filter(g => Number(g.asiste) === 1);
    if (currentFilter === 'no') rows = rows.filter(g => Number(g.asiste) !== 1);
    if (search) rows = rows.filter(g => (g.nombre || '').toLowerCase().includes(search));

    if (rows.length === 0) {
        wrap.innerHTML = `<div class="empty-state">${currentGuests.length === 0 ? 'Aún no hay confirmaciones.' : 'Sin resultados para este filtro.'
            }</div>`;
        return;
    }

    wrap.innerHTML = `
        <table class="guest-table">
            <thead>
                <tr><th>Nombre</th><th>Personas</th><th>Fecha</th><th>Asiste</th></tr>
            </thead>
            <tbody>
                ${rows.map(g => {
        const asiste = Number(g.asiste) === 1;
        return `
                        <tr>
                            <td data-label="Nombre">${escapeHtml(g.nombre || '')}</td>
                            <td data-label="Personas">${escapeHtml(g.personas ?? 0)}</td>
                            <td data-label="Fecha">${escapeHtml(g.date || '')}</td>
                            <td data-label="Asiste"><span class="badge ${asiste ? 'badge-yes' : 'badge-no'}">${asiste ? 'Sí' : 'No'}</span></td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}

function exportCsv(id) {
    const confirmed = currentGuests.filter(g => Number(g.asiste) === 1);
    if (confirmed.length === 0) return;
    const header = ['Nombre', 'Personas', 'Fecha'];
    const rows = confirmed.map(g => [g.nombre || '', g.personas ?? 0, g.date || '']);
    const csv = '﻿' + [header, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `confirmados-${id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

async function renderDashboard(descriptor, branding) {
    showView('dashboard');

    document.getElementById('dashLogo').innerHTML = avatarHtml(branding);
    document.getElementById('dashLogo').style.background = branding.primary;
    document.getElementById('dashTitle').textContent = branding.label;

    const siteLink = document.getElementById('dashSiteLink');
    if (descriptor.siteUrl) {
        siteLink.href = descriptor.siteUrl;
        siteLink.classList.remove('hidden');
    } else {
        siteLink.classList.add('hidden');
    }

    document.getElementById('dashError').classList.add('hidden');
    document.getElementById('statsGrid').classList.remove('hidden');
    document.getElementById('tableSection').classList.remove('hidden');

    renderStatsSkeleton();
    document.querySelector('.table-toolbar').classList.add('hidden');
    document.getElementById('tableWrap').innerHTML =
        '<div class="empty-state"><span class="skeleton" style="width:40%"></span></div>';

    try {
        const data = await loadInvitationData(descriptor);
        renderStats(data);
        setupTable(data.asistentes);
    } catch (err) {
        console.error(err);
        document.getElementById('statsGrid').classList.add('hidden');
        document.getElementById('tableSection').classList.add('hidden');
        const banner = document.getElementById('dashError');
        banner.querySelector('.error-msg').textContent = 'No se pudieron cargar los datos de esta invitación.';
        banner.classList.remove('hidden');
    }
}

/* ══════════════════════════════════════════════════════════════
   ROUTER
   ══════════════════════════════════════════════════════════════ */
async function route() {
    const id = getInvitationIdFromUrl();

    if (!id) { renderPicker(); return; }

    const descriptor = await resolveInvitation(id);
    if (!descriptor) {
        showToast(`No existe una invitación con id "${id}".`);
        renderPicker();
        return;
    }

    const branding = await getBranding(descriptor);
    applyBranding(branding);

    if (isAuthenticated(id)) {
        await renderDashboard(descriptor, branding);
    } else {
        renderLogin(descriptor, branding);
    }
}

/* ── Controles del picker: se enlazan una sola vez (el input vive fijo
   en index.html, no se recrea en cada renderPicker()) ── */
function initPickerControls() {
    const input = document.getElementById('invitationSearch');
    input.addEventListener('input', renderSearchResults);
    input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const first = document.querySelector('#searchResults .result-row');
        if (first) {
            e.preventDefault();
            location.href = first.getAttribute('href');
        }
    });
}

/* Carga invitations/ de Firebase una sola vez al iniciar; si el picker
   ya está visible cuando termina, habilita el input y refresca resultados. */
async function initFirebaseInvitations() {
    await loadFirebaseInvitations();
    const input = document.getElementById('invitationSearch');
    if (document.getElementById('view-picker').classList.contains('hidden')) return;
    input.disabled = false;
    input.placeholder = 'Ej. gali, o “XV Años”…';
    if (input.value.trim()) renderSearchResults();
}

/* ── Controles del dashboard: se enlazan una sola vez (los nodos del
   toolbar viven fijos en index.html, no se recrean en cada render) ── */
function initDashboardControls() {
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('filterGroup').addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTable();
    });
    document.getElementById('exportBtn').addEventListener('click', () => exportCsv(getInvitationIdFromUrl()));
    document.getElementById('logoutBtn').addEventListener('click', () => logout(getInvitationIdFromUrl()));
    document.getElementById('retryBtn').addEventListener('click', () => route());
}

window.addEventListener('DOMContentLoaded', () => {
    initPickerControls();
    initDashboardControls();
    initFirebaseInvitations();
    route();
});
