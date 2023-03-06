import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Observable, of} from 'rxjs';
import {finalize, map, mergeMap} from 'rxjs/operators';

import { IPublication, Publication } from '../publication.model';
import { PublicationService } from '../service/publication.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { UserService } from 'app/entities/user/user.service';
import { IChercheurExterne } from 'app/entities/chercheur-externe/chercheur-externe.model';
import { ChercheurExterneService } from 'app/entities/chercheur-externe/service/chercheur-externe.service';
import {Doctorant, IDoctorant} from "../../doctorant/doctorant.model";
import {DoctorantService} from "../../doctorant/service/doctorant.service";
import {IUser} from "../../../admin/user-management/user-management.model";

@Component({
  selector: 'jhi-publication-update',
  templateUrl: './publication-update.component.html',
})
export class PublicationUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  chercheurExternesSharedCollection: IChercheurExterne[] = [];
  doctorant!:IDoctorant;

  editForm = this.fb.group({
    id: [],
    titre: [null, [Validators.required]],
    date: [null, [Validators.required]],
    description: [null, [Validators.required]],
    type: [],
    article: [],
    articleContentType: [],
    chercheurs: [],
    chercheurExternes: [],
    user: [],
  });

  constructor(
    protected serviceDoctorant: DoctorantService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected publicationService: PublicationService,
    protected userService: UserService,
    protected chercheurExterneService: ChercheurExterneService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
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
    this.activatedRoute.data.subscribe(({ publication }) => {
      this.updateForm(publication);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
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
    const publication = this.createFromForm();
    if (publication.id !== undefined) {
      this.subscribeToSaveResponse(this.publicationService.update(publication));
    } else {
      this.subscribeToSaveResponse(this.publicationService.create(publication));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackChercheurExterneById(index: number, item: IChercheurExterne): number {
    return item.id!;
  }

  getSelectedUser(option: IUser, selectedVals?: IUser[]): IUser {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedChercheurExterne(option: IChercheurExterne, selectedVals?: IChercheurExterne[]): IChercheurExterne {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPublication>>): void {
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

  protected updateForm(publication: IPublication): void {
    this.editForm.patchValue({
      id: publication.id,
      titre: publication.titre,
      date: publication.date,
      description: publication.description,
      type: publication.type,
      article: publication.article,
      articleContentType: publication.articleContentType,
      chercheurs: publication.chercheurs,
      chercheurExternes: publication.chercheurExternes,
      user: publication.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      ...(publication.chercheurs ?? []),
      publication.user
    );
    this.chercheurExternesSharedCollection = this.chercheurExterneService.addChercheurExterneToCollectionIfMissing(
      this.chercheurExternesSharedCollection,
      ...(publication.chercheurExternes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(
            users,
            ...(this.editForm.get('chercheurs')!.value ?? []),
            this.editForm.get('user')!.value
          )
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.chercheurExterneService
      .query()
      .pipe(map((res: HttpResponse<IChercheurExterne[]>) => res.body ?? []))
      .pipe(
        map((chercheurExternes: IChercheurExterne[]) =>
          this.chercheurExterneService.addChercheurExterneToCollectionIfMissing(
            chercheurExternes,
            ...(this.editForm.get('chercheurExternes')!.value ?? [])
          )
        )
      )
      .subscribe((chercheurExternes: IChercheurExterne[]) => (this.chercheurExternesSharedCollection = chercheurExternes));
  }

  protected createFromForm(): IPublication {
    return {
      ...new Publication(),
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      date: this.editForm.get(['date'])!.value,
      description: this.editForm.get(['description'])!.value,
      type: this.editForm.get(['type'])!.value,
      articleContentType: this.editForm.get(['articleContentType'])!.value,
      article: this.editForm.get(['article'])!.value,
      chercheurs: this.editForm.get(['chercheurs'])!.value,
      chercheurExternes: this.editForm.get(['chercheurExternes'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
