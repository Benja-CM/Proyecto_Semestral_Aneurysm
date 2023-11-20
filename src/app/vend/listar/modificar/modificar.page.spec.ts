import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarPage } from './modificar.page';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ModificarPage', () => {
  let component: ModificarPage;
  let fixture: ComponentFixture<ModificarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler,
        {
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
        }, SQLite]
    })
    fixture = TestBed.createComponent(ModificarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
