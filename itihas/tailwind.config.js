const withMT = require('@material-tailwind/react/utils/withMT');
const plugin = require('tailwindcss/plugin');
/** @type {import('tailwindcss').Config} */
export default withMT({
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				foreground: 'var(--foreground)',
				background: 'var(--background)',
				warning: 'var(--warning)',
				error: 'var(--error)',
				secondary: 'var(--secondary)',
				'secondary-foreground': 'var(--secondary-foreground)',
				accent: 'var(--accent)',
				primary: 'var(--primary)',
				'border-color': 'var(--border-color)',
			},
		},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			const directions = {
				t: 'to top',
				tr: 'to top right',
				r: 'to right',
				br: 'to bottom right',
				b: 'to bottom',
				bl: 'to bottom left',
				l: 'to left',
				tl: 'to top left',
			};

			const steps = [
				'0%',
				'10%',
				'20%',
				'30%',
				'40%',
				'50%',
				'60%',
				'70%',
				'80%',
				'90%',
			];

			const utilities = Object.entries(directions).reduce(
				(result, [shorthand, direction]) => {
					const variants = steps.map(step => {
						const className = `.gradient-mask-${shorthand}-${step}`;
						return {
							[className]: {
								maskImage: `linear-gradient(${direction}, rgba(0, 0, 0, 1.0) ${step}, transparent 100%)`,
							},
						};
					});

					const stepClasses = Object.assign(...variants);
					return {
						...result,
						...stepClasses,
					};
				},
				{}
			);

			addUtilities(utilities);
		}),
	],
});
