import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentreclamComponent } from './studentreclam.component';

describe('StudentreclamComponent', () => {
  let component: StudentreclamComponent;
  let fixture: ComponentFixture<StudentreclamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentreclamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentreclamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
