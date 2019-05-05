/// <reference types="node" />
import { ServerResponse, IncomingMessage } from 'http';
declare type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<unknown>;
export default function withCORS(handler: Handler): (req: IncomingMessage, res: ServerResponse) => void | Promise<unknown>;
export {};
