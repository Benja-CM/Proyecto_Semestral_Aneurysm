import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FgpsswPage } from './fgpssw.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('FgpsswPage', () => {
  let component: FgpsswPage;
  let fixture: ComponentFixture<FgpsswPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [SQLite]
    })
    fixture = TestBed.createComponent(FgpsswPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
