import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminextComponent } from './adminext.component';

describe('AdminextComponent', () => {
  let component: AdminextComponent;
  let fixture: ComponentFixture<AdminextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
