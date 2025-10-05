function costeAnualAmortizacion(PrecioNetoCabezaTractora:number
                                ,PrecioNetoSemiRemolque:number
                                ,valoreResidualCabezaTractora:number //Porcentaje
                                ,valoreResidualSemiRemolque:number //Porcentaje
                                ,vidaUtilCabezaTractora:number
                                ,vidaUtilSemiRemolque:number){
    const amortizacionCabezaTractora = (PrecioNetoCabezaTractora * (1-valoreResidualCabezaTractora/100)) / vidaUtilCabezaTractora
    const amortizacionSemiRemolque = (PrecioNetoSemiRemolque * (1-valoreResidualSemiRemolque/100)) / vidaUtilSemiRemolque
    return amortizacionCabezaTractora + amortizacionSemiRemolque
}

function precioNeto(precioBruto:number,descuentoSobreTarifa:number){
    return precioBruto * (1 - descuentoSobreTarifa/100)
}

function costeAnualFinanciacion(Cuantia:number,TAE:number,plazoAnios:number){
    const interesTotal = (Cuantia * (TAE/100)) * plazoAnios
    return interesTotal/plazoAnios
}

function costeFijoPersonal(retribucionAnualConductor:number,seguridadSocial:number,plusDeAsistencia:number){
    return retribucionAnualConductor + (retribucionAnualConductor * seguridadSocial/100) + plusDeAsistencia
}

function costeFijoImpuestos(costeVisado:number,impuestoVTM:number,costeITV:number,impuestoIAE:number,costeRevTacografo:number){
    return costeVisado + impuestoVTM + costeITV + impuestoIAE + costeRevTacografo
}

function costeFijoSeguro(responsabilidadCivil:number,seguroMercancia:number,propiosObligatoriosTerceros:number){
    return responsabilidadCivil + seguroMercancia + propiosObligatoriosTerceros
}

function costeVariableCombustible(kilometrajeAnual:number,consumoMedio:number,precioBrutoCombustible:number,desuentoCombustible:number){
    return (kilometrajeAnual/100)*(consumoMedio)*(precioBrutoCombustible*(1-desuentoCombustible/100))
}

function costeVariableDietas(dietaMedia:number,numeroDias:number){
    return dietaMedia * numeroDias
}

function costeVariableNeumaticos(kilometrajeAnual:number,numeroNeumaticos:number,precioBrutoNeumaticos:number,desuentoNeumaticos:number,vidaUtilNeumaticos:number){
    return (kilometrajeAnual/vidaUtilNeumaticos) * numeroNeumaticos * (precioBrutoNeumaticos*(1-desuentoNeumaticos/100))
}

function costeVariableMantenimiento(kilometrajeAnual:number, costeAnualMantenimiento:number){
    return kilometrajeAnual * costeAnualMantenimiento
}

function costeVariablePeajes(serviciosAnuales:number, costeMedioPeaje:number, porcentajeServiciosNoPeaje:number){
    return serviciosAnuales * costeMedioPeaje * (1-porcentajeServiciosNoPeaje/100)
}

export {
    costeAnualAmortizacion,
    precioNeto,
    costeAnualFinanciacion,
    costeFijoPersonal,
    costeFijoImpuestos,
    costeFijoSeguro,
    costeVariableCombustible,
    costeVariableDietas,
    costeVariableNeumaticos,
    costeVariableMantenimiento,
    costeVariablePeajes
}
