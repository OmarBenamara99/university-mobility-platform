import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentjustifaccComponent } from './studentjustifacc.component';

describe('StudentjustifaccComponent', () => {
  let component: StudentjustifaccComponent;
  let fixture: ComponentFixture<StudentjustifaccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentjustifaccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentjustifaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
