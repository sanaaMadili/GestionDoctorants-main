import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISujet, Sujet } from '../sujet.model';
import { SujetService } from '../service/sujet.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

@Component({
  selector: 'jhi-sujet-update',
  templateUrl: './sujet-update.component.html',
})
export class SujetUpdateComponent implements OnInit {
  isSaving = false;

  extraUsersSharedCollection: IExtraUser[] = [];

  editForm = this.fb.group({
    id: [],
    titre: [null, [Validators.required]],
    description: [null, [Validators.required]],
    domaines: [],
    motsCles: [],
    context: [],
    profilRecherchees: [],
    annee: [null, [Validators.required]],
    reference: [],
    candidatures: [],
    coencadrent: [],
    encadrent: [],
  });

  constructor(
    protected sujetService: SujetService,
    protected extraUserService: ExtraUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sujet }) => {
      this.updateForm(sujet);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sujet = this.createFromForm();
    if (sujet.id !== undefined) {
      this.subscribeToSaveResponse(this.sujetService.update(sujet));
    } else {
      this.subscribeToSaveResponse(this.sujetService.create(sujet));
    }
  }

  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISujet>>): void {
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

  protected updateForm(sujet: ISujet): void {
    this.editForm.patchValue({
      id: sujet.id,
      titre: sujet.titre,
      description: sujet.description,
      domaines: sujet.domaines,
      motsCles: sujet.motsCles,
      context: sujet.context,
      profilRecherchees: sujet.profilRecherchees,
      annee: sujet.annee,
      reference: sujet.reference,
      candidatures: sujet.candidatures,
      coencadrent: sujet.coencadrent,
      encadrent: sujet.encadrent,
    });

    this.extraUsersSharedCollection = this.extraUserService.addExtraUserToCollectionIfMissing(
      this.extraUsersSharedCollection,
      sujet.encadrent
    );
  }

  protected loadRelationshipsOptions(): void {
    this.extraUserService
      .query()
      .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
      .pipe(
        map((extraUsers: IExtraUser[]) =>
          this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('encadrent')!.value)
        )
      )
      .subscribe((extraUsers: IExtraUser[]) => (this.extraUsersSharedCollection = extraUsers));
  }

  protected createFromForm(): ISujet {
    return {
      ...new Sujet(),
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      description: this.editForm.get(['description'])!.value,
      domaines: this.editForm.get(['domaines'])!.value,
      motsCles: this.editForm.get(['motsCles'])!.value,
      context: this.editForm.get(['context'])!.value,
      profilRecherchees: this.editForm.get(['profilRecherchees'])!.value,
      annee: this.editForm.get(['annee'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      candidatures: this.editForm.get(['candidatures'])!.value,
      coencadrent: this.editForm.get(['coencadrent'])!.value,
      encadrent: this.editForm.get(['encadrent'])!.value,
    };
  }
}
