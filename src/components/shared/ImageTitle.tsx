export default function ImageTitle({ title, imageSrc }: { title: string; imageSrc: string }) {
    const style = `bg-[url(${imageSrc})]  bg-no-repeat bg-cover h-[120px] w-full m-0`
    return (
        <div className={style}>
            <div id="container" className="flex flex-row items-center  h-full  mx-10 gap-5">
                <div id="rectangle" className="h-20 w-7 bg-red "></div>
                <h1 className="text-white text-5xl font-semibold ">{title}</h1>
            </div>

        </div>
    );
}