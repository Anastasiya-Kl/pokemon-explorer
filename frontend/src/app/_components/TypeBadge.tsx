type TypeBadgeProps = {
	type: string;
};

export function TypeBadge({ type }: TypeBadgeProps) {
	return (
		<span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700 text-xs capitalize">
			{type}
		</span>
	);
}
