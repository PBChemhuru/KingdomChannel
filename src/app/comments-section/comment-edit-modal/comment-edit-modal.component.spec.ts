import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentEditModalComponent } from './comment-edit-modal.component';

describe('CommentEditModalComponent', () => {
  let component: CommentEditModalComponent;
  let fixture: ComponentFixture<CommentEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
