import { Component, OnInit } from '@angular/core';
import { ToastMessage } from '../../../interfaces/ToastMessage';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  // [x: string]: any;
  toastMessage!: ToastMessage | null;

  constructor(private toastService: ToastService) {
  }
  ngOnInit() {
      this.toastService.toastMessage$.subscribe({
      next: (toastMessage: ToastMessage | null) => {
        this.toastMessage = toastMessage;
      },
    });
  }
}
