import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletCardComponent } from './booklet-card.component';

describe('BookletCardComponent', () => {
  let component: BookletCardComponent;
  let fixture: ComponentFixture<BookletCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookletCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
