import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tab2viewPage } from './tab2view.page';
import { ActivatedRoute } from '@angular/router';

describe('Tab2viewPage', () => {
  let component: Tab2viewPage;
  let fixture: ComponentFixture<Tab2viewPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [ActivatedRoute]
    })
    fixture = TestBed.createComponent(Tab2viewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
