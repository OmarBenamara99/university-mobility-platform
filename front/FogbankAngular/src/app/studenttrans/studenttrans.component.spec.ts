import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenttransComponent } from './studenttrans.component';

describe('StudenttransComponent', () => {
  let component: StudenttransComponent;
  let fixture: ComponentFixture<StudenttransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudenttransComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudenttransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
