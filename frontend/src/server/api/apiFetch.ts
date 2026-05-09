import { env } from "@/env";

export class ApiFetchError extends Error {
	public constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = "ApiFetchError";
	}
}

export async function apiFetch<T>(path: string): Promise<T> {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const url = `${env.BACKEND_URL}${normalizedPath}`;

	const response = await fetch(url, { cache: "no-store" });

	if (!response.ok) {
		throw new ApiFetchError(
			`Backend request failed with status ${response.status}`,
			response.status,
		);
	}

	const data: unknown = await response.json();
	return data as T;
}
