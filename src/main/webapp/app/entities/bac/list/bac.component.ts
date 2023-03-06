import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBac } from '../bac.model';
import { BacService } from '../service/bac.service';
import { BacDeleteDialogComponent } from '../delete/bac-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-bac',
  templateUrl: './bac.component.html',
})
export class BacComponent implements OnInit {
  bacs?: IBac[];
  isLoading = false;

  constructor(protected bacService: BacService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bacService.query().subscribe({
      next: (res: HttpResponse<IBac[]>) => {
        this.isLoading = false;
        this.bacs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBac): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(bac: IBac): void {
    const modalRef = this.modalService.open(BacDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bac = bac;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
