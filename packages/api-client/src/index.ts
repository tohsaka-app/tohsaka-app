import { createTRPCClient } from "@trpc/client";

import type { AppRouter } from "@tohsaka/api-server";

export interface CreateClientOptions {
	url?: string;
}

export function createClient(options: CreateClientOptions) {
	return createTRPCClient<AppRouter>({
		url: options.url || "https://api.tohsaka.app"
	});
}
