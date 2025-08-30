import Navbar from "../shared/Navbar";
import BigCard from "./components/BigCard";


export default  function Landing() {
  
  
  return(
    <>
        <Navbar />
        <div id="container" className="flex flex-row px-10" >
          <BigCard 
            title="Calculadora de transporte"
            imageSrc="/busLanding.png" 
            imageAlt="busLanding"
            imageHeight={675}
            imageWidth={1200}
            toRedirect="/calculadoraTransporte"
            firstParagraph="La Dirección General de Transportes y Movilidad dota a las empresas del sector de una herramienta que les permita, de una manera rápida y sencilla, conocer tanto los costes unitarios por vehículo como los costes totales de los servicios que realicen o se planteen realizar. "
            secondParagraph="En esta versión se recogen los datos obtenidos en la DECIMOSEXTA ACTUALIZACIÓN del Observatorio de Costes del Transporte de Mercancías por Carretera en la Comunidad de Madrid."
            buttonText="Acceder a la calculadora de transporte"
            />
          <BigCard 
            title="Calculadora de mercancías"
            imageSrc="/truckLanding.png" 
            imageAlt="truckLanding"
            imageHeight={675}
            imageWidth={1200}
            firstParagraph="La Dirección General de Transportes pone a disposición de las empresas del sector la aplicación informática que sirve de herramienta de ayuda a los empresarios para calcular tanto los costes unitarios por vehículo como por servicios o trayectos concretos, según el tipo de vehículo utilizado para su realización. "
            secondParagraph="En esta versión se recogen los datos obtenidos en la DUODÉCIMA ACTUALIZACIÓN del Observatorio de Costes del Transporte Discrecional de Viajeros en Autobús en la Comunidad de Madrid. "
            toRedirect="/calculadoraMercancias"
            buttonText="Acceder a la calculadora de mercancías"
          />

        </div>
    </>
  )
}   