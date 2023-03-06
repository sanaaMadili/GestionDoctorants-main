import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICursus } from '../cursus.model';
import { CursusService } from '../service/cursus.service';
import { CursusDeleteDialogComponent } from '../delete/cursus-delete-dialog.component';

@Component({
  selector: 'jhi-cursus',
  templateUrl: './cursus.component.html',
})
export class CursusComponent implements OnInit {
  cursuses?: ICursus[];
  isLoading = false;

  constructor(protected cursusService: CursusService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cursusService.query().subscribe({
      next: (res: HttpResponse<ICursus[]>) => {
        this.isLoading = false;
        this.cursuses = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICursus): number {
    return item.id!;
  }

  delete(cursus: ICursus): void {
    const modalRef = this.modalService.open(CursusDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cursus = cursus;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
