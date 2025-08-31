import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white p-4"
    >
      <div data-testid="product-wrapper">
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        size="full"
        isFeatured={isFeatured}
        className="rounded-md mb-4"
      />
      <div className="flex flex-row items-center justify-between gap-4">
        <Text
          className="text-lg font-semibold text-ui-fg-base group-hover:text-ui-fg-interactive transition-colors"
          data-testid="product-title"
        >
          {product.title}
        </Text>
        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
      </div>
      </div>
    </LocalizedClientLink>
  )
}
