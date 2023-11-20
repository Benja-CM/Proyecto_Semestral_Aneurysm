import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarVendPage } from './agregar-vend.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AgregarVendPage', () => {
  let component: AgregarVendPage;
  let fixture: ComponentFixture<AgregarVendPage>;

  const sqliteMock = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve()),
  };

  const activatedRouteMock = {
    queryParams: of({  }),
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, {
        provide: SQLite,
        useValue: sqliteMock
      }, {
        provide: ActivatedRoute,
        useValue: activatedRouteMock
      },]
    })

    fixture = TestBed.createComponent(AgregarVendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
