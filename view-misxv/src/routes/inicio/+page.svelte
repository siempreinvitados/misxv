<script lang="ts">
	import data from '$lib/data.json';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import scrollIcon from '$lib/assets/imgs/scroll_icon.png';
	import cardIcon from '$lib/assets/imgs/card_icon.png';

	let showTxt1 = $state(false);
	let showTxt2 = $state(false);
	let showTxt3 = $state(false);
	let showTxt4 = $state(false);
	let showTxt1Fading = $state(false);
	let showTxt4Fading = $state(false);
	let showTxt5 = $state(false);
	let showTxt5Fading = $state(false);
	let groupAtTop = $state(false);
	let showForm = $state(false);
	let selectedOption = $state('');
	let scrollAnimating = $state(false);
	let cardAnimating = $state(false);

	onMount(() => {
		// Verificar si ya hay una selección guardada
		if (browser) {
			const savedSelection = localStorage.getItem('invitation_selection');
			if (savedSelection) {
				if (savedSelection === 'clasico') {
					goto('/clasica');
					return;
				} else if (savedSelection === 'tarjeta') {
					goto('/tarjeta');
					return;
				}
			}
		}

		// Secuencia de animaciones
		setTimeout(() => {
			showTxt1 = true;
		}, 100);

		// 2 segundos después de txt1, aparece txt2
		setTimeout(() => {
			showTxt2 = true;
		}, 2100);

		// 1 segundo después de txt2, aparece txt3
		setTimeout(() => {
			showTxt3 = true;
		}, 3100);

		// 2 segundos después de txt3, aparece txt4
		setTimeout(() => {
			showTxt4 = true;
		}, 5100);

		// 3 segundos después de txt4, start a disappear
		setTimeout(() => {
			showTxt1Fading = true;
			showTxt4Fading = true;
		}, 8100);

		// 2 segundos después de que start a disappear, aparece txt5
		setTimeout(() => {
			showTxt1 = false;
			showTxt4 = false;
			showTxt1Fading = false;
			showTxt4Fading = false;
			showTxt5 = true;
		}, 9100);

		// 1.5 segundos después de txt5, desaparece txt5 con fadeOut
		setTimeout(() => {
			showTxt5Fading = true;
		}, 10600);

		// Después de que desaparezca txt5, txt2 y txt3 suben arriba
		setTimeout(() => {
			groupAtTop = true;
		}, 11600);

		// Mostrar formulario al final
		setTimeout(() => {
			showForm = true;
		}, 12000);
	});

	function selectOption(option: string) {
		selectedOption = option;
		// Guardar selección en localStorage
		if (browser) {
			localStorage.setItem('invitation_selection', option);
		}
		if (option === 'clasico') {
			scrollAnimating = true;
			setTimeout(() => scrollAnimating = false, 500);
		} else if (option === 'tarjeta') {
			cardAnimating = true;
			setTimeout(() => cardAnimating = false, 500);
		}
	}

	function viewInvitation() {
		if (selectedOption === 'clasico') {
			goto('/clasica');
		} else if (selectedOption === 'tarjeta') {
			goto('/tarjeta');
		}
	}
</script>

<svelte:head>
	<title>Invitación - XV {data.festejado.nombre}</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</svelte:head>

