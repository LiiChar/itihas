import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSnowPreset } from '@tsparticles/preset-snow';
import { Engine } from '@tsparticles/engine';

export default function Snowing() {
	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine: Engine) => {
			await loadSnowPreset(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	return (
		<>
			{init && (
				<Particles
					id='tsparticles'
					options={{
						preset: 'snow',
						background: {
							opacity: 0,
						},
						particles: {
							size: {
								value: 1,
							},
						},
					}}
				/>
			)}
		</>
	);
}
