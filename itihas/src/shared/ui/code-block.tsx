import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { cn } from '../lib/lib';

export interface CodeBlockProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	language?: string;
	darkMode?: boolean;
}
const CodeBlock = ({ className, ...props }: CodeBlockProps) => {
	return (
		<CodeEditor
			className={cn(
				`111111111111111 relative flex min-h-[80px] w-full 
                       rounded border-input px-3 py-2 
                       text-sm text-foreground`,
				className
			)}
			style={{
				background: 'transparent',
				fontFamily: 'ui-monospace,Menlo,monospace',
			}}
			{...props}
		/>
	);
};

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
