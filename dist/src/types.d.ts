import { RequestInit } from 'node-fetch';
import ZeitClient from './zeit-client';
export interface HandlerOptions {
    payload: UiHookPayload;
    zeitClient: ZeitClient;
}
export interface UiHookPayload {
    action: string;
    token: string;
    teamId: string | null;
    slug: string;
    projectId?: string | null;
    clientState: any;
    query: any;
}
export interface FetchOptions extends RequestInit {
    data?: object;
}
