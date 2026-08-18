#!/usr/bin/env node
/* Escribe los metadatos de una invitación (nombre, fecha, branding) en
 * invitations/{id} del proyecto nuevo de Firebase ("siempre-invitados"),
 * para que admin/app.js la descubra sola (ver README.md). Lee
 * INVITATION_ID/EVENT_TITLE/EVENT_DATE directo del app.js del proyecto —
 * no hace falta repetirlos a mano.
 *
 * Uso: node scripts/provision-invitation-meta.js <carpeta> [--primary '#hex']
 *      [--primaryDark '#hex'] [--accent '#hex'] [--force]
 *
 * Requiere shared/firebase-config.js real en disco (no se commitea, ver
 * .gitignore) — sin él no hay databaseURL al que escribir.
 */
const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

const REPO_ROOT = path.resolve(__dirname, '..');

function fail(msg) {
    console.error('Error: ' + msg);
    process.exit(1);
}

function parseArgs(argv) {
    const args = { _: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--force') { args.force = true; continue; }
        if (a.startsWith('--')) { args[a.slice(2)] = argv[++i]; continue; }
        args._.push(a);
    }
    return args;
}

function extractConst(content, name, isString) {
    const re = isString
        ? new RegExp(`const\\s+${name}\\s*=\\s*'([^']*)'`)
        : new RegExp(`const\\s+${name}\\s*=\\s*new Date\\('([^']*)'\\)`);
    const m = content.match(re);
    return m ? m[1] : null;
}

function httpsJson(method, url, body) {
    return new Promise((resolve, reject) => {
        const payload = body != null ? JSON.stringify(body) : null;
        const req = https.request(url, { method, headers: payload ? { 'Content-Type': 'application/json' } : {} }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try { parsed = data ? JSON.parse(data) : null; } catch (e) { /* respuesta no-JSON, se deja null */ }
                resolve({ status: res.statusCode, body: parsed, raw: data });
            });
        });
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const projectDir = args._[0];
    if (!projectDir) fail('falta el nombre de la carpeta del proyecto. Uso: node scripts/provision-invitation-meta.js <carpeta>');

    const appJsPath = path.join(REPO_ROOT, projectDir, 'app.js');
    if (!fs.existsSync(appJsPath)) fail(`no existe ${projectDir}/app.js`);
    const appJs = fs.readFileSync(appJsPath, 'utf8');

    const id = extractConst(appJs, 'INVITATION_ID', true);
    if (!id) fail(`${projectDir}/app.js no tiene INVITATION_ID todavía — corre primero scripts/ensure-invitation-id.js ${projectDir}`);
    const nombre = extractConst(appJs, 'EVENT_TITLE', true);
    const fecha = extractConst(appJs, 'EVENT_DATE', false);
    if (!nombre || !fecha) fail(`${projectDir}/app.js no tiene EVENT_TITLE/EVENT_DATE en el formato esperado`);

    const configPath = path.join(REPO_ROOT, 'shared', 'firebase-config.js');
    if (!fs.existsSync(configPath)) fail('falta shared/firebase-config.js (real, no el .example) — no está en git, créalo en local primero. Ver README.md');
    const configSrc = fs.readFileSync(configPath, 'utf8');
    const databaseURL = extractConst(configSrc, 'databaseURL', true)
        || (configSrc.match(/databaseURL:\s*"([^"]+)"/) || [])[1];
    if (!databaseURL) fail('no se pudo leer databaseURL de shared/firebase-config.js');

    const branding = {
        primary: args.primary || '#6c63ff',
        primaryDark: args.primaryDark || '#4f47cc',
        accent: args.accent || '#eceaff',
    };

    const nodeUrl = `${databaseURL.replace(/\/$/, '')}/invitations/${id}.json`;

    // OJO: nunca un PUT al nodo completo — invitations/{id} ya puede traer
    // contadores/* reales (visitas, RSVPs) escritos por el sitio en vivo;
    // un PUT los reemplazaría enteros. Un PATCH solo toca las claves que
    // mandamos (nombre/fecha/branding), deja contadores intacto.
    const existing = await httpsJson('GET', nodeUrl);
    if (existing.body && existing.body.nombre && !args.force) {
        console.log(`invitations/${id} ya tiene metadatos en Firebase, no se toca (usa --force para sobreescribir):`);
        console.log(JSON.stringify(existing.body, null, 2));
        return;
    }
    if (existing.body) {
        console.log(`invitations/${id} ya tenía datos (ej. contadores de visitas reales) — se preservan, solo se agregan/actualizan nombre/fecha/branding:`);
        console.log(JSON.stringify(existing.body, null, 2));
    }

    const payload = { nombre, fecha, branding };
    const patch = await httpsJson('PATCH', nodeUrl, payload);
    if (patch.status < 200 || patch.status >= 300 || (patch.body && patch.body.error)) {
        fail(`Firebase respondió ${patch.status}: ${patch.raw}`);
    }

    console.log(`invitations/${id} provisionado en Firebase (nombre/fecha/branding):`);
    console.log(JSON.stringify(payload, null, 2));
}

main();
