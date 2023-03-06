import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFormationSuivie, FormationSuivie } from '../formation-suivie.model';
import { FormationSuivieService } from '../service/formation-suivie.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import {FormationDoctoranle, IFormationDoctoranle} from 'app/entities/formation-doctoranle/formation-doctoranle.model';
import { FormationDoctoranleService } from 'app/entities/formation-doctoranle/service/formation-doctoranle.service';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

@Component({
  selector: 'jhi-formation-suivie-update',
  templateUrl: './formation-suivie-update.component.html',
})
export class FormationSuivieUpdateComponent implements OnInit {
  isSaving = false;

  formationDoctoranlesSharedCollection: IFormationDoctoranle[] = [];
  doctorantsSharedCollection: IDoctorant[] = [];
  formationDoctoranlee!:FormationDoctoranle;
  editForm = this.fb.group({
    id: [],
    duree: [null, [Validators.required]],
    attestation: [],
    attestationContentType: [],
    date: [],
    titre: [],
    formationDoctoranle: [],
    doctorant: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected formationSuivieService: FormationSuivieService,
    protected formationDoctoranleService: FormationDoctoranleService,
    protected doctorantService: DoctorantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formationSuivie }) => {
      this.updateForm(formationSuivie);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('doctorantApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formationSuivie = this.createFromForm();
    if (formationSuivie.id !== undefined) {
      this.subscribeToSaveResponse(this.formationSuivieService.update(formationSuivie));
    } else {
      this.subscribeToSaveResponse(this.formationSuivieService.create(formationSuivie));
    }
  }

  trackFormationDoctoranleById(_index: number, item: IFormationDoctoranle): number {
    return item.id!;
  }

  trackDoctorantById(_index: number, item: IDoctorant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormationSuivie>>): void {
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

  protected updateForm(formationSuivie: IFormationSuivie): void {
    this.editForm.patchValue({
      id: formationSuivie.id,
      duree: formationSuivie.duree,
      attestation: formationSuivie.attestation,
      attestationContentType: formationSuivie.attestationContentType,
      date: formationSuivie.date,
      titre: formationSuivie.titre,
      formationDoctoranle: formationSuivie.formationDoctoranle,
      doctorant: formationSuivie.doctorant,
    });

    this.formationDoctoranlesSharedCollection = this.formationDoctoranleService.addFormationDoctoranleToCollectionIfMissing(
      this.formationDoctoranlesSharedCollection,
      formationSuivie.formationDoctoranle
    );
    this.doctorantsSharedCollection = this.doctorantService.addDoctorantToCollectionIfMissing(
      this.doctorantsSharedCollection,
      formationSuivie.doctorant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.formationDoctoranleService
      .query()
      .pipe(map((res: HttpResponse<IFormationDoctoranle[]>) => res.body ?? []))
      .pipe(
        map((formationDoctoranles: IFormationDoctoranle[]) =>
          this.formationDoctoranleService.addFormationDoctoranleToCollectionIfMissing(
            formationDoctoranles,
            this.editForm.get('formationDoctoranle')!.value
          )
        )
      )
      .subscribe((formationDoctoranles: IFormationDoctoranle[]) => (this.formationDoctoranlesSharedCollection = formationDoctoranles));

    this.doctorantService
      .query()
      .pipe(map((res: HttpResponse<IDoctorant[]>) => res.body ?? []))
      .pipe(
        map((doctorants: IDoctorant[]) =>
          this.doctorantService.addDoctorantToCollectionIfMissing(doctorants, this.editForm.get('doctorant')!.value)
        )
      )
      .subscribe((doctorants: IDoctorant[]) => (this.doctorantsSharedCollection = doctorants));
  }

  protected createFromForm(): IFormationSuivie {
    return {
      ...new FormationSuivie(),
      id: this.editForm.get(['id'])!.value,
      duree: this.editForm.get(['duree'])!.value,
      attestationContentType: this.editForm.get(['attestationContentType'])!.value,
      attestation: this.editForm.get(['attestation'])!.value,
      date: this.editForm.get(['date'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      formationDoctoranle: this.editForm.get(['formationDoctoranle'])!.value,
      doctorant: this.editForm.get(['doctorant'])!.value,
    };
  }
}
