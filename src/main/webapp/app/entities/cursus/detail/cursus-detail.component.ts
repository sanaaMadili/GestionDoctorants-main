import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICursus } from '../cursus.model';

@Component({
  selector: 'jhi-cursus-detail',
  templateUrl: './cursus-detail.component.html',
})
export class CursusDetailComponent implements OnInit {
  cursus: ICursus | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cursus }) => {
      this.cursus = cursus;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
