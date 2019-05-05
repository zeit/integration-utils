import { FetchOptions } from './types';
interface ClientOptions {
    token: string;
    teamId: string | null | undefined;
    slug: string;
}
export default class ZeitClient {
    options: ClientOptions;
    constructor(options: ClientOptions);
    fetch(path: string, options: FetchOptions): Promise<import("node-fetch").Response>;
    fetchAndThrow(path: string, options: FetchOptions): Promise<any>;
    getMetadata(): Promise<any>;
    setMetadata(data: object): Promise<any>;
    ensureSecret(namePrefix: string, value: string): Promise<string>;
    addEnv(projectId: string, name: string, secretName: string): Promise<void>;
}
export {};
