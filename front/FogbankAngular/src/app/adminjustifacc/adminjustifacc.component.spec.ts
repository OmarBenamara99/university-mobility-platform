import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminjustifaccComponent } from './adminjustifacc.component';

describe('AdminjustifaccComponent', () => {
  let component: AdminjustifaccComponent;
  let fixture: ComponentFixture<AdminjustifaccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminjustifaccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminjustifaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
