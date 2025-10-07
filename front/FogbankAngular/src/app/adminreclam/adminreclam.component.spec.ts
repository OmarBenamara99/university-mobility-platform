import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminreclamComponent } from './adminreclam.component';

describe('AdminreclamComponent', () => {
  let component: AdminreclamComponent;
  let fixture: ComponentFixture<AdminreclamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminreclamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminreclamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
