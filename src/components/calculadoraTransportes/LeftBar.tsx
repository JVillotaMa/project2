import TituloSeccion from "../shared/leftbar/TituloSeccion";

export default function LeftBar() {
    return (
        <>
            <div className="bg-leftbar-gray flex w-fit px-4 py-5 mx-7 my-10">
                <div id="container" className="flex flex-col">
                    <h1 className="font-bold text-[1.2rem] text-gray-600">Secciones</h1>
                    <TituloSeccion titulo="Costes fijos" />
                    <TituloSeccion titulo="Costes variables" />
                </div>
            </div>
        </>
    );
}