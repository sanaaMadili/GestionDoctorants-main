import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMembreEquipe } from '../membre-equipe.model';

@Component({
  selector: 'jhi-membre-equipe-detail',
  templateUrl: './membre-equipe-detail.component.html',
})
export class MembreEquipeDetailComponent implements OnInit {
  membreEquipe: IMembreEquipe | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ membreEquipe }) => {
      this.membreEquipe = membreEquipe;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
