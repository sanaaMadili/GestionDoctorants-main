import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChefEquipe, ChefEquipe } from '../chef-equipe.model';
import { ChefEquipeService } from '../service/chef-equipe.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';
import { IEquipe } from 'app/entities/equipe/equipe.model';
import { EquipeService } from 'app/entities/equipe/service/equipe.service';

@Component({
  selector: 'jhi-chef-equipe-update',
  templateUrl: './chef-equipe-update.component.html',
})
export class ChefEquipeUpdateComponent implements OnInit {
  isSaving = false;

  extraUsersCollection: IExtraUser[] = [];
  equipesCollection: IEquipe[] = [];

  editForm = this.fb.group({
    id: [],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    extraUser: [],
    equipe: [],
  });

  constructor(
    protected chefEquipeService: ChefEquipeService,
    protected extraUserService: ExtraUserService,
    protected equipeService: EquipeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chefEquipe }) => {
      this.updateForm(chefEquipe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chefEquipe = this.createFromForm();
    if (chefEquipe.id !== undefined) {
      this.subscribeToSaveResponse(this.chefEquipeService.update(chefEquipe));
    } else {
      this.subscribeToSaveResponse(this.chefEquipeService.create(chefEquipe));
    }
  }

  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }

  trackEquipeById(index: number, item: IEquipe): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChefEquipe>>): void {
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

  protected updateForm(chefEquipe: IChefEquipe): void {
    this.editForm.patchValue({
      id: chefEquipe.id,
      dateDebut: chefEquipe.dateDebut,
      dateFin: chefEquipe.dateFin,
      extraUser: chefEquipe.extraUser,
      equipe: chefEquipe.equipe,
    });

    this.extraUsersCollection = this.extraUserService.addExtraUserToCollectionIfMissing(this.extraUsersCollection, chefEquipe.extraUser);
    this.equipesCollection = this.equipeService.addEquipeToCollectionIfMissing(this.equipesCollection, chefEquipe.equipe);
  }

  protected loadRelationshipsOptions(): void {
    this.extraUserService
      .querymembre({ filter: 'chefequipe-is-null' })
      .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
      .pipe(
        map((extraUsers: IExtraUser[]) =>
          this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('extraUser')!.value)
        )
      )
      .subscribe((extraUsers: IExtraUser[]) => (this.extraUsersCollection = extraUsers));

    this.equipeService
      .query({ filter: 'chefequipe-is-null' })
      .pipe(map((res: HttpResponse<IEquipe[]>) => res.body ?? []))
      .pipe(map((equipes: IEquipe[]) => this.equipeService.addEquipeToCollectionIfMissing(equipes, this.editForm.get('equipe')!.value)))
      .subscribe((equipes: IEquipe[]) => (this.equipesCollection = equipes));
  }

  protected createFromForm(): IChefEquipe {
    return {
      ...new ChefEquipe(),
      id: this.editForm.get(['id'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
      extraUser: this.editForm.get(['extraUser'])!.value,
      equipe: this.editForm.get(['equipe'])!.value,
    };
  }
}
