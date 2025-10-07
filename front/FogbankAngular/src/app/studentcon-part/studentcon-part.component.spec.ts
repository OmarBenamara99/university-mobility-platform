import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentconPartComponent } from './studentcon-part.component';

describe('StudentconPartComponent', () => {
  let component: StudentconPartComponent;
  let fixture: ComponentFixture<StudentconPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentconPartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentconPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
