'use client'
import { useState } from 'react';

export default function NavigationLeftBarContainer({children}: {children: React.ReactNode}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <>
            {/* Mobile menu toggle button - only visible on small screens */}
            <button 
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-red text-white rounded-md border-1 border-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? 'Cerrar' : 'Menú'}
            </button>
            
            {/* Navigation sidebar - hidden on mobile when closed */}
            <div className={`${isMenuOpen ? 'fixed left-0 top-0 h-full z-40' : 'hidden'} md:block w-full md:w-72 lg:w-80 bg-gray-200 p-3 md:p-5 md:ml-0 overflow-y-auto md:relative`}>
                <div className="pt-12 md:pt-0">
                    {children}
                </div>
            </div>
        </>
    )
}