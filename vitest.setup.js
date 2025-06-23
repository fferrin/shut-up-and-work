import { vi } from 'vitest';

globalThis.chrome = {
    runtime: {
        onMessage: {
            addListener: vi.fn(),
        },
    },
};
