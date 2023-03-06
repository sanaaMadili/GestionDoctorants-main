import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBourse } from '../bourse.model';

@Component({
  selector: 'jhi-bourse-detail',
  templateUrl: './bourse-detail.component.html',
})
export class BourseDetailComponent implements OnInit {
  bourse: IBourse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bourse }) => {
      this.bourse = bourse;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
