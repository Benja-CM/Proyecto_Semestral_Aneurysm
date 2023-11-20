import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPage } from './agregar.page';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AgregarPage', () => {
  let component: AgregarPage;
  let fixture: ComponentFixture<AgregarPage>;

  const activatedRouteMock = {
    queryParams: of({ 
      id: 1,
      nombre: 'Noita',
      descripcion: 'Descripcion generica',
      precio: 1000,
      stock: 30,
      req_minimo: 'N/A',
      req_recomendado: 'N/A',
      foto: 'Fotogenerica.jpg'
    }),
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, {
        provide: SQLite,
        useValue: {
          queryParams: of({
            id: 1,
            nombre: 'Noita',
            descripcion: 'Descripcion generica',
            precio: 1000,
            stock: 30,
            req_minimo: 'N/A',
            req_recomendado: 'N/A',
            foto: 'Fotogenerica.jpg'
          }),
        },
      },

      {provide: ActivatedRoute, useValue: activatedRouteMock},]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
