"use client"
import { useState, useEffect } from "react"
import { searchProducts } from "@lib/data/search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function SearchBar() {
    const [q, setQ] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (q.trim().length < 1) {
        setResults([])
        return
        }

        const timer = setTimeout(async () => {
        setLoading(true)
        try {
            const products = await searchProducts(q, 6)
            setResults(products)
        } finally {
            setLoading(false)
        }
        }, 300) // debounce

        return () => clearTimeout(timer)
    }, [q])

    return (
    <div className="relative w-80" style={{ width: "36rem" }}>
        <div className="flex items-center">
            <input
            type="text"
            placeholder="Search products, brands and more"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            style={{ borderWidth: "1.5px" }}
            />
            {q && (
            <button
                type="button"
                onClick={() => {
                setQ("");
                setResults([]);
                }}
                className="ml-2 px-2 py-1 text-gray-500 hover:text-gray-700"
                aria-label="Clear"
            >
                &#10005;
            </button>
            )}
        </div>
        {q && (
            <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-50">
                {loading && <div className="p-3 text-sm">Searching…</div>}
                {!loading && results.length === 0 && (
                    <div className="p-3 text-sm">No results</div>
                )}
                <ul>
                    {results.map((p) => (
                        <li key={p.id} className="p-2 hover:bg-gray-50">
                            <LocalizedClientLink
                                href={`/products/${p.handle}`}
                                onClick={() => {
                                    setQ("");
                                    setResults([]);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={p.thumbnail || "https://d19u8jta4am29c.cloudfront.net/default-product.png"}
                                        alt={p.title}
                                        className="h-10 w-10 rounded object-cover"
                                    />
                                    <div>
                                        <div className="font-medium">{p.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">
                                            {p.description}
                                        </div>
                                    </div>
                                </div>
                            </LocalizedClientLink>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
    )
}
