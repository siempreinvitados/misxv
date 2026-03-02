<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

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
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
