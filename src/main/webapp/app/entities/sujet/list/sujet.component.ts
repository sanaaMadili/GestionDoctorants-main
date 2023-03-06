import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISujet } from '../sujet.model';
import { SujetService } from '../service/sujet.service';
import { SujetDeleteDialogComponent } from '../delete/sujet-delete-dialog.component';

@Component({
  selector: 'jhi-sujet',
  templateUrl: './sujet.component.html',
})
export class SujetComponent implements OnInit {
  sujets?: ISujet[];
  isLoading = false;

  constructor(protected sujetService: SujetService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sujetService.query().subscribe({
      next: (res: HttpResponse<ISujet[]>) => {
        this.isLoading = false;
        this.sujets = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISujet): number {
    return item.id!;
  }

  delete(sujet: ISujet): void {
    const modalRef = this.modalService.open(SujetDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sujet = sujet;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
