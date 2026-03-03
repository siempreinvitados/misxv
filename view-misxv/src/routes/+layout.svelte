<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/xv.ico';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import music from '$lib/assets/music.mp3';
	import { viewPreferenceStore } from '$lib/stores/viewPreferenceStore';
	import { database, ref, get, set } from '$lib/firebase';

	let { children } = $props();
	let isPlaying = $state(false);
	let audioElement: HTMLAudioElement;
	let musicAsked = $state(false);
	let showMusicPlayer = $derived($page.url.pathname !== '/inicio');
	
	// Debug state
	let showDebug = $derived($page.url.searchParams.get('debug') === 'true');
	
	// Modal state
	let showPreferenceModal = $state(false);
	let selectedPreference = $state<'tarjeta' | 'clasica' | null>(null);
	let isModalVisible = $state(false); // For animation

	onMount(() => {
		// Verificar si se debe limpiar el localStorage
		if ($page.url.searchParams.get('c') === 'true') {
			localStorage.removeItem('invitation_selection');
			viewPreferenceStore.reset(); // Also reset our store
		}
		
		const validPaths = ['/clasica', '/tarjeta', '/inicio'];
		if (!validPaths.includes($page.url.pathname)) {
			goto('/inicio');
		}
		
		// Incrementar visitas en Firebase (solo la primera vez, en background)
		const hasVisited = localStorage.getItem('has_visited');
		if (!hasVisited) {
			get(ref(database, 'encu/visitas'))
				.then((snapshot) => {
					const currentVisitas = snapshot.val() || 0;
					return set(ref(database, 'encu/visitas'), currentVisitas + 1);
				})
				.then(() => {
					localStorage.setItem('has_visited', 'true');
				})
				.catch(() => {
					// Silencioso - no importa si falla
				});
		}
		
		// Check if we should show the preference modal
		// Only on tarjeta or clasica pages
		if (validPaths.includes($page.url.pathname)) {
			// Subscribe to store changes
			const unsubscribe = viewPreferenceStore.subscribe((data) => {
				// Show modal if count >= 4 and hasn't submitted preference
				if (data.viewCount == 4 && !data.hasSubmittedPreference) {
					// Small delay for smooth animation
					setTimeout(() => {
						showPreferenceModal = true;
						setTimeout(() => {
							isModalVisible = true;
						}, 50);
					}, 100);
				}
			});
			
			return () => unsubscribe();
		}
	});

	function handleMusicAnswer(answer: boolean) {
		musicAsked = true;
		if (answer && audioElement) {
			audioElement.play();
			isPlaying = true;
		} else {
			isPlaying = false;
		}
	}

	function toggleMusicFromButton() {
		if (!audioElement) {
			if (!musicAsked) {
				musicAsked = true;
			}
			audioElement?.play();
			isPlaying = true;
			return;
		}
		
		if (isPlaying) {
			audioElement.pause();
		} else {
			audioElement.play();
		}
		isPlaying = !isPlaying;
	}

	// Modal functions
	function openModal() {
		showPreferenceModal = true;
		setTimeout(() => {
			isModalVisible = true;
		}, 50);
	}

	function closeModal() {
		isModalVisible = false;
		setTimeout(() => {
			showPreferenceModal = false;
		}, 300); // Wait for animation
	}

	function selectPreference(pref: 'tarjeta' | 'clasica') {
		selectedPreference = pref;
	}

	function handleSend() {
		if (selectedPreference) {
			// Actualizar Firebase según preferencia (en background, silencioso)
			const firebaseKey = selectedPreference === 'tarjeta' ? 'encu/favCard' : 'encu/favClasic';
			get(ref(database, firebaseKey))
				.then((snapshot) => {
					const current = snapshot.val() || 0;
					return set(ref(database, firebaseKey), current + 1);
				})
				.catch(() => { /* silencioso */ });
			
			viewPreferenceStore.savePreference(selectedPreference);
			closeModal();
		}
	}

	function handleContinueViewing() {
		viewPreferenceStore.handleContinueViewing();
		closeModal();
	}
	
	// Debug functions
	function clearInvitationSelection() {
		localStorage.removeItem('invitation_selection');
		alert('invitation_selection eliminado del localStorage');
	}
	
	function resetViewPreference() {
		viewPreferenceStore.reset();
		alert('view_preference_data reiniciado');
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Audio element -->
<audio bind:this={audioElement} src={music} loop></audio>

<!-- Botón flotante para música -->
{#if showMusicPlayer}
{#if !musicAsked}
	<!-- Rectángulo con pregunta y botones Sí/No -->
	<div class="fixed bottom-4 right-4 z-50 bg-parchment/90 backdrop-blur-sm rounded-xl shadow-lg p-2 border border-secondary animate__animated animate__tada animate__infinite">
		<p class="text-xs text-sepia font-medium mb-1.5 text-center">¿Reproducir música?</p>
		<div class="flex gap-1.5 justify-center">
			<button
				onclick={() => handleMusicAnswer(true)}
				class="px-3 py-1 vintage-button text-xs font-semibold rounded-lg transition-all duration-300"
			>
				Sí
			</button>
			<button
				onclick={() => handleMusicAnswer(false)}
				class="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs font-semibold rounded-full transition-all duration-300"
			>
				No
			</button>
		</div>
	</div>
{:else if isPlaying}
	<!-- Reproduciendo: triángulo + título de canción + artista -->
	<button
		onclick={toggleMusicFromButton}
		class="opacity-50 fixed bottom-4 right-4 z-50 vintage-button backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:scale-105"
	>
		<Icon icon="material-symbols:pause-rounded" class="text-white text-xl" />
		<div class="flex flex-col items-start">
			<p class="text-white text-sm font-medium">Say Yes To Haven</p>
			<p class="text-white/70 text-xs">Lana del Rey</p>
		</div>
	</button>
{:else}
	<!-- Pausado: solo icono de reproducir -->
	<button
		onclick={toggleMusicFromButton}
		class="opacity-50 fixed bottom-4 right-4 z-50 vintage-button rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
	>
		<Icon icon="material-symbols:play-arrow-rounded" class="text-2xl" />
	</button>
	{/if}
{/if}

<!-- Debug Panel -->
{#if showDebug}
	<div class="fixed top-2 left-2 z-[200] bg-black/80 text-green-400 p-2 rounded text-xs font-mono">
		<div class="mb-2 font-bold text-yellow-400">🔧 Debug Panel</div>
		<button
			onclick={clearInvitationSelection}
			class="block w-full mb-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
		>
			🗑️ Limpiar invitation_selection
		</button>
		<button
			onclick={resetViewPreference}
			class="block w-full px-2 py-1 vintage-button text-xs rounded transition-colors"
		>
			🔄 Reiniciar view_preference
		</button>
	</div>
{/if}

<!-- Floating Question Mark Button (shows after 'Seguir viendo') -->
{#if $viewPreferenceStore.showFloatingButton && !showPreferenceModal && $page.url.pathname !== '/inicio'}
	<button
		onclick={openModal}
		class="fixed top-20 right-4 z-50 bg-parchment/80 backdrop-blur-md hover:bg-parchment text-sepia rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border border-secondary"
		aria-label="¿Cuál experiencia prefieres?"
	>
		<Icon icon="material-symbols:help" class="text-2xl" />
	</button>
{/if}

<!-- Preference Modal -->
{#if showPreferenceModal}
	<!-- Backdrop with blur -->
	<div 
		class="fixed inset-0 z-[100] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop -->
		<div 
			class="absolute inset-0 bg-black/30 backdrop-blur-sm {isModalVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300"
			onclick={handleContinueViewing}
			role="presentation"
		></div>
		
		<!-- Modal Content -->
		<div 
			class="relative vintage-card backdrop-blur-xl rounded-lg shadow-2xl max-w-md w-full p-8 {isModalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-300"
			role="document"
		>
			
			<!-- Close Button -->
			<button
				onclick={handleContinueViewing}
				class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-parchment hover:bg-secondary text-sepia hover:text-sepia transition-all duration-300"
				aria-label="Cerrar"
			>
				<Icon icon="material-symbols:close" class="text-xl" />
			</button>
			
			<!-- Title -->
			<h2 class="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 font-sans">
				¿Cuál experiencia prefieres?
			</h2>
			
			<!-- Subtitle -->
			<p class="text-center text-gray-600 text-sm md:text-base mb-8 max-w-xs mx-auto leading-relaxed">
				Puedes cambiar entre vistas cuando quieras, pero nos encantaría saber cuál te gusta más.
			</p>
			
			<!-- Options -->
			<div class="flex flex-col sm:flex-row gap-4 mb-8">
				<button
					onclick={() => selectPreference('tarjeta')}
					class="flex-1 py-4 px-6 rounded-lg border-2 transition-all duration-300 font-medium {selectedPreference === 'tarjeta' ? 'border-gold bg-parchment text-sepia' : 'border-secondary hover:border-gold hover:bg-parchment text-sepia'}"
				>
					<Icon icon="material-symbols:credit-card" class="text-2xl mb-1 block mx-auto" />
					Modo Tarjeta
				</button>
				<button
					onclick={() => selectPreference('clasica')}
					class="flex-1 py-4 px-6 rounded-lg border-2 transition-all duration-300 font-medium {selectedPreference === 'clasica' ? 'border-gold bg-parchment text-sepia' : 'border-secondary hover:border-gold hover:bg-parchment text-sepia'}"
				>
					<Icon icon="material-symbols:article" class="text-2xl mb-1 block mx-auto" />
					Modo Clásico
				</button>
			</div>
			
			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-3">
				<button
					onclick={handleContinueViewing}
					class="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-600 font-medium transition-all duration-300 hover:bg-gray-50"
				>
					Seguir viendo
				</button>
				<button
					onclick={handleSend}
					disabled={!selectedPreference}
					class="flex-1 py-3 px-6 rounded-lg vintage-button disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 hover:shadow-lg disabled:hover:shadow-none"
				>
					Enviar
				</button>
			</div>
		</div>
	</div>
{/if}

{@render children()}
