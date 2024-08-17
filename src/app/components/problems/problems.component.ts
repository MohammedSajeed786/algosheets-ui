import { Component, OnInit } from '@angular/core';
import { ProblemsService } from '../../services/problems/problems.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { F, G } from '@angular/cdk/keycodes';
import { Problem, Status } from '../../interfaces/Problems';
import { ToastService } from '../../services/toast/toast.service';
import { TableData } from '../../interfaces/Table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.css',
})
export class ProblemsComponent implements OnInit {
  fileId!: string;
  fileName!: string | null;
  problems!: Problem[];
  tableData!: TableData<Problem>;
  filterId = 0;
  backendCallInProgress = false;
  subscriptions: Subscription[] = [];
  statuses: Status[] = [
    {
      statusId: 0,
      type: 'All',
      color: '',
      show: false,
      count: 0,
    },
    {
      statusId: 1,
      type: 'Unsolved',
      color: 'bg-danger',
      show: true,
      count: 0,
    },
    {
      statusId: 2,
      type: 'Solved',
      color: 'bg-success',
      show: true,
      count: 0,
    },
    {
      statusId: 3,
      type: 'Revision',
      color: 'bg-warning',
      show: true,
      count: 0,
    },
    {
      statusId: 4,
      type: 'Attempted',
      color: '',
      show: false,
      count: 0,
    },
  ];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private problemsService: ProblemsService,
    private toastService: ToastService
  ) {
    this.fileId = router.getCurrentNavigation()?.extras?.state?.['fileId'];
    this.subscriptions.push(
      activatedRoute.paramMap.subscribe((value: ParamMap) => {
        this.fileName = value.get('name');
      })
    );
  }
  ngOnInit() {
    this.backendCallInProgress = true;
    this.subscriptions.push(
      this.problemsService.getProblems(this.fileId).subscribe({
        next: (res) => {
          this.problems = res.problems;
          this.assignIdsAndCountProblems();
          this.backendCallInProgress = false;
        },
        error: (err) => {
          this.toastService.showToast(err.message, 'danger'),
            (this.backendCallInProgress = false);
        },
      })
    );
  }

  assignIdsAndCountProblems() {
    for (let i = 0; i < this.problems.length; i++){
      this.problems[i].problemId = i + 1;
      this.statuses[this.problems[i].status].count++;
      if(this.problems[i].status==2 || this.problems[i].status==3) {
        this.statuses[4].count++;
      }

      this.statuses[0].count++;

    }
  }

  filterProblems(filterId: number) {
    this.filterId = filterId;
  }

  changeProblemStatus(problemId: number, statusId: number) {
    let currProblemIndex = this.problems.findIndex(
      (problem: Problem) => problem.problemId == problemId
    );

    let oldStatus = this.problems[currProblemIndex].status;

    if (oldStatus != statusId) {
      this.problems[currProblemIndex].status = statusId;

      this.backendCallInProgress = true;
      this.subscriptions.push(
        this.problemsService
          .updateProblems(this.fileId, this.problems)
          .subscribe({
            next: (res) => {
              this.toastService.showToast(res, 'success');
              this.backendCallInProgress = false;
              this.statuses[statusId].count++;

              //unsolved to solved/revision
              if (oldStatus==1 && (statusId==2 || statusId==3) ) {
                this.statuses[4].count++;
              }
              else if((oldStatus==2 || oldStatus==3) && statusId==1) this.statuses[4].count--; //solved/revision to unsolved

              this.statuses[oldStatus].count--;

              
            },
            error: (err) => {
              this.toastService.showToast(err.message, 'danger');
              this.problems[currProblemIndex].status = oldStatus;
              this.backendCallInProgress = false;
            },
          })
      );
    }
  }

  sortProblems(order: number) {
    this.problems.sort((a, b) => (a.numOccur - b.numOccur) * order);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
