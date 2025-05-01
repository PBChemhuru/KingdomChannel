import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookletDialogComponent } from './create-booklet-dialog.component';

describe('CreateBookletDialogComponent', () => {
  let component: CreateBookletDialogComponent;
  let fixture: ComponentFixture<CreateBookletDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBookletDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBookletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
