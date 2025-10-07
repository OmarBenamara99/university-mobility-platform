import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentreguladminComponent } from './studentreguladmin.component';

describe('StudentreguladminComponent', () => {
  let component: StudentreguladminComponent;
  let fixture: ComponentFixture<StudentreguladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentreguladminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentreguladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
