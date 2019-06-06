import { ServerResponse, IncomingMessage } from 'http';
import { json as getJsonBody, send } from 'micro';
import { UiHookPayload, HandlerOptions } from './types';
import ZeitClient from './zeit-client';
import uid from 'uid-promise';
import { renderAST } from './htm';

type Handler = (handlerOptions: HandlerOptions) => Promise<any>;
type Options = {
	onDelete: ({ payload }: { payload: UiHookPayload }) => void;
};

function getWelcomeMessage() {
	return `
		<html>
			<head>
				<style>
					body{
						font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
						text-rendering: optimizeLegibility;
						line-height: 25px;
						text-align: center;
						display: flex;
						flex-direction: column;
						justify-content: center;
					}

					a {
					  color: #067df7;
						text-decoration: none;
						border-bottom: 1px solid;
					}

					a:hover {
						opacity: 0.6;
					}
				</style>
			</head>
			<body>
				<h1>This is a ZEIT Integration UIHook!</h1>
				<p>
					Next, this UIHook needs to accept HTTP POST requests.
					<br/>
					To learn more about that, <a href="https://zeit.co/docs/integrations#creating-an-integration/step-3-creating-your-integration">click here</a>.
				</p>
			</body>
		</html>
	`;
}

export function withUiHook(handler: Handler, options: Options) {
	return async function(req: IncomingMessage, res: ServerResponse) {
		const payload = (await getJsonBody(req)) as UiHookPayload;

		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, DELETE, OPTIONS'
		);
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Authorization, Accept, Content-Type'
		);

		if (req.method === 'OPTIONS') {
			return send(res, 200);
		}

		if (req.method === 'GET') {
			return send(res, 200, getWelcomeMessage());
		}

		if (req.method === 'DELETE') {
			options.onDelete({ payload });
			return send(res, 200);
		}

		if (req.method !== 'POST') {
			return send(res, 404, '404 - Not Found');
		}

		try {
			const {
				token,
				teamId,
				slug,
				integrationId,
				configurationId
			} = payload;
			const zeitClient = new ZeitClient({
				token,
				teamId,
				slug,
				integrationId,
				configurationId
			});
			const output = await handler({ payload, zeitClient });
			if (output.isAST === true) {
				const renderedAST = renderAST(output);
				return send(res, 200, renderedAST);
			}

			return send(res, 200, String(output));
		} catch (err) {
			const code = await uid(20);
			console.error(`Error on UiHook[${code}]: ${err.stack}`);
			send(
				res,
				200,
				`
				<Page>
					<Box/>
					<Box color="red">
						<Box fontSize="18px" fontWeight="600">Internal Integration Error</Box>
						<Box fontWeight="500">Reference Code: ${code}</Box>
						<Box fontSize="12px" lineHeight="15px">Contact the Integration developer for more information.</Box>
					</Box>
				</Page>
			`
			);
		}
	};
}

export * from './types';
export * from './htm';
