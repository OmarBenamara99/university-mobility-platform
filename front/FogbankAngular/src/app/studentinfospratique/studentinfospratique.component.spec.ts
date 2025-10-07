import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentinfospratiqueComponent } from './studentinfospratique.component';

describe('StudentinfospratiqueComponent', () => {
  let component: StudentinfospratiqueComponent;
  let fixture: ComponentFixture<StudentinfospratiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentinfospratiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentinfospratiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
