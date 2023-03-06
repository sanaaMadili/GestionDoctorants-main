import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChefLab, ChefLab } from '../chef-lab.model';
import { ChefLabService } from '../service/chef-lab.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';
import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { LaboratoireService } from 'app/entities/laboratoire/service/laboratoire.service';

@Component({
  selector: 'jhi-chef-lab-update',
  templateUrl: './chef-lab-update.component.html',
})
export class ChefLabUpdateComponent implements OnInit {
  isSaving = false;

  extraUsersCollection: IExtraUser[] = [];
  laboratoiresCollection: ILaboratoire[] = [];

  editForm = this.fb.group({
    id: [],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    extraUser: [],
    laboratoire: [],
  });

  constructor(
    protected chefLabService: ChefLabService,
    protected extraUserService: ExtraUserService,
    protected laboratoireService: LaboratoireService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chefLab }) => {
      this.updateForm(chefLab);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chefLab = this.createFromForm();
    if (chefLab.id !== undefined) {
      this.subscribeToSaveResponse(this.chefLabService.update(chefLab));
    } else {
      this.subscribeToSaveResponse(this.chefLabService.create(chefLab));
    }
  }

  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }

  trackLaboratoireById(index: number, item: ILaboratoire): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChefLab>>): void {
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

  protected updateForm(chefLab: IChefLab): void {
    this.editForm.patchValue({
      id: chefLab.id,
      dateDebut: chefLab.dateDebut,
      dateFin: chefLab.dateFin,
      extraUser: chefLab.extraUser,
      laboratoire: chefLab.laboratoire,
    });

    this.extraUsersCollection = this.extraUserService.addExtraUserToCollectionIfMissing(this.extraUsersCollection, chefLab.extraUser);
    this.laboratoiresCollection = this.laboratoireService.addLaboratoireToCollectionIfMissing(
      this.laboratoiresCollection,
      chefLab.laboratoire
    );
  }

  protected loadRelationshipsOptions(): void {
    this.extraUserService
      .query({ filter: 'cheflab-is-null' })
      .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
      .pipe(
        map((extraUsers: IExtraUser[]) =>
          this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('extraUser')!.value)
        )
      )
      .subscribe((extraUsers: IExtraUser[]) => (this.extraUsersCollection = extraUsers));

    this.laboratoireService
      .query({ filter: 'cheflab-is-null' })
      .pipe(map((res: HttpResponse<ILaboratoire[]>) => res.body ?? []))
      .pipe(
        map((laboratoires: ILaboratoire[]) =>
          this.laboratoireService.addLaboratoireToCollectionIfMissing(laboratoires, this.editForm.get('laboratoire')!.value)
        )
      )
      .subscribe((laboratoires: ILaboratoire[]) => (this.laboratoiresCollection = laboratoires));
  }

  protected createFromForm(): IChefLab {
    return {
      ...new ChefLab(),
      id: this.editForm.get(['id'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
      extraUser: this.editForm.get(['extraUser'])!.value,
      laboratoire: this.editForm.get(['laboratoire'])!.value,
    };
  }
}
