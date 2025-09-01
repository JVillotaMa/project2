export default function ShowInformation({ index, title, value }: { index: number | null, title: string, value: number | null }) {
    return (
        <div className="flex flex-row gap-3 w-[50%]">
            <div className="block w-100">
                <span className="font-bold">{title}</span>
            </div>
            <div className="">
                <span>{index !== null ? value : ""}</span>
            </div>
            
        </div>
    )
}