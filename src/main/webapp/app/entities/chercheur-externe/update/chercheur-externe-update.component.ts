import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChercheurExterne, ChercheurExterne } from '../chercheur-externe.model';
import { ChercheurExterneService } from '../service/chercheur-externe.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-chercheur-externe-update',
  templateUrl: './chercheur-externe-update.component.html',
})
export class ChercheurExterneUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    email: [],
    pays: [],
    universite: [],
    user: [],
  });

  constructor(
    protected chercheurExterneService: ChercheurExterneService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    /*
    this.activatedRoute.data.subscribe(({ chercheurExterne }) => {
      this.updateForm(chercheurExterne);

    });
    */
    this.loadRelationshipsOptions();

  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chercheurExterne = this.createFromForm();
    if (chercheurExterne.id !== undefined) {
      this.subscribeToSaveResponse(this.chercheurExterneService.create(chercheurExterne));
    } else {
      this.subscribeToSaveResponse(this.chercheurExterneService.create(chercheurExterne));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChercheurExterne>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    window.location.reload();

    //    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(chercheurExterne: IChercheurExterne): void {
    this.editForm.patchValue({
      id: chercheurExterne.id,
      nom: chercheurExterne.nom,
      prenom: chercheurExterne.prenom,
      email: chercheurExterne.email,
      pays: chercheurExterne.pays,
      universite: chercheurExterne.universite,
      user: chercheurExterne.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, chercheurExterne.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IChercheurExterne {
    return {
      ...new ChercheurExterne(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      email: this.editForm.get(['email'])!.value,
      pays: this.editForm.get(['pays'])!.value,
      universite: this.editForm.get(['universite'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
