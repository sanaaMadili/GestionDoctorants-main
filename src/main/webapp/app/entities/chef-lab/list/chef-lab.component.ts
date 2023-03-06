import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChefLab } from '../chef-lab.model';
import { ChefLabService } from '../service/chef-lab.service';
import { ChefLabDeleteDialogComponent } from '../delete/chef-lab-delete-dialog.component';

@Component({
  selector: 'jhi-chef-lab',
  templateUrl: './chef-lab.component.html',
})
export class ChefLabComponent implements OnInit {
  chefLabs?: IChefLab[];
  isLoading = false;

  constructor(protected chefLabService: ChefLabService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.chefLabService.query().subscribe({
      next: (res: HttpResponse<IChefLab[]>) => {
        this.isLoading = false;
        this.chefLabs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IChefLab): number {
    return item.id!;
  }

  delete(chefLab: IChefLab): void {
    const modalRef = this.modalService.open(ChefLabDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chefLab = chefLab;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
