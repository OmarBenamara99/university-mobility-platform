import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcandidatureComponent } from './studentcandidature.component';

describe('StudentcandidatureComponent', () => {
  let component: StudentcandidatureComponent;
  let fixture: ComponentFixture<StudentcandidatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentcandidatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentcandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
