import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarVendPage } from './agregar-vend.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('AgregarVendPage', () => {
  let component: AgregarVendPage;
  let fixture: ComponentFixture<AgregarVendPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [SQLite]
    })
    fixture = TestBed.createComponent(AgregarVendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
