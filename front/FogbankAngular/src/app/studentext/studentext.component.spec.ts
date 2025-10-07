import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentextComponent } from './studentext.component';

describe('StudentextComponent', () => {
  let component: StudentextComponent;
  let fixture: ComponentFixture<StudentextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
