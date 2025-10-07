import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffrepublicComponent } from './offrepublic.component';

describe('OffrepublicComponent', () => {
  let component: OffrepublicComponent;
  let fixture: ComponentFixture<OffrepublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffrepublicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffrepublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
