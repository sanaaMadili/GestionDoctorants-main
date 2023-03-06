import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReinscription, Reinscription } from '../reinscription.model';
import { ReinscriptionService } from '../service/reinscription.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

@Component({
  selector: 'jhi-reinscription-update',
  templateUrl: './reinscription-update.component.html',
})
export class ReinscriptionUpdateComponent implements OnInit {
  isSaving = false;
  contentEditable=false;
  etablissementsSharedCollection: IEtablissement[] = [];
  doctorantsSharedCollection: IDoctorant[] = [];

  editForm = this.fb.group({
    id: [],
    formulaireReinscription: [],
    formulaireReinscriptionContentType: [],
    demande: [],
    demandeContentType: [],
    annee: [],
    etablissement: [],
    doctorant: [],
  });


  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected reinscriptionService: ReinscriptionService,
    protected etablissementService: EtablissementService,
    protected doctorantService: DoctorantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reinscription }) => {
      this.updateForm(reinscription);

    });
    this.loadRelationshipsOptions();

  }
  toggleEditable({event}: { event: any }):void {
    if ( event.target.checked ) {
      this.contentEditable = true;
    }
    else {this.contentEditable = false;}
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
    const reinscription = this.createFromForm();
    if (reinscription.id !== undefined) {
      this.subscribeToSaveResponse(this.reinscriptionService.create(reinscription));
    } else {
      this.subscribeToSaveResponse(this.reinscriptionService.create(reinscription));
    }
  }

  trackEtablissementById(_index: number, item: IEtablissement): number {
    return item.id!;
  }

  trackDoctorantById(_index: number, item: IDoctorant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReinscription>>): void {
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
    window.location.reload()
  }

  protected updateForm(reinscription: IReinscription): void {
    this.editForm.patchValue({
      id: reinscription.id,
      formulaireReinscription: reinscription.formulaireReinscription,
      formulaireReinscriptionContentType: reinscription.formulaireReinscriptionContentType,
      demande: reinscription.demande,
      demandeContentType: reinscription.demandeContentType,
      annee: reinscription.annee,
      etablissement: reinscription.etablissement,
      doctorant: reinscription.doctorant,
    });

    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing(
      this.etablissementsSharedCollection,
      reinscription.etablissement
    );
    this.doctorantsSharedCollection = this.doctorantService.addDoctorantToCollectionIfMissing(
      this.doctorantsSharedCollection,
      reinscription.doctorant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissements, this.editForm.get('etablissement')!.value)
        )
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissementsSharedCollection = etablissements));

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

  protected createFromForm(): IReinscription {
    return {
      ...new Reinscription(),
      id: this.editForm.get(['id'])!.value,
      formulaireReinscriptionContentType: this.editForm.get(['formulaireReinscriptionContentType'])!.value,
      formulaireReinscription: this.editForm.get(['formulaireReinscription'])!.value,
      demandeContentType: this.editForm.get(['demandeContentType'])!.value,
      demande: this.editForm.get(['demande'])!.value,
      annee: this.editForm.get(['annee'])!.value,
      etablissement: this.editForm.get(['etablissement'])!.value,
      doctorant: this.editForm.get(['doctorant'])!.value,
    };
  }

}
