import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Doctorant, IDoctorant} from '../doctorant.model';
import { DoctorantService } from '../service/doctorant.service';
import { DoctorantDeleteDialogComponent } from '../delete/doctorant-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {BourseUpdateComponent} from "../../bourse/update/bourse-update.component";
import {BourseAddDialogComponent} from "../../bourse/add/bourse-add-dialog.component";
import {BourseService} from "../../bourse/service/bourse.service";
import {IFormationDoctorant} from "../../formation-doctorant/formation-doctorant.model";
import {Bourse, IBourse} from "../../bourse/bourse.model";
import {mergeMap} from "rxjs/operators";
import {Bac, IBac} from "../../bac/bac.model";
import {Observable, of, Subscription} from "rxjs";
import {DoctorantSuccessDialogComponent} from "../success/doctorant-success-dialog.component";

@Component({
  selector: 'jhi-doctorant',
  templateUrl: './doctorant.component.html',
})
export class DoctorantComponent implements OnInit {
  doctorants?: IDoctorant[];
  isLoading = false;
  dtOptions: DataTables.Settings = {};
  bourses: number[]=[];
  m!:number;


  constructor(protected bourseService: BourseService,public _sanitizer: DomSanitizer,protected doctorantService: DoctorantService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;
    this.test2();
    this.doctorantService.query().subscribe({
      next: (res: HttpResponse<IDoctorant[]>) => {
        this.isLoading = false;
        this.doctorants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });

  }

  ngOnInit(): void {
    this.loadAll();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      searching: true
    };
  }

  trackId(index: number, item: IDoctorant): number {
    return item.id!;
  }
  reinscription(): Observable<number> {
    return this.doctorantService.reinscription().pipe(
      mergeMap((bac: HttpResponse<number>) => {
        if (bac.body) {
          return of(bac.body);
        } else {
          return of(0);
        }
      })
    );
  }
  reinscriptionbtn(): void {
    this.reinscription().subscribe((value:number)=>this.loadAll());
    const modalRef = this.modalService.open(DoctorantSuccessDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.closed.subscribe(() => this.loadAll());

  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }
  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }


  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(doctorant: IDoctorant): void {
    const modalRef = this.modalService.open(DoctorantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.doctorant = doctorant;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  bourse(doctorant: IDoctorant): void {
    const modalRef = this.modalService.open(BourseAddDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.doc = doctorant;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      this.loadAll();
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }


  test2(): void{
     this.bourseService.findDocs().subscribe({
      next: (res: HttpResponse<number[]>) => {
        this.isLoading = false;
        this.bourses = res.body ?? [];
      }
    })
  }

  setActive(user: Doctorant, isActivated: number): void {
    if(user.anneeInscription===null){
      this.doctorantService.update({ ...user, etatDossier: isActivated,anneeInscription:new Date().getFullYear() }).subscribe(() => this.loadAll());
    }else{
      this.doctorantService.update({ ...user, etatDossier: isActivated }).subscribe(() => this.loadAll());

    }
  }
}
