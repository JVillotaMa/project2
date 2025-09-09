'use client'
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormStepNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isNextDisabled?: boolean;
  className?: string;
}

export default function FormStepNavigation({
  onPrevious,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  isNextDisabled = false,
  className = ""
}: FormStepNavigationProps) {
  return (
    <div className={`flex justify-between mt-6 ${className}`}>
      {!isFirstStep ? (
        <Button
          variant="outline"
          className="hover:cursor-pointer flex items-center gap-1 text-sm sm:text-base border-gray-300 hover:bg-gray-100"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
      ) : (
        <div></div>
      )}
      
      {!isLastStep && (
        <Button
          variant="outline"
          className={`hover:cursor-pointer flex items-center gap-1 text-sm sm:text-base ${isNextDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'}`}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          Siguiente <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
