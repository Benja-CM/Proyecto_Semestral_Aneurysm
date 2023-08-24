import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangepsswdPage } from './changepsswd.page';

describe('ChangepsswdPage', () => {
  let component: ChangepsswdPage;
  let fixture: ComponentFixture<ChangepsswdPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChangepsswdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
