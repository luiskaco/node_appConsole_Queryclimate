// mportamos paquete de variable de tornor
require('dotenv').config()  // confguracion por default

// importamos las configuracions de menu
const { leerInput , inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
// importamos clases de busquedas
const Busquedas = require("./models/busquedas");


// console.log(process.env) // para cocomprobar las variables de entornos

const main = async() => {
    
    let opt;
    // conste de instancia de objeto
    const busquedas = new Busquedas();
    
    
    do {

    // imprimiendo menu
    opt = await inquirerMenu();
    console.log({opt});

    // Switch para las opcioens

    switch(opt){
        case 1: 
            // Mostrar Mensaje
            const termino = await leerInput('Ciudad; ');
;                // console.log(lugar)

            // Buscar los Lugares

                  // Busqueda en el api
                  const lugares = await busquedas.ciudad(termino);
                  // console.log(lugares);
 
               
          

            // Selecionar el lugar
                   //Armando las preguntas
                   const id = await listarLugares(lugares);

                        // Valudando si la selecion es 0
                        if(id=== '0') continue; // Sigue la siguiente interacion

                
                   // Obteniendo el lugar selecionado
                   const lugarSel = lugares.find(l => l.id ===id);
                //    console.log(lugarSel);


                  //Guardando en DB el lugar selecionad
                  busquedas.agregarHistorial(lugarSel.name);


            // Clima
                const clima =await busquedas.climaLugar(lugarSel.lat,lugarSel.lng );
                //Destructurin
                const {min, max, desc,temp} = clima;

            // Mostrar Resultados
            console.log('\nInformación de la Ciudad\n'.green);
            console.log('Ciudad:', lugarSel.name.green);
            console.log('Lat:', lugarSel.lat );
            console.log('Lng:', lugarSel.lng);
            console.log('Temperatura:', temp);
            console.log('Max', max);
            console.log('Min', min);
            console.log('El clima actual: ', desc.green);
        break;
        case 2:

            busquedas.historialCapitalizado.forEach((lugar, i )=> {
                idx =`${ i + 1 }.`.green;
                console.log(`${idx} ${lugar}`);
            })
    
        break;
    }


    // Deteniendo la informacion
    if(opt !== 0) await pausa();
  
    }while( opt !== 0);
}


main();