import { ServerResponse, IncomingMessage } from 'http';
import { json as getJsonBody, send } from 'micro';
import { UiHookPayload, HandlerOptions } from './types';
import ZeitClient from './zeit-client';
import uid from 'uid-promise';

type Handler = (handlerOptions: HandlerOptions) => Promise<string>;

export function withUiHook(handler: Handler) {
  return async function(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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
			const {token, teamId, slug} = payload;
			const zeitClient = new ZeitClient({token, teamId, slug});
			const jsxString = await handler({payload, zeitClient});
			send(res, 200, jsxString);
		} catch(err) {
			const code = await uid(20);
			console.error(`Error on UiHook[${code}]: ${err.stack}`);
			send(res, 200, `
				<Page>
					<Box/>
					<Box color="red">
						<Box fontSize="18px" fontWeight="600">Addon Loading Error</Box>
						<Box>Reference Code: ${code}</Box>
					</Box>
				</Page>
			`);
		}
  };
}

export * from './types'

