# @zeit/addons

[![npm](https://badgen.net/npm/v/@zeit/addons)](https://www.npmjs.com/package/@zeit/addons) [![install size](https://badgen.net/packagephobia/install/@zeit/addons)](https://packagephobia.now.sh/result?p=@zeit/addons) [![cicleci](https://badgen.net/circleci/github/zeit/addons)](https://circleci.com/gh/zeit/workflows/addons) [![codecov](https://badgen.net/codecov/c/github/zeit/addons)](https://circleci.com/gh/zeit/workflows/addons)

A set of utilies for ZEIT Addons.<br/>
Vist https://zeit.co/docs/addons for more details.

## Install

```
yarn add @zeit/addons
```

## Middleware for Micro / Now v2

This middleware helps to write UiHook for ZEIT addons easily.
```js
const {withUiHook} = require('@zeit/addons');

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
