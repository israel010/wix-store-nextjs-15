/* eslint-disable @next/next/no-img-element */
import { products } from "@wix/stores"
import Link from "next/link";
import { media as wixMedia } from "@wix/sdk"
import WixImage from "./WixImage";
import Badge from "./ui/badge";
import { formatCurrency } from "@/lib/utils";
import DiscountBadge from "./DiscountBadge";

interface ProductProps {
    product: products.Product;
}
export default function Product({ product }: ProductProps) {
    const mainImage = product.media?.mainMedia?.image;




    return (
        <Link href={`/products/${product.slug}`}
            className="border h-full bg-card"
        >

            <div className="overflow-hidden relative">

                <WixImage
                    mediaIdentifier={mainImage?.url}

                    alt={mainImage?.altText}
                    width={700}
                    height={700}
                    className="transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute gap-3  bottom-3 right-4 flex flex-wrap items-center">
                    {product.ribbon && <Badge>{product.ribbon}</Badge>}
                    {product.discount && <DiscountBadge data={product.discount} />}
                    <Badge className="bg-secondary font-semibold text-secondary-foreground">{getFormatPrice(product)}</Badge>
                </div>
            </div>
            <div className="space-y-3 p-3">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <div
                    className="line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: product.description || "" }}
                />
            </div>
        </Link>

    )
}


function getFormatPrice(product: products.Product) {

    const minPrice = product.priceRange?.minValue;
    const maxPrice = product.priceRange?.maxValue;

    if (minPrice && maxPrice && minPrice !== maxPrice) {
        return ` from ${formatCurrency(minPrice, product.priceData?.currency)}`;
    } else {
        return product.priceData?.formatted?.discountedPrice || product.priceData?.formatted?.price || "n/a";
    }
}