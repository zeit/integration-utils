import { RequestInit } from 'node-fetch';
import ZeitClient from './zeit-client';

export interface HandlerOptions {
	payload: UiHookPayload;
	zeitClient: ZeitClient;
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
}

export { ZeitClient };
