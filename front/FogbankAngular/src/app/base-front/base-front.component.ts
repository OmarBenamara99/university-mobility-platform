import { AfterViewInit, Component } from '@angular/core';

declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-base-front',
  templateUrl: './base-front.component.html',
  styleUrls: ['./base-front.component.css']
})
export class BaseFrontComponent {
  ngAfterViewInit() {
    // Initialize Owl Carousel
    $('.owl-carousel').owlCarousel({
      // your options here
      loop: true,
      margin: 10,
      nav: true,
      items: 5
    });

    // Initialize AOS
    if (AOS) {
      AOS.init();
    }
  }

}
