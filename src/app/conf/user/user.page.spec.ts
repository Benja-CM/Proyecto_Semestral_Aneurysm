import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPage } from './user.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('UserPage', () => {
  let component: UserPage;
  let fixture: ComponentFixture<UserPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [SQLite]
    })
    
    fixture = TestBed.createComponent(UserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
