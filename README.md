# Estructura de datos en Firebase

Cada invitación vive en su propio nodo de Firebase Realtime Database, bajo `invitations/{id}`. El admin ya lee esta estructura de forma dinámica: cualquier invitación creada con esta forma aparece sola en el buscador, sin tocar código.

```
invitations/{id}/
  nombre        -> string, usado para buscar la invitación en el admin
  fecha         -> fecha/hora del evento (ISO), usada para ordenar resultados de búsqueda
  caratula      -> URL de la imagen de portada; también sirve de avatar en los
                    resultados de búsqueda del admin (no hace falta un logo aparte)
  password      -> string plano, se compara en el cliente — barrera ligera,
                    no seguridad real
  branding: {
    primary, primaryDark, accent   -> paleta de colores para re-skinear el admin
  }
  contadores/
    visitas
    confirmados
    noConfirmados
    asistentes    -> array de {nombre, personas, date, asiste}
```

## Campos

- **nombre**: nombre de la invitación, el que se busca/lista en el admin.
- **fecha**: fecha y hora del evento; determina el orden de los resultados de búsqueda.
- **caratula**: imagen de portada de la invitación; el admin la reutiliza como avatar, sin necesidad de un logo separado.
- **password**: contraseña de acceso al panel de esa invitación.
- **branding**: colores con los que el admin se personaliza al cargar esa invitación.
- **contadores.visitas**: número de visitas a la invitación.
- **contadores.confirmados**: número de personas que confirmaron asistencia.
- **contadores.noConfirmados**: número de respuestas de "no asistiré".
- **contadores.asistentes**: listado de respuestas recibidas, una entrada por RSVP.

## Config de Firebase compartido (`shared/`)

Cada invitación necesita el objeto `firebaseConfig` del SDK de Firebase para conectarse. Hay **dos** archivos compartidos en `shared/`, uno por proyecto de Firebase — el repo usa dos proyectos distintos, ver abajo:

```html
<script src="../shared/firebase-config.legacy.js"></script>  <!-- proyecto viejo: gali, sofi, admin (conexión principal) -->
<script src="../shared/firebase-config.js"></script>          <!-- proyecto nuevo: bautizo, bautizo2, admin (2da conexión) -->
```

Cada uno expone su config como una propiedad de `window` (`window.firebaseConfigLegacy` / `window.firebaseConfig`). Van como los **primeros** `<script>` del documento, sin `defer` (son locales y minúsculos), antes de cualquier otro script que los necesite.

**¿Por qué `window.X = {...}` y no `const X = {...}`?** Un `const`/`let` de nivel superior en un script clásico no se convierte en propiedad de `window` — solo queda accesible como identificador global "suelto" para otros scripts clásicos, pero **no** desde un módulo ES (como `admin/app.js`). `window.X` es la única forma que funciona igual desde scripts clásicos y desde módulos.

**Los dos proyectos de Firebase, y por qué no están unificados:**

- **`shared/firebase-config.legacy.js`** → proyecto `bautizo-sofia` (el viejo). Lo usan `gali/`, `sofi/` y la conexión principal de `admin/app.js` (variable `db`). Estos sitios ya tienen datos históricos reales ahí (visitas, confirmaciones) — no se migran. Este archivo **sí se commitea en texto plano**: son valores de config de cliente (no secretos reales — la seguridad vive en las Reglas de la base de datos), y ya estaban duplicados en texto plano dentro de `gali/app.js`/`sofi/index.html`/`admin/app.js` desde antes; consolidarlos en un archivo no cambia el nivel de exposición.
- **`shared/firebase-config.js`** → proyecto `siempre-invitados` (el nuevo). Lo usan `bautizo/` (v1), `bautizo2/` y la segunda conexión de `admin/app.js` (variable `bautizo2Db`, nombrada así por ser la primera invitación que lo usó). **Este archivo NO se commitea** (está en `.gitignore`) — en producción lo genera `.github/workflows/deploy.yml` a partir de GitHub Secrets en el momento del deploy. Para desarrollo local, copia `shared/firebase-config.example.js` a `shared/firebase-config.js` y llena los valores reales; si no lo creas, el sitio sigue funcionando (RSVP solo por WhatsApp, sin contador ni persistencia) gracias al `try/catch` en cada `app.js`.

