import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormationDoctoranle } from '../formation-doctoranle.model';

@Component({
  selector: 'jhi-formation-doctoranle-detail',
  templateUrl: './formation-doctoranle-detail.component.html',
})
export class FormationDoctoranleDetailComponent implements OnInit {
  formationDoctoranle: IFormationDoctoranle | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formationDoctoranle }) => {
      this.formationDoctoranle = formationDoctoranle;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
