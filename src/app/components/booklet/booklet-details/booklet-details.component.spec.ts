import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletDetailsComponent } from './booklet-details.component';

describe('BookletDetailsComponent', () => {
  let component: BookletDetailsComponent;
  let fixture: ComponentFixture<BookletDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
