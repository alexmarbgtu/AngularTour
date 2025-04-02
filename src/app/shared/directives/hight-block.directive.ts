import { AfterContentChecked, AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHightBlock]',
  host: {
    '(document:keyup)' : 'initKeyUp($event)'
  }

})
export class HightBlockDirective implements AfterViewInit, OnInit, OnChanges, AfterContentChecked {
  @Input() selector: string
  @Input() initFirst: boolean = false
  @Input() updateView: boolean = false
  @Output() renderComplete = new EventEmitter()
  @Output() onEnter = new EventEmitter()

  private index: number = 0
  private isLoaded: boolean = false

  constructor(private el: ElementRef) {}

  get activeIndex(): number {
    return this.index
  }

  ngOnInit(): void {

  }

  ngAfterContentChecked(): void {
    const isItemLoaded = this.el.nativeElement.querySelectorAll(this.selector)
    if (this.initFirst && isItemLoaded?.length && !this.isLoaded) {
      this.isLoaded = true
      this.changeIndex(0)
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  changeIndex( shift: -1 | 1 | 0 | 3 | -3) {
    const items = [...this.el.nativeElement.querySelectorAll(this.selector)]
    if (!items.length) {
      return;
    }
    const index = items.findIndex((el: Element) => el.classList.contains("active"))
    this.index = index === -1 ? 0 : index
    items[this.index].classList.remove('active')
    this.index += shift

    if (this.index < 0) {
      if (shift === -1) {
        this.index = items.length - 1
      } else {
        this.index = 0
      }
    }
    if (this.index > items.length -1) {
       if (shift === 1) {
         this.index = 0;
       } else {
         this.index = items.length - 1;
       }
    }
    items[this.index].classList.toggle('active');
    (items[this.index] as HTMLDivElement).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
  }

  initKeyUp(event: KeyboardEvent) {
    // console.log('event', event)
    if (event. key === 'ArrowRight') {
      this.changeIndex(1);
    } else if (event.key === 'ArrowLeft') {
      this.changeIndex(-1);
    } else if (event. key === 'ArrowDown') {
      this.changeIndex(3);
    } else if (event.key === 'ArrowUp') {
      this.changeIndex(-3);
    } else if (event.key === 'Enter') {
      const items = [...this.el.nativeElement.querySelectorAll(this.selector)];
      const index = items.findIndex((e: Element) => e.classList.contains('active'));
      this.onEnter.emit(index)
    }
  }
}
