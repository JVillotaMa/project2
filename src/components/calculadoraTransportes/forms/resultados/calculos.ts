function costeCombustibleKm(precioPorLitro:number,consumoMedio:number){
    return precioPorLitro * (consumoMedio/100)
}

function costeMantenimientoKm(costeAnualMantenimiento:number,kmRecorridos:number){
    return costeAnualMantenimiento/kmRecorridos
}

function costeNeumaticosKm(costeCadaNeumatico:number,numeroNeumaticos:number,vidaUtil:number){
    return (costeCadaNeumatico * numeroNeumaticos)/vidaUtil
}

function costeConductorHora(salarioAnualConductor:number,horasAnualesConductor:number){
    return salarioAnualConductor/horasAnualesConductor
}

function costeSeguroHora(costeAnualSeguro:number,horasAnualesConductor:number){
    return costeAnualSeguro/horasAnualesConductor
}

function costeAmortizacionHora(costeAdquisicion:number,vidaUtil:number,horasAnualesConductor:number){
    return costeAdquisicion/(vidaUtil*horasAnualesConductor)    
}

// FORMULA TODAVIA NO VERFICADA POR LA GENTE DE MADRID
function costeFinanciacionHora(costeAdquisicion:number,TAE:number,plazoAnios:number,vidaUtil:number,horasAnualesConductor:number){
    const interesTotal = (costeAdquisicion * (TAE/100)) * plazoAnios
    return (interesTotal/plazoAnios) * (vidaUtil/horasAnualesConductor)
}

function costesPorServicio(costeUnitarioCombustible:number,costeUnitarioMantenimiento:number,costeUnitarioNeumaticos:number,costeUnitarioConductor:number,costeUnitarioSeguro:number,costeUnitarioAmortizacion:number,costeUnitarioFinanciacion:number,kmsTrayecto:number,kmsPosicionamiento:number,horasServicio:number,costeGeneral:number){
    const costeTotalCombustible = costeUnitarioCombustible * (kmsTrayecto + kmsPosicionamiento)
    const costeTotalMantenimiento = costeUnitarioMantenimiento * (kmsTrayecto + kmsPosicionamiento)
    const costeTotalNeumaticos = costeUnitarioNeumaticos * (kmsTrayecto + kmsPosicionamiento)
    const costeTotalConductor = costeUnitarioConductor * horasServicio
    const costeTotalSeguro = costeUnitarioSeguro * horasServicio
    const costeTotalAmortizacion = costeUnitarioAmortizacion * horasServicio
    const costeTotalFinanciacion = costeUnitarioFinanciacion * horasServicio
    const costesDirectos = costeTotalCombustible + costeTotalMantenimiento + costeTotalNeumaticos + costeTotalConductor + costeTotalSeguro + costeTotalAmortizacion + costeTotalFinanciacion 
    const costeTotal = costesDirectos / (1 - costeGeneral/100)
    return {
        costeTotalCombustible,
        costeTotalMantenimiento,
        costeTotalNeumaticos,
        costeTotalConductor,
        costeTotalSeguro,
        costeTotalAmortizacion,
        costeTotalFinanciacion,
        costeTotalServicio: costeTotal
    }
    // Por definir
}


export {
    costeCombustibleKm,
    costeMantenimientoKm,
    costeNeumaticosKm,
    costeConductorHora,
    costeSeguroHora,
    costeAmortizacionHora,
    costeFinanciacionHora,
    costesPorServicio
}

