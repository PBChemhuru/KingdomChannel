import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookletDialogComponent } from './edit-booklet-dialog.component';

describe('EditBookletDialogComponent', () => {
  let component: EditBookletDialogComponent;
  let fixture: ComponentFixture<EditBookletDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBookletDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBookletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
