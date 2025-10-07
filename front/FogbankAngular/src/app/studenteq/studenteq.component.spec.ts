import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenteqComponent } from './studenteq.component';

describe('StudenteqComponent', () => {
  let component: StudenteqComponent;
  let fixture: ComponentFixture<StudenteqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudenteqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudenteqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
