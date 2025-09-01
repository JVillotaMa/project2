export default function TituloSeccion({titulo}: {titulo: string}) {
    return (
        <>
            <h1 className="font-bold text-[1.5rem] text-gray-600 mb-4">{titulo}</h1>
        </>
    );
}