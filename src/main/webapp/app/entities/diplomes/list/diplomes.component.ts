import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiplomes } from '../diplomes.model';
import { DiplomesService } from '../service/diplomes.service';
import {IFormation} from "../../formation/formation.model";
import {FormationService} from "../../formation/service/formation.service";

@Component({
  selector: 'jhi-diplomes',
  templateUrl: './diplomes.component.html',
})
export class DiplomesComponent implements OnInit {
  diplomes?: IDiplomes[];
  isLoading = false;
  cursus: Array<string> = ["Formation1", "Formation2", "Formation3"];
  formations?: IFormation[];
  editable = false;

  constructor(protected diplomesService: DiplomesService,protected formationService: FormationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formationService.getformations().subscribe({
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

  trackId(index: number, item: IDiplomes): number {
    return item.id!;
  }



}
