import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmineqComponent } from './admineq.component';

describe('AdmineqComponent', () => {
  let component: AdmineqComponent;
  let fixture: ComponentFixture<AdmineqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmineqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmineqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
