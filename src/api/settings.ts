import { prisma } from './db';

const DEFAULT_SETTINGS = {
    'ENABLE_TOASTS': 'true',
    'ENABLE_VISITORS': 'true',
    'BASE_VISITORS': '4502'
};

export async function getSiteSettings(): Promise<Record<string, string>> {
    try {
        const settings = await prisma.siteSetting.findMany();

        const settingsMap: Record<string, string> = { ...DEFAULT_SETTINGS };
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });

        // Initialize missing default settings
        for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
            if (!settings.find(s => s.key === key)) {
                await prisma.siteSetting.create({
                    data: { key, value }
                }).catch(() => { }); // prevent crash if race condition
            }
        }

        return settingsMap;
    } catch (e) {
        console.error("Error fetching settings:", e);
        return DEFAULT_SETTINGS;
    }
}

export async function updateSiteSetting(key: string, value: string): Promise<boolean> {
    try {
        await prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
        return true;
    } catch (e) {
        console.error("Error updating setting:", e);
        return false;
    }
}
