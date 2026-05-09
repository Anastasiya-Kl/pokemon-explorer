import { Suspense } from "react";

import { HomePage } from "@/app/_components/HomePage";

export default function Page() {
	return (
		<Suspense
			fallback={
				<main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8">
					<p className="text-slate-600">Loading Pokémon...</p>
				</main>
			}
		>
			<HomePage />
		</Suspense>
	);
}
