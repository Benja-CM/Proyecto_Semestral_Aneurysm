import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarVendPage } from './agregar-vend.page';

describe('AgregarVendPage', () => {
  let component: AgregarVendPage;
  let fixture: ComponentFixture<AgregarVendPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarVendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
