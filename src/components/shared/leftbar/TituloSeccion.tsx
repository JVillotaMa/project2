export default function TituloSeccion({titulo}: {titulo: string}) {
    return (
        <>
            <h1 className="font-bold text-xl sm:text-[1.5rem] md:text-xl lg:text-[1.5rem] text-gray-600 mb-2 sm:mb-4">{titulo}</h1>
        </>
    );
}