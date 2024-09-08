import { getTime } from '@/shared/lib/time';
import { useAudioStore } from '@/shared/store/AudioStore';
import { Slider } from '@/shared/ui/slider';
import { useInterval, useMount } from '@siberiacancode/reactuse';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { memo } from 'react';

export const SoundBar = memo(() => {
	const {
		setAudioCurrentTime,
		setAudioVolume,
		layers,
		updateAudioCurrentTime,
		toggleAudioStoped,
		updateAudio,
	} = useAudioStore();

	useInterval(() => updateAudioCurrentTime(), 1000);

	useMount(() => {
		const audios = Object.values(layers);
		const cb = (layer: (typeof audios)[0]) => {
			toggleAudioStoped(layer.name, true);
		};
		const cb1 = (layer: (typeof audios)[0]) => {
			updateAudio(layer.name);
			console.log(layer);
		};
		audios.forEach(audio => {
			if (!audio.audio) return;
			audio.audio.addEventListener('ended', () => cb(audio));
			audio.audio.addEventListener('loadedmetadata', () => cb1(audio));
		}, [] as number[]);
		return () => {
			audios.forEach(audio => {
				if (!audio.audio) return;
				audio.audio.removeEventListener('ended', () => cb(audio));
				audio.audio.removeEventListener('loadedmetadata', () => cb1(audio));
			});
		};
	});

	const title = {
		background: 'Эмбиент',
		music: 'Музыка',
		noise: 'Шум',
	};
	console.log(layers);

	return (
		<div className='flex gap-2 w-max min-w-[7em] justify-center'>
			{Object.values(layers).map(audio => (
				<div key={audio.name}>
					{audio.audio && (
						<div className='flex flex-col w-full justify-center'>
							<div className=' flex text-xs justify-center items-center'>
								{title[audio.name]}
							</div>
							<div className=' flex flex-col-reverse gap-2 justify-center items-center'>
								<Slider
									className=''
									max={audio.audio?.duration ?? 1}
									onValueChange={e => {
										setAudioCurrentTime(audio.name, e[0]);
									}}
									min={0}
									value={[audio.currentTime ?? 1]}
								/>
								<Slider
									className=''
									onValueChange={e => {
										if (!audio.audio) return;
										setAudioVolume(audio.name, e[0]);
									}}
									min={0}
									step={0.01}
									max={1}
									value={[audio.audio.volume ?? 1]}
								/>
							</div>
							<div className=' flex flex-col justify-center items-center'>
								<div className='text-sm flex flex-col justify-center items-center'>
									{getTime(audio.currentTime)}
								</div>
								<div className=' flex justify-between items-center'>
									<div></div>
									<div>
										{audio.stoped ? (
											<div>
												<PlayIcon
													width={16}
													height={16}
													onClick={() => {
														if (!audio.audio) return;
														toggleAudioStoped(audio.name, false);
													}}
												/>
											</div>
										) : (
											<div>
												<PauseIcon
													width={16}
													height={16}
													onClick={() => {
														if (!audio.audio) return;
														toggleAudioStoped(audio.name, true);
													}}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
});
