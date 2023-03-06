import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICursus, Cursus } from '../cursus.model';
import { CursusService } from '../service/cursus.service';

@Component({
  selector: 'jhi-cursus-update',
  templateUrl: './cursus-update.component.html',
})
export class CursusUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [],
    nbFormation: [],
  });

  constructor(protected cursusService: CursusService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cursus }) => {
      this.updateForm(cursus);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cursus = this.createFromForm();
    if (cursus.id !== undefined) {
      this.subscribeToSaveResponse(this.cursusService.update(cursus));
    } else {
      this.subscribeToSaveResponse(this.cursusService.create(cursus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICursus>>): void {
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

  protected updateForm(cursus: ICursus): void {
    this.editForm.patchValue({
      id: cursus.id,
      nom: cursus.nom,
      nbFormation: cursus.nbFormation,
    });
  }

  protected createFromForm(): ICursus {
    return {
      ...new Cursus(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      nbFormation: this.editForm.get(['nbFormation'])!.value,
    };
  }
}
