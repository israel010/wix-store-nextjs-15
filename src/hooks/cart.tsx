import { wixBrowserClient } from "@/lib/wix-client.browser";
import getCart, { addToCart, AddToCartValues, clearCart, removeCartItem, updateCartItemQuantity, UpdateCartItemQuantityValues } from "@/wix-api/cart";
import { MutationKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { useToast } from "./use-toast";

const queryKey = ["cart"];

export function useCart(initialData: currentCart.Cart | null) {

    return useQuery({
        queryKey,
        queryFn: () => getCart(wixBrowserClient),
        initialData

    })

}

export function useAddItemCart() {

    const queryClient = useQueryClient();

    const { toast } = useToast()

    return useMutation({
        mutationFn: (values: AddToCartValues) => addToCart(wixBrowserClient, values),
        onSuccess: (data) => {
            toast({ description: "Item added to cart" })
            queryClient.cancelQueries({ queryKey })
            queryClient.setQueryData(queryKey, data.cart)
        },
        onError: (error) => {
            toast({ description: "Error adding item to cart", variant: "destructive" })
        }
    })
}
export function useUpdateCartItemQuantity() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    const mutationKey: MutationKey = ["updateCartItemQuantity"];

    return useMutation({
        mutationKey,
        mutationFn: (values: UpdateCartItemQuantityValues) =>
            updateCartItemQuantity(wixBrowserClient, values),
        onMutate: async ({ productId, newQuantity }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousState =
                queryClient.getQueryData<currentCart.Cart>(queryKey);

            queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
                ...oldData,
                lineItems: oldData?.lineItems?.map((lineItem) =>
                    lineItem._id === productId
                        ? { ...lineItem, quantity: newQuantity }
                        : lineItem,
                ),
            }));

            return { previousState };
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState);
            console.error(error);
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again.",
            });
        },
        onSettled() {
            if (queryClient.isMutating({ mutationKey }) === 1) {
                queryClient.invalidateQueries({ queryKey });
            }
        },
    });
}

export function useRemoveCartItem() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: (productId: string) =>
            removeCartItem(wixBrowserClient, productId),
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey });

            const previousState =
                queryClient.getQueryData<currentCart.Cart>(queryKey);

            queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
                ...oldData,
                lineItems: oldData?.lineItems?.filter(
                    (lineItem) => lineItem._id !== productId,
                ),
            }));

            return { previousState };
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState);
            console.error(error);
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again.",
            });
        },
        onSettled() {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

export function useClearCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => clearCart(wixBrowserClient),
        onSuccess() {
            queryClient.setQueryData(queryKey, null);
            queryClient.invalidateQueries({ queryKey });
        },
        retry: 3,
    });
}
