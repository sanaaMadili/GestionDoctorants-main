/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ILaboratoire, Laboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';
import {  ChefLab, IChefLab } from 'app/entities/chef-lab/chef-lab.model';
import { ChefLabService } from 'app/entities/chef-lab/service/chef-lab.service';

@Component({
  selector: 'jhi-laboratoire-update',
  templateUrl: './laboratoire-update.component.html',
})

export class LaboratoireUpdateComponent implements OnInit {
  isSaving = false;
  laboratoire!: ILaboratoire;
  chefLaboratoire!: IChefLab;
  laboratoires?: ILaboratoire[];


  extraUsersSharedCollection: IExtraUser[] = [];
  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    abreviation: [null, [Validators.required]],
    extrauser: [],

  });

  constructor(protected laboratoireService :LaboratoireService ,
     protected cheflaboratoireservice : ChefLabService , protected extraUserService: ExtraUserService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ laboratoire }) => {
      this.updateForm(laboratoire);
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();

  }

  save(): void {
    this.isSaving = true;
    this.laboratoire = this.createFromForm();
    if (this.laboratoire.id !== undefined) {
      this.subscribeToSaveResponse1(this.laboratoireService.update(this.laboratoire));
      if(this.editForm.get(['extrauser'])!.value !== null){
      this.subscribeToSaveResponseup(this.cheflaboratoireservice.updatedate(this.laboratoire.id));}

    } else {
      this.subscribeToSaveResponse(this.laboratoireService.create(this.laboratoire));
    }
  }

  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILaboratoire>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.loadRelationshipsOptions1(),
      error: () => this.onSaveError(),
    });
  }
  protected subscribeToSaveResponse1(result: Observable<HttpResponse<IChefLab>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }



  protected subscribeToSaveResponseup(result: Observable<HttpResponse<ILaboratoire>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.loadRelationshipsOptionsupdate(),
      error: () => this.onSaveError(),
    });
  }
  protected subscribeToSaveResponseip1(result: Observable<HttpResponse<IChefLab>>): void {
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

  protected updateForm(laboratoire: ILaboratoire): void {
    this.editForm.patchValue({
      id: laboratoire.id,
      nom: laboratoire.nom,
      abreviation: laboratoire.abreviation

    });



}
protected loadRelationshipsOptions(): void {
  this.extraUserService
    .query1()
    .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
    .pipe(
      map((extraUsers: IExtraUser[]) =>
        this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('extrauser')!.value)
      )
    )
    .subscribe((extraUsers: IExtraUser[]) => (this.extraUsersSharedCollection = extraUsers));
}


protected loadRelationshipsOptions1(): void {
  this.laboratoireService.query().subscribe({
    next: (res: HttpResponse<ILaboratoire[]>) => {
      this.laboratoires = res.body ?? [];
      this.chefLaboratoire = this.createcheflabo(this.laboratoires.slice(-1)[0]);
      this.subscribeToSaveResponse1(this.cheflaboratoireservice.create(this.chefLaboratoire));
    },

  });
}

protected loadRelationshipsOptionsupdate(): void {
      this.chefLaboratoire = this.createcheflabo(this.laboratoire);
      this.subscribeToSaveResponse1(this.cheflaboratoireservice.create(this.chefLaboratoire));

}

  protected createFromForm(): ILaboratoire {
    return {
      ...new Laboratoire(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      abreviation: this.editForm.get(['abreviation'])!.value,

    };
  }
  protected createcheflabo(laboratoire1: ILaboratoire): IChefLab {
    return {
      ...new ChefLab(),
      dateDebut:dayjs(),
      dateFin: dayjs().set('year', 0).set('month', 0).set('day', 0),
      extraUser:  this.editForm.get(['extrauser'])!.value,
      laboratoire : laboratoire1,
    };
  }
}
