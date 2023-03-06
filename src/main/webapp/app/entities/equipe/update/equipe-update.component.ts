import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEquipe, Equipe } from '../equipe.model';
import { EquipeService } from '../service/equipe.service';
import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { LaboratoireService } from 'app/entities/laboratoire/service/laboratoire.service';

@Component({
  selector: 'jhi-equipe-update',
  templateUrl: './equipe-update.component.html',
})
export class EquipeUpdateComponent implements OnInit {
  isSaving = false;

  laboratoiresSharedCollection: ILaboratoire[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    abreviation: [null, [Validators.required]],
    laboratoire: [],
  });

  constructor(
    protected equipeService: EquipeService,
    protected laboratoireService: LaboratoireService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipe }) => {
      this.updateForm(equipe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const equipe = this.createFromForm();
    if (equipe.id !== undefined) {
      this.subscribeToSaveResponse(this.equipeService.update(equipe));
    } else {
      this.subscribeToSaveResponse(this.equipeService.create(equipe));
    }
  }

  trackLaboratoireById(index: number, item: ILaboratoire): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEquipe>>): void {
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

  protected updateForm(equipe: IEquipe): void {
    this.editForm.patchValue({
      id: equipe.id,
      nom: equipe.nom,
      abreviation: equipe.abreviation,
      laboratoire: equipe.laboratoire,
    });

    this.laboratoiresSharedCollection = this.laboratoireService.addLaboratoireToCollectionIfMissing(
      this.laboratoiresSharedCollection,
      equipe.laboratoire
    );
  }

  protected loadRelationshipsOptions(): void {
    this.laboratoireService
      .query()
      .pipe(map((res: HttpResponse<ILaboratoire[]>) => res.body ?? []))
      .pipe(
        map((laboratoires: ILaboratoire[]) =>
          this.laboratoireService.addLaboratoireToCollectionIfMissing(laboratoires, this.editForm.get('laboratoire')!.value)
        )
      )
      .subscribe((laboratoires: ILaboratoire[]) => (this.laboratoiresSharedCollection = laboratoires));
  }

  protected createFromForm(): IEquipe {
    return {
      ...new Equipe(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      abreviation: this.editForm.get(['abreviation'])!.value,
      laboratoire: this.editForm.get(['laboratoire'])!.value,
    };
  }
}
