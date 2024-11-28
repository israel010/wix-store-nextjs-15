import { products } from "@wix/stores"
import { Button, ButtonProps } from "./ui/button"
import { addToCart } from "@/wix-api/cart"
import { wixBrowserClient } from '../lib/wix-client.browser';
import LoadingButton from "./LoadingButton";
import { useAddItemCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

interface AddttoCartButtonProps extends ButtonProps {
    product: products.Product,
    selectedOptions: Record<string, string>
    quantity: number
}
export default function AddttoCartButton({ product, selectedOptions, quantity, className, ...props }: AddttoCartButtonProps) {

    const mutation = useAddItemCart()
    return (
        <LoadingButton



            onClick={() =>
                mutation.mutate({ product, selectedOptions, quantity })}
            {...props}
            className={cn("flex  gap-2", className)}
            loading={mutation.isPending}
        >
            <ShoppingCartIcon />
            Add to Cart
        </LoadingButton>
    )
}
