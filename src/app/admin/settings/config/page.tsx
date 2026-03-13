import { SiteSettingsForm } from "./SiteSettingsForm";
import { getSiteConfig } from "@/api/db";

export default async function ConfigPage() {
    const config = await getSiteConfig();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black font-serif text-[#f5ebd7] tracking-widest uppercase mb-2">
                Site Control Engine <span className="text-[#c4a265]">/ Settings</span>
            </h1>
            <p className="text-[#a39783] text-sm mb-8">
                Modify global registry definitions. Warning: These parameters directly affect public-facing components.
            </p>

            <SiteSettingsForm config={config} />
        </div>
    );
}
