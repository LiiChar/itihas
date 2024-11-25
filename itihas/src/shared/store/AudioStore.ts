import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type Layer = {
	name: 'background' | 'music' | 'noise';
	audio: HTMLAudioElement | null;
	volume: number;
	source: string;
	time: number;
	muted: boolean;
	currentTime: number;
	stoped: boolean;
	updated: boolean;
	loop: boolean;
};

interface AudioStore {
	layers: Record<Layer['name'], Layer>;
	setAudio: (src: string, layer: Layer['name']) => void;
	setAudioLayers: (layers: Record<Layer['name'], Layer>) => void;
	setAudioVolume: (layer: Layer['name'], volume: number) => void;
	setAudioCurrentTime: (layer: Layer['name'], time: number) => void;
	updateAudioCurrentTime: (layer: Layer['name']) => void;
	toggleAudioUpdated: (layer: Layer['name'], updated?: boolean) => void;
	toggleAudioMuted: (layer: Layer['name'], mutd?: boolean) => void;
	updateAudio: (layer: Layer['name']) => void;
	toggleAudioStoped: (layer: Layer['name'], stoped?: boolean) => void;
}

export const useAudioStore = create<AudioStore>()(
	immer(set => ({
		layers: {
			background: {
				currentTime: 0,
				muted: false,
				name: 'background',
				source: '',
				stoped: false,
				updated: true,
				loop: true,
				time: 0,
				volume: 0.7,
				audio: null,
			},
			music: {
				currentTime: 0,
				muted: false,
				name: 'music',
				source: '',
				stoped: false,
				updated: true,
				loop: false,
				time: 0,
				volume: 1,
				audio: null,
			},
			noise: {
				currentTime: 0,
				muted: false,
				name: 'noise',
				source: '',
				stoped: false,
				updated: true,
				time: 0,
				loop: false,
				volume: 1,
				audio: null,
			},
		},
		setAudioLayers: _layers => {},
		setAudio: (src: string, layer: Layer['name']) => {
			set(state => {
				const defaultLayer = state.layers[layer];
				const audio: any = new Audio(src);
				audio.loop = defaultLayer.loop;
				audio.volume = defaultLayer.volume;
				audio.autoplay = !defaultLayer.stoped;
				audio.preload = 'metadata';
				audio.defaultMuted = defaultLayer.muted;
				const time = audio.duration;
				const currentTime = audio.currentTime;
				state.layers[layer].currentTime = currentTime;
				state.layers[layer].name = layer;
				state.layers[layer].stoped = audio.autoplay;
				state.layers[layer].source = src;
				state.layers[layer].time = time;
				state.layers[layer].audio = audio;
			});
		},
		setAudioVolume: (layer: Layer['name'], volume: number) => {
			set(state => {
				const lay = state.layers[layer];
				if (!lay.audio) return;
				lay.audio.volume = volume;
				lay.volume = volume;
			});
		},
		setAudioCurrentTime: (layer: Layer['name'], time: number) => {
			set(state => {
				if (!state.layers[layer].audio) return;
				state.layers[layer].currentTime = time;
				state.layers[layer].audio!.currentTime = time;
			});
		},
		updateAudioCurrentTime: (layer: Layer['name']) => {
			set(state => {
				state.layers[layer].currentTime =
					state.layers[layer].audio!.currentTime;
				state.layers[layer].time = state.layers[layer].audio!.duration;
			});
		},
		toggleAudioUpdated: (layer: Layer['name'], updated?: boolean) => {
			set(state => {
				state.layers[layer].updated = updated
					? updated
					: !state.layers[layer].updated;
			});
		},
		toggleAudioMuted: (layer: Layer['name'], muted?: boolean) => {
			set(state => {
				const lay = state.layers[layer];
				if (!lay.audio) return;
				const mute = muted ? muted : !lay.muted;
				lay.muted = mute;
				if (mute) {
					lay.audio.muted = false;
				} else {
					lay.audio.muted = true;
				}
			});
		},
		toggleAudioStoped: (layer: Layer['name'], stoped?: boolean) => {
			set(state => {
				const lay = state.layers[layer];
				if (!lay.audio) return;
				const stope = stoped ? stoped : !lay.stoped;
				lay.stoped = stope;
				if (stope) {
					state.layers[layer].audio!.play();
				} else {
					state.layers[layer].audio!.pause();
				}
			});
		},
		updateAudio: (layer: Layer['name']) => {
			set(state => {
				const audio = state.layers[layer];
				if (!audio.audio) return;
				audio.currentTime = audio.audio.currentTime;
				audio.time = audio.audio.duration;
			});
		},
	}))
);

export const setMedia = (src: string, layer: Layer['name']) => {
	const state = useAudioStore.getState();
	if (src == state.layers[layer].source) return;
	state.setAudio(src, layer);
};