`admin/app.js` mantiene por eso **dos** instancias de Firebase a la vez (`db` para el proyecto viejo, `bautizo2Db` para el nuevo) — cualquier invitación nueva que se agregue ahí debe indicar cuál usar.

**Secrets necesarios en GitHub** (*Settings → Secrets and variables → Actions*) para que el deploy genere `shared/firebase-config.js`: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID` (valores del proyecto `siempre-invitados`). Además, *Settings → Pages → Source* debe estar en **"GitHub Actions"** para que `deploy.yml` sea lo que publica el sitio.

**Local vs. producción:** como las rutas son relativas (`../shared/firebase-config*.js`), esto funciona igual en GitHub Pages (todo el repo se sirve bajo una misma raíz) y abriendo el HTML directo (`file://`). La única forma de que falle en local es levantar un servidor estático con la carpeta de un proyecto individual como raíz (ej. `cd bautizo2 && python3 -m http.server`) — ahí `../shared/` queda fuera de lo que ese servidor expone. Para probar localmente, levanta el servidor **desde la raíz del repo** y visita `http://localhost:PUERTO/bautizo2/`, así la estructura de rutas queda igual que en producción.

## Dar de alta una invitación nueva

Dos pasos, en orden, cada uno con su propio script (ninguno pide datos que no estén ya en el `app.js` del proyecto):

**1. Asignar el `INVITATION_ID`** (el `{id}` de `invitations/{id}`, usado en los paths de `contadores/...`):

```bash
node scripts/ensure-invitation-id.js <carpeta-de-la-invitacion>
# ej: node scripts/ensure-invitation-id.js sofi2
```

Corre esto **una vez**, después de crear la carpeta del proyecto nuevo con su `app.js` (aunque sea copiado de otra invitación como plantilla) y antes de publicarlo. El script busca `<carpeta>/app.js`, y:

- Si ya tiene `const INVITATION_ID = '...'`, lo deja tal cual y no hace nada (idempotente — correrlo de nuevo por accidente no rompe nada).
- Si no lo tiene, genera uno de **5 caracteres** (`a-z0-9`), evitando que choque con los ids que ya usan otros proyectos del repo, y lo inserta en el `app.js` justo antes del bloque de Firebase (`let db = null;`).

**2. Provisionar sus metadatos en Firebase**, para que `admin/` la descubra sola en el buscador (ver "Descubrimiento dinámico" abajo):

```bash
node scripts/provision-invitation-meta.js <carpeta-de-la-invitacion> [--primary '#hex'] [--primaryDark '#hex'] [--accent '#hex']
```

Lee `INVITATION_ID`/`EVENT_TITLE`/`EVENT_DATE` del `app.js` de la carpeta (ya deben existir — corre primero el paso 1) y escribe `invitations/{id}/{nombre,fecha,branding}` en el proyecto nuevo de Firebase (`shared/firebase-config.js`, real, debe existir en local — ver sección de arriba). Los colores de `branding` son opcionales (si no se pasan, usa un morado genérico de respaldo). Es un `PATCH`, no un `PUT`: si el nodo ya tiene datos (ej. `contadores` reales de visitas del sitio ya en vivo), **los preserva** — solo agrega/actualiza `nombre`/`fecha`/`branding`. Si el nodo ya tiene `nombre` (ya provisionado antes), no hace nada salvo que se pase `--force`.

`caratula`/`password` no los pone este script — se agregan a mano en la consola de Firebase si hacen falta (sin `password`, el panel de esa invitación queda sin login configurado, igual que las demás invitaciones nuevas hasta ahora).

## Descubrimiento dinámico en `admin/`

`admin/app.js` no necesita una entrada por invitación para las que siguen el esquema nuevo (`invitations/{id}/...`, la estructura documentada arriba) — busca directo en Firebase, en **ambos** proyectos (`db`, el viejo, y `bautizo2Db`, el nuevo — ver `FIREBASE_PROJECTS` en `admin/app.js`), vía `loadFirebaseInvitations()`/`resolveInvitation()`. El registro local `INVITATIONS` en ese archivo queda solo para las invitaciones legacy (`gali`, `sofi`, que no siguen el esquema nuevo) o casos que necesiten un override fijo.
