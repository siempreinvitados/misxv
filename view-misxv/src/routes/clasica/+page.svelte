<script lang="ts">
	import data from '$lib/data.json';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import flores from '$lib/assets/imgs/flores.png';
	import iglesia from '$lib/assets/imgs/iglesia.png';
	import salon from '$lib/assets/imgs/salon.png';
	import img1 from '$lib/assets/imgs/img1.png';
	import img2 from '$lib/assets/imgs/img2.png';
	import img3 from '$lib/assets/imgs/img3.png';
	import img4 from '$lib/assets/imgs/img4.png';
	import { viewPreferenceStore } from '$lib/stores/viewPreferenceStore';
	import music from '$lib/assets/music.mp3';

	// Estado del contador
	let days = $state('00');
	let hours = $state('00');
	let minutes = $state('00');
	let seconds = $state('00');
	let pulsingImage = $state<number | null>(null);
	let isAnimating = $state(false);
	let showContactModal = $state(false);
	let isPlaying = $state(false);
	let audio: HTMLAudioElement;

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

	function navigateToOtherPage() {
		// Increment view count before navigating
		viewPreferenceStore.incrementViewCount();
		
		if ($page.url.pathname === base + '/clasica') {
			goto(base + '/tarjeta');
		} else {
			goto(base + '/clasica');
		}
	}

	// Función para guardar en calendario
	function saveToCalendar() {
		// Fecha del evento: 28 de Marzo de 2026 a las 14:00
		const eventTitle = encodeURIComponent('XV Briana Natali');
		const eventDetails = encodeURIComponent('Ceremonia: 2:00 PM - Parroquia de Nuestra Señora del Refugio\nRecepción: 3:30 PM - Auditorio de Omitlán de Juárez');
		const eventLocation = encodeURIComponent('Omitlán de Juárez, Hgo.');
		
		// Fechas en formato ISO sin guiones
		const startDate = '20260328T140000'; // 28 Mar 2026 14:00
		const endDate = '20260328T220000';   // 28 Mar 2026 22:00
		
		// Crear enlace de Google Calendar
		const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${eventDetails}&location=${eventLocation}`;
		
		window.open(googleCalendarUrl, '_blank');
	}

	function pulseImage() {
		// Si ya está en animación, no hacer nada
		if (isAnimating) return;
		
		// Animación en secuencia: 1, 2, 3, 4
		const animateSequence = async () => {
			isAnimating = true;
			for (let i = 1; i <= 4; i++) {
				pulsingImage = i;
				await new Promise(resolve => setTimeout(resolve, 700));
				pulsingImage = null;
				if (i < 4) {
					await new Promise(resolve => setTimeout(resolve, 200));
				}
			}
			isAnimating = false;
		};
		
		animateSequence();
	}

	function toggleMusic() {
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}
</script>

<svelte:head>
	<title>Invitación - XV Briana Natali</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</svelte:head>

<!-- Flores en esquinas -->
<button
	onclick={navigateToOtherPage}
	class="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:scale-105 opacity-60 hover:opacity-100"
>
	<Icon icon="material-symbols:swap-horiz" class="text-lg" />
	<span class="text-sm">{$page.url.pathname === base + '/clasica' ? 'Tarjeta' : 'Vista Clásica'}</span>
</button>

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

<!-- Fondo con estrellas cayendo -->
<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FDF4FF]">
	<div class="absolute -top-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
	<div class="absolute top-1/3 -right-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
	<div class="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
	<div class="absolute inset-0 bg-sparkle"></div>
	
	<!-- Estrellas cayendo -->
	<div class="stars-container">
		{#each Array(25) as _, i}
			<div class="star" style="left: {Math.random() * 100}%; animation-delay: {Math.random() * 5}s; animation-duration: {4 + Math.random() * 3}s;">
				<Icon icon="mdi:star" class="text-[12px] sm:text-[16px] md:text-[20px]" />
			</div>
		{/each}
	</div>
</div>

<style>
	.stars-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	
	.star {
		position: absolute;
		top: -20px;
		width: 20px;
		height: 20px;
		color: #e9d5ff;
		filter: drop-shadow(0 0 4px #c084fc) drop-shadow(0 0 8px #a855f7);
		animation: fall linear infinite;
		opacity: 0.85;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.star:nth-child(even) {
		color: #f5d0fe;
		filter: drop-shadow(0 0 5px #d8b4fe) drop-shadow(0 0 10px #c084fc);
	}
	
	.star:nth-child(3n) {
		color: #ffffff;
		filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #e9d5ff);
	}
	
	@keyframes fall {
		0% {
			transform: translateY(-10px) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateY(100vh) rotate(360deg);
			opacity: 0;
		}
	}
</style>

<main class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 sm:gap-8">
	<!-- Sección principal -->
	<section class="text-center relative px-2">
		<div class="flex-shrink-0 mt-5 animate__animated animate__fadeInDown">
			<p class="font-serif italic text-xs sm:text-sm md:text-base text-purple-800 mb-3 opacity-80">
				{data.mensaje.citatorio}
			</p>
			<h1 class="font-script text-[2.5rem] sm:text-5xl md:text-5xl  text-primary drop-shadow-md leading-none -mb-2">
				{data.festejado.titulo}
			</h1>
			<h2 class="font-script text-[2.5rem] sm:text-4xl md:text-5xl  silver-text -mt-4 drop-shadow-sm">
				{data.festejado.nombre}
			</h2>
		</div>
	</section>

	<!-- Padres y Padrinos -->
	<section class="text-center relative mx-auto w-full max-w-3xl animate__animated animate__slideInRight py-8 border-t border-b border-purple-200 bg-white/30">
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

	<!-- Separador -->
	<div class="flex items-center justify-center gap-4 py-4">
		<div class="h-px bg-purple-300 w-16"></div>
		<Icon icon="material-symbols:flower-2" class="text-purple-400 text-xl" />
		<div class="h-px bg-purple-300 w-16"></div>
	</div>

	<!-- Mensaje de agradecimiento -->
	<section class="text-center mx-auto w-full max-w-2xl animate__animated animate__slideInLeft py-6">
		<p class="font-serif italic text-base sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mt-4">
			{data.mensaje.agradecimiento}
		</p>
	</section>

	<!-- Separador -->
	<div class="flex items-center justify-center gap-4 py-4">
		<div class="h-px bg-purple-300 w-16"></div>
		<Icon icon="material-symbols:flower-2" class="text-purple-400 text-xl" />
		<div class="h-px bg-purple-300 w-16"></div>
	</div>

	<!-- Reproductor de Música -->
	<section class="flex flex-col items-center py-4">
		<h3 class="font-script text-3xl sm:text-4xl text-center text-primary mb-4 drop-shadow-sm">Escucha mi canción favorita</h3>
		<div class="bg-white/70 rounded-full px-4 py-2 shadow-sm flex items-center gap-3 w-full max-w-sm">
			<button
				onclick={toggleMusic}
				class="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors flex-shrink-0"
			>
				<Icon icon={isPlaying ? 'material-symbols:pause' : 'material-symbols:play-arrow'} class="text-xl" />
			</button>
			<div class="flex-1 min-w-0">
				<p class="text-sm font-semibold text-purple-800 truncate">Say Yes To Heaven</p>
				<p class="text-xs text-gray-500 truncate">Lana Del Rey</p>
			</div>
			<Icon icon="material-symbols:music-note" class="text-purple-400 text-xl flex-shrink-0 {isPlaying ? 'animate__animated animate__swing animate__infinite' : ''}" />
		</div>
		<audio bind:this={audio} src={music} loop onplay={() => isPlaying = true} onpause={() => isPlaying = false}></audio>
	</section>

	

	<!-- Separador floral -->
	<div class="flex items-center justify-center gap-4 py-4">
		<div class="h-px bg-purple-300 w-16"></div>
		<Icon icon="material-symbols:flower-2" class="text-purple-400 text-xl" />
		<div class="h-px bg-purple-300 w-16"></div>
	</div>


	<h3 class="font-script text-3xl sm:text-4xl text-center text-primary mb-4 drop-shadow-sm mt-6">Detalles del evento</h3>

	<section class="space-y-8 max-w-4xl mx-auto w-full ">
		<!-- Ceremonia -->
		<article class="bg-white/60 rounded-2xl overflow-hidden flex flex-col md:flex-row h-full mx-auto w-full animate__animated animate__slideInLeft">
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
						class="inline-flex items-center justify-center gap-1 px-4 sm:px-6 py-2 bg-primary hover:bg-purple-700 text-white rounded-full transition-colors w-full shadow-lg text-sm sm:text-base"
						href="{data.evento.ceremonia.enlace_mapa}" 
						target="_blank"
					>
						<Icon icon="material-symbols:location-on" class="text-base" />
						Ver Ubicación
					</a>
				</div>
			</div>
		</article>

		<!-- Recepción -->
		<article class="bg-white/60 rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse h-full mx-auto w-full animate__animated animate__slideInRight">
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
					
					<a 
						class="inline-flex items-center justify-center gap-1 px-4 sm:px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-colors w-full shadow-lg text-sm sm:text-base"
						href="{data.evento.recepcion.enlace_mapa}"
						target="_blank"
					>
						<Icon icon="material-symbols:location-on" class="text-base" />
						Ver Ubicación
					</a>
				</div>
			</div>
		</article>
	</section>

	<!-- Separador -->
	<div class="flex items-center justify-center gap-4 py-4">
		<div class="h-px bg-purple-300 w-16"></div>
		<Icon icon="material-symbols:flower-2" class="text-purple-400 text-xl" />
		<div class="h-px bg-purple-300 w-16"></div>
	</div>

	<!-- Contador -->

	<h3 class="font-script text-3xl sm:text-4xl text-center text-primary mb-4 drop-shadow-sm mt-6">Cuenta regresiva</h3>

	<section class="text-center px-2 animate__animated animate__fadeInDown">
		<div class="bg-white/60 rounded-2xl p-4 sm:p-6 md:p-8 max-w-md sm:max-w-2xl mx-auto">
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

	<!-- Mini Calendario Marzo 2026 -->
	<section class="flex justify-center py-2">
		<div class="bg-white/70 rounded-xl p-3 sm:p-4 shadow-sm w-full max-w-sm sm:max-w-md">
			<h4 class="text-center font-semibold text-purple-700 text-sm sm:text-base mb-2">Marzo 2026</h4>
			<div class="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs">
				<span class="text-gray-500 font-medium h-6 sm:h-7 flex items-center justify-center">D</span>
				<span class="text-gray-500 font-medium h-6 sm:h-7 flex items-center justify-center">L</span>
				<span class="text-gray-500 font-medium h-6 sm:h-7 flex items-center justify-center">M</span>
				<span class="text-gray-500 font-medium h-6 sm:h-7 flex items-center justify-center">M</span>
				<span class="text-gray-500 font-medium h-6 sm:h-7 flex items-center justify-center">J</span>
				<span class="text-gray-500 font-medium h-6 sm:h-7 flex items-center justify-center">V</span>
				<span class="text-gray-500 font-medium h-6 sm:h-7 flex items-center justify-center">S</span>
				
				<!-- Semana 1 -->
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">1</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">2</span>
				<span class="text-purple-600 font-bold border-2 border-purple-400 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mx-auto">3</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">4</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">5</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">6</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">7</span>
				
				<!-- Semana 2 -->
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">8</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">9</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">10</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">11</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">12</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">13</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">14</span>
				
				<!-- Semana 3 -->
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">15</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">16</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">17</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">18</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">19</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">20</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">21</span>
				
				<!-- Semana 4 -->
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">22</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">23</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">24</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">25</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">26</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">27</span>
				<span class="text-purple-600 font-bold bg-purple-200 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mx-auto animate__animated animate__heartBeat animate__infinite" >28</span>
				
				<!-- Semana 5 -->
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">29</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">30</span>
				<span class="text-gray-400 h-6 sm:h-7 flex items-center justify-center">31</span>
				<span class="text-gray-300 h-6 sm:h-7 flex items-center justify-center"></span>
				<span class="text-gray-300 h-6 sm:h-7 flex items-center justify-center"></span>
				<span class="text-gray-300 h-6 sm:h-7 flex items-center justify-center"></span>
				<span class="text-gray-300 h-6 sm:h-7 flex items-center justify-center"></span>
			</div>
		</div>
	</section>

	<!-- Botón Guardar Fecha -->
	<div class="text-center mt-2 mb-4">
		<button
			onclick={saveToCalendar}
			class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-base sm:text-lg"
		>
			<Icon icon="material-symbols:calendar-month" class="text-xl" />
			Guarda la fecha
		</button>
	</div>

	<!-- Separador floral -->
	<div class="flex items-center justify-center gap-4 py-4">
		<div class="h-px bg-purple-300 w-16"></div>
		<Icon icon="material-symbols:flower-2" class="text-purple-400 text-xl" />
		<div class="h-px bg-purple-300 w-16"></div>
	</div>

	<!-- Galería -->
	<section class="py-10 overflow-hidden animate__animated animate__fadeInUp">
		<h3 class="font-script text-4xl sm:text-5xl text-center text-primary mb-8 sm:mb-10 drop-shadow-sm">Galería de fotos</h3>
		<div class="fan-gallery flex justify-center items-center gap-4 md:gap-0">
			<!-- Imagen 1 -->
			<button 
				onclick={pulseImage}
				class="fan-item w-32 h-44 sm:w-40 sm:h-56 md:w-52 md:h-72 lg:w-60 lg:h-80 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer -rotate-6 translate-x-2 sm:translate-x-4 {pulsingImage === 1 ? 'animate__animated animate__flip' : ''}"
			>
				<img 
					alt="Foto 1" 
					class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
					src={img1}
				/>
			</button>
			<!-- Imagen 2 -->
			<button 
				onclick={pulseImage}
				class="fan-item w-36 h-48 sm:w-44 sm:h-60 md:w-56 md:h-76 lg:w-64 lg:h-84 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer -rotate-3 translate-x-1 sm:translate-x-2 {pulsingImage === 2 ? 'animate__animated animate__flip' : ''}"
			>
				<img 
					alt="Foto 2" 
					class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
					src={img2}
				/>
			</button>
			<!-- Imagen 3 (central) -->
			<button 
				onclick={pulseImage}
				class="fan-item w-40 h-52 sm:w-48 sm:h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer z-10 scale-105 {pulsingImage === 3 ? 'animate__animated animate__flip' : ''}"
			>
				<img 
					alt="Foto 3" 
					class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
					src={img3}
				/>
			</button>
			<!-- Imagen 4 -->
			<button 
				onclick={pulseImage}
				class="fan-item w-36 h-48 sm:w-44 sm:h-60 md:w-56 md:h-76 lg:w-64 lg:h-84 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer rotate-3 -translate-x-1 sm:-translate-x-2 {pulsingImage === 4 ? 'animate__animated animate__flip' : ''}"
			>
				<img 
					alt="Foto 4" 
					class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
					src={img4}
				/>
			</button>
		</div>
	</section>



	<!-- Footer -->
	<footer class="mt-12 text-center pb-8">
		<p class="font-script text-2xl sm:text-3xl md:text-4xl text-primary">{data.mensaje.despedida}</p>
	</footer>

	<!-- Enlace de contacto -->
	<div class="text-center pb-8">
		<button
			onclick={() => showContactModal = true}
			class="text-purple-600 text-sm hover:text-purple-800 underline"
		>
			¿Te gustó la invitación? Contactame
		</button>
	</div>

	<!-- Modal de contacto -->
	{#if showContactModal}
		<div 
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			onclick={() => showContactModal = false}
			onkeydown={(e) => e.key === 'Escape' && (showContactModal = false)}
			role="presentation"
			tabindex="-1"
		>
			<div 
				class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate__animated animate__zoomIn"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.key === 'Escape' && (showContactModal = false)}
				role="dialog"
				aria-modal="true"
				tabindex="0"
			>
				<p class="text-center text-lg text-purple-800 font-semibold mb-4">
					¿Te gustó la invitación? Contactame
				</p>
				<a
					href="https://wa.me/5215658936778?text=Hola%20me%20ayudas%20a%20crear%20una%20invitaci%C3%B3n%20para%20mi%20evento"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300"
				>
					<Icon icon="fa-brands:whatsapp" class="text-2xl" />
					Escríbenos por WhatsApp
				</a>
				<button
					onclick={() => showContactModal = false}
					class="mt-3 w-full py-2 text-gray-500 hover:text-gray-700 text-sm underline"
				>
					Cerrar
				</button>
			</div>
		</div>
	{/if}
</main>

