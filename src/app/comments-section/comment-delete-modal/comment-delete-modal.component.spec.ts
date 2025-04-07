import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDeleteModalComponent } from './comment-delete-modal.component';

describe('CommentDeleteModalComponent', () => {
  let component: CommentDeleteModalComponent;
  let fixture: ComponentFixture<CommentDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
