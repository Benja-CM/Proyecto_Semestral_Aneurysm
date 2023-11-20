import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3Page } from './tab3.page';
import { HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tab3Page],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
      providers: [HttpHandler, SQLite, {
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

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
