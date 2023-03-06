import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isEqual } from 'lodash';
import { ILaboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';
import { LaboratoireDeleteDialogComponent } from '../delete/laboratoire-delete-dialog.component';
import { ExtraUser, IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';
import {  ChefLab, IChefLab } from 'app/entities/chef-lab/chef-lab.model';
import { ChefLabService } from 'app/entities/chef-lab/service/chef-lab.service';

@Component({
  selector: 'jhi-laboratoire',
  templateUrl: './laboratoire.component.html',
})
export class LaboratoireComponent implements OnInit {
  laboratoires: ILaboratoire[] = [];
  isLoading = false;
  chefLabs: IChefLab[] = [];

  constructor(protected laboratoireService: LaboratoireService,  protected cheflaboratoireservice : ChefLabService , protected extraUserService: ExtraUserService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.laboratoireService.list().subscribe({
      next: (res: HttpResponse<ILaboratoire[]>) => {
        this.isLoading = false;
        this.laboratoires = res.body ?? [];
            this.loadAll1();


      },
      error: () => {
        this.isLoading = false;
      },
    });


  }

  loadAll1(): void {
    this.isLoading = true;
    this.cheflaboratoireservice.query().subscribe({
      next: (res: HttpResponse<IChefLab[]>) => {
        this.isLoading = false;
        this.chefLabs = res.body ?? [];
        for (const lab of this.laboratoires) {
          for (const cheflab of this.chefLabs) {
            if(lab.id===cheflab.laboratoire?.id){
              lab.extrauser=cheflab.extraUser;
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

  trackId(index: number, item: ILaboratoire): number {
    return item.id!;
  }

  delete(laboratoire: ILaboratoire): void {
    const modalRef = this.modalService.open(LaboratoireDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.laboratoire = laboratoire;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
