import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDoctorant, Doctorant } from '../doctorant.model';
import { DoctorantService } from '../service/doctorant.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ISujet } from 'app/entities/sujet/sujet.model';
import { SujetService } from 'app/entities/sujet/service/sujet.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPromotion } from 'app/entities/promotion/promotion.model';
import { PromotionService } from 'app/entities/promotion/service/promotion.service';
import { ICursus } from 'app/entities/cursus/cursus.model';
import { CursusService } from 'app/entities/cursus/service/cursus.service';
import {AccountService} from "../../../core/auth/account.service";
import {Account} from "../../../core/auth/account.model";
import {IExtraUser} from "../../extra-user/extra-user.model";

@Component({
  selector: 'jhi-doctorant-update',
  templateUrl: './doctorant-update.component.html',
  styleUrls : ['./doctorant.scss']
})
export class DoctorantUpdateComponent implements OnInit {
  isSaving = false;
  account!: Account;
  doctorants?: IDoctorant[];

  sujetsCollection: ISujet[] = [];
  usersSharedCollection: IUser[] = [];
  promotionsSharedCollection: IPromotion[] = [];
  cursusesSharedCollection: ICursus[] = [];
  encadren!:IExtraUser;
  sujeta!:ISujet;
  editForm = this.fb.group({
    id: [],
    cne: [null, [Validators.required]],
    etatProfessionnel: [null, [Validators.required, Validators.min(0), Validators.max(3)]],
    photoCNEPile: [],
    photoCNEPileContentType: [],
    photoCNEFace: [],
    photoCNEFaceContentType: [],
    photoCv: [],
    photoCvContentType: [],
    anneeInscription: [],
    etatDossier: [],
    cin: [null, [Validators.required]],
    dateNaissance: [null, [Validators.required]],
    lieuNaissance: [null, [Validators.required]],
    nationalite: [null, [Validators.required]],
    adresse: [null, [Validators.required]],
    numeroTelephone: [null, [Validators.required]],
    genre: [null, [Validators.required]],
    nomArabe: [null, [Validators.required]],
    prnomArabe: [null, [Validators.required]],
    sujet: [],
    user: [],
    promotion: [],
    cursus: [],
  });

