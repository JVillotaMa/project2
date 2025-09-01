export default function ImageTitle() {
    
    return (
        <div className={`bg-[url(/truckBg.png)]  bg-no-repeat bg-cover h-[120px] w-full m-0`}>
            <div id="container" className="flex flex-row items-center  h-full  mx-10 gap-5">
                <div id="rectangle" className="h-20 w-7 bg-red "></div>
                <h1 className="text-white text-5xl font-semibold ">Calculadora de coste de mercancias</h1>
            </div>

        </div>
    );
}