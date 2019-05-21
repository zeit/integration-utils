import { ServerResponse, IncomingMessage } from 'http';
import { json as getJsonBody, send } from 'micro';
import { UiHookPayload, HandlerOptions } from './types';
import ZeitClient from './zeit-client';
import uid from 'uid-promise';
import { renderAST } from './htm';

type Handler = (handlerOptions: HandlerOptions) => Promise<any>;

export function withUiHook(handler: Handler) {
	return async function(req: IncomingMessage, res: ServerResponse) {
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

		if (req.method !== 'POST') {
			return send(res, 404, '404 - Not Found');
		}

		try {
			const payload = (await getJsonBody(req)) as UiHookPayload;
			const { token, teamId, slug, integrationId, configurationId} = payload;
			const zeitClient = new ZeitClient({ token, teamId, slug, integrationId, configurationId });
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
						<Box fontSize="12px" lineHeight="15px">Contact the Integration creator for more information.</Box>
					</Box>
				</Page>
			`
			);
		}
	};
}

export * from './types';
export * from './htm';
