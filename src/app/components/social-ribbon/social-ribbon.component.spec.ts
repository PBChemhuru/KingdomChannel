import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialRibbonComponent } from './social-ribbon.component';

describe('SocialRibbonComponent', () => {
  let component: SocialRibbonComponent;
  let fixture: ComponentFixture<SocialRibbonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialRibbonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
