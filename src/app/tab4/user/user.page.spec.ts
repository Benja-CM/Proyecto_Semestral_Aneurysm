import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPage } from './user.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('UserPage', () => {
  let component: UserPage;
  let fixture: ComponentFixture<UserPage>;

  const sqliteMock = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({
      rows: {
        length: 1,
        item: (index:any) => ({ id: 1, name: 'John Doe' })
      }
    })),
    // Otros métodos si es necesario
  };

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
      providers: [HttpClient, HttpHandler,
        {provide: SQLite, useValue: sqliteMock},
        {provide: ActivatedRoute, useValue: activatedRouteMock},
      ],
      declarations: [UserPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
