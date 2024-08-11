import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent implements OnInit, OnChanges {
  showLoader = false;
  @Input()
  spinnerWidth = '5rem';

  @Input()
  spinnerHeight = '5rem';

  @Input()
  containerPadding='100px'

  @Input()
  containerHeight='100%'

  style = {};

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.showLoader$.subscribe({
      next: (showLoader) => (this.showLoader = showLoader),
    });

   
  }

  ngOnChanges() {
    this.style = {
      height: this.spinnerHeight,
      width: this.spinnerWidth,
    };
  }
  
}
