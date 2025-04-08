import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentFlagModalComponent } from './comment-flag-modal.component';

describe('CommentFlagModalComponent', () => {
  let component: CommentFlagModalComponent;
  let fixture: ComponentFixture<CommentFlagModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentFlagModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentFlagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
