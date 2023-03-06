import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormation } from '../formation.model';
import { FormationService } from '../service/formation.service';
import { FormationDeleteDialogComponent } from '../delete/formation-delete-dialog.component';

@Component({
  selector: 'jhi-formation',
  templateUrl: './formation.component.html',
})
export class FormationComponent implements OnInit {
  formations?: IFormation[];
  isLoading = false;

  constructor(protected formationService: FormationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formationService.query().subscribe({
      next: (res: HttpResponse<IFormation[]>) => {
        this.isLoading = false;
        this.formations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFormation): number {
    return item.id!;
  }

  delete(formation: IFormation): void {
    const modalRef = this.modalService.open(FormationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formation = formation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
