import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { IProfile } from '../profile.model';
import { ProfileService } from '../service/profile.service';
import { ProfileDeleteDialogComponent } from '../delete/profile-delete-dialog.component';
import {AccountService} from "../../../core/auth/account.service";
import {Account} from "../../../core/auth/account.model";
import {mergeMap} from "rxjs/operators";
import {Doctorant, IDoctorant} from "../../doctorant/doctorant.model";
import {Observable, of} from "rxjs";
import {DoctorantService} from "../../doctorant/service/doctorant.service";
import {IFormation} from "../../formation/formation.model";
import {FormationService} from "../../formation/service/formation.service";
import {FormationDoctorant, IFormationDoctorant} from "../../formation-doctorant/formation-doctorant.model";
import {FormationDoctorantService} from "../../formation-doctorant/service/formation-doctorant.service";
import {ILaboratoire} from "../../laboratoire/laboratoire.model";
import {Bac, IBac} from "../../bac/bac.model";
import {BacService} from "../../bac/service/bac.service";
import { DataUtils } from 'app/core/util/data-util.service';
import {IPublication} from "../../publication/publication.model";
import {CountPub} from "../../ChartsModels/CountPub";
import {PublicationService} from "../../publication/service/publication.service";
import {CountPubByType} from "../../ChartsModels/CountPubByType";
import {Label} from "ng2-charts";


@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent implements OnInit {
  isLoading = false;
  account!: Account;
  doctorant!:IDoctorant;
  formations!: IFormation[];
  formationDoctorant!:FormationDoctorant[];
  bac!:IBac;
  show = false;
  publications?: IPublication[];
  countPubByType!:CountPubByType[];
  counts3!:number[] ;
  type!:Label[] ;
  types!:string[];
  login!:string;

  constructor(protected publicationService: PublicationService,public _sanitizer: DomSanitizer,protected dataUtils: DataUtils, protected bacService: BacService, protected formationDoctorantService:FormationDoctorantService, protected formationService: FormationService, protected serviceDoctorant: DoctorantService, protected modalService: NgbModal, private accountService: AccountService) {}

  loadAll(): void {
    this.isLoading = true;
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
        this.login=account.login;
      }
    });
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
    this.formationService.getformations().subscribe({
      next: (res: HttpResponse<IFormation[]>) => {
        this.isLoading = false;
        this.formations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.formationDoctorantService.findformation().subscribe({
      next: (res: HttpResponse<IFormationDoctorant[]>) => {
        this.isLoading = false;
        this.formationDoctorant = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });


  }

  ngOnInit(): void {
    this.loadAll();

    this.publicationService.publicationCurentUser().subscribe({
      next: (res: HttpResponse<IPublication[]>) => {
        this.isLoading = false;
        this.publications = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.up().subscribe((value:IBac)=>this.bac=value);
    this.publicationService.PublicationType().subscribe({
      next: (res: HttpResponse<string[]>) => {
        this.types = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.publicationService.countTypeCurentUser().subscribe({
      next: (res: HttpResponse<CountPubByType[]>) => {
        this.countPubByType = res.body ?? [];
        for (const a of this.countPubByType) {
          this.type.push(a.type.toString())
          this.counts3.push(a.count)
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }



  up(): Observable<IBac> | Observable<never> {
    return this.bacService.findActive().pipe(
      mergeMap((bac: HttpResponse<Bac>) => {
        if (bac.body) {
          return of(bac.body);
        } else {
          return of(new Bac());
        }
      })
    );
  }

  decode(base64String: string):SafeResourceUrl{
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

  change():void{
    this.show =! this.show;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }


}
