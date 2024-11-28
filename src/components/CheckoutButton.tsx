import { ButtonProps } from '@/components/ui/button';
import { usecartCheckout } from '@/hooks/checkout';
import LoadingButton from './LoadingButton';


export default function CheckoutButton(props: ButtonProps) {
    const { startCheckoutFlow, pending } = usecartCheckout()
    return (
        <LoadingButton onClick={startCheckoutFlow} loading={pending} {...props}>
            Checkout
        </LoadingButton>
    )
}