import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarUsPage } from './listar-us.page';

describe('ListarUsPage', () => {
  let component: ListarUsPage;
  let fixture: ComponentFixture<ListarUsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
