import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestClavePage } from './rest-clave.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('RestClavePage', () => {
  let component: RestClavePage;
  let fixture: ComponentFixture<RestClavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [SQLite, {
        provide: ActivatedRoute,
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
      },]
    })
    fixture = TestBed.createComponent(RestClavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
