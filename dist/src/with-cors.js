"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function withCORS(handler) {
    return function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type');
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            return res.end('{}');
        }
        return handler(req, res);
    };
}
exports.default = withCORS;
