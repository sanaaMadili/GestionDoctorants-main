import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IExtraUser, ExtraUser } from '../extra-user.model';
import { ExtraUserService } from '../service/extra-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-extra-user-update',
  templateUrl: './extra-user-update.component.html',
})
export class ExtraUserUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    cin: [null, [Validators.required]],
    dateNaissance: [null, [Validators.required]],
    lieuNaissance: [null, [Validators.required]],
    nationalite: [null, [Validators.required]],
    adresse: [null, [Validators.required]],
    numeroTelephone: [null, [Validators.required]],
    genre: [null, [Validators.required]],
    nomArabe: [null, [Validators.required]],
    prnomArabe: [null, [Validators.required]],
    internalUser: [],
  });

  constructor(
    protected extraUserService: ExtraUserService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extraUser }) => {
      if (extraUser.id === undefined) {
        const today = dayjs().startOf('day');
        extraUser.dateNaissance = today;
      }

      this.updateForm(extraUser);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const extraUser = this.createFromForm();
    if (extraUser.id !== undefined) {
      this.subscribeToSaveResponse(this.extraUserService.update(extraUser));
    } else {
      this.subscribeToSaveResponse(this.extraUserService.create(extraUser));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExtraUser>>): void {
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

  protected updateForm(extraUser: IExtraUser): void {
    this.editForm.patchValue({
      id: extraUser.id,
      cin: extraUser.cin,
      dateNaissance: extraUser.dateNaissance ? extraUser.dateNaissance.format(DATE_TIME_FORMAT) : null,
      lieuNaissance: extraUser.lieuNaissance,
      nationalite: extraUser.nationalite,
      adresse: extraUser.adresse,
      numeroTelephone: extraUser.numeroTelephone,
      genre: extraUser.genre,
      nomArabe: extraUser.nomArabe,
      prnomArabe: extraUser.prnomArabe,
      internalUser: extraUser.internalUser,
    });

  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('internalUser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IExtraUser {
    return {
      ...new ExtraUser(),
      id: this.editForm.get(['id'])!.value,
      cin: this.editForm.get(['cin'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value
        ? dayjs(this.editForm.get(['dateNaissance'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lieuNaissance: this.editForm.get(['lieuNaissance'])!.value,
      nationalite: this.editForm.get(['nationalite'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      numeroTelephone: this.editForm.get(['numeroTelephone'])!.value,
      genre: this.editForm.get(['genre'])!.value,
      nomArabe: this.editForm.get(['nomArabe'])!.value,
      prnomArabe: this.editForm.get(['prnomArabe'])!.value,
      internalUser: this.editForm.get(['internalUser'])!.value,
    };
  }
}
