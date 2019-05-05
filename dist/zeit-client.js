"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = require("crypto");
class ZeitClient {
    constructor(options) {
        this.options = options;
    }
    fetch(path, options) {
        let apiPath = `https://zeit.co/api${path}`;
        if (this.options.teamId) {
            apiPath += `?teamId=${this.options.teamId}`;
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
        return node_fetch_1.default(apiPath, options);
    }
    async fetchAndThrow(path, options) {
        const res = await this.fetch(path, options);
        if (res.status !== 200) {
            throw new Error(`Failed ZEIT API call. path: ${path} status: ${res.status} error: ${await res.text()}`);
        }
        return res.json();
    }
    getMetadata() {
        const metadataApiEndpoint = `/v1/integrations/installation/${this.options.slug}/metadata`;
        return this.fetchAndThrow(metadataApiEndpoint, { method: 'GET' });
    }
    setMetadata(data) {
        const metadataApiEndpoint = `/v1/integrations/installation/${this.options.slug}/metadata`;
        return this.fetchAndThrow(metadataApiEndpoint, {
            method: 'POST',
            data
        });
    }
    async ensureSecret(namePrefix, value) {
        const hash = crypto_1.createHash('sha1')
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
        throw new Error(`Error when adding a secret: [${apiRes.status}] ${await apiRes.text()}`);
    }
    async addEnv(projectId, name, secretName) {
        const env = {};
        env[name] = `@${secretName}`;
        const deleteRes = await this.fetch(`/v1/projects/${projectId}/env/${name}`, { method: 'DELETE' });
        if (deleteRes.status !== 200) {
            throw new Error(`Error when deleting an env: [${deleteRes.status}] ${await deleteRes.text()}`);
        }
        const createRes = await this.fetch(`/v1/projects/${projectId}/env`, {
            method: 'POST',
            data: { env }
        });
        if (createRes.status !== 200) {
            throw new Error(`Error when deleting an env: [${createRes.status}] ${await createRes.text()}`);
        }
    }
}
exports.default = ZeitClient;
