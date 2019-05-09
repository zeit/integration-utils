# @zeit/integration-utils

[![npm](https://badgen.net/npm/v/@zeit/integration-utils)](https://www.npmjs.com/package/@zeit/integration-utils) [![install size](https://badgen.net/packagephobia/install/@zeit/integration-utils)](https://packagephobia.now.sh/result?p=@zeit/integration-utils) [![cicleci](https://badgen.net/circleci/github/zeit/integration-utils)](https://circleci.com/gh/zeit/workflows/integration-utils) [![codecov](https://badgen.net/codecov/c/github/zeit/integration-utils)](https://circleci.com/gh/zeit/workflows/integration-utils)

A set of utilies for ZEIT Integrations.<br/>
Vist https://zeit.co/docs/integrations for more details.

## Install

```
yarn add @zeit/integrations
```

## Middleware for Micro / Now v2

This middleware helps to write UiHook for ZEIT integrations easily.
```js
const {withUiHook} = require('@zeit/integration-utils');

module.exports = withUiHook(async (options) => {
	const {payload, zeitClient} = options;
	const {action, clientState} = payload;
	let metadata = await zeitClient.getMetadata();

	if (action === 'submit') {
		metadata = clientState;
		await zeitClient.setMetadata(metadata);
	}

	if (action === 'reset') {
		metadata = {};
		await zeitClient.setMetadata(metadata);
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
* [zeitClient](./src/zeit-client.ts) - initialized API client for ZEIT with some helpers


