import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILaboratoire } from '../laboratoire.model';

@Component({
  selector: 'jhi-laboratoire-detail',
  templateUrl: './laboratoire-detail.component.html',
})
export class LaboratoireDetailComponent implements OnInit {
  laboratoire: ILaboratoire | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ laboratoire }) => {
      this.laboratoire = laboratoire;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
