import Link from "next/link";

export default function NotFoundPage() {
	return (
		<main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 px-6 py-8">
			<div className="space-y-2">
				<h1 className="font-bold text-3xl text-slate-950">Page not found</h1>
				<p className="text-slate-600">
					The page you&apos;re looking for doesn&apos;t exist.
				</p>
			</div>

			<Link
				className="w-fit rounded-md border border-slate-300 px-3 py-2 font-medium text-sm"
				href="/"
			>
				Home
			</Link>
		</main>
	);
}
