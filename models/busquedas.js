// importacioens de node siempre van de primero
const fs = require('fs');


// importamos axios
const axios = require('axios');


class Busquedas {
     historial = []; //'Tegucigalpa', 'Madrid','Saan Jose'
     dbPath = './db/database.json';

    constructor(){
        // TODO: leer db si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            //unimos
            return palabras.join(' ')
            //hol
        })
    }

    get paramsMapbox(){
        return {
            "access_token":process.env.MAPBOX_KEY || '',
            "limit":10,
            "language":"es"
        }
    }

    get paramsWeather(){
        return {
            "appid":process.env.OPENWEATHER_KEY || '',
            "units":"metric",
            "lang":"es",
        }
    }



    // Metodo Buscar Ciudad
    async ciudad(lugar = ''){   
        try {
            
            // Peticiones http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();

            //console.log("ciudad de:"+lugar)

            // Solicitando peticion a ruta
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/caracas.json?access_token=pk.eyJ1Ijoia2Rldmx1aXMiLCJhIjoiY2tzZ3p6eHphMXBqdjJwcDM5a3hvb2o1aiJ9.LxiN-yLqO6AUHTXZmoHfUg&language=es');

           // console.log(resp.data.features);

          // return resp.data.features
            return resp.data.features.map(lugar => ({
                id:lugar.id,
                name:lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

  
        }catch(error){
            return [];
        }
       
    }

    async climaLugar (lat, lon) {
        try {
        
            // instance axionx.create()
             const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                // Destructurin de objeto
                params: { ...this.paramsWeather, lat, lon }
            })

            const resp = await instance.get();
           
            // respuesta
            const {weather, main} = resp.data;
           
            return {
                desc:weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp
            }

        } catch (error) {
            console.log(error)
        }
    }

    // Agregar el historial
    agregarHistorial(lugar = ''){

        //TODO prevenir duplicados
       if(this.historial.includes(lugar.toLocaleLowerCase()))
        {
            return ; // retornamos nada
        }
        // cortando el historial
        this.historial = this.historial.splice(0,5);

        // Añadiendo al principio del arreglo
        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar en db
        this.GuardarDB();

    }

    // Guardados

    GuardarDB(){

        // data
        const payload = {
            historial: this.historial
        };


        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB(){

        // verificar existencia
        if( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });

        //desesrealizar de string a objeto
        const data = JSON.parse( info );

        this.historial = data.historial;
     
    }

}

module.exports = Busquedas;