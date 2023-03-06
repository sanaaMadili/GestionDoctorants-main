import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReinscription } from '../reinscription.model';
import { ReinscriptionService } from '../service/reinscription.service';
import { ReinscriptionDeleteDialogComponent } from '../delete/reinscription-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-reinscription',
  templateUrl: './reinscription.component.html',
})
export class ReinscriptionComponent implements OnInit {
  reinscriptions?: IReinscription[];
  isLoading = false;
  dtOptions: DataTables.Settings = {};

  constructor(protected reinscriptionService: ReinscriptionService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.reinscriptionService.query().subscribe({
      next: (res: HttpResponse<IReinscription[]>) => {
        this.isLoading = false;
        this.reinscriptions = res.body ?? [];
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

  trackId(_index: number, item: IReinscription): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(reinscription: IReinscription): void {
    const modalRef = this.modalService.open(ReinscriptionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reinscription = reinscription;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
