import {
    WixClient
} from "@/lib/wix-client.base";
import { cache } from "react";
import { collections } from "@wix/stores";


export const getCollectionBySlug = cache(async (wixClient: WixClient, slug: string) => {
    const { collection } = await wixClient.collections.getCollectionBySlug(slug)


    return collection || null;
}
)
export const getCollections = cache(
    async (wixClient: WixClient): Promise<collections.Collection[]> => {
        const collections = await wixClient.collections
            .queryCollections()
            .ne("_id", "00000000-000000-000000-000000000001") // all products
            .ne("_id", "47c2425c-7ae6-255b-ff48-61db1fa41d2f") // featured products
            .find();

        return collections.items;
    },
);
