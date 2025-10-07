import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentordremisComponent } from './studentordremis.component';

describe('StudentordremisComponent', () => {
  let component: StudentordremisComponent;
  let fixture: ComponentFixture<StudentordremisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentordremisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentordremisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
