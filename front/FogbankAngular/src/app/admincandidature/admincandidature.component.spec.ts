import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincandidatureComponent } from './admincandidature.component';

describe('AdmincandidatureComponent', () => {
  let component: AdmincandidatureComponent;
  let fixture: ComponentFixture<AdmincandidatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmincandidatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmincandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
