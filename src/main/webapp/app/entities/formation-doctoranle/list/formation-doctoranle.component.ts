import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormationDoctoranle } from '../formation-doctoranle.model';
import { FormationDoctoranleService } from '../service/formation-doctoranle.service';
import { FormationDoctoranleDeleteDialogComponent } from '../delete/formation-doctoranle-delete-dialog.component';

@Component({
  selector: 'jhi-formation-doctoranle',
  templateUrl: './formation-doctoranle.component.html',
})
export class FormationDoctoranleComponent implements OnInit {
  formationDoctoranles?: IFormationDoctoranle[];
  isLoading = false;

  constructor(protected formationDoctoranleService: FormationDoctoranleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formationDoctoranleService.query().subscribe({
      next: (res: HttpResponse<IFormationDoctoranle[]>) => {
        this.isLoading = false;
        this.formationDoctoranles = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFormationDoctoranle): number {
    return item.id!;
  }

  delete(formationDoctoranle: IFormationDoctoranle): void {
    const modalRef = this.modalService.open(FormationDoctoranleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formationDoctoranle = formationDoctoranle;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
