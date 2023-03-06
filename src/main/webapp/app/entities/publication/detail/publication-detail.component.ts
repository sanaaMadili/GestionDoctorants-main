import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPublication } from '../publication.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-publication-detail',
  templateUrl: './publication-detail.component.html',
})
export class PublicationDetailComponent implements OnInit {
  publication: IPublication | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publication }) => {
      this.publication = publication;
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
