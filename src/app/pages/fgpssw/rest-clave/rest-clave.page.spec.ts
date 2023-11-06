import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestClavePage } from './rest-clave.page';
import { ActivatedRoute } from '@angular/router';

describe('RestClavePage', () => {
  let component: RestClavePage;
  let fixture: ComponentFixture<RestClavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [ActivatedRoute]
    })
    fixture = TestBed.createComponent(RestClavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
