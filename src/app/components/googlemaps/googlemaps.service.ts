import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
/* import { Script } from 'vm'; */

declare var google: any;

declare global {
  interface Window {
    mapInit: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  //key
  apiKey = 'AIzaSyByTN8fNZ33dvyDjdVmG7taYEQkLJndgCc';
  mapsLoaded = false;

  constructor() { }

  init(renderer: any, document: any): Promise<any> {

    return new Promise((resolve) => {
      if (this.mapsLoaded) {
        console.log('google is preview loaded')
        resolve(true);
        return;
      }

      const script = renderer.createElement('script');
      script.id = 'googleMaps';

      window.mapInit = () => {
        this.mapsLoaded = true;
        if (google) {
          console.log('google is loaded')
        } else {
          console.log('google is not Defined')
        }
        resolve(true);
        return;
      }

      if (this.apiKey) {
        // 0% seguro que esta direccion sea la correcta
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'https://maps.googleapis.com/maps/api/js?&callback=mapInit'
      }

      renderer.appendChild(document.body, script);

    })
  }

  async reverseGeoCoding(lat: any, lgn: any): Promise<any> {
    try {
      const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lgn + '&key=' + this.apiKey;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const address_formatted = data.results[0].formatted_address;
        const address_components = data.results[0].address_components;
        const street_number = address_components.find((component: { types: string | string[]; }) => component.types.includes('street_number'))?.long_name;
        const street_name = address_components.find((component: { types: string | string[]; }) => component.types.includes('route'))?.long_name;
        const city = address_components.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_2'))?.long_name;
        const postal_code = address_components.find((component: { types: string | string[]; }) => component.types.includes('postal_code'))?.long_name;
        const region = address_components.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_1'))?.long_name;

        const comuna = address_components.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_3'))?.long_name;

        const address = {
          street_number,
          street_name,
          postal_code,
          region,
          comuna
        };

        console.log("calle -> " + street_name);
        console.log("numero -> " + street_number);
        console.log("ciudad -> " + city);
        console.log("codigo postal -> " + postal_code);
        console.log("region -> " + region);
        console.log("comuna -> " + comuna);

        console.log(address);
        console.log(address_formatted);
        return address;
      } else {
        throw new Error('Error en el servicio de geocodificación inversa.');
      }
    } catch (error) {
      console.log('Error obteniendo la dirección: ', error);
    }
  }
}
