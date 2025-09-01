export default function SectionTitle({ title }: { title: string }) {
    return (
        <div id="container" className="mb-5 flex flex-row items-center  h-full gap-5">
                <div id="rectangle" className="h-12 w-5 bg-red "></div>
                <h1 className="text-black text-2xl font-semibold ">{title}</h1>
            </div>
    );
}