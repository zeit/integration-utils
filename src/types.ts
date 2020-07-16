import { RequestInit } from 'node-fetch';
import VercelClient from './vercel-client';

export interface HandlerOptions {
	payload: UiHookPayload;
	vercelClient: VercelClient;
	// to be removed in future versions
	zeitClient: VercelClient;
}

export interface UiHookPayload {
	action: string;
	clientState: any;
	installationUrl: string;
	projectId?: string | null;
	query: { [key: string]: string | number | string[] };
	slug: string;
	integrationId: string;
	configurationId: string;
	teamId: string | null;
	token: string;
	user: {
		id: string;
		username: string;
		email: string;
		name: string;
		profiles: any[];
	};
	team?: {
		id: string;
		slug: string;
		name: string;
		description: string;
	} | null;
}

export interface FetchOptions extends RequestInit {
	data?: object;
	headers?: { [name: string]: string };
	body?: string;
	method?: 'GET' | 'PATCH' | 'POST' | 'DELETE'
}

export { VercelClient };
