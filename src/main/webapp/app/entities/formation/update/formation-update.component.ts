import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFormation, Formation } from '../formation.model';
import { FormationService } from '../service/formation.service';
import { ICursus } from 'app/entities/cursus/cursus.model';
import { CursusService } from 'app/entities/cursus/service/cursus.service';

@Component({
  selector: 'jhi-formation-update',
  templateUrl: './formation-update.component.html',
})
export class FormationUpdateComponent implements OnInit {
  isSaving = false;

  cursusesSharedCollection: ICursus[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    niveau: [],
    nbAnnee: [],
    rang: [],
    cursus: [],
  });

  constructor(
    protected formationService: FormationService,
    protected cursusService: CursusService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formation }) => {
      this.updateForm(formation);
      this.loadRelationshipsOptions();
    });

  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formation = this.createFromForm();
    if (formation.id !== undefined) {
      this.subscribeToSaveResponse(this.formationService.update(formation));
    } else {
      this.subscribeToSaveResponse(this.formationService.create(formation));
    }
  }

  trackCursusById(index: number, item: ICursus): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormation>>): void {
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

  protected updateForm(formation: IFormation): void {
    this.editForm.patchValue({
      id: formation.id,
      nom: formation.nom,
      niveau: formation.niveau,
      nbAnnee: formation.nbAnnee,
      rang: formation.rang,
      cursus: formation.cursus,
    });

    this.cursusesSharedCollection = this.cursusService.addCursusToCollectionIfMissing(this.cursusesSharedCollection, formation.cursus);
  }

  protected loadRelationshipsOptions(): void {
    this.cursusService
      .query()
      .pipe(map((res: HttpResponse<ICursus[]>) => res.body ?? []))
      .pipe(map((cursuses: ICursus[]) => this.cursusService.addCursusToCollectionIfMissing(cursuses, this.editForm.get('cursus')!.value)))
      .subscribe((cursuses: ICursus[]) => (this.cursusesSharedCollection = cursuses));
  }

  protected createFromForm(): IFormation {
    return {
      ...new Formation(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      niveau: this.editForm.get(['niveau'])!.value,
      nbAnnee: this.editForm.get(['nbAnnee'])!.value,
      rang: this.editForm.get(['rang'])!.value,
      cursus: this.editForm.get(['cursus'])!.value,
    };
  }
}
