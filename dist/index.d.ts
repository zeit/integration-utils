/// <reference types="node" />
import { ServerResponse, IncomingMessage } from 'http';
import { HandlerOptions } from './types';
declare type Handler = (handlerOptions: HandlerOptions) => Promise<string>;
export declare function withUiHook(handler: Handler): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export {};
