import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChercheurExterne } from '../chercheur-externe.model';

@Component({
  selector: 'jhi-chercheur-externe-detail',
  templateUrl: './chercheur-externe-detail.component.html',
})
export class ChercheurExterneDetailComponent implements OnInit {
  chercheurExterne: IChercheurExterne | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chercheurExterne }) => {
      this.chercheurExterne = chercheurExterne;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
