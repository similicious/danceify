import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appPlaybackRate]'
})
export class PlaybackRateDirective implements OnChanges {

  @Input('appPlaybackRate')
  playbackRate: number = 1;

  constructor(private element: ElementRef<HTMLVideoElement>) { }

  ngOnChanges() {
    this.element.nativeElement.playbackRate = this.playbackRate;
  }
}
