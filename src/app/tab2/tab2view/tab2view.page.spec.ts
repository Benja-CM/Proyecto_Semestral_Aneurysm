import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tab2viewPage } from './tab2view.page';
import { ActivatedRoute } from '@angular/router';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CommonModule, CurrencyPipe } from '@angular/common';

describe('Tab2viewPage', () => {
  let component: Tab2viewPage;
  let fixture: ComponentFixture<Tab2viewPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [Tab2viewPage],
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
      }, {
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
    }).compileComponents();
    
    fixture = TestBed.createComponent(Tab2viewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
