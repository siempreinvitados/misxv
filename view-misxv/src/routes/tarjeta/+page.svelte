<script lang="ts">
	import data from '$lib/data.json';
	import Icon from '@iconify/svelte';
	import flores from '$lib/assets/imgs/flores.png';
	import iglesia from '$lib/assets/imgs/iglesia.png';
	import salon from '$lib/assets/imgs/salon.png';
	import img1 from '$lib/assets/imgs/img1.jpeg';
	import img2 from '$lib/assets/imgs/img2.jpeg';
	import img3 from '$lib/assets/imgs/img3.jpeg';
	import img4 from '$lib/assets/imgs/img4.jpeg';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import VanillaTilt from 'vanilla-tilt';
	import { viewPreferenceStore } from '$lib/stores/viewPreferenceStore';
	import music from '$lib/assets/music.mp3';

	let isFlipped = $state(false);
	let tiltElement: HTMLDivElement;
	let isBrowser = $state(false);
	let showDebug = $derived($page.url.searchParams.get('dg') === 'true');

	// Estado del contador
	let days = $state('00');
	let hours = $state('00');
	let minutes = $state('00');
	let seconds = $state('00');
	let pulsingImage = $state<number | null>(null);
	let isAnimating = $state(false);
	let showContactModal = $state(false);

	let contentElement: HTMLDivElement;
	let containerElement: HTMLDivElement;
	let isPlaying = $state(false);
	let audio: HTMLAudioElement;

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

	onMount(() => {
		isBrowser = true;
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
			hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(
				2,
				'0'
			);
			minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
			seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
		}, 1000);

		// Inicializar VanillaTilt en el elemento contenedor
		if (tiltElement) {
			VanillaTilt.init(tiltElement, {
				max: 15,
				speed: 400,
				glare: true,
				'glare-prerender': false,
				'max-glare': 0.3,
				scale: 1,
				perspective: 1000,
				transition: true,
				reset: true,
				easing: 'cubic-bezier(.03,.98,.52,.99)',
			});
		}

		adjustFontSize();
		window.addEventListener('resize', adjustFontSize);

		return () => {
			clearInterval(timerInterval);
			window.removeEventListener('resize', adjustFontSize);
		};
	});

	async function adjustFontSize() {
		await tick();

		// On tablet and larger screens, we use Tailwind classes and do not scale dynamically.
		if (typeof window !== 'undefined' && window.innerWidth >= 768) { // md breakpoint
			if (contentElement) {
				contentElement.style.transform = 'scale(1)';
			}
			return;
		}

		if (!containerElement || !contentElement) {
			return;
		}

		// On mobile, dynamically adjust font size
		contentElement.style.transform = 'scale(1)';
		contentElement.style.transformOrigin = 'center';

		const containerHeight = containerElement.clientHeight;
		const contentHeight = contentElement.scrollHeight;

		const verticalPadding = 40;

		if (contentHeight > containerHeight - verticalPadding) {
			const scale = (containerHeight - verticalPadding) / contentHeight;
			contentElement.style.transform = `scale(${scale})`;
		}
	}

	function toggleCard() {
		isFlipped = !isFlipped;
	}

	function navigateToOtherPage() {
		// Increment view count before navigating
		viewPreferenceStore.incrementViewCount();
		
		if ($page.url.pathname === '/tarjeta') {
			goto('/clasica');
		} else {
			goto('/tarjeta');
		}
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

<!-- Fondo con estrellas cayendo -->
<div class="min-h-screen bg-[#FDF4FF] flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
	<!-- Estrellas cayendo -->
	<div class="stars-container absolute inset-0 pointer-events-none overflow-hidden">
		{#each Array(25) as _, i}
			<div class="star absolute" style="left: {Math.random() * 100}%; animation-delay: {Math.random() * 5}s; animation-duration: {4 + Math.random() * 3}s;">
				<Icon icon="mdi:star" class="text-[12px] sm:text-[16px] md:text-[20px]" />
			</div>
		{/each}
	</div>
	<!-- Chip flotante para navegar -->
	<button
		onclick={navigateToOtherPage}
		class="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:scale-105 opacity-60 hover:opacity-100"
	>
		<Icon icon="material-symbols:swap-horiz" class="text-lg" />
		<span class="text-sm">{$page.url.pathname === '/tarjeta' ? 'Vista Clásica' : 'Tarjeta'}</span>
	</button>
	<!-- Panel de debug VanillaTilt -->
	{#if isBrowser && showDebug}
	<div class="fixed top-2 left-2 z-50 bg-black/80 text-green-400 p-2 rounded text-xs font-mono">
		<div class="mb-1 font-bold text-yellow-400">🔧 VanillaTilt</div>
		<div>Inicializado: ✅</div>
		<div>max: 15deg</div>
		<div>Flipped: {isFlipped ? 'Sí' : 'No'}</div>
	</div>
	{/if}

	<!-- Contenedor con VanillaTilt -->
	<div 
		bind:this={tiltElement}
		class="relative w-full max-w-xs sm:max-w-sm md:w-[450px] lg:max-w-lg h-[85dvh] md:h-[80dvh] lg:h-[85vh] perspective-1000 cursor-pointer animate__animated animate__jackInTheBox"
		onclick={toggleCard}
		role="button"
		tabindex="0"
		aria-label={isFlipped ? 'Ver información resumida' : 'Ver más información'}
	>
		<!-- Contenedor interno para flip -->
		<div class="card-inner w-full h-full relative preserve-3d transition-transform duration-700 {isFlipped ? 'flipped' : ''}">
			<!-- Frente de la tarjeta -->
			<div
				bind:this={containerElement}
				class="card-front absolute inset-0 backface-hidden custom-glass bg-white/90 rounded-3xl shadow-[0_0_30px_rgba(147,112,219,0.5)] border-[20px] border-purple-600 px-4 sm:px-6 py-2 sm:py-3 flex flex-col items-center justify-between text-center overflow-hidden" style="border: 3px solid #D8B4FE;"
			>
				<!-- Imagen decorativa flores -->
				<img
					src={flores}
					alt="Flores decorativas"
					class="absolute -bottom-14 -right-8 w-50 w-24 h-auto opacity-50 pointer-events-none rotate-[-15deg] translate-x-2 translate-y-2"
				/>

				<!-- Títulos - siempre arriba -->
				<div class="flex-shrink-0 mt-5">
					<p class="font-serif italic text-xs sm:text-sm md:text-base text-purple-800 mb-3 opacity-80">
						{data.mensaje.citatorio}
					</p>
					<h1 class="font-script text-[2.5rem] sm:text-5xl md:text-3xl lg:text-4xl xl:text-5rem text-primary drop-shadow-md leading-none -mb-2">
						{data.festejado.titulo}
					</h1>
					<h2 class="font-script text-[2.5rem] sm:text-4xl md:text-2xl lg:text-3xl xl:text-4rem silver-text -mt-4 drop-shadow-sm">
						{data.festejado.nombre}
					</h2>
				</div>

				<!-- Información - justificada hacia arriba -->
				<div bind:this={contentElement} class="flex-grow flex flex-col items-center justify-start z-10 py-1">
					<!-- división -->
					<div class="mb-5 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent my-1"></div>

					<!-- Padres -->
					<div class="flex flex-col items-center justify-center">
						<h3 class="font-script text-xl sm:text-2xl md:text-[1rem] text-primary">Mis Papás</h3>
						<p class="font-serif text-base sm:text-lg md:text-sm text-gray-700">
							{data.familia.padres.nombre}
						</p>
					</div>

					<!-- Padrinos -->
					<div class="flex flex-col items-center justify-center">
						<h3 class="font-script text-xl sm:text-2xl md:text-lg text-primary">Mis Padrinos</h3>
						<p class="font-serif text-base sm:text-lg md:text-sm text-gray-700">
							{data.familia.padrinos.nombre}
						</p>
					</div>

					<!-- división -->
					<div class="mt-5 mb-5 w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-1"></div>

					<!-- Ceremonia -->
					<div class="flex flex-col items-center justify-center">
						<h3 class="font-script text-xl sm:text-2xl md:text-base text-primary">Ceremonia</h3>
						<p class="text-sm md:text-xs uppercase tracking-widest text-gray-500 font-bold">
							{data.evento.ceremonia.hora}
						</p>
						<p class="font-serif italic text-base sm:text-lg md:text-sm text-gray-700">
							{data.evento.ceremonia.lugar}
						</p>
					</div>

					<!-- Recepción -->
					<div class="flex flex-col items-center justify-center">
						<h3 class="font-script text-xl sm:text-2xl md:text-base text-primary">Recepción</h3>
						<p class="text-sm md:text-xs uppercase tracking-widest text-gray-500 font-bold">
							{data.evento.recepcion.hora}
						</p>
						<p class="font-serif italic text-base sm:text-lg md:text-sm text-gray-700 mt-0.5">
							{data.evento.recepcion.lugar}
						</p>
					</div>
				</div>

				<!-- Indicador para voltear -->
				<div class="flex-shrink-0 z-10 mt-2">
					<div class="flex flex-col items-center text-gray-400 text-xs sm:text-sm md:text-base animate-pulse">
						<span class="mb-0.5">Tap para ver más</span>
						<Icon icon="material-symbols:touch-app" class="text-primary text-lg sm:text-xl md:text-2xl" />
					</div>
				</div>
			</div>

			<!-- Reverso de la tarjeta (detalles) -->
			<div
				class="card-back absolute inset-0 backface-hidden custom-glass bg-white/90 rounded-3xl shadow-[0_0_30px_rgba(147,112,219,0.5)] border-[20px] border-purple-600 px-4 sm:px-6 py-2 flex flex-col items-center justify-between text-center overflow-hidden rotate-y-180" style="border: 3px solid #D8B4FE;"
			>
				<!-- Imagen decorativa flores -->
				<img
					src={flores}
					alt="Flores decorativas"
					class="absolute -bottom-14 -right-8 w-50 w-24 h-auto opacity-50 pointer-events-none rotate-[-15deg] translate-x-2 translate-y-2"
				/>

				<!-- Contenido principal -->
				<div id="container-card-reverse" class="flex flex-col items-center w-full z-10 overflow-y-auto">
					<!-- Título reverso -->
					<div class="mb-2 sm:mb-3 mt-5">
						<h2 class="font-script text-3xl sm:text-4xl md:text-2xl lg:text-3xl text-primary">
							{data.festejado.titulo}
						</h2>
						<h3 class="font-script text-3xl sm:text-4xl md:text-2xl lg:text-3xl silver-text mt-0.5">
							{data.festejado.nombre}
						</h3>
					</div>

					<!-- Fecha del evento -->
					<div class="mb-1">
						<p
							class="font-bold text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 border-t border-b border-primary/30 py-0.5 px-2"
						>
							{data.evento.fecha}
						</p>
					</div>

					<!-- Mensaje de agradecimiento -->
					<div class="mb-2 w-full">
						
						<p
							class="font-serif italic text-xs sm:text-sm md:text-[0.7rem] lg:text-[0.7rem] text-gray-700 mt-4 mb-4 leading-relaxed px-1"
						>
							{data.mensaje.agradecimiento}
						</p>
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

					<!-- Contador -->
					<div class="mb-1">
						<p class="uppercase tracking-widest text-[8px] sm:text-[9px] md:text-xs font-bold text-gray-500 mb-0.5">
							Faltan
						</p>
						<div class="flex justify-center gap-1">
							<div class="flex flex-col items-center">
								<span
									class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary bg-purple-50 px-1.5 py-0.5 rounded"
									>{days}</span
								>
								<span class="text-[7px] sm:text-[8px] md:text-xs text-gray-500">Días</span>
							</div>
							<span class="text-base sm:text-lg md:text-xl font-bold text-gray-400">:</span>
							<div class="flex flex-col items-center">
								<span
									class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary bg-purple-50 px-1.5 py-0.5 rounded"
									>{hours}</span
								>
								<span class="text-[7px] sm:text-[8px] md:text-xs text-gray-500">Hs</span>
							</div>
							<span class="text-base sm:text-lg md:text-xl font-bold text-gray-400">:</span>
							<div class="flex flex-col items-center">
								<span
									class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary bg-purple-50 px-1.5 py-0.5 rounded"
									>{minutes}</span
								>
								<span class="text-[7px] sm:text-[8px] md:text-xs text-gray-500">Min</span>
							</div>
							<span class="text-base sm:text-lg md:text-xl font-bold text-gray-400">:</span>
							<div class="flex flex-col items-center">
								<span
									class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary bg-purple-50 px-1.5 py-0.5 rounded"
									>{seconds}</span
								>
								<span class="text-[7px] sm:text-[8px] md:text-xs text-gray-500">Seg</span>
							</div>
						</div>
					</div>

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
				<div class="flex-shrink-0 z-10 mt-4">
					<button
						onclick={(e) => { e.stopPropagation(); saveToCalendar(); }}
						class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base"
					>
						<Icon icon="material-symbols:calendar-month" class="text-lg" />
						Guarda la fecha
					</button>
				</div>

					<!-- división -->
					<div
						class="w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent my-1"
					></div>

					<!-- Detalles con enlaces -->
					<div class="w-full">
						<!-- Ceremonia Religiosa - Imagen a la izquierda, texto a la derecha -->
						<div class="mb-2 flex items-start gap-2">
							<!-- Imagen Iglesia -->
							<img
								src={iglesia}
								alt="Iglesia"
								class="w-20 sm:w-24 h-14 sm:h-16 object-cover rounded-lg shadow-md border-2 border-purple-200 flex-shrink-0"
							/>
							<!-- Información Ceremonia - alineado a la derecha -->
							<div class="flex-1 text-right">
								<h4
									class="font-bold uppercase text-xs sm:text-sm md:text-base tracking-widest text-gray-500 mb-0.5"
								>
									Ceremonia Religiosa
								</h4>
								<p class="text-xs sm:text-sm md:text-base text-gray-700 font-medium">{data.evento.ceremonia.lugar}</p>
								<p class="text-[10px] sm:text-xs md:text-sm text-gray-500">
									{data.evento.ceremonia.direccion}
								</p>
								<p class="text-xs sm:text-sm md:text-base font-bold text-primary">{data.evento.ceremonia.hora}</p>
								<a
									class="inline-flex items-center gap-1 text-xs sm:text-sm md:text-base text-purple-600 hover:text-purple-800 font-semibold underline mt-1 px-2 py-1 bg-purple-50 rounded"
									href={data.evento.ceremonia.enlace_mapa}
									target="_blank"
									onclick={(e) => e.stopPropagation()}
								>
									<Icon icon="material-symbols:location-on" class="text-sm sm:text-base" />
									Ver ubicación
								</a>
							</div>
						</div>

						<!-- Recepción - Texto a la izquierda, imagen a la derecha -->
						<div class="mb-2 flex items-start gap-2">
							<!-- Información Recepción - alineado a la izquierda -->
							<div class="flex-1 text-left">
								<h4
									class="font-bold uppercase text-xs sm:text-sm md:text-base tracking-widest text-gray-500 mb-0.5"
								>
									Recepción
								</h4>
								<p class="text-xs sm:text-sm md:text-base text-gray-700 font-medium">{data.evento.recepcion.lugar}</p>
								<p class="text-[10px] sm:text-xs md:text-sm text-gray-500">
									{data.evento.recepcion.direccion}
								</p>
								<p class="text-xs sm:text-sm md:text-base text-primary font-medium">
									{data.evento.recepcion.tipo} - {data.evento.recepcion.hora}
								</p>
								<a
									class="inline-flex items-center gap-1 text-xs sm:text-sm md:text-base text-purple-600 hover:text-purple-800 font-semibold underline mt-1 px-2 py-1 bg-purple-50 rounded"
									href={data.evento.recepcion.enlace_mapa}
									target="_blank"
									onclick={(e) => e.stopPropagation()}
								>
									<Icon icon="material-symbols:location-on" class="text-sm sm:text-base" />
									Ver ubicación
								</a>
							</div>
							<!-- Imagen Salon -->
							<img
								src={salon}
								alt="Salón"
								class="w-20 sm:w-24 h-14 sm:h-16 object-cover rounded-lg shadow-md border-2 border-purple-200 flex-shrink-0"
							/>
						</div>
					</div>

					<h4 class="font-bold uppercase text-xs sm:text-sm md:text-base tracking-widest text-gray-500 mb-0.5">
					Galeria de Fotos
					</h4>

					<!-- Galería tipo fan -->
					<div class="fan-gallery flex justify-center items-center gap-1 mt-4 mb-4">
						<button 
							onclick={(e) => { e.stopPropagation(); pulseImage(); }}
							class="fan-item w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-22 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer -rotate-6 {pulsingImage === 1 ? 'animate__animated animate__flip' : ''}"
						>
							<img alt="Foto 1" class="w-full h-full object-cover" src={img1}/>
						</button>
						<button 
							onclick={(e) => { e.stopPropagation(); pulseImage(); }}
							class="fan-item w-14 h-18 sm:w-16 sm:h-22 md:w-18 md:h-24 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer -rotate-3 {pulsingImage === 2 ? 'animate__animated animate__flip' : ''}"
						>
							<img alt="Foto 2" class="w-full h-full object-cover" src={img2}/>
						</button>
						<button 
							onclick={(e) => { e.stopPropagation(); pulseImage(); }}
							class="fan-item w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer z-10 scale-105 {pulsingImage === 3 ? 'animate__animated animate__flip' : ''}"
						>
							<img alt="Foto 3" class="w-full h-full object-cover" src={img3}/>
						</button>
						<button 
							onclick={(e) => { e.stopPropagation(); pulseImage(); }}
							class="fan-item w-14 h-18 sm:w-16 sm:h-22 md:w-18 md:h-24 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer rotate-3 {pulsingImage === 4 ? 'animate__animated animate__flip' : ''}"
						>
							<img alt="Foto 4" class="w-full h-full object-cover" src={img4}/>
						</button>
					</div>
				</div>

				

				<!-- Mensaje de despedida -->
				<div class="z-10">
					<p class="pt-3 pb-3 font-script text-base sm:text-lg md:text-xl lg:text-2xl text-primary">{data.mensaje.despedida}</p>
				</div>

			</div>
		</div>
	</div>
</div>

<!-- Enlace de contacto -->
<button
	onclick={() => showContactModal = true}
	class="fixed bottom-4 left-4 z-50 text-purple-600 text-sm hover:text-purple-800 underline"
>
	¿Te gustó la invitación? Contáctanos
</button>

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
			role="dialog"
			aria-modal="true"
			tabindex="0"
		>
			<p class="text-center text-lg text-purple-800 font-semibold mb-4">
				¿Te gustó la invitación? Contáctanos
			</p>
			<a
				href="https://wa.me/5217712345678?text=Hola%20me%20ayudas%20a%20crear%20una%20invitaci%C3%B3n%20para%20mi%20evento"
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

	/* Flip card styles */
	.card-inner {
		transform-style: preserve-3d;
	}

	.card-inner.flipped {
		transform: rotateY(180deg);
	}

	.card-front,
	.card-back {
		transform-style: preserve-3d;
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
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	/* Scrollbar transparente para el reverso de la tarjeta */
	.card-back ::-webkit-scrollbar {
		width: 4px;
	}

	.card-back ::-webkit-scrollbar-track {
		background: transparent;
	}

	.card-back ::-webkit-scrollbar-thumb {
		background-color: rgba(147, 112, 219, 0.1);
		border-radius: 10px;
	}

	.card-back ::-webkit-scrollbar-thumb:hover {
		background-color: rgba(147, 112, 219, 0.2);
	}

	/* Estrellas cayendo */
	.stars-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.star {
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
