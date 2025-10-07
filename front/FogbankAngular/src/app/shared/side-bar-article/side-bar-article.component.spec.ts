import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarArticleComponent } from './side-bar-article.component';

describe('SideBarArticleComponent', () => {
  let component: SideBarArticleComponent;
  let fixture: ComponentFixture<SideBarArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideBarArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
