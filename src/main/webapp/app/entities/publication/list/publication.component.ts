import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublication } from '../publication.model';
import { PublicationService } from '../service/publication.service';
import { PublicationDeleteDialogComponent } from '../delete/publication-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import {Doctorant, IDoctorant} from "../../doctorant/doctorant.model";
import {DoctorantService} from "../../doctorant/service/doctorant.service";
import {mergeMap} from "rxjs/operators";
import {of} from "rxjs";
import {CountPub} from "../../ChartsModels/CountPub";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'jhi-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.scss'],
})
export class PublicationComponent implements OnInit {
  publications?: IPublication[];
  countPub!:CountPub[];
  isLoading = false;
  doctorant!:IDoctorant;



  constructor(public _sanitizer: DomSanitizer,protected serviceDoctorant: DoctorantService,protected publicationService: PublicationService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}
  decode(base64String: string | null ):SafeResourceUrl{
    if(base64String){
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String.toString());
    }else {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + "base64String.toString()");

    }
  }
  loadAll(): void {
    this.isLoading = true;

    this.publicationService.publicationCurentUser().subscribe({
      next: (res: HttpResponse<IPublication[]>) => {
        this.isLoading = false;
        this.publications = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.publicationService.count().subscribe({
      next:(res: HttpResponse<CountPub[]>) => {
        this.isLoading = false;
        this.countPub = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    })
  }

  ngOnInit(): void {
    this.loadAll();
    this.serviceDoctorant.findActiveUser().pipe(
      mergeMap((doctorant: HttpResponse<Doctorant>) => {
        if (doctorant.body) {
          return of(doctorant.body);
        } else {
          return of(new Doctorant());
        }
      })
    ).subscribe(doctorant=>{
      this.doctorant=doctorant;
    });
  }

  trackId(index: number, item: IPublication): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(publication: IPublication): void {
    const modalRef = this.modalService.open(PublicationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.publication = publication;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
