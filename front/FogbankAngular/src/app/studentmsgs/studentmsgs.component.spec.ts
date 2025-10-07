import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentmsgsComponent } from './studentmsgs.component';

describe('StudentmsgsComponent', () => {
  let component: StudentmsgsComponent;
  let fixture: ComponentFixture<StudentmsgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentmsgsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentmsgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
