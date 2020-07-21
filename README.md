# @vercel/integration-utils

[![npm](https://badgen.net/npm/v/@vercel/integration-utils)](https://www.npmjs.com/package/@vercel/integration-utils) [![install size](https://badgen.net/packagephobia/install/@vercel/integration-utils)](https://packagephobia.now.sh/result?p=@vercel/integration-utils) [![cicleci](https://badgen.net/circleci/github/vercel/integration-utils)](https://circleci.com/gh/vercel/workflows/integration-utils) [![codecov](https://badgen.net/codecov/c/github/vercel/integration-utils)](https://circleci.com/gh/vercel/workflows/integration-utils)

A set of utilies for Vercel Integrations.<br/>
Vist https://vercel.com/docs/integrations for more details.

## Install

```
yarn add @vercel/integrations
```

## Middleware for Micro / Vercel

This middleware helps to write UiHook for Vercel integrations easily.
```js
const {withUiHook} = require('@vercel/integration-utils');

module.exports = withUiHook(async (options) => {
	const {payload, vercelClient} = options;
	const {action, clientState} = payload;
	let metadata = await vercelClient.getMetadata();

	if (action === 'submit') {
		metadata = clientState;
		await vercelClient.setMetadata(metadata);
	}

	if (action === 'reset') {
		metadata = {};
		await vercelClient.setMetadata(metadata);
	}

	return `
		<Page>
			<Container>
				<Input label="Secret Id" name="secretId" value="${metadata.secretId || ''}"/>
				<Input label="Secret Key" name="secretKey" type="password" value="${metadata.secretKey || ''}" />
			</Container>
			<Container>
				<Button action="submit">Submit</Button>
				<Button action="reset">Reset</Button>
			</Container>
		</Page>
	`;
});

```

This middleware calls the handler with an object containing following entities:

* [payload](./src/types.ts#L9) - the information related uiHook
* [vercelClient](./src/vercel-client.ts) - initialized API client for Vercel with some helpers

