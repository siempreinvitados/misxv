<script lang="ts">
	import data from '$lib/data.json';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import flores from '$lib/assets/imgs/flores.png';
	import iglesia from '$lib/assets/imgs/iglesia.png';
	import salon from '$lib/assets/imgs/salon.png';

	// Estado del contador
	let days = $state('00');
	let hours = $state('00');
	let minutes = $state('00');
	let seconds = $state('00');

	onMount(() => {
		// Configurar contador
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
</script>

<!-- Flores en esquinas -->
<img 
	src={flores} 
	alt="Flores decorativas" 
	class="fixed -top-20 -left-18 w-52 sm:w-64 md:w-72 h-auto z-10 opacity-80 pointer-events-none rotate-[-30deg]"
/>
<img 
	src={flores} 
	alt="Flores decorativas" 
	class="fixed -top-20 -right-18 w-52 sm:w-64 md:w-72 h-auto z-10 opacity-80 pointer-events-none transform scale-x-[-1] rotate-[30deg] hidden md:block"
/>

<!-- Fondo con blobs animados -->
<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FDF4FF]">
	<div class="absolute -top-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
	<div class="absolute top-1/3 -right-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
	<div class="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
	<div class="absolute inset-0 bg-sparkle"></div>
</div>

<main class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10 sm:gap-16">
	<!-- Sección principal -->
	<section class="text-center relative px-2">
		<p class="font-serif italic text-base sm:text-lg md:text-xl text-purple-800 mb-2">
			{data.mensaje.citatorio}
		</p>
		<h1 class="font-script text-5xl sm:text-7xl md:text-9xl silver-text mb-2 sm:mb-4 leading-tight">
			{data.quinceañera.titulo}
		</h1>
		<h2 class="font-script text-4xl sm:text-5xl md:text-7xl text-primary drop-shadow-md mb-6 sm:mb-8">
			{data.quinceañera.nombre}
		</h2>
	</section>

	<!-- Padres y Padrinos -->
	<section class="glass-panel bg-white/80 rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-glass relative overflow-hidden mx-auto w-full max-w-3xl">
		<div class="absolute top-2 left-2 right-2 bottom-2 border border-white/50 rounded-2xl pointer-events-none"></div>
		<div class="mb-6 sm:mb-10">
			<h3 class="font-script text-3xl sm:text-4xl text-primary mb-2 sm:mb-4">Mis Papás</h3>
			<p class="font-serif text-lg sm:text-xl md:text-2xl text-gray-700 px-2">
				{data.familia.padres.nombre}
			</p>
		</div>
		<div>
			<h3 class="font-script text-3xl sm:text-4xl text-primary mb-2 sm:mb-4">Mis Padrinos</h3>
			<p class="font-serif text-lg sm:text-xl md:text-2xl text-gray-700 px-2">
				{data.familia.padrinos.nombre}
			</p>
		</div>
	</section>

	<!-- Mensaje de agradecimiento -->
	<section class="glass-panel bg-white/60 rounded-3xl p-6 sm:p-8 md:p-10 text-center shadow-glass mt-6 sm:mt-8 mx-auto w-full max-w-2xl">
		<span class="text-4xl sm:text-5xl text-primary/30 font-serif leading-none">"</span>
		<p class="font-serif italic text-base sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mt-4">
			{data.mensaje.agradecimiento}
		</p>
		<p class="font-script text-2xl sm:text-3xl text-primary mt-4 sm:mt-6">{data.mensaje.despedida}</p>
	</section>

	<!-- Contador -->
	<section class="text-center px-2">
		<div class="glass-panel bg-white/80 rounded-2xl p-4 sm:p-6 md:p-8 max-w-md sm:max-w-2xl mx-auto shadow-glass mt-6 sm:mt-10">
			<h3 class="uppercase tracking-widest text-xs sm:text-sm font-bold text-gray-500 mb-4 sm:mb-6 border-b border-gray-300 pb-2">Faltan</h3>
			<div class="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4 text-center">
				<div class="flex flex-col items-center">
					<span class="text-2xl sm:text-3xl md:text-5xl font-bold text-primary shadow-glow p-1 sm:p-2 rounded-lg bg-white/80 backdrop-blur-sm">
						{days}
					</span>
					<span class="text-[10px] sm:text-xs md:text-sm uppercase mt-1 sm:mt-2 text-gray-600">Días</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-2xl sm:text-3xl md:text-5xl font-bold text-primary shadow-glow p-1 sm:p-2 rounded-lg bg-white/80 backdrop-blur-sm">
						{hours}
					</span>
					<span class="text-[10px] sm:text-xs md:text-sm uppercase mt-1 sm:mt-2 text-gray-600">Hs</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-2xl sm:text-3xl md:text-5xl font-bold text-primary shadow-glow p-1 sm:p-2 rounded-lg bg-white/80 backdrop-blur-sm">
						{minutes}
					</span>
					<span class="text-[10px] sm:text-xs md:text-sm uppercase mt-1 sm:mt-2 text-gray-600">Min</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-2xl sm:text-3xl md:text-5xl font-bold text-primary shadow-glow p-1 sm:p-2 rounded-lg bg-white/80 backdrop-blur-sm">
						{seconds}
					</span>
					<span class="text-[10px] sm:text-xs md:text-sm uppercase mt-1 sm:mt-2 text-gray-600">Seg</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Eventos -->
	<section class="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
		<!-- Ceremonia -->
		<article class="glass-panel bg-white/80 rounded-2xl overflow-hidden shadow-glass hover:shadow-glow transition-shadow duration-300 flex flex-col md:flex-row h-full mx-auto w-full">
			<!-- Imagen -->
			<div class="w-full md:w-1/2 h-28 sm:h-32 md:h-full min-h-[160px] md:min-h-[280px] order-first md:order-none">
				<img 
					src={iglesia} 
					alt="Iglesia" 
					class="w-full h-full object-cover object-center"
				/>
			</div>
			<!-- Información -->
			<div class="flex-1 p-2 sm:p-4 text-center flex flex-col items-center">
				<div class="w-8 sm:w-10 h-8 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-primary">
					<Icon icon="material-symbols:church" class="text-lg sm:text-xl" />
				</div>
				<h3 class="font-script text-xl sm:text-2xl text-primary mb-1">Ceremonia Religiosa</h3>
				<p class="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
					{data.evento.ceremonia.hora}
				</p>
				<p class="font-serif italic text-xs sm:text-sm mb-1 px-1">{data.evento.ceremonia.lugar}</p>
				<p class="text-[10px] sm:text-xs text-gray-600 mb-1 sm:mb-2 px-1">{data.evento.ceremonia.direccion}</p>
				<div class="mt-auto w-full px-1 sm:px-0">
					<p class="font-bold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 border-t border-b border-primary/20 py-1 inline-block w-full">
						{data.evento.fecha}
					</p>
					<a 
						class="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 bg-primary hover:bg-purple-700 text-white rounded-full transition-colors w-full shadow-lg text-[10px] sm:text-xs"
						href="#"
					>
						<Icon icon="material-symbols:location-on" class="text-[8px]" />
						Ver Ubicación
					</a>
				</div>
			</div>
		</article>

		<!-- Recepción -->
		<article class="glass-panel bg-white/80 rounded-2xl overflow-hidden shadow-glass hover:shadow-glow transition-shadow duration-300 flex flex-col md:flex-row-reverse h-full mx-auto w-full">
			<!-- Imagen -->
			<div class="w-full md:w-1/2 h-28 sm:h-32 md:h-full min-h-[160px] md:min-h-[280px] order-first md:order-none">
				<img 
					src={salon} 
					alt="Salón" 
					class="w-full h-full object-cover object-center"
				/>
			</div>
			<!-- Información -->
			<div class="flex-1 p-2 sm:p-4 text-center flex flex-col items-center">
				<div class="w-8 sm:w-10 h-8 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-primary">
					<Icon icon="material-symbols:celebration" class="text-lg sm:text-xl" />
				</div>
				<h3 class="font-script text-xl sm:text-2xl text-primary mb-1">Recepción</h3>
				<p class="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
					{data.evento.recepcion.hora}
				</p>
				<p class="font-serif italic text-xs sm:text-sm mb-1 px-1">{data.evento.recepcion.lugar}</p>
				<p class="text-[10px] sm:text-xs text-gray-600 mb-1 sm:mb-2 px-1">{data.evento.recepcion.direccion}</p>
				<div class="mt-auto w-full px-1 sm:px-0">
					<p class="font-bold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 border-t border-b border-primary/20 py-1 inline-block w-full">
						{data.evento.recepcion.tipo}
					</p>
					<a 
						class="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-colors w-full shadow-lg text-[10px] sm:text-xs"
						href="#"
					>
						<Icon icon="material-symbols:location-on" class="text-[8px]" />
						Ver Ubicación
					</a>
				</div>
			</div>
		</article>
	</section>

	<!-- Detalles -->
	<section class="glass-panel bg-white/80 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row justify-around items-center gap-4 sm:gap-6 text-center max-w-3xl mx-auto w-full">
		<div class="flex flex-col items-center">
			<Icon icon="material-symbols:checkroom" class="text-3xl sm:text-4xl text-primary mb-1 sm:mb-2" />
			<h4 class="font-bold uppercase text-xs sm:text-sm tracking-widest mb-1">Código de Vestimenta</h4>
			<p class="text-sm text-gray-600">{data.detalles.codigo_vestimenta}</p>
		</div>
		<div class="w-full md:w-px h-px md:h-12 bg-gray-300"></div>
		<div class="flex flex-col items-center">
			<Icon icon="material-symbols:card-giftcard" class="text-3xl sm:text-4xl text-primary mb-1 sm:mb-2" />
			<h4 class="font-bold uppercase text-xs sm:text-sm tracking-widest mb-1">Regalos</h4>
			<p class="text-sm text-gray-600">{data.detalles.regalos}</p>
		</div>
	</section>

	<!-- Galería -->
	<section class="max-w-3xl mx-auto w-full">
		<h3 class="font-script text-4xl sm:text-5xl text-center text-primary mb-6 sm:mb-8 drop-shadow-sm">Galería</h3>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
			{#each data.galeria as imagen, i}
				<div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group {i === 1 ? 'md:mt-8' : ''}">
					<img 
						alt={imagen.alt}
						class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						src={imagen.url}
					/>
				</div>
			{/each}
		</div>
	</section>

	<!-- Footer vacío (mensaje movido arriba del contador) -->
	<footer class="hidden">
	</footer>
</main>

