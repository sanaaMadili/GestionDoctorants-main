import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFormationDoctoranle, FormationDoctoranle } from '../formation-doctoranle.model';
import { FormationDoctoranleService } from '../service/formation-doctoranle.service';

@Component({
  selector: 'jhi-formation-doctoranle-update',
  templateUrl: './formation-doctoranle-update.component.html',
})
export class FormationDoctoranleUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    thematique: [null, [Validators.required]],
    description: [],
  });

  constructor(
    protected formationDoctoranleService: FormationDoctoranleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formationDoctoranle }) => {
      this.updateForm(formationDoctoranle);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formationDoctoranle = this.createFromForm();
    if (formationDoctoranle.id !== undefined) {
      this.subscribeToSaveResponse(this.formationDoctoranleService.update(formationDoctoranle));
    } else {
      this.subscribeToSaveResponse(this.formationDoctoranleService.create(formationDoctoranle));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormationDoctoranle>>): void {
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

  protected updateForm(formationDoctoranle: IFormationDoctoranle): void {
    this.editForm.patchValue({
      id: formationDoctoranle.id,
      thematique: formationDoctoranle.thematique,
      description: formationDoctoranle.description,
    });
  }

  protected createFromForm(): IFormationDoctoranle {
    return {
      ...new FormationDoctoranle(),
      id: this.editForm.get(['id'])!.value,
      thematique: this.editForm.get(['thematique'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
