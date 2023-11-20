import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';
import { GooglemapsService } from './googlemaps.service';
import { ModalController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { DbserviceService } from 'src/app/services/dbservice.service';
import { NavigationExtras, Router } from '@angular/router';
const { Geolocation } = Plugins;


declare var google: any;


@Component({
      selector: 'google-maps',
      templateUrl: './googlemaps.component.html',
      styleUrls: ['./googlemaps.component.scss']
})
export class GooglemapsComponent implements OnInit {


      // coordenadas cuenca
      @Input() position = {
            lat: -33.43918622926139,
            lng: -70.66845464893467
      };

      label: any = {
            titulo: 'Ubicación',
            subtitulo: 'Mi ubicación de envío'
      }

      map: any;
      marker: any;
      infowindow: any;
      positionSet: any

      @ViewChild('map') divMap!: ElementRef;


      constructor(private renderer: Renderer2,
            @Inject(DOCUMENT) private document: any,
            private googlemapsService: GooglemapsService,
            public modalController: ModalController,
            private router: Router,
            private db: DbserviceService,
            ) { }

      ngOnInit(): void {
            this.init();

            console.log('position ->', this.position)
      }

      async init() {

            this.googlemapsService.init(this.renderer, this.document).then(() => {
                  this.initMap();
            }).catch((err) => {
                  console.log(err);
            });

      }




      initMap() {

            const position = this.position;

            let latLng = new google.maps.LatLng(position.lat, position.lng);

            let mapOptions = {
                  center: latLng,
                  zoom: 15,
                  disableDefaultUI: true,
                  clickableIcons: false,
            };

            this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
            this.marker = new google.maps.Marker({
                  map: this.map,
                  animation: google.maps.Animation.DROP,
                  draggable: false,
            });
            this.clickHandleEvent();
            this.infowindow = new google.maps.InfoWindow();
            this.addMarker(position);
            this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);

      }

      clickHandleEvent() {

            this.map.addListener('click', (event: any) => {
                  const position = {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng(),
                  };
                  this.addMarker(position);
                  this.infowindow.open();
            });

      }



      addMarker(position: any): void {

            let latLng = new google.maps.LatLng(position.lat, position.lng);

            this.marker.setPosition(latLng);
            this.map.panTo(position);
            this.positionSet = position;

      }


      setInfoWindow(marker: any, titulo: string, subtitulo: string) {

            const contentString = '<div id="contentInsideMap">' +
                  '<div>' +
                  '</div>' +
                  '<p style="font-weight: bold; margin-bottom: 5px;">' + titulo + '</p>' +
                  '<div id="bodyContent">' +
                  '<p class"normal m-0">'
                  + subtitulo + '</p>' +
                  '</div>' +
                  '</div>';
            this.infowindow.setContent(contentString);
            this.infowindow.open(this.map, marker);

      }

      async mylocation() {

            console.log('mylocation() click')

            Geolocation['getCurrentPosition']({ enableHighAccuracy: true }).then((res: any) => {

                  console.log('mylocation() -> get ', res.coords.latitude, ' ', res.coords.longitude);

                  const position = {
                        lat: res.coords.latitude,
                        lng: res.coords.longitude,
                  }

                  this.addMarker(position);
            });

      }

      async aceptar() {
            let userID = localStorage.getItem('usuario');

            console.log('click aceptar -> ', this.positionSet.lat, ' ', this.positionSet.lng);
            this.modalController.dismiss({ pos: this.positionSet })

            const dir = await this.googlemapsService.reverseGeoCoding(this.positionSet.lat, this.positionSet.lng);

            let navigationExtras: NavigationExtras = {
                  state: {
                        calle: dir.street_name,
                        numero: dir.street_number,
                        cod_postal: dir.postal_code,
                        region: dir.region,
                        comuna: dir.comuna
                  }
            }

            this.router.navigate(['/user'], navigationExtras)
      }

}