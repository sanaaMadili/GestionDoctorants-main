import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISujet } from '../sujet.model';

@Component({
  selector: 'jhi-sujet-detail',
  templateUrl: './sujet-detail.component.html',
})
export class SujetDetailComponent implements OnInit {
  sujet: ISujet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sujet }) => {
      this.sujet = sujet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
