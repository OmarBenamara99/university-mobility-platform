import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcandidaturestatComponent } from './studentcandidaturestat.component';

describe('StudentcandidaturestatComponent', () => {
  let component: StudentcandidaturestatComponent;
  let fixture: ComponentFixture<StudentcandidaturestatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentcandidaturestatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentcandidaturestatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
