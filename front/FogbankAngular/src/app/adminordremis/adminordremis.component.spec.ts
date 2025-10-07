import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminordremisComponent } from './adminordremis.component';

describe('AdminordremisComponent', () => {
  let component: AdminordremisComponent;
  let fixture: ComponentFixture<AdminordremisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminordremisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminordremisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
