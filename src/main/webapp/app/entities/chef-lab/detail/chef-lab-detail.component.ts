import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChefLab } from '../chef-lab.model';

@Component({
  selector: 'jhi-chef-lab-detail',
  templateUrl: './chef-lab-detail.component.html',
})
export class ChefLabDetailComponent implements OnInit {
  chefLab: IChefLab | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chefLab }) => {
      this.chefLab = chefLab;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
