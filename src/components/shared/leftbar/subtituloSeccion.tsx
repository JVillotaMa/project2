export default function TituloSeccion({titulo}: {titulo: string}) {
    return (
        <>
            <h1 className="font-bold text-base sm:text-[1.1rem] md:text-base lg:text-[1.1rem] text-gray-600 mt-2 sm:mt-3">{titulo}</h1>
        </>
    );
}