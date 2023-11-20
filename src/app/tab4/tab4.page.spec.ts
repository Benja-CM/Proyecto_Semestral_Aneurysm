import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab4Page } from './tab4.page';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';

describe('Tab4Page', () => {
  let component: Tab4Page;
  let fixture: ComponentFixture<Tab4Page>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tab4Page],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
      providers: [HttpClient, HttpHandler, {
        provide: SQLite,
        useValue: {
          queryParams: of({
            id: 1
          }),
        },
      },
      {provide: ActivatedRoute, useValue: activatedRouteMock},]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
