import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMembreEquipe } from '../membre-equipe.model';
import { MembreEquipeService } from '../service/membre-equipe.service';
import { MembreEquipeDeleteDialogComponent } from '../delete/membre-equipe-delete-dialog.component';

@Component({
  selector: 'jhi-membre-equipe',
  templateUrl: './membre-equipe.component.html',
})
export class MembreEquipeComponent implements OnInit {
  membreEquipes?: IMembreEquipe[];
  isLoading = false;

  constructor(protected membreEquipeService: MembreEquipeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.membreEquipeService.query().subscribe({
      next: (res: HttpResponse<IMembreEquipe[]>) => {
        this.isLoading = false;
        this.membreEquipes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMembreEquipe): number {
    return item.id!;
  }

  delete(membreEquipe: IMembreEquipe): void {
    const modalRef = this.modalService.open(MembreEquipeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.membreEquipe = membreEquipe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
