import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Doctorant, IDoctorant} from '../doctorant.model';
import { DataUtils } from 'app/core/util/data-util.service';
import {Account} from "../../../core/auth/account.model";
import {IFormation} from "../../formation/formation.model";
import {FormationDoctorant, IFormationDoctorant} from "../../formation-doctorant/formation-doctorant.model";
import {Bac, IBac} from "../../bac/bac.model";
import {HttpResponse} from "@angular/common/http";
import {BacService} from "../../bac/service/bac.service";
import {FormationDoctorantService} from "../../formation-doctorant/service/formation-doctorant.service";
import {FormationService} from "../../formation/service/formation.service";
import {DoctorantService} from "../service/doctorant.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../../core/auth/account.service";
import {Observable, of} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UserManagementService} from "../../../admin/user-management/service/user-management.service";
import {IPublication} from "../../publication/publication.model";
import {CountPub} from "../../ChartsModels/CountPub";
import {PublicationService} from "../../publication/service/publication.service";
import {CountPubByType} from "../../ChartsModels/CountPubByType";

@Component({
  selector: 'jhi-doctorant-detail',
  templateUrl: './doctorant-detail.component.html',
  styleUrls: ['./profile.scss'],
})
export class DoctorantDetailComponent implements OnInit {
  doctorant!: IDoctorant ;
  formations!: IFormation[];
  formationDoctorant!:FormationDoctorant[];
  bac!:IBac;
  isLoading = false;
  publications?: IPublication[];
  countPub!:CountPub[];
  countPubByType!:CountPubByType[];
  types!:string[];
  login!:string;

  constructor(protected publicationService: PublicationService,protected doctorantService: DoctorantService,private userService: UserManagementService,public _sanitizer: DomSanitizer,protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, protected bacService: BacService, protected formationDoctorantService:FormationDoctorantService, protected formationService: FormationService, protected serviceDoctorant: DoctorantService, protected modalService: NgbModal, private accountService: AccountService) {}
  loadAll(): void {
    this.activatedRoute.data.subscribe(({ doctorant }) => {
      this.doctorant = doctorant;
      this.login=doctorant.user?.login;
      this.formationDoctorantService.findByDoctorant(doctorant.id).subscribe({
        next: (res: HttpResponse<IFormationDoctorant[]>) => {
          this.isLoading = true;
          this.formationDoctorant = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
      this.formationService.findbyDoctorant(doctorant.id).subscribe({
        next: (res: HttpResponse<IFormation[]>) => {
          this.isLoading = false;
          this.formations = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
      this.up(doctorant.id).subscribe((value:IBac)=>this.bac=value);
      this.publicationService.findByUser(doctorant.user?.id).subscribe({
        next: (res: HttpResponse<IPublication[]>) => {
          this.isLoading = false;
          this.publications = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
      this.publicationService.PublicationTypeByuser(doctorant?.user.login).subscribe({
        next: (res: HttpResponse<string[]>) => {
          this.types = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
      this.publicationService.countTypeByUser(doctorant.user?.id).subscribe({
        next:(res: HttpResponse<CountPubByType[]>) => {
          this.countPubByType = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });

      this.publicationService.countByUser(doctorant.user?.id).subscribe({
        next:(res: HttpResponse<CountPub[]>) => {
          this.isLoading = false;
          this.countPub = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
    });



  }
  ngOnInit(): void {
this.loadAll();

  }

  up(id:number): Observable<IBac> | Observable<never> {
    return this.bacService.findBacDoctorant(id).pipe(
      mergeMap((bac: HttpResponse<Bac>) => {
        if (bac.body) {
          return of(bac.body);
        } else {
          return of(new Bac());
        }
      })
    );
  }


  decode2(base64String: string):SafeResourceUrl{
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
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
  setActive(user: Doctorant, isActivated: number): void {
    this.doctorantService.update({ ...user, etatDossier: isActivated,anneeInscription:new Date().getFullYear() }).subscribe(() => this.loadAll());
  }
}
