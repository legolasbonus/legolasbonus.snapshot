/// <reference types="node" />

declare module 'build-url' {
    function buildUrl (url: string, options?: any): string;
    export = buildUrl;
}