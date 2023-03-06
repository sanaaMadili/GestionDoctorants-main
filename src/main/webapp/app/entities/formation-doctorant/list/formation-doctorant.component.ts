import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormationDoctorant } from '../formation-doctorant.model';
import { FormationDoctorantService } from '../service/formation-doctorant.service';
import { FormationDoctorantDeleteDialogComponent } from '../delete/formation-doctorant-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-formation-doctorant',
  templateUrl: './formation-doctorant.component.html',
})
export class FormationDoctorantComponent implements OnInit {
  formationDoctorants?: IFormationDoctorant[];
  isLoading = false;

  constructor(
    protected formationDoctorantService: FormationDoctorantService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.formationDoctorantService.query().subscribe({
      next: (res: HttpResponse<IFormationDoctorant[]>) => {
        this.isLoading = false;
        this.formationDoctorants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFormationDoctorant): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(formationDoctorant: IFormationDoctorant): void {
    const modalRef = this.modalService.open(FormationDoctorantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formationDoctorant = formationDoctorant;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
