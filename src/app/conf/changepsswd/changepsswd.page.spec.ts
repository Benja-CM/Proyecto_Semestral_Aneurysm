import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangepsswdPage } from './changepsswd.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ChangepsswdPage', () => {
  let component: ChangepsswdPage;
  let fixture: ComponentFixture<ChangepsswdPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [SQLite]
    })
    fixture = TestBed.createComponent(ChangepsswdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
