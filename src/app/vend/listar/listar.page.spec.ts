import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarPage } from './listar.page';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ListarPage', () => {
  let component: ListarPage;
  let fixture: ComponentFixture<ListarPage>;

  const sqliteMock = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve()),
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, {
        provide: SQLite,
        useValue: sqliteMock
      }, {
        provide: ActivatedRoute,
        useValue: sqliteMock  
      },]
    })
    fixture = TestBed.createComponent(ListarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
