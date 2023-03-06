import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChefEquipe } from '../chef-equipe.model';

@Component({
  selector: 'jhi-chef-equipe-detail',
  templateUrl: './chef-equipe-detail.component.html',
})
export class ChefEquipeDetailComponent implements OnInit {
  chefEquipe: IChefEquipe | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chefEquipe }) => {
      this.chefEquipe = chefEquipe;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
