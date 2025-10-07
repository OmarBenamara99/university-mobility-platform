import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFrontComponent } from './base-front.component';

describe('BaseFrontComponent', () => {
  let component: BaseFrontComponent;
  let fixture: ComponentFixture<BaseFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseFrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
