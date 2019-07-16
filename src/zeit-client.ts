import fetchImpl from 'node-fetch';
import { createHash } from 'crypto';
import { FetchOptions } from './types';

interface ClientOptions {
	token: string;
	teamId: string | null | undefined;
	integrationId: string;
	configurationId: string;
	slug: string;
}

export default class ZeitClient {
	options: ClientOptions;

	constructor(options: ClientOptions) {
		this.options = options;
	}

	fetch(path: string, options: FetchOptions = {}) {
		let apiPath = `https://zeit.co/api${path}`;

		if (this.options.teamId) {
			const e = encodeURIComponent;
			apiPath = apiPath.includes('?')
				? `${apiPath}&teamId=${e(this.options.teamId)}`
				: `${apiPath}?teamId=${e(this.options.teamId)}`;
		}

		options.headers = options.headers || {
			Authorization: `Bearer ${this.options.token}`
		};

		if (options.data) {
			options.headers = {
				...options.headers,
				'Content-Type': 'application/json'
			};
			options.body = JSON.stringify(options.data);
		}

		return fetchImpl(apiPath, options);
	}

	async fetchAndThrow(path: string, options: FetchOptions) {
		const res = await this.fetch(path, options);
		if (res.status !== 200) {
			throw new Error(
				`Failed ZEIT API call. path: ${path} status: ${
					res.status
				} error: ${await res.text()}`
			);
		}

		return res.json();
	}

	getMetadata() {
		const metadataApiEndpoint = `/v1/integrations/configuration/${
			this.options.configurationId
		}/metadata`;
		return this.fetchAndThrow(metadataApiEndpoint, { method: 'GET' });
	}

	setMetadata(data: object) {
		const metadataApiEndpoint = `/v1/integrations/configuration/${
			this.options.configurationId
		}/metadata`;
		return this.fetchAndThrow(metadataApiEndpoint, {
			method: 'POST',
			data
		});
	}

	async ensureSecret(namePrefix: string, value: string) {
		const hash = createHash('sha1')
			.update(value)
			.digest('hex');
		const name = `${namePrefix}-${hash.substring(0, 10)}`;
		const apiRes = await this.fetch(`/v2/now/secrets`, {
			method: 'POST',
			data: { name, value }
		});

		if (apiRes.status === 200 || apiRes.status === 409) {
			return name;
		}

		throw new Error(
			`Error when adding a secret: [${
				apiRes.status
			}] ${await apiRes.text()}`
		);
	}

	async upsertEnv(projectId: string, name: string, secretName: string) {
		const createRes = await this.fetch(`/v1/projects/${projectId}/env`, {
			method: 'POST',
			data: {
				key: name,
				value: `@${secretName}`
			}
		});

		if (createRes.status !== 200) {
			throw new Error(
				`Error when adding an env: [${
					createRes.status
				}] ${await createRes.text()}`
			);
		}
	}

	async removeEnv(projectId: string, name: string) {
		const deleteRes = await this.fetch(
			`/v1/projects/${projectId}/env/${name}`,
			{ method: 'DELETE' }
		);
		if (deleteRes.status !== 200 && deleteRes.status !== 404) {
			throw new Error(
				`Error when deleting an env: [${
					deleteRes.status
				}] ${await deleteRes.text()}`
			);
		}
	}
}
