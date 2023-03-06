import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEquipe } from '../equipe.model';
import { EquipeService } from '../service/equipe.service';
import { EquipeDeleteDialogComponent } from '../delete/equipe-delete-dialog.component';

@Component({
  selector: 'jhi-equipe',
  templateUrl: './equipe.component.html',
})
export class EquipeComponent implements OnInit {
  equipes?: IEquipe[];
  isLoading = false;

  constructor(protected equipeService: EquipeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.equipeService.query().subscribe({
      next: (res: HttpResponse<IEquipe[]>) => {
        this.isLoading = false;
        this.equipes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEquipe): number {
    return item.id!;
  }

  delete(equipe: IEquipe): void {
    const modalRef = this.modalService.open(EquipeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.equipe = equipe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
