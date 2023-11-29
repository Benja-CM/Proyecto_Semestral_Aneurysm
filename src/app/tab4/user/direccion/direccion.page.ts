import { Component, OnInit } from '@angular/core';
import { GoogleMap, Marker, Polyline } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation'

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.page.html',
  styleUrls: ['./direccion.page.scss'],
})
export class DireccionPage implements OnInit {

  apiKey = 'AIzaSyDJTdmms9SBC4FoA-p-SzALWmeUReSf4IY'; 

  mapRef: HTMLElement | null = null;

  latitud: number = 0;
  longitud: number = 0;

  latiDuoc: number = -33.36329660178706;
  longiDuoc: number = -70.75316140662984;

  constructor() { }

  ngOnInit() {
  }

  async inicializarMapa() {
    const apiKey = 'AIzaSyDJTdmms9SBC4FoA-p-SzALWmeUReSf4IY'; // Reemplaza con tu propia clave de API

    const ubicacionUser = { lat: this.latitud, lng: this.longitud };
    const ubicacionDestino = { lat: this.latiDuoc, lng: this.longiDuoc }

    if (this.mapRef) {
      const newMap = GoogleMap.create({
        id: 'my-map',
        element: this.mapRef,
        apiKey: apiKey,
        config: {
          center: {
            lat: this.latitud,
            lng: this.longitud,
          },
          zoom: 10,
        },
      });

      const linea: Polyline[] = [{ path: [{ lat: this.latitud, lng: this.longitud }, { lat: this.latiDuoc, lng: this.longiDuoc }], strokeColor: '#55aa58', strokeWeight: 5, geodesic: true }];
      const marker: Marker = { coordinate: { lat: this.latiDuoc, lng: this.longiDuoc }, title: 'Tienda', snippet: "Sede de Ivan's" };
      (await newMap).addMarker(marker);
      (await newMap).addPolylines(linea);
    }
  }

  async ngAfterViewInit() {

    await this.getUbicacion();

    // Accedemos al elemento del mapa una vez que la vista se ha inicializado
    this.mapRef = document.getElementById('map');
    if (this.mapRef) {
      this.inicializarMapa();
    } else {
      console.error('Elemento del mapa no encontrado');
    }
  }

  async getUbicacion() {
    const coordinates = await Geolocation.getCurrentPosition();

    this.latitud = coordinates.coords.latitude;
    this.longitud = coordinates.coords.longitude;

  }

}
