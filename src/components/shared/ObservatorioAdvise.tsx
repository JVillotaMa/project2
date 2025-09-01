import { ArrowLeftToLine } from "lucide-react";

export default function ObservatorioAdvise() {
    return (
        <div className="block border-2 border-black  shadow-lg rounded-lg p-6 m-4 max-w-4xl ">
            <div className="flex flex-row items-center justify-center ">
                <span className="text-center font-semibold">
                    Pulsa el icono
                    <ArrowLeftToLine className="mx-2 align-middle inline" />
                    si quieres utilizar los datos del observatorio (media del sector) para algún campo que no dispongas
                </span>
            </div>
        </div>
    );
}