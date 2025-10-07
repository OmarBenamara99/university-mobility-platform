import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating-component',
  templateUrl: './star-rating-component.component.html',
  styleUrls: ['./star-rating-component.component.css']
})
export class StarRatingComponentComponent {
  @Input() rating: number = 0;
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5];

  setRating(rating: number): void {
    if (!this.disabled) {
      this.rating = rating;
      this.ratingChange.emit(rating);
    }
  }

}
