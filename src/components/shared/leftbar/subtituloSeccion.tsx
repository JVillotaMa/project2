export default function TituloSeccion({titulo}: {titulo: string}) {
    return (
        <>
            <h1 className="font-bold text-[1.1rem] text-gray-600 ">{titulo}</h1>
        </>
    );
}