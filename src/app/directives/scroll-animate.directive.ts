import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
})
export class ScrollAnimateDirective implements AfterViewInit {
  @Input('appScrollAnimate') animationClass: string = 'slide-up';
  @Input() delay = 0;
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngAfterViewInit(): void {
    if (this.animationClass) {
      const classes = this.animationClass.split(' ');
      classes.forEach((cls) => this.el.nativeElement.classList.add(cls));
    }
    console.log('Directive initialized with class:', this.animationClass);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Element intersecting:', this.el.nativeElement);
          setTimeout(() => {
            this.renderer.addClass(this.el.nativeElement, 'animate');
            const classes = this.animationClass.split(' ');
            classes.forEach((cls) =>
              this.renderer.addClass(this.el.nativeElement, cls)
            );
          }, this.delay);
        }
      },
      {
        threshold: 0.1,
      }
    );
    observer.observe(this.el.nativeElement);
  }
}
