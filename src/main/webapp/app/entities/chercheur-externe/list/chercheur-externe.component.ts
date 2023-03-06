import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChercheurExterne } from '../chercheur-externe.model';
import { ChercheurExterneService } from '../service/chercheur-externe.service';
import { ChercheurExterneDeleteDialogComponent } from '../delete/chercheur-externe-delete-dialog.component';

@Component({
  selector: 'jhi-chercheur-externe',
  templateUrl: './chercheur-externe.component.html',
})
export class ChercheurExterneComponent implements OnInit {
  chercheurExternes?: IChercheurExterne[];
  isLoading = false;

  constructor(protected chercheurExterneService: ChercheurExterneService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.chercheurExterneService.query().subscribe({
      next: (res: HttpResponse<IChercheurExterne[]>) => {
        this.isLoading = false;
        this.chercheurExternes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IChercheurExterne): number {
    return item.id!;
  }

  delete(chercheurExterne: IChercheurExterne): void {
    const modalRef = this.modalService.open(ChercheurExterneDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chercheurExterne = chercheurExterne;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
