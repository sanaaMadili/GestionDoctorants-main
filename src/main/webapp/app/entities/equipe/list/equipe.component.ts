import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExtraUser, IExtraUser } from 'app/entities/extra-user/extra-user.model';

import { IEquipe } from '../equipe.model';
import { EquipeService } from '../service/equipe.service';
import { ChefLabService } from 'app/entities/chef-lab/service/chef-lab.service';
import { IChefLab } from 'app/entities/chef-lab/chef-lab.model';
import { IChefEquipe } from 'app/entities/chef-equipe/chef-equipe.model';
import { ChefEquipeService } from 'app/entities/chef-equipe/service/chef-equipe.service';

import { EquipeDeleteDialogComponent } from '../delete/equipe-delete-dialog.component';

@Component({
  selector: 'jhi-equipe',
  templateUrl: './equipe.component.html',
})
export class EquipeComponent implements OnInit {
  equipes!: IEquipe[];
  isLoading = false;
  chefLabs?: IChefLab[];
  chefEquipe? :IChefEquipe[];



  constructor(protected equipeService: EquipeService, protected cheflaboratoireservice : ChefLabService , protected chefequipeservice : ChefEquipeService , protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.equipeService.query().subscribe({
      next: (res: HttpResponse<IEquipe[]>) => {
        this.isLoading = false;
        this.equipes = res.body ?? [];
        this.loadAll1();
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.cheflaboratoireservice.queryparuser().subscribe({
      next: (res: HttpResponse<IChefLab[]>) => {
        this.isLoading = false;
        this.chefLabs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  loadAll1(): void {
    this.isLoading = true;
    this.chefequipeservice.query().subscribe({
      next: (res: HttpResponse<IChefEquipe[]>) => {
        this.isLoading = false;
        this.chefEquipe = res.body ?? [];
        for (const equipe of this.equipes) {
          for (const chefequipe of this.chefEquipe) {
            if(equipe.id===chefequipe.equipe?.id){
              equipe.extrauser=chefequipe.extraUser;
            }
            }
        }
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
