# Configuración PWA - Mis XV Briana

## Descripción

Esta aplicación ha sido convertida en una PWA (Progressive Web App) con sistema de caché offline y control de versiones.

## Características

- **Instalable**: Los usuarios pueden instalar la app en su dispositivo
- **Funciona Offline**: Los recursos se almacenan en caché para funcionar sin conexión
- **Sistema de Versiones**: Control de versiones para actualizar recursos correctamente

## Iconos PWA

La app usa los siguientes iconos ubicados en `static/`:
- `android-chrome-192x192.png` - Icono para Android (192x192)
- `android-chrome-512x512.png` - Icono para Android (512x512)
- `apple-touch-icon.png` - Icono para iOS
- `favicon-32x32.png` - Favicon estándar
- `favicon-16x16.png` - Favicon pequeño

## Estructura de Caché

### Pre-cache (precaching)
Los recursos estáticos principales se precachan durante la instalación:
- Archivos HTML, CSS, JS
- Iconos PWA (android-chrome, apple-touch-icon, favicon)
- Imágenes de la app

### Runtime Caching
Los recursos dinámicos se cachan en tiempo de ejecución:

| Tipo de Recurso | Estrategia | Duración |
|----------------|------------|----------|
| Imágenes | CacheFirst | 30 días |
| Audio (música) | CacheFirst | 1 año |
| Fuentes Google | StaleWhileRevalidate | 1 año |
| Firebase | NetworkFirst | 1 día |

## Cómo Actualizar Recursos

### Opción 1: Cambiar versión en vite.config.ts

Para forzar una actualización de todos los recursos, modifica el nombre del caché en [`vite.config.ts`](vite.config.ts):

```typescript
// Busca y cambia estos valores:
cacheName: 'imagenes-cache-v2'  // Cambia v1 a v2
cacheName: 'audio-cache-v2'       // Cambia v1 a v2
cacheName: 'fuentes-cache-v2'     // Cambia v1 a v2
```

### Opción 2: Aumentar versión del paquete

Cambia la versión en [`package.json`](package.json):

```json
{
  "version": "0.0.2"
}
```

Esto activará el sistema de auto-update del service worker.

## Archivos Generados

- `build/manifest.webmanifest` - Manifiesto PWA generado
- `build/registerSW.js` - Script de registro del service worker
- `build/sw.js` - Service worker principal
- `build/workbox-*.js` - Workbox para gestión de caché

## Recursos en Caché

- **Iconos PWA**: android-chrome-192x192.png, android-chrome-512x512.png, apple-touch-icon.png, favicon-*.png
- **Imágenes app**: img1.png, img2.png, img3.png, img4.png, iglesia.png, salon.png, flores.png, card_icon.png, scroll_icon.png
- **Audio**: music.mp3 (~3.3MB)
- **Fuentes**: Google Fonts (Great Vibes, Playfair Display, Lato)

## Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar producción
npm run preview
```

## Notas

- La app está configurada con `base: /misxv/` en SvelteKit
- El service worker se registra automáticamente
- Los usuarios recibirán actualizaciones cuando visiten la app y haya cambios
