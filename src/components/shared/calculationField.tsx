

interface CalculationFieldProps {
    label: string;
    value:number | undefined;
}

export default function CalculationField({ label, value=0 }: CalculationFieldProps) {

    return (
        <div className="flex flex-col gap-1 ">
            <div className="flex justify-between gap-10 align-middle items-center">
                <span className="font-semibold">{label}</span>
                <div className="flex flex-row gap-2 items-center">
                    <span>{value.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}