export default function SectionTitle({ title }: { title: string }) {
    return (
        <div id="container" className="mb-3 sm:mb-5 flex flex-row items-center h-full gap-2 sm:gap-5">
                <div id="rectangle" className="h-8 sm:h-12 w-3 sm:w-5 bg-red"></div>
                <h1 className="text-black text-xl sm:text-2xl md:text-xl lg:text-2xl font-semibold">{title}</h1>
            </div>
    );
}