// @ts-ignore
import { lightGreen } from '@mui/material/colors';
// @ts-ignore
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		background: {
			paper: '#222629',
			default: '#222629',
		},
		text: {
			primary: '#ffffff',
			secondary: '#8d9196',
		},
		primary: {
			main: lightGreen['500'],
		},
	},
});
