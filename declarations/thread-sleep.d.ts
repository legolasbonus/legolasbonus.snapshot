/// <reference types="node" />

declare module 'thread-sleep' {
    function sleep (milliseconds: number): void;
    export = sleep;
}