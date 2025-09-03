export default function ShowInformation({ 
    index, 
    title, 
    value, 
    error 
}: { 
    index: number | null, 
    title: string, 
    value: number | null,
    error?: string
}) {
    // Format display value with better handling of different types
    const displayValue = () => {
        // Handle null or undefined
        if (value === null || value === undefined) {
            return "No disponible";
        }
        
        // Format numbers appropriately
        if (typeof value === 'number') {
            // Format decimal numbers nicely, but don't add unnecessary decimal places
            if (Number.isInteger(value)) {
                return value.toLocaleString('es-ES'); // Format with thousands separator
            } else {
                return value.toLocaleString('es-ES', { 
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2
                });
            }
        }
        
        // For any other type, convert to string safely
        return String(value);
    };
    
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between gap-3 w-full p-2 hover:bg-gray-100 rounded">
                <div className="block">
                    <span className="font-bold text-gray-700">{title}</span>
                </div>
                <div className="block">
                    <span className={error ? "text-red-500 font-medium" : "font-medium text-blue-600"}>
                        {displayValue()}
                    </span>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}
