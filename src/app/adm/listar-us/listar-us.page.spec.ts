import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarUsPage } from './listar-us.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ListarUsPage', () => {
  let component: ListarUsPage;
  let fixture: ComponentFixture<ListarUsPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [SQLite]
    })
    fixture = TestBed.createComponent(ListarUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
