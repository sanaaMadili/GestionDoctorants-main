import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of} from 'rxjs';
import {finalize, map, mergeMap} from 'rxjs/operators';

import { IBac, Bac } from '../bac.model';
import { BacService } from '../service/bac.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

@Component({
  selector: 'jhi-bac-update',
  templateUrl: './bac-update.component.html',
})
export class BacUpdateComponent implements OnInit {
  isSaving = false;

  doctorantsCollection: IDoctorant[] = [];

  editForm = this.fb.group({
    id: [],
    serieBac: [],
    typeBac: [],
    anneeObtention: [],
    noteBac: [],
    scanneBac: [],
    scanneBacContentType: [],
    mention: [],
    villeObtention: [],
    doctorant: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected bacService: BacService,
    protected doctorantService: DoctorantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}



  ngOnInit(): void {
    this.loadRelationshipsOptions();
    this.up().subscribe((value:IBac)=>this.updateForm(value));
  }

  up(): Observable<IBac> | Observable<never> {
    return this.bacService.findActive().pipe(
      mergeMap((bac: HttpResponse<Bac>) => {
        if (bac.body) {
          return of(bac.body);
        } else {
          return of(new Bac());
        }
      })
    );
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
    const bac = this.createFromForm();
    if (bac.id !== undefined) {
      this.subscribeToSaveResponse(this.bacService.update(bac));
    } else {
      this.subscribeToSaveResponse(this.bacService.create(bac));
    }
  }

  trackDoctorantById(index: number, item: IDoctorant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBac>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bac: IBac): void {
    this.editForm.patchValue({
      id: bac.id,
      serieBac: bac.serieBac,
      typeBac: bac.typeBac,
      anneeObtention: bac.anneeObtention,
      noteBac: bac.noteBac,
      scanneBac: bac.scanneBac,
      scanneBacContentType: bac.scanneBacContentType,
      mention: bac.mention,
      villeObtention: bac.villeObtention,
      doctorant: bac.doctorant,
    });

    this.doctorantsCollection = this.doctorantService.addDoctorantToCollectionIfMissing(this.doctorantsCollection, bac.doctorant);
  }

  protected loadRelationshipsOptions(): void {
    this.doctorantService
      .query({ filter: 'bac-is-null' })
      .pipe(map((res: HttpResponse<IDoctorant[]>) => res.body ?? []))
      .pipe(
        map((doctorants: IDoctorant[]) =>
          this.doctorantService.addDoctorantToCollectionIfMissing(doctorants, this.editForm.get('doctorant')!.value)
        )
      )
      .subscribe((doctorants: IDoctorant[]) => (this.doctorantsCollection = doctorants));
  }

  protected createFromForm(): IBac {
    return {
      ...new Bac(),
      id: this.editForm.get(['id'])!.value,
      serieBac: this.editForm.get(['serieBac'])!.value,
      typeBac: this.editForm.get(['typeBac'])!.value,
      anneeObtention: this.editForm.get(['anneeObtention'])!.value,
      noteBac: this.editForm.get(['noteBac'])!.value,
      scanneBacContentType: this.editForm.get(['scanneBacContentType'])!.value,
      scanneBac: this.editForm.get(['scanneBac'])!.value,
      mention: this.editForm.get(['mention'])!.value,
      villeObtention: this.editForm.get(['villeObtention'])!.value,
      doctorant: this.editForm.get(['doctorant'])!.value,
    };
  }
}
