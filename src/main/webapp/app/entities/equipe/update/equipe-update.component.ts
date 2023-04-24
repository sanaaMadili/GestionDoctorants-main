import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';
import {  ChefEquipe, IChefEquipe } from 'app/entities/chef-equipe/chef-equipe.model';
import { ChefEquipeService } from 'app/entities/chef-equipe/service/chef-equipe.service';
import { IEquipe, Equipe } from '../equipe.model';
import { EquipeService } from '../service/equipe.service';
import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { LaboratoireService } from 'app/entities/laboratoire/service/laboratoire.service';
import dayjs from 'dayjs/esm';
@Component({
  selector: 'jhi-equipe-update',
  templateUrl: './equipe-update.component.html',
})
export class EquipeUpdateComponent implements OnInit {
  isSaving = false;

  laboratoiresSharedCollection: ILaboratoire[] = [];
  extraUsersSharedCollection: IExtraUser[] = [];
  equipe?: IEquipe[];
  chefEquipe!: IChefEquipe;
  equipee!: IEquipe;


  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    abreviation: [null, [Validators.required]],
    laboratoire: [],
    extrauser: [],
  });

  constructor(
    protected equipeService: EquipeService,
    protected laboratoireService: LaboratoireService,
    protected extraUserService: ExtraUserService,
    protected chefequipeservice :ChefEquipeService,

    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipe }) => {
      this.updateForm(equipe);
      this.loadRelationshipsOptions1();
      this.loadRelationshipsOptions();
    });
  }
  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }
  previousState(): void {
    window.history.back();
  }
  save(): void {
    this.isSaving = true;
    this.equipee = this.createFromForm();
    if (this.equipee.id !== undefined) {
        this.subscribeToSaveResponse1(this.equipeService.update(this.equipee));

      if(this.editForm.get(['extrauser'])!.value !== null) {
        this.subscribeToSaveResponseup(this.chefequipeservice.updatedate(this.equipee.id));
      }
    }
      else {this.subscribeToSaveResponse(this.equipeService.create(this.equipee)); }
  }

  trackLaboratoireById(index: number, item: ILaboratoire): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEquipe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () =>this.loadRelationshipsOptions2(),
      error: () => this.onSaveError(),
    });
  }
  protected subscribeToSaveResponseup(result: Observable<HttpResponse<IEquipe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.loadRelationshipsOptionsupdate(),
      error: () => this.onSaveError(),
    });
  }
  protected loadRelationshipsOptionsupdate(): void {
    this.chefEquipe = this.createchefEquipe(this.equipee);
    this.subscribeToSaveResponse1(this.chefequipeservice.create(this.chefEquipe));

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


  }
  protected subscribeToSaveResponse1(result: Observable<HttpResponse<IChefEquipe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
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

  protected loadRelationshipsOptions2(): void {
    this.equipeService.query().subscribe({
      next: (res: HttpResponse<IEquipe[]>) => {
        this.equipe = res.body ?? [];
        this.chefEquipe = this.createchefEquipe(this.equipe.slice(-1)[0]);
        this.subscribeToSaveResponse1(this.chefequipeservice.create(this.chefEquipe));
      },

    });
  }
  protected loadRelationshipsOptions1(): void {
    this.extraUserService
      .query()
      .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
      .pipe(
        map((extraUsers: IExtraUser[]) =>
          this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('extrauser')!.value)
        )
      )
      .subscribe((extraUsers: IExtraUser[]) => (this.extraUsersSharedCollection = extraUsers));
  }

  protected createFromForm(): IEquipe {
    return {
      ...new Equipe(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      abreviation: this.editForm.get(['abreviation'])!.value,
      laboratoire: this.laboratoiresSharedCollection[0],
    };
  }
  protected createchefEquipe(equipe1: IEquipe): IChefEquipe {
    return {
      ...new ChefEquipe(),
      dateDebut:dayjs(),
      dateFin: dayjs().set('year', 0).set('month', 0).set('day', 0),
      extraUser:  this.editForm.get(['extrauser'])!.value,
      equipe : equipe1,
    };
  }
}
