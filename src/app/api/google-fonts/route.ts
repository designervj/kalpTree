import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sort = searchParams.get("sort") || "popularity";

        // Use the public metadata API which doesn't require an API key
        const url = `https://fonts.google.com/metadata/fonts`;

        const res = await fetch(url, {
            // cache for 24 hours
            next: { revalidate: 60 * 60 * 24 },
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: "Google Fonts API failed", details: text },
                { status: 500 }
            );
        }

        const data = await res.json();
        let familyMetadataList = data.familyMetadataList || [];

        // Sort the list based on the requested sort type
        if (sort === "popularity") {
            familyMetadataList.sort((a: any, b: any) => (a.popularity || 0) - (b.popularity || 0));
        } else if (sort === "alpha") {
            familyMetadataList.sort((a: any, b: any) => a.family.localeCompare(b.family));
        }

        // Keep only what client needs
        const items = familyMetadataList.map((f: any) => {
            // Convert font keys like '400', '400i' to 'regular', 'italic', '500', '500italic'
            const variants = Object.keys(f.fonts || {}).map(k => {
                if (k === "400") return "regular";
                if (k === "400i") return "italic";
                if (k.endsWith("i")) return k.replace("i", "italic");
                return k;
            });

            return {
                family: f.family,
                variants: variants,
                category: f.category,
            };
        });

        return NextResponse.json({ items });
    } catch (err: any) {
        return NextResponse.json(
            { error: "Unexpected error", details: String(err?.message || err) },
            { status: 500 }
        );
    }
}