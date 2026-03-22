import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

/**
 * Vite does not expand Laravel-style "${APP_NAME}" in .env — that string can end up
 * literally in the JS bundle (titles like "Log in - ${APP_NAME}"). Prefer APP_NAME
 * when VITE_APP_NAME is missing or still looks like a template.
 */
function resolveClientAppName(env) {
    const viteVal = (env.VITE_APP_NAME || '').trim();
    const appName = (env.APP_NAME || process.env.APP_NAME || '').trim();
    if (viteVal && !viteVal.includes('${')) {
        return viteVal;
    }
    if (appName && !appName.includes('${')) {
        return appName;
    }
    return 'Barangay Portal';
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const appName = resolveClientAppName(env);

    return {
        define: {
            'import.meta.env.VITE_APP_NAME': JSON.stringify(appName),
        },
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                ssr: 'resources/js/ssr.jsx',
                refresh: true,
            }),
            react(),
        ],
    };
});
