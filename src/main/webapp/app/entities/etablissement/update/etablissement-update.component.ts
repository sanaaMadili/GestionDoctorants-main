import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEtablissement, Etablissement } from '../etablissement.model';
import { EtablissementService } from '../service/etablissement.service';
import { IFormationDoctorant } from 'app/entities/formation-doctorant/formation-doctorant.model';
import { FormationDoctorantService } from 'app/entities/formation-doctorant/service/formation-doctorant.service';

@Component({
  selector: 'jhi-etablissement-update',
  templateUrl: './etablissement-update.component.html',
})
export class EtablissementUpdateComponent implements OnInit {
  isSaving = false;

  formationDoctorantsSharedCollection: IFormationDoctorant[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    ville: [],
    universite: [],
    addresse: [],
    formationDoctorant: [],
  });

  constructor(
    protected etablissementService: EtablissementService,
    protected formationDoctorantService: FormationDoctorantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etablissement }) => {
      this.updateForm(etablissement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etablissement = this.createFromForm();
    if (etablissement.id !== undefined) {
      this.subscribeToSaveResponse(this.etablissementService.update(etablissement));
    } else {
      this.subscribeToSaveResponse(this.etablissementService.create(etablissement));
    }
  }

  trackFormationDoctorantById(index: number, item: IFormationDoctorant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtablissement>>): void {
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

  protected updateForm(etablissement: IEtablissement): void {
    this.editForm.patchValue({
      id: etablissement.id,
      nom: etablissement.nom,
      ville: etablissement.ville,
      universite: etablissement.universite,
      addresse: etablissement.addresse,
      formationDoctorant: etablissement.formationDoctorant,
    });

    this.formationDoctorantsSharedCollection = this.formationDoctorantService.addFormationDoctorantToCollectionIfMissing(
      this.formationDoctorantsSharedCollection,
      etablissement.formationDoctorant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.formationDoctorantService
      .query()
      .pipe(map((res: HttpResponse<IFormationDoctorant[]>) => res.body ?? []))
      .pipe(
        map((formationDoctorants: IFormationDoctorant[]) =>
          this.formationDoctorantService.addFormationDoctorantToCollectionIfMissing(
            formationDoctorants,
            this.editForm.get('formationDoctorant')!.value
          )
        )
      )
      .subscribe((formationDoctorants: IFormationDoctorant[]) => (this.formationDoctorantsSharedCollection = formationDoctorants));
  }

  protected createFromForm(): IEtablissement {
    return {
      ...new Etablissement(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      ville: this.editForm.get(['ville'])!.value,
      universite: this.editForm.get(['universite'])!.value,
      addresse: this.editForm.get(['addresse'])!.value,
      formationDoctorant: this.editForm.get(['formationDoctorant'])!.value,
    };
  }
}
