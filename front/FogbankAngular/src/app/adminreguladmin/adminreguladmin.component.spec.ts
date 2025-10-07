import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminreguladminComponent } from './adminreguladmin.component';

describe('AdminreguladminComponent', () => {
  let component: AdminreguladminComponent;
  let fixture: ComponentFixture<AdminreguladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminreguladminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminreguladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
