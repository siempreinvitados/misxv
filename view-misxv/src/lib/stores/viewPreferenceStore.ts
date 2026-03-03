import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'view_preference_data';
const COUNT_THRESHOLD = 4;

interface ViewPreferenceData {
	viewCount: number;
	userPreference: 'tarjeta' | 'clasica' | null;
	hasSubmittedPreference: boolean;
	showFloatingButton: boolean;
}

function getInitialData(): ViewPreferenceData {
	if (!browser) {
		return {
			viewCount: 0,
			userPreference: null,
			hasSubmittedPreference: false,
			showFloatingButton: false,
		};
	}

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			return {
				viewCount: 0,
				userPreference: null,
				hasSubmittedPreference: false,
				showFloatingButton: false,
			};
		}
	}

	return {
		viewCount: 0,
		userPreference: null,
		hasSubmittedPreference: false,
		showFloatingButton: false,
	};
}

function createViewPreferenceStore() {
	const { subscribe, set, update } = writable<ViewPreferenceData>(getInitialData());

	function persist(data: ViewPreferenceData) {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		}
	}

	return {
		subscribe,

		// Increment view count when switching between pages
		incrementViewCount: () => {
			update((data) => {
				const newCount = data.viewCount + 1;
				const newData = { ...data, viewCount: newCount };
				persist(newData);
				return newData;
			});
		},

		// Check if modal should be shown (count >= 4 and no preference submitted)
		shouldShowModal: (): boolean => {
			let result = false;
			update((data) => {
				result = data.viewCount >= COUNT_THRESHOLD && !data.hasSubmittedPreference;
				return data;
			});
			return result;
		},

		// Get current view count
		getViewCount: (): number => {
			let count = 0;
			update((data) => {
				count = data.viewCount;
				return data;
			});
			return count;
		},

		// Save user preference when they click "Enviar"
		savePreference: (preference: 'tarjeta' | 'clasica') => {
			update((data) => {
				const newData = {
					...data,
					userPreference: preference,
					hasSubmittedPreference: true,
					showFloatingButton: false, // Hide floating button permanently
				};
				persist(newData);
				return newData;
			});
		},

		// Called when user clicks "Seguir viendo"
		handleContinueViewing: () => {
			update((data) => {
				const newData = {
					...data,
					showFloatingButton: true, // Show floating button
				};
				persist(newData);
				return newData;
			});
		},

		// Check if floating button should be shown
		shouldShowFloatingButton: (): boolean => {
			let result = false;
			update((data) => {
				result = data.showFloatingButton && !data.hasSubmittedPreference;
				return data;
			});
			return result;
		},

		// Force show modal (can be called from pages)
		forceShowModal: () => {
			// This will be handled reactively
		},

		// Reset for testing
		reset: () => {
			const initialData: ViewPreferenceData = {
				viewCount: 0,
				userPreference: null,
				hasSubmittedPreference: false,
				showFloatingButton: false,
			};
			set(initialData);
			persist(initialData);
		},
	};
}

export const viewPreferenceStore = createViewPreferenceStore();
