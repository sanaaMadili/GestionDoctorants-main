import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { IMembreEquipe, MembreEquipe } from '../membre-equipe.model';
import { MembreEquipeService } from '../service/membre-equipe.service';
import { IEquipe } from 'app/entities/equipe/equipe.model';
import { EquipeService } from 'app/entities/equipe/service/equipe.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

@Component({
  selector: 'jhi-membre-equipe-update',
  templateUrl: './membre-equipe-update.component.html',
})
export class MembreEquipeUpdateComponent implements OnInit {
  isSaving = false;

  equipesSharedCollection: IEquipe[] = [];
  extraUsersSharedCollection: IExtraUser[] = [];
  membreEquipe!:IMembreEquipe;
  editForm = this.fb.group({
    id: [],
    dateDebut: [null, [Validators.required]],
    datefin: [],
    equipe: [],
    extraUser: [],
  });

  constructor(
    protected membreEquipeService: MembreEquipeService,
    protected equipeService: EquipeService,
    protected extraUserService: ExtraUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ membreEquipe }) => {
      this.updateForm(membreEquipe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
this.membreEquipe = this.createFromForm();
    if (this.membreEquipe.id !== undefined) {
      this.subscribeToSaveResponse(this.membreEquipeService.update(this.membreEquipe));
    } else {
      this.subscribeToSaveResponse(this.membreEquipeService.updatedate(this.membreEquipe.extraUser!.id!));
    }
  }

  trackEquipeById(index: number, item: IEquipe): number {
    return item.id!;
  }

  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMembreEquipe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.subscribeToSaveResponse1(this.membreEquipeService.create(this.membreEquipe)),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponse1(result: Observable<HttpResponse<IMembreEquipe>>): void {
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

  protected updateForm(membreEquipe: IMembreEquipe): void {
    this.editForm.patchValue({
      id: membreEquipe.id,
      dateDebut: membreEquipe.dateDebut,
      datefin: membreEquipe.datefin,
      equipe: membreEquipe.equipe,
      extraUser: membreEquipe.extraUser,
    });

    this.equipesSharedCollection = this.equipeService.addEquipeToCollectionIfMissing(this.equipesSharedCollection, membreEquipe.equipe);
    this.extraUsersSharedCollection = this.extraUserService.addExtraUserToCollectionIfMissing(
      this.extraUsersSharedCollection,
      membreEquipe.extraUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.equipeService
      .querychefequipe()
      .pipe(map((res: HttpResponse<IEquipe[]>) => res.body ?? []))
      .pipe(map((equipes: IEquipe[]) => this.equipeService.addEquipeToCollectionIfMissing(equipes, this.editForm.get('equipe')!.value)))
      .subscribe((equipes: IEquipe[]) => (this.equipesSharedCollection = equipes));

    this.extraUserService
      .query()
      .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
      .pipe(
        map((extraUsers: IExtraUser[]) =>
          this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('extraUser')!.value)
        )
      )
      .subscribe((extraUsers: IExtraUser[]) => (this.extraUsersSharedCollection = extraUsers));
  }

  protected createFromForm(): IMembreEquipe {
    return {
      ...new MembreEquipe(),
      id: this.editForm.get(['id'])!.value,
      dateDebut:dayjs(),
      datefin: dayjs().set('year', 0).set('month', 0).set('day', 0),
      equipe: this.equipesSharedCollection[0],
      extraUser: this.editForm.get(['extraUser'])!.value,
    };
  }
}
