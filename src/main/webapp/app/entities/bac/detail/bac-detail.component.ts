import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBac } from '../bac.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-bac-detail',
  templateUrl: './bac-detail.component.html',
})
export class BacDetailComponent implements OnInit {
  bac: IBac | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bac }) => {
      this.bac = bac;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
