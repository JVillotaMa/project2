export default function sectionContainer({ subSectionTitle,children }: { subSectionTitle:string,children: React.ReactNode }) {
    return (
        <div className="flex flex-col bg-white border-2 border-gray-300 shadow-md rounded-lg w-full max-w-5xl mx-auto">
            <div className="flex items-center p-3 sm:p-5 bg-gray-200 min-h-8 rounded-t-lg">
                <h2 className="font-bold text-base sm:text-lg">{subSectionTitle}</h2>
            </div>
            {children}
        </div>
    );
}