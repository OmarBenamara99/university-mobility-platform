import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingeditprofileComponent } from './settingeditprofile.component';

describe('SettingeditprofileComponent', () => {
  let component: SettingeditprofileComponent;
  let fixture: ComponentFixture<SettingeditprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingeditprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingeditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
