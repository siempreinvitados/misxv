<script lang="ts">
	import data from '$lib/data.json';
	import Icon from '@iconify/svelte';
	import flores from '$lib/assets/imgs/flores.png';
	import iglesia from '$lib/assets/imgs/iglesia.png';
	import { onMount } from 'svelte';

	let isFlipped = $state(false);
	
	// Estado del contador
	let days = $state('00');
	let hours = $state('00');
	let minutes = $state('00');
	let seconds = $state('00');

	onMount(() => {
		const targetDate = new Date('March 28, 2026 14:00:00').getTime();
		
		const timerInterval = setInterval(() => {
			const now = new Date().getTime();
			const distance = targetDate - now;
			
			if (distance < 0) {
				clearInterval(timerInterval);
				days = '00';
				hours = '00';
				minutes = '00';
				seconds = '00';
				return;
			}
			
			days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
			hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
			minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
			seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
		}, 1000);

		return () => clearInterval(timerInterval);
	});

	function toggleCard() {
		isFlipped = !isFlipped;
	}
</script>

<svelte:head>
	<title>Invitación - XV Briana Natali</title>
</svelte:head>

<!-- Fondo -->
<div class="min-h-screen bg-[#FDF4FF] flex items-center justify-center p-2 sm:p-4">
	<!-- Contenedor de la tarjeta flipable -->
	<div class="relative w-full max-w-sm sm:max-w-md h-[85dvh] sm:h-auto perspective-1000">
		<!-- Tarjeta -->
		<button
			class="w-full h-full relative preserve-3d transition-transform duration-700 cursor-pointer {isFlipped ? 'rotate-y-180' : ''}"
			onclick={toggleCard}
			aria-label={isFlipped ? 'Ver información resumida' : 'Ver más información'}
		>
			<!-- Frente de la tarjeta -->
			<div class="absolute inset-0 backface-hidden custom-glass bg-white/90 rounded-3xl shadow-xl px-6 sm:px-8 py-4 flex flex-col items-center justify-between text-center overflow-hidden">
				<!-- Imagen decorativa flores -->
				<img 
					src={flores} 
					alt="Flores decorativas" 
					class="absolute bottom-0 right-0 w-32 sm:w-36 h-auto opacity-60 pointer-events-none rotate-[-15deg] translate-x-2 translate-y-2"
				/>

				<!-- Contenido principal -->
				<div class="flex flex-col items-center w-full z-10">
					<!-- Título principal con énfasis - más juntos -->
					<div class="mb-2 sm:mb-3">
						<p class="font-serif italic text-xs sm:text-sm text-purple-800 mb-0.5 opacity-80">
							{data.mensaje.citatorio}
						</p>
						<h1 class="font-script text-6xl sm:text-7xl md:text-8xl text-primary drop-shadow-md leading-tight">
							{data.festejado.titulo}
						</h1>
						<h2 class="font-script text-5xl sm:text-6xl md:text-7xl silver-text -mt-2 drop-shadow-sm">
							{data.festejado.nombre}
						</h2>
					</div>

					<!-- división -->
					<div class="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-primary to-transparent my-2 sm:my-3"></div>

					<!-- Padres -->
					<div class="mb-2 sm:mb-3 w-full">
						<h3 class="font-script text-xl sm:text-2xl text-primary mb-1">Mis Papás</h3>
						<p class="font-serif text-xs sm:text-sm text-gray-700 leading-relaxed">
							{data.familia.padres.nombre}
						</p>
					</div>

					<!-- Padrinos -->
					<div class="mb-2 sm:mb-3 w-full">
						<h3 class="font-script text-xl sm:text-2xl text-primary mb-1">Mis Padrinos</h3>
						<p class="font-serif text-xs sm:text-sm text-gray-700 leading-relaxed">
							{data.familia.padrinos.nombre}
						</p>
					</div>

					<!-- división -->
					<div class="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-2"></div>

					<!-- Ceremonia con imagen -->
					<div class="mb-2 w-full flex justify-between items-start gap-2">
						<div class="text-left">
							<h3 class="font-script text-xl sm:text-2xl text-primary mb-1">Ceremonia</h3>
							<p class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{data.evento.ceremonia.hora}</p>
							<p class="font-serif italic text-xs sm:text-sm text-gray-700">{data.evento.ceremonia.lugar}</p>
						</div>
						<img src={iglesia} alt="Iglesia" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shadow-md flex-shrink-0" />
					</div>

					<!-- Recepción -->
					<div class="mb-2 w-full">
						<h3 class="font-script text-xl sm:text-2xl text-primary mb-1">Recepción</h3>
						<p class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
							{data.evento.recepcion.hora}
						</p>
						<p class="font-serif italic text-xs sm:text-sm text-gray-700 mt-0.5">
							{data.evento.recepcion.lugar}
						</p>
					</div>
				</div>

				<!-- Indicador para voltear -->
				<div class="mt-2 flex flex-col items-center z-10">
					<div class="flex flex-col items-center text-gray-400 text-[10px] sm:text-xs animate-pulse">
						<span class="mb-0.5">Tap para ver más</span>
						<Icon icon="material-symbols:touch-app" class="text-primary text-lg sm:text-xl" />
					</div>
				</div>
			</div>

			<!-- Reverso de la tarjeta (detalles) -->
			<div class="absolute inset-0 backface-hidden custom-glass bg-white/90 rounded-3xl shadow-xl px-6 sm:px-8 py-3 flex flex-col items-center justify-between text-center overflow-hidden rotate-y-180">
				<!-- Imagen decorativa flores -->
				<img 
					src={flores} 
					alt="Flores decorativas" 
					class="absolute bottom-0 right-0 w-28 sm:w-32 h-auto opacity-60 pointer-events-none rotate-[-15deg] translate-x-2 translate-y-2"
				/>

				<!-- Contenido principal -->
				<div class="flex flex-col items-center w-full z-10 overflow-y-auto">
					<!-- Título reverso (más pequeño) -->
					<div class="mb-2 sm:mb-3">
						<h2 class="font-script text-2xl sm:text-3xl text-primary drop-shadow-md">
							{data.festejado.titulo}
						</h2>
						<h3 class="font-script text-xl sm:text-2xl silver-text mt-1 drop-shadow-sm">
							{data.festejado.nombre}
						</h3>
					</div>

					<!-- Fecha del evento -->
					<div class="mb-2">
						<p class="font-bold text-sm sm:text-base text-gray-800 border-t border-b border-primary/30 py-0.5 px-3">
							{data.evento.fecha}
						</p>
					</div>

					<!-- Contador -->
					<div class="mb-2">
						<p class="uppercase tracking-widest text-[9px] sm:text-xs font-bold text-gray-500 mb-1">Faltan</p>
						<div class="flex justify-center gap-1 sm:gap-2">
							<div class="flex flex-col items-center">
								<span class="text-lg sm:text-xl font-bold text-primary bg-purple-50 px-2 py-1 rounded-lg">{days}</span>
								<span class="text-[8px] sm:text-[9px] text-gray-500">Días</span>
							</div>
							<span class="text-lg sm:text-xl font-bold text-gray-400">:</span>
							<div class="flex flex-col items-center">
								<span class="text-lg sm:text-xl font-bold text-primary bg-purple-50 px-2 py-1 rounded-lg">{hours}</span>
								<span class="text-[8px] sm:text-[9px] text-gray-500">Hs</span>
							</div>
							<span class="text-lg sm:text-xl font-bold text-gray-400">:</span>
							<div class="flex flex-col items-center">
								<span class="text-lg sm:text-xl font-bold text-primary bg-purple-50 px-2 py-1 rounded-lg">{minutes}</span>
								<span class="text-[8px] sm:text-[9px] text-gray-500">Min</span>
							</div>
							<span class="text-lg sm:text-xl font-bold text-gray-400">:</span>
							<div class="flex flex-col items-center">
								<span class="text-lg sm:text-xl font-bold text-primary bg-purple-50 px-2 py-1 rounded-lg">{seconds}</span>
								<span class="text-[8px] sm:text-[9px] text-gray-500">Seg</span>
							</div>
						</div>
					</div>

					<!-- Mensaje de agradecimiento -->
					<div class="mb-2 w-full">
						<span class="text-xl sm:text-2xl text-primary/30 font-serif leading-none">"</span>
						<p class="font-serif italic text-[9px] sm:text-xs text-gray-700 mt-1 leading-relaxed px-1">
							{data.mensaje.agradecimiento}
						</p>
					</div>

					<!-- división -->
					<div class="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent my-1 sm:my-2"></div>

					<!-- Detalles con enlaces -->
					<div class="w-full text-left">
						<div class="mb-2">
							<h4 class="font-bold uppercase text-[9px] sm:text-xs tracking-widest text-gray-500 mb-0.5">Ceremonia Religiosa</h4>
							<p class="text-xs text-gray-700">{data.evento.ceremonia.lugar}</p>
							<p class="text-[9px] sm:text-xs text-gray-500">{data.evento.ceremonia.direccion}</p>
							<p class="text-xs font-bold text-primary">{data.evento.ceremonia.hora}</p>
							<a 
								class="inline-flex items-center gap-1 text-[9px] sm:text-xs text-primary hover:text-purple-700 underline mt-0.5"
								href={data.evento.ceremonia.enlace_mapa}
								target="_blank"
								onclick={(e) => e.stopPropagation()}
							>
								<Icon icon="material-symbols:location-on" class="text-sm" />
								Ver ubicación
							</a>
						</div>

						<div class="mb-2">
							<h4 class="font-bold uppercase text-[9px] sm:text-xs tracking-widest text-gray-500 mb-0.5">Recepción</h4>
							<p class="text-xs text-gray-700">{data.evento.recepcion.lugar}</p>
							<p class="text-[9px] sm:text-xs text-gray-500">{data.evento.recepcion.direccion}</p>
							<p class="text-xs text-primary">{data.evento.recepcion.tipo} - {data.evento.recepcion.hora}</p>
							<a 
								class="inline-flex items-center gap-1 text-[9px] sm:text-xs text-primary hover:text-purple-700 underline mt-0.5"
								href={data.evento.recepcion.enlace_mapa}
								target="_blank"
								onclick={(e) => e.stopPropagation()}
							>
								<Icon icon="material-symbols:location-on" class="text-sm" />
								Ver ubicación
							</a>
						</div>
					</div>
				</div>

				<!-- división inferior -->
				<div class="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent my-1 z-10"></div>

				<!-- Mensaje de despedida -->
				<div class="z-10">
					<p class="font-script text-lg sm:text-xl text-primary">{data.mensaje.despedida}</p>
				</div>

				<!-- Indicador para voltear -->
				<div class="mt-1 flex flex-col items-center z-10">
					<p class="text-[10px] sm:text-xs text-gray-500 mb-0.5">Tap para volver</p>
					<Icon icon="material-symbols:touch-app" class="text-primary text-lg sm:text-xl animate-pulse" />
				</div>
			</div>
		</button>
	</div>
</div>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	.preserve-3d {
		transform-style: preserve-3d;
	}

	.backface-hidden {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.rotate-y-180 {
		transform: rotateY(180deg);
	}

	.custom-glass {
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.5);
	}

	.silver-text {
		background: linear-gradient(to bottom, #cfc7c7 0%, #7c7c7c 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
