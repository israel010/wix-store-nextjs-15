import { useToast } from "./use-toast";
import { useMutation } from "@tanstack/react-query";
import { updateMemberInfo, UpdateMemberInfoValues } from "@/wix-api/members";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { useRouter } from "next/navigation";

export function useUpdateMember() {

    const { toast } = useToast()

    const router = useRouter()
    return useMutation({
        mutationFn: (variables: UpdateMemberInfoValues) =>
            updateMemberInfo(wixBrowserClient, variables),
        onSuccess() {
            toast({
                description: "Profile updated successfully"
            })
            setTimeout(() => {

                router.refresh()
            }, 2000)

        },
        onError() {
            toast({
                description: "Error updating profile",
                variant: "destructive"
            })
        }

    })
}
