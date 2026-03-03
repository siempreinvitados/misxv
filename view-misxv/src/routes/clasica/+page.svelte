<script lang="ts">
	import data from '$lib/data.json';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import flores from '$lib/assets/imgs/flores.png';
	import iglesia from '$lib/assets/imgs/iglesia.png';
	import salon from '$lib/assets/imgs/salon.png';
	import img1 from '$lib/assets/imgs/img1.jpeg';
	import img2 from '$lib/assets/imgs/img2.jpeg';
	import img3 from '$lib/assets/imgs/img3.jpeg';
	import img4 from '$lib/assets/imgs/img4.jpeg';
	import { viewPreferenceStore } from '$lib/stores/viewPreferenceStore';

	// Estado del contador
	let days = $state('00');
	let hours = $state('00');
	let minutes = $state('00');
	let seconds = $state('00');
	let pulsingImage = $state<number | null>(null);
	let isAnimating = $state(false);
	let showContactModal = $state(false);

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
		
		if ($page.url.pathname === '/clasica') {
			goto('/tarjeta');
		} else {
			goto('/clasica');
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
</script>

<svelte:head>
	<title>Invitación - XV Briana Natali</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</svelte:head>

<!-- Flores en esquinas -->
<button
	onclick={navigateToOtherPage}
	class="fixed top-4 right-4 z-50 vintage-button font-semibold rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:scale-105 opacity-60 hover:opacity-100"
>
	<Icon icon="material-symbols:swap-horiz" class="text-lg" />
	<span class="text-sm">{$page.url.pathname === '/clasica' ? 'Tarjeta' : 'Vista Clásica'}</span>
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

<!-- Fondo con blobs animados -->
<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FDF4FF]">
	<div class="absolute -top-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
	<div class="absolute top-1/3 -right-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
	<div class="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
	<div class="absolute inset-0 bg-sparkle"></div>
</div>

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
	<section class="glass-panel bg-white/80 rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-glass relative overflow-hidden mx-auto w-full max-w-3xl animate__animated animate__slideInRight">
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
	<section class="glass-panel bg-white/60 rounded-3xl p-6 sm:p-8 md:p-10 text-center shadow-glass mx-auto w-full max-w-2xl animate__animated animate__slideInLeft">
		
		<p class="font-serif italic text-base sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mt-4">
			{data.mensaje.agradecimiento}
		</p>
		
	</section>

	<!-- Contador -->
	<section class="text-center px-2 animate__animated animate__fadeInDown">
		<div class="glass-panel bg-white/80 rounded-2xl p-4 sm:p-6 md:p-8 max-w-md sm:max-w-2xl mx-auto shadow-glass">
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

		<!-- Botón Guardar Fecha -->
	<div class="text-center mt-4 mb-4">
		<button
			onclick={saveToCalendar}
			class="inline-flex items-center gap-2 px-6 py-3 vintage-button font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-base sm:text-lg"
		>
			<Icon icon="material-symbols:calendar-month" class="text-xl" />
			Guarda la fecha
		</button>
	</div>

	<!-- Eventos -->
	<section class="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
		<!-- Ceremonia -->
		<article class="glass-panel bg-white/80 rounded-2xl overflow-hidden shadow-glass hover:shadow-glow transition-shadow duration-300 flex flex-col md:flex-row h-full mx-auto w-full animate__animated animate__slideInLeft">
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
						href="{data.evento.ceremonia.enlace_mapa}" 
						target="_blank"
					>
						<Icon icon="material-symbols:location-on" class="text-[8px]" />
						Ver Ubicación
					</a>
				</div>
			</div>
		</article>

		<!-- Recepción -->
		<article class="glass-panel bg-white/80 rounded-2xl overflow-hidden shadow-glass hover:shadow-glow transition-shadow duration-300 flex flex-col md:flex-row-reverse h-full mx-auto w-full animate__animated animate__slideInRight">
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
						href="{data.evento.recepcion.enlace_mapa}"
						target="_blank"
					>
						<Icon icon="material-symbols:location-on" class="text-[8px]" />
						Ver Ubicación
					</a>
				</div>
			</div>
		</article>
	</section>

	<!-- Galería -->
	<section class="py-10 overflow-hidden animate__animated animate__fadeInUp">
		<h3 class="font-script text-4xl sm:text-5xl text-center text-primary mb-8 sm:mb-10 drop-shadow-sm">Galería</h3>
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
			¿Te gustó la invitación? Contáctanos
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
</main>

