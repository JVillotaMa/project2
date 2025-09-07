export default function ImageTitle() {
    
    return (
        <div className={`bg-[url(/truckBg.png)] bg-no-repeat bg-cover h-[90px] sm:h-[120px] w-full m-0`}>
            <div id="container" className="flex flex-row items-center h-full mx-3 sm:mx-10 gap-2 sm:gap-5">
                <div id="rectangle" className="h-12 sm:h-20 w-3 sm:w-7 bg-red"></div>
                <h1 className="text-white text-xl sm:text-3xl md:text-5xl font-semibold">Calculadora de coste de mercancias</h1>
            </div>
        </div>
    );
}