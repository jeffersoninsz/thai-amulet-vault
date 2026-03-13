import { NavigationManager } from "./NavigationManager";
import { getNavigationItems } from "@/api/db";

export default async function NavigationPage() {
    const items = await getNavigationItems();

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-black font-serif text-[#f5ebd7] tracking-widest uppercase mb-2">
                Navigation <span className="text-[#c4a265]">/ Architecture</span>
            </h1>
            <p className="text-[#a39783] text-sm mb-8">
                Modify global top and bottom navigation anchors dynamically. Changes apply immediately to storefront routing mapping.
            </p>

            <NavigationManager initialItems={items} />
        </div>
    );
}