  constructor(
    private accountService: AccountService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected doctorantService: DoctorantService,
    protected sujetService: SujetService,
    protected userService: UserService,
    protected promotionService: PromotionService,
    protected cursusService: CursusService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ doctorant }) => {
      if (doctorant.id === undefined) {
        const today = dayjs().startOf('day');
        doctorant.dateNaissance = today;
      }
      if(doctorant.sujet){
        this.sujeta=doctorant.sujet;
        this.getEncadrent(this.sujeta.encadrent);
      }

      this.updateForm(doctorant);

      this.loadRelationshipsOptions();
    });
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  getEncadrent(a: any):void{
    this.encadren=a;
  }
  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('doctorantApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const doctorant = this.createFromForm();
    if (doctorant.id !== undefined) {
      this.subscribeToSaveResponse(this.doctorantService.update(doctorant));
    } else {
      this.subscribeToSaveResponse(this.doctorantService.create(doctorant));
    }
  }

  trackSujetById(index: number, item: ISujet): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackPromotionById(index: number, item: IPromotion): number {
    return item.id!;
  }

  trackCursusById(index: number, item: ICursus): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDoctorant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(doctorant: IDoctorant): void {
    this.editForm.patchValue({
      id: doctorant.id,
      cne: doctorant.cne,
      etatProfessionnel: doctorant.etatProfessionnel,
      photoCNEPile: doctorant.photoCNEPile,
      photoCNEPileContentType: doctorant.photoCNEPileContentType,
      photoCNEFace: doctorant.photoCNEFace,
      photoCNEFaceContentType: doctorant.photoCNEFaceContentType,
      photoCv: doctorant.photoCv,
      photoCvContentType: doctorant.photoCvContentType,
      anneeInscription: doctorant.anneeInscription,
      etatDossier: doctorant.etatDossier,
      cin: doctorant.cin,
      dateNaissance: doctorant.dateNaissance ? doctorant.dateNaissance.format(DATE_TIME_FORMAT) : null,
      lieuNaissance: doctorant.lieuNaissance,
      nationalite: doctorant.nationalite,
      adresse: doctorant.adresse,
      numeroTelephone: doctorant.numeroTelephone,
      genre: doctorant.genre,
      nomArabe: doctorant.nomArabe,
      prnomArabe: doctorant.prnomArabe,
      sujet: doctorant.sujet,
      user: doctorant.user,
      promotion: doctorant.promotion,
      cursus: doctorant.cursus,
    });

    this.sujetsCollection = this.sujetService.addSujetToCollectionIfMissing(this.sujetsCollection, doctorant.sujet);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, doctorant.user);
    this.promotionsSharedCollection = this.promotionService.addPromotionToCollectionIfMissing(
      this.promotionsSharedCollection,
      doctorant.promotion
    );
    this.cursusesSharedCollection = this.cursusService.addCursusToCollectionIfMissing(this.cursusesSharedCollection, doctorant.cursus);
  }

  protected loadRelationshipsOptions(): void {
    this.sujetService
      .query1({ filter: 'doctorant-is-null' })
      .pipe(map((res: HttpResponse<ISujet[]>) => res.body ?? []))
      .pipe(map((sujets: ISujet[]) =>
      this.sujetService.addSujetToCollectionIfMissing(sujets, this.editForm.get('sujet')!.value)))
      .subscribe((sujets: ISujet[]) =>(this.sujetsCollection = sujets));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.promotionService
      .query()
      .pipe(map((res: HttpResponse<IPromotion[]>) => res.body ?? []))
      .pipe(
        map((promotions: IPromotion[]) =>
          this.promotionService.addPromotionToCollectionIfMissing(promotions, this.editForm.get('promotion')!.value)
        )
      )
      .subscribe((promotions: IPromotion[]) => (this.promotionsSharedCollection = promotions));

    this.cursusService
      .query()
      .pipe(map((res: HttpResponse<ICursus[]>) => res.body ?? []))
      .pipe(map((cursuses: ICursus[]) => this.cursusService.addCursusToCollectionIfMissing(cursuses, this.editForm.get('cursus')!.value)))
      .subscribe((cursuses: ICursus[]) => (this.cursusesSharedCollection = cursuses));
  }


  protected createFromForm(): IDoctorant {
    return {
      ...new Doctorant(),
      id: this.editForm.get(['id'])!.value,
      cne: this.editForm.get(['cne'])!.value,
      etatProfessionnel: this.editForm.get(['etatProfessionnel'])!.value,
      photoCNEPileContentType: this.editForm.get(['photoCNEPileContentType'])!.value,
      photoCNEPile: this.editForm.get(['photoCNEPile'])!.value,
      photoCNEFaceContentType: this.editForm.get(['photoCNEFaceContentType'])!.value,
      photoCNEFace: this.editForm.get(['photoCNEFace'])!.value,
      photoCvContentType: this.editForm.get(['photoCvContentType'])!.value,
      photoCv: this.editForm.get(['photoCv'])!.value,
      anneeInscription: this.editForm.get(['anneeInscription'])!.value,
      etatDossier: this.editForm.get(['etatDossier'])!.value,
      cin: this.editForm.get(['cin'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value
        ? dayjs(this.editForm.get(['dateNaissance'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lieuNaissance: this.editForm.get(['lieuNaissance'])!.value,
      nationalite: this.editForm.get(['nationalite'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      numeroTelephone: this.editForm.get(['numeroTelephone'])!.value,
      genre: this.editForm.get(['genre'])!.value,
      nomArabe: this.editForm.get(['nomArabe'])!.value,
      prnomArabe: this.editForm.get(['prnomArabe'])!.value,
      sujet: this.editForm.get(['sujet'])!.value,
      user: this.editForm.get(['user'])!.value,
      promotion: this.editForm.get(['promotion'])!.value,
      cursus: this.editForm.get(['cursus'])!.value,
    };
  }

}
