import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true
			},
			manifest: {
				name: 'Bautizo Sofía',
				short_name: 'Bautizo Sofía',
				description: 'Invitación al bautizo de Sofía',
				start_url: '/misxv/',
				scope: '/misxv/',
				display: 'standalone',
				background_color: '#fdf6f0',
				theme_color: '#d4a574',
				orientation: 'portrait',
				icons: [
					{
						src: '/misxv/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/misxv/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/misxv/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/misxv/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				],
				categories: ['events', 'lifestyle'],
				lang: 'es'
			},
			workbox: {
				// Versión actual de la caché - cambiar cuando haya cambios en recursos
				globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2}'],
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB para la música
				runtimeCaching: [
					// Cache para imágenes
					{
						urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'imagenes-cache-v1',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					// Cache para el audio (recursos grandes)
					{
						urlPattern: /^https:\/\/.*\.mp3/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'audio-cache-v1',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					// Cache para fuentes de Google
					{
						urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'fuentes-cache-v1',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					// Cache para Firebase
					{
						urlPattern: /^https:\/\/.*\.firebaseio\.com/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'firebase-cache-v1',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 // 1 día
							},
							cacheableResponse: {
								statuses: [0, 200]
							},
							networkTimeoutSeconds: 10
						}
					}
				]
			},
			kit: {
				includeVersionFile: true
			}
		})
	]
});
