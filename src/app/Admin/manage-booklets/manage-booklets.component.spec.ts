import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBookletsComponent } from './manage-booklets.component';

describe('ManageBookletsComponent', () => {
  let component: ManageBookletsComponent;
  let fixture: ComponentFixture<ManageBookletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBookletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBookletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
