import dedent from 'dedent';

type FormattedProps = { tabsWidth?: number; gapWidth?: number };

export const FormattedText = ({
	text,
	options,
}: {
	text: string;
	options?: FormattedProps;
}) => {
	const { gapWidth, tabsWidth }: FormattedProps = Object.assign(
		{ tabsWidth: 8, gapWidth: 4 },
		options
	);
	return dedent`${text}`.split('\n').map(l => {
		const splitedLine = l.split('\t');
		return (
			<span>
				{splitedLine.map(s => (
					<span
						style={{
							paddingLeft: splitedLine.length == 1 ? '0px' : `${tabsWidth}px`,
							paddingRight: `${gapWidth}px`,
						}}
					>
						{s}
					</span>
				))}
				<br />
			</span>
		);
	});
};
