import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tab1viewPage } from './tab1view.page';

describe('Tab1viewPage', () => {
  let component: Tab1viewPage;
  let fixture: ComponentFixture<Tab1viewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Tab1viewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
