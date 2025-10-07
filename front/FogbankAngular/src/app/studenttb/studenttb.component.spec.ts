import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenttbComponent } from './studenttb.component';

describe('StudenttbComponent', () => {
  let component: StudenttbComponent;
  let fixture: ComponentFixture<StudenttbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudenttbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudenttbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
