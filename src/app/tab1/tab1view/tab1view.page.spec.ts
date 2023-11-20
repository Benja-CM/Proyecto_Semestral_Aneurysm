import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tab1viewPage } from './tab1view.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('Tab1viewPage', () => {
  let component: Tab1viewPage;
  let fixture: ComponentFixture<Tab1viewPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [Tab1viewPage],
      providers: [HttpClient, HttpHandler, SQLite, {
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({
            cant: 1,
            subtotal: 3000,
            id: 1,
            compra: 1,
            nombre: 'Noita',
            precio: 30,
            foto: 'Fotogenerica.jpg'
          }),
        },
      },]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1viewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
