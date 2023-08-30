import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FgpsswPage } from './fgpssw.page';

describe('FgpsswPage', () => {
  let component: FgpsswPage;
  let fixture: ComponentFixture<FgpsswPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FgpsswPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
