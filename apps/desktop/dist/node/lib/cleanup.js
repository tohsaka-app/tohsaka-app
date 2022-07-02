"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCleanup = void 0;
function useCleanup(cb) {
    [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
        process.on(eventType, cb.bind(null, eventType));
    });
}
exports.useCleanup = useCleanup;
