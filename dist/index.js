"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const micro_1 = require("micro");
const zeit_client_1 = __importDefault(require("./zeit-client"));
const uid_promise_1 = __importDefault(require("uid-promise"));
function withUiHook(handler) {
    return async function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type');
        if (req.method === 'OPTIONS') {
            return micro_1.send(res, 200);
        }
        if (req.method !== 'POST') {
            return micro_1.send(res, 404, '404 - Not Found');
        }
        try {
            const payload = (await micro_1.json(req));
            const { token, teamId, slug } = payload;
            const zeitClient = new zeit_client_1.default({ token, teamId, slug });
            const jsxString = await handler({ payload, zeitClient });
            micro_1.send(res, 200, jsxString);
        }
        catch (err) {
            const code = await uid_promise_1.default(20);
            console.error(`Error on UiHook[${code}]: ${err.stack}`);
            micro_1.send(res, 200, `
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
exports.withUiHook = withUiHook;
