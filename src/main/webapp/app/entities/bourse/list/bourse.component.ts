import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBourse } from '../bourse.model';
import { BourseService } from '../service/bourse.service';
import { BourseDeleteDialogComponent } from '../delete/bourse-delete-dialog.component';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'jhi-bourse',
  templateUrl: './bourse.component.html',
})
export class BourseComponent implements OnInit {
  bourses?: IBourse[];
  isLoading = false;
  dtOptions: DataTables.Settings = {};

  constructor(protected bourseService: BourseService,public _sanitizer: DomSanitizer, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bourseService.query().subscribe({
      next: (res: HttpResponse<IBourse[]>) => {
        this.isLoading = false;
        this.bourses = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      searching: true
    };
  }

  trackId(_index: number, item: IBourse): number {
    return item.id!;
  }
  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }
  delete(bourse: IBourse): void {
    const modalRef = this.modalService.open(BourseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bourse = bourse;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
