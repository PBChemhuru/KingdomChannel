import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveflagDialogComponent } from './resolveflag-dialog.component';

describe('ResolveflagDialogComponent', () => {
  let component: ResolveflagDialogComponent;
  let fixture: ComponentFixture<ResolveflagDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveflagDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolveflagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
