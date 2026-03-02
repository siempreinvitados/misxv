<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/xv.ico';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import music from '$lib/assets/music.mp3';

	let { children } = $props();
	let isPlaying = $state(false);
	let audioElement: HTMLAudioElement;
	let musicAsked = $state(false);
	let showMusicPlayer = $derived($page.url.pathname !== '/inicio');

	onMount(() => {
		// Verificar si se debe limpiar el localStorage
		if ($page.url.searchParams.get('c') === 'true') {
			localStorage.removeItem('invitation_selection');
		}
		
		const validPaths = ['/clasica', '/tarjeta', '/inicio'];
		if (!validPaths.includes($page.url.pathname)) {
			goto('/inicio');
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
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Audio element -->
<audio bind:this={audioElement} src={music} loop></audio>

<!-- Botón flotante para música -->
{#if showMusicPlayer}
{#if !musicAsked}
	<!-- Rectángulo con pregunta y botones Sí/No -->
	<div class="fixed bottom-4 right-4 z-50 bg-purple-100/90 backdrop-blur-sm rounded-xl shadow-lg p-2 border border-purple-300 animate__animated animate__tada animate__infinite">
		<p class="text-xs text-purple-700 font-medium mb-1.5 text-center">¿Reproducir música?</p>
		<div class="flex gap-1.5 justify-center">
			<button
				onclick={() => handleMusicAnswer(true)}
				class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-full transition-all duration-300"
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
		class="opacity-50 fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:scale-105"
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
		class="opacity-50 fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
	>
		<Icon icon="material-symbols:play-arrow-rounded" class="text-2xl" />
	</button>
	{/if}
{/if}

{@render children()}
