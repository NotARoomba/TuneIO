import { AlbumOptionProps } from "../../utils/Types";

export default function AlbumOption({title, img}: AlbumOptionProps) {
    return <div className="flex bg-midnight_green h-8 gap-2">
        <img src={img} className="h-6 rounded-md" />
        <p className="text-2xl">{title}</p>
    </div>
}