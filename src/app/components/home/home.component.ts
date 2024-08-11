import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../services/jwt/jwt.service';
import { UserDetails } from '../../interfaces/UserDetails';
import { FilesService } from '../../services/files/files.service';
import { FileInfo } from '../../interfaces/Files';
import { ToastService } from '../../services/toast/toast.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  files!: Array<FileInfo>;
  backendCallInProgress = false;

  subscriptions: Subscription[] = [];
  constructor(
    private filesService: FilesService,
    private toastService: ToastService,
    private router: Router
  ) {}
  ngOnInit() {
    this.backendCallInProgress = true;
    this.subscriptions.push(
      this.filesService.getAllFiles().subscribe({
        next: (res) => {
          this.files = res.files;
          this.backendCallInProgress = false;
        },
        error: (error) => {
          this.toastService.showToast(error.message, 'danger');
          this.backendCallInProgress = false;
        },
      })
    );
  }

  goToFile(file: FileInfo) {
    this.router.navigate(
      [
        '/problems/' +
          file.name.substring(0, file.name.length - 4).toLocaleLowerCase(),
      ],
      { state: { fileId: file.id } }
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
