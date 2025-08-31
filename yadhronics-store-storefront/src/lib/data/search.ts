"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const searchProducts = async (q: string, limit = 10) => {
    const next = {
    ...(await getCacheOptions("products")),
    }

    return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(
        `/store/products?q=${encodeURIComponent(q)}&limit=${limit}`,
        {
            next,
            cache: "no-store", // always fresh
        }
        )
    .then(({ products }) => products)
}
