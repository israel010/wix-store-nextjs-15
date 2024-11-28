
import WixImage from "@/components/WixImage"
import { cn } from "@/lib/utils";
import { products } from "@wix/stores"
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react"
import Zoom from "react-medium-image-zoom"

interface ProductMediaProps {
    media: products.MediaItem[] | undefined
}
export default function ProductMedia({ media }: ProductMediaProps) {
    const [selectedMedia, setSelectedMedia] = useState(media?.[0]);


    useEffect(() => {
        setSelectedMedia(media?.[0]);
    }, [media]);

    if (!media?.length) return null;

    const selectedImage = selectedMedia?.image;
    const selectedVideo = selectedMedia?.video?.files?.[0];
    return (
        <div className='basis-2/5 md:sticky md:top-10 h-fit space-y-5'>
            <div className="aspect-square bg-secondary">
                {selectedImage?.url ? (
                    <Zoom key={selectedImage.url}>

                        <WixImage
                            mediaIdentifier={selectedImage?.url}
                            alt={selectedImage?.altText}
                            width={1000}
                            height={1000}
                        />
                    </Zoom>
                ) : selectedVideo?.url ? (
                    <div className="flex items-center bg-black">
                        <video
                            className="size-full"
                        >
                            <source src={selectedVideo?.url}
                                type={`video/${selectedVideo.format}`}
                            />

                        </video>
                    </div>

                ) : null
                }

            </div>

            {
                media?.length > 1 && (
                    <div className="flex gap-2 flex-wrap">

                        {
                            media?.map((item) => (
                                <MediaPreview key={item._id} media={item}
                                    isSelected={item._id === selectedMedia?._id}
                                    onSelect={() => setSelectedMedia(item)}
                                />
                            ))}

                    </div>
                )}
        </div>
    )

}


interface MediaPreviewProps {
    media: products.MediaItem
    isSelected: boolean;
    onSelect: () => void
}



function MediaPreview({ media, isSelected, onSelect }: MediaPreviewProps) {

    const imageUrl = media?.image?.url;
    const stillFrameMediaId = media?.video?.stillFrameMediaId;
    const thumbnailUrl = media?.thumbnail?.url;
    const resolvedThumbnailUrl = stillFrameMediaId && thumbnailUrl ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId : undefined;


    if (!imageUrl && !resolvedThumbnailUrl) return null;

    return <div className={cn("", isSelected && "outline outline-2 oitline-primary")} >

        <WixImage
            mediaIdentifier={imageUrl || resolvedThumbnailUrl}
            alt={media.image?.altText || media.video?.files?.[0]?.altText}
            width={100}
            height={100}
            onMouseEnter={onSelect}
        />
        {resolvedThumbnailUrl && (
            <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40">
                <PlayIcon className="size-5 text-white/60" />
            </span>
        )}
    </div>

}