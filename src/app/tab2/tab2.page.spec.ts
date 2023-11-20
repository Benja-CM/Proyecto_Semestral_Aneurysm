import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2Page } from './tab2.page';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
      providers: [HttpClient, HttpHandler, SQLite, {
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
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});