<!-- Fondo -->
<div class="min-h-screen bg-[#FDF4FF] flex flex-col items-center justify-center p-4">
	<!-- Grupo txt1 -->
	<div class="flex-shrink-0 mt-5 text-center">
		{#if showTxt1 && !showTxt1Fading}
			<p class="font-serif italic text-xl sm:text-base md:text-lg text-purple-800 mb-8 opacity-80 animate__animated animate__fadeInDown">
				Estamos por celebrar
			</p>
		{/if}
		{#if showTxt1Fading}
			<p class="font-serif italic text-xl sm:text-base md:text-lg text-purple-800 mb-8 opacity-80 animate__animated animate__fadeOut">
				Estamos por celebrar
			</p>
		{/if}
	</div>

	<!-- Grupo txt2 y txt3 que sube arriba -->
	<div class="flex-shrink-0 text-center transition-all duration-1000 {groupAtTop ? 'fixed top-10 left-0 right-0 z-50' : ''}">
		{#if showTxt2}
			<h1 class="font-script text-[2.5rem] sm:text-5xl md:text-5xl text-primary drop-shadow-md leading-none -mb-2 animate__animated {groupAtTop ? 'animate__fadeInDown' : 'animate__backInDown'}">
				{data.festejado.titulo}
			</h1>
		{/if}
	
		{#if showTxt3}
			<h2 class="font-script text-[2.5rem] sm:text-4xl md:text-5xl silver-text -mt-4 drop-shadow-sm animate__animated {groupAtTop ? 'animate__fadeInDown' : 'animate__backInUp'}">
				{data.festejado.nombre}
			</h2>
		{/if}
	</div>

	<!-- txt4 -->
	<div>
		{#if showTxt4 && !showTxt4Fading}
			<p class="font-serif text-center italic text-xl sm:text-base md:text-lg text-purple-800 mt-3 opacity-80 animate__animated animate__fadeInUp">
				y nos encantará compartir este momento contigo
			</p>
		{/if}
		{#if showTxt4Fading}
			<p class="font-serif text-center italic text-xl sm:text-base md:text-lg text-purple-800 mt-3 opacity-80 animate__animated animate__fadeOut">
				y nos encantará compartir este momento contigo
			</p>
		{/if}
	</div>

	<!-- txt5 -->
	<div class="mt-5">
		{#if showTxt5 && !showTxt5Fading}
			<p class="font-serif italic text-xl sm:text-base md:text-lg text-purple-800 mt-3 opacity-80 animate__animated animate__fadeInDown">
				pero antes...
			</p>
		{/if}
		{#if showTxt5Fading}
			<p class="font-serif italic text-xl sm:text-base md:text-lg text-purple-800 mt-3 opacity-80 animate__animated animate__fadeOut">
				pero antes...
			</p>
		{/if}
	</div>

	<!-- Formulario de selección -->
	{#if showForm}
		<div class="p-6 fixed inset-0 bg-[#FDF4FF] flex flex-col items-center justify-center z-40 pt-20 animate__animated animate__fadeIn">
			<p class="font-serif italic text-2xl sm:text-3xl md:text-4xl text-purple-800 mb-10 text-center">
				elige como quieres ver la invitacion:
			</p>
			
			<div class="flex gap-6 mb-10">
				<button
					onclick={() => selectOption('clasico')}
					class="px-10 py-6 text-2xl font-semibold rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 {selectedOption === 'clasico' ? 'bg-purple-600 text-white ring-4 ring-purple-300' : 'bg-white text-purple-800 border-2 border-purple-600 hover:bg-purple-50'}"
				>
					<img 
						src={scrollIcon} 
						alt="Clásico" 
						class="w-24 h-24 object-contain {scrollAnimating ? 'animate__animated animate__bounce animate__slideInUp' : ''}" 
					/>
					Clásico
				</button>
				<button
					onclick={() => selectOption('tarjeta')}
					class="px-10 py-6 text-2xl font-semibold rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 {selectedOption === 'tarjeta' ? 'bg-purple-600 text-white ring-4 ring-purple-300' : 'bg-white text-purple-800 border-2 border-purple-600 hover:bg-purple-50'}"
				>
					<img 
						src={cardIcon} 
						alt="Tarjeta" 
						class="w-24 h-24 object-contain {cardAnimating ? 'animate__animated animate__bounce animate__flip' : ''}" 
					/>
					Tarjeta
				</button>
			</div>

			{#if selectedOption === 'clasico'}
				<p class="text-center text-lg md:text-xl text-gray-600 mb-6 animate__animated animate__fadeIn">
					Ve toda la información en una sola página.<br/>Desliza hacia abajo para descubrir cada detalle.
				</p>
			{:else if selectedOption === 'tarjeta'}
				<p class="text-center text-lg md:text-xl text-gray-600 mb-6 animate__animated animate__fadeIn">
					Explora un resumen en una tarjeta interactiva.<br/>Toca o haz clic para voltearla y ver más información.
				</p>
			{/if}
			
			{#if selectedOption}
				<button
					onclick={viewInvitation}
					class="px-10 py-4 text-xl md:text-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 animate__animated animate__fadeInUp"
				>
					Ver Invitación
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.silver-text {
		background: linear-gradient(to bottom, #cfc7c7 0%, #7c7c7c 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
