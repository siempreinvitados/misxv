#!/usr/bin/env node
/* Asigna el INVITATION_ID de una invitación nueva: 5 caracteres [a-z0-9].
 * Si el app.js del proyecto ya tiene uno, lo reusa tal cual (no lo toca).
 * Uso: node scripts/ensure-invitation-id.js <carpeta-del-proyecto>
 * Ej:  node scripts/ensure-invitation-id.js sofi2
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ID_RE = /const\s+INVITATION_ID\s*=\s*'([a-z0-9]+)'/;
const REPO_ROOT = path.resolve(__dirname, '..');

function fail(msg) {
    console.error('Error: ' + msg);
    process.exit(1);
}

function findAllUsedIds() {
    const used = new Set();
    for (const entry of fs.readdirSync(REPO_ROOT, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        const appJsPath = path.join(REPO_ROOT, entry.name, 'app.js');
        if (!fs.existsSync(appJsPath)) continue;
        const match = fs.readFileSync(appJsPath, 'utf8').match(ID_RE);
        if (match) used.add(match[1]);
    }
    return used;
}

function generateId(usedIds) {
    let id;
    do {
        id = Array.from({ length: 5 }, () => ID_CHARS[crypto.randomInt(ID_CHARS.length)]).join('');
    } while (usedIds.has(id));
    return id;
}

function main() {
    const projectDir = process.argv[2];
    if (!projectDir) fail('falta el nombre de la carpeta del proyecto. Uso: node scripts/ensure-invitation-id.js <carpeta>');

    const appJsPath = path.join(REPO_ROOT, projectDir, 'app.js');
    if (!fs.existsSync(appJsPath)) fail(`no existe ${projectDir}/app.js`);

    const content = fs.readFileSync(appJsPath, 'utf8');
    const existing = content.match(ID_RE);
    if (existing) {
        console.log(`Ya tiene id: ${existing[1]} (sin cambios)`);
        return;
    }

    const id = generateId(findAllUsedIds());
    const constLine = `const INVITATION_ID = '${id}';`;

    // Ancla en "let db = null;" (línea literal, presente en todo bloque de
    // Firebase ya wireado) en vez de intentar reconocer el estilo del
    // comentario que lo precede — los distintos app.js usan headers de
    // comentario distintos (una línea vs. caja de "═"), y matchear el
    // comentario en vez del código es frágil.
    const dbInitWithCommentRe = /\/\*(?:(?!\*\/)[\s\S])*\*\/\n(?=let db = null;)/;
    const dbInitRe = /^let db = null;/m;
    let updated;
    if (dbInitWithCommentRe.test(content)) {
        updated = content.replace(dbInitWithCommentRe, match => `${constLine}\n\n${match}`);
    } else if (dbInitRe.test(content)) {
        updated = content.replace(dbInitRe, match => `${constLine}\n${match}`);
    } else if (content.includes('FAMILY_WHATSAPP')) {
        updated = content.replace(
            /(const FAMILY_WHATSAPP = [^\n]*\n)/,
            `$1\n${constLine}\n/* NOTA: falta agregar el resto del bloque de Firebase (init de db,\n   contador de visitas, escritura de RSVP) — copia el patrón de\n   bautizo2/app.js o bautizo/app.js y ajusta INVITATION_ID. */\n`
        );
    } else {
        updated = `${constLine}\n\n${content}`;
    }

    fs.writeFileSync(appJsPath, updated);
    console.log(`Id nuevo asignado a ${projectDir}: ${id}`);
}

main();
