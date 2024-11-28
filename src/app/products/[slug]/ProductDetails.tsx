"use client";
import { products } from '@wix/stores';
import Badge from '@/components/ui/badge';
import ProductOptions from './ProductOptions';
import { useState } from 'react';
import { checkInStock, findVariant } from '@/lib/utils';
import ProductPrice from './ProductPrice';
import ProductMedia from './ProductMedia';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InfoIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AddttoCartButton from '@/components/AddttoCartButton';
import BackInStockNotifications from '@/components/BackInStockNotificationButton';
import BuyNowButton from '@/components/BuyNowButton';

interface ProductDetailsProps {

    product: products.Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {

    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(



        product.productOptions
            ?.map((option) => ({
                [option.name || ""]: option.choices?.[0]?.description || ""
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {}

    );
    const variants = findVariant(product, selectedOptions);

    const inStock = checkInStock(product, selectedOptions)

    const availableQuantity = variants?.stock?.quantity ?? product.stock?.quantity

    const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
        const selectedChoice = option.choices?.find(
            (choice) => choice.description === selectedOptions[option.name || ""],
        );
        return selectedChoice?.media?.items ?? [];
    });

    const availableQuantityExceeded = !!availableQuantity && quantity > availableQuantity
    return (
        <div className='flex flex-col gap-10 md:flex-row lg:gap-20'>

            <ProductMedia media={!!selectedOptionsMedia?.length ?
                selectedOptionsMedia : product.media?.items
            } />

            <div className='basis-3/5 space-y-5'>
                <div className='space-y-2.5'>
                    <h1 className='text-3xl font-bold lg:text-4xl'>{product.name}</h1>
                    {product.brand && (
                        <div className='text-gray-600'>
                            {product.brand}
                        </div>
                    )}
                    {
                        product.ribbon && <Badge className='block'>{product.ribbon}</Badge>
                    }
                </div>

                {
                    product.description && (

                        <div
                            className='prose dark:prose-invert'

                            dangerouslySetInnerHTML={
                                { __html: product.description }
                            }
                        />
                    )}
                <ProductPrice product={product} selectedVariant={variants} />
                <ProductOptions selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} product={product} />

                <div className='space-y-1.5'>

                    <Label htmlFor='quantity'>Quantiy</Label>
                    <div className="flex items-center gap-2.5">
                        <Input

                            name='quantity'
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className='w-24'
                            disabled={!inStock}
                        />
                        {!!availableQuantity &&
                            (availableQuantityExceeded || availableQuantity < 10) && (
                                <span className="text-destructive">
                                    Only {availableQuantity} left in stock
                                </span>
                            )}

                    </div>
                </div>
                {
                    inStock ? (

                        <div className='flex items-center gap-2.5'>


                            <AddttoCartButton
                                product={product}
                                selectedOptions={selectedOptions}
                                quantity={quantity}
                                disabled={availableQuantityExceeded || quantity < 1}
                                className='w-full lg:w-auto'
                            />
                            <BuyNowButton
                                product={product}
                                quantity={quantity}
                                selectedOptions={selectedOptions}
                                disabled={availableQuantityExceeded || quantity < 1}
                            />
                        </div>
                    ) : (<BackInStockNotifications product={product}
                        selectedOptions={selectedOptions}
                    />)
                }
                {!!product.additionalInfoSections?.length && (
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <InfoIcon className="size-5" />
                            <span>Additional product information</span>
                        </span>
                        <Accordion type="multiple">
                            {product.additionalInfoSections.map((section) => (
                                <AccordionItem value={section.title || ""} key={section.title}>
                                    <AccordionTrigger>{section.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: section.description || "",
                                            }}
                                            className="prose text-sm text-muted-foreground dark:prose-invert"
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </div>
        </div>
    )
}
