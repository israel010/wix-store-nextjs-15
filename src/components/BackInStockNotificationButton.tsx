import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";
import { requiredString } from "@/lib/validation";
import { products } from "@wix/stores"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { env } from "@/env";

const formSchema = z.object({
    email: requiredString.email(),

})
type FormValues = z.infer<typeof formSchema>

interface BackInStockNotificationsProps {
    product: products.Product,
    selectedOptions: Record<string, string>

}

export default function BackInStockNotifications({ product, selectedOptions, ...props }: BackInStockNotificationsProps) {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        }
    })
    const mutation = useCreateBackInStockNotificationRequest();

    async function onSubmit({ email }: FormValues) {
        mutation.mutate({
            email,
            itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
            product,
            selectedOptions,
        });
    }

    return <Dialog>
        <DialogTrigger asChild>
            <Button  {...props}>Notify when available</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Notify when available</DialogTitle>
                <DialogDescription>
                    Enter your email address and we&apos;ll let you know when this
                    product is back in stock.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <LoadingButton type="submit" loading={mutation.isPending}>
                        Notify me
                    </LoadingButton>
                </form>
            </Form>
            {mutation.isSuccess && (
                <div className="py-2.5 text-green-500">
                    Thank you! We&apos;ll notify you when this product is back in stock.
                </div>
            )}
        </DialogContent>

    </Dialog>
}
