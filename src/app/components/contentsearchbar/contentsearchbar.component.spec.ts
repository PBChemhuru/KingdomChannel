import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentsearchbarComponent } from './contentsearchbar.component';

describe('ContentsearchbarComponent', () => {
  let component: ContentsearchbarComponent;
  let fixture: ComponentFixture<ContentsearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentsearchbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentsearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
