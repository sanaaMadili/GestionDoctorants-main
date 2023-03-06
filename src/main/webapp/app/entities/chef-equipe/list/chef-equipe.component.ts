import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChefEquipe } from '../chef-equipe.model';
import { ChefEquipeService } from '../service/chef-equipe.service';
import { ChefEquipeDeleteDialogComponent } from '../delete/chef-equipe-delete-dialog.component';

@Component({
  selector: 'jhi-chef-equipe',
  templateUrl: './chef-equipe.component.html',
})
export class ChefEquipeComponent implements OnInit {
  chefEquipes?: IChefEquipe[];
  isLoading = false;

  constructor(protected chefEquipeService: ChefEquipeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.chefEquipeService.query().subscribe({
      next: (res: HttpResponse<IChefEquipe[]>) => {
        this.isLoading = false;
        this.chefEquipes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IChefEquipe): number {
    return item.id!;
  }

  delete(chefEquipe: IChefEquipe): void {
    const modalRef = this.modalService.open(ChefEquipeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chefEquipe = chefEquipe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
