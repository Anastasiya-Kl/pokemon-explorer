type LoadingStateProps = {
	label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
	return (
		<div
			aria-live="polite"
			className="flex items-center justify-center gap-3 text-slate-600"
			role="status"
		>
			<div
				aria-hidden="true"
				className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
			/>
			<span>{label}</span>
		</div>
	);
}
