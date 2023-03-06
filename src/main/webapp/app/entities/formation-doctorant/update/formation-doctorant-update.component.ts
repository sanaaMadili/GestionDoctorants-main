import {Component, Input, OnInit} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Observable, of} from 'rxjs';
import {finalize, map, mergeMap} from 'rxjs/operators';
import { IFormationDoctorant, FormationDoctorant } from '../formation-doctorant.model';
import { FormationDoctorantService } from '../service/formation-doctorant.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IFormation } from 'app/entities/formation/formation.model';
import { FormationService } from 'app/entities/formation/service/formation.service';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

@Component({
  selector: 'jhi-formation-doctorant-update',
  templateUrl: './formation-doctorant-update.component.html',
  styleUrls:['./formation-doctorant.scss']
})
export class FormationDoctorantUpdateComponent implements OnInit {
  isSaving = false;
  @Input() formationd!: IFormation;
  a= "scanneNote1";
  notes = ["scanneNote1", "scanneNote2", "scanneNote3", "scanneNote4", "scanneNote5"];
  formationsSharedCollection: IFormation[] = [];
  doctorantsSharedCollection: IDoctorant[] = [];
  n !: number | null |undefined;
  num =  Array(this.n).fill(1).map((x,i)=>i+1);
  editForm = this.fb.group({
    id: [],
    specialite: [],
    type: [],
    dateObtention: [],
    note1: [],
    scanneNote1: [],
    scanneNote1ContentType: [],
    note2: [],
    scanneNote2: [],
    scanneNote2ContentType: [],
    note3: [],
    scanneNote3: [],
    scanneNote3ContentType: [],
    note4: [],
    scanneNote4: [],
    scanneNote4ContentType: [],
    note5: [],
    scanneNote5: [],
    scanneNote5ContentType: [],
    scanneDiplome: [],
    scanneDiplomeContentType: [],
    mention: [],
    formation: [],
    doctorant: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected formationDoctorantService: FormationDoctorantService,
    protected formationService: FormationService,
    protected doctorantService: DoctorantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadRelationshipsOptions();
    this.n = this.formationd.nbAnnee;
    this.up().subscribe((value:IFormationDoctorant)=>this.updateForm(value));

  }

  up(): Observable<IFormationDoctorant> | Observable<never> {
    return this.formationDoctorantService.findActive(<number>this.formationd.id).pipe(
      mergeMap((bac: HttpResponse<FormationDoctorant>) => {
        if (bac.body) {
          return of(bac.body);
        } else {
          return of(new FormationDoctorant());
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
    const formationDoctorant = this.createFromForm();
    if (formationDoctorant.doctorant !== null) {
      this.subscribeToSaveResponse(this.formationDoctorantService.update(formationDoctorant));
    }else{
      this.subscribeToSaveResponse(this.formationDoctorantService.create(formationDoctorant));

    }
  }

  trackFormationById(index: number, item: IFormation): number {
    return item.id!;
  }

  trackDoctorantById(index: number, item: IDoctorant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormationDoctorant>>): void {
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

  protected updateForm(formationDoctorant: IFormationDoctorant): void {
    this.editForm.patchValue({
      id: formationDoctorant.id,
      specialite: formationDoctorant.specialite,
      type: formationDoctorant.type,
      dateObtention: formationDoctorant.dateObtention,
      note1: formationDoctorant.note1,
      scanneNote1: formationDoctorant.scanneNote1,
      scanneNote1ContentType: formationDoctorant.scanneNote1ContentType,
      note2: formationDoctorant.note2,
      scanneNote2: formationDoctorant.scanneNote2,
      scanneNote2ContentType: formationDoctorant.scanneNote2ContentType,
      note3: formationDoctorant.note3,
      scanneNote3: formationDoctorant.scanneNote3,
      scanneNote3ContentType: formationDoctorant.scanneNote3ContentType,
      note4: formationDoctorant.note4,
      scanneNote4: formationDoctorant.scanneNote4,
      scanneNote4ContentType: formationDoctorant.scanneNote4ContentType,
      note5: formationDoctorant.note5,
      scanneNote5: formationDoctorant.scanneNote5,
      scanneNote5ContentType: formationDoctorant.scanneNote5ContentType,
      scanneDiplome: formationDoctorant.scanneDiplome,
      scanneDiplomeContentType: formationDoctorant.scanneDiplomeContentType,
      mention: formationDoctorant.mention,
      formation: formationDoctorant.formation,
      doctorant: formationDoctorant.doctorant,
    });

    this.formationsSharedCollection = this.formationService.addFormationToCollectionIfMissing(
      this.formationsSharedCollection,
      formationDoctorant.formation
    );
    this.doctorantsSharedCollection = this.doctorantService.addDoctorantToCollectionIfMissing(
      this.doctorantsSharedCollection,
      formationDoctorant.doctorant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.formationService
      .query()
      .pipe(map((res: HttpResponse<IFormation[]>) => res.body ?? []))
      .pipe(
        map((formations: IFormation[]) =>
          this.formationService.addFormationToCollectionIfMissing(formations, this.editForm.get('formation')!.value)
        )
      )
      .subscribe((formations: IFormation[]) => (this.formationsSharedCollection = formations));

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

  protected createFromForm(): IFormationDoctorant {
    return {
      ...new FormationDoctorant(),
      id: this.editForm.get(['id'])!.value,
      specialite: this.editForm.get(['specialite'])!.value,
      type: this.editForm.get(['type'])!.value,
      dateObtention: this.editForm.get(['dateObtention'])!.value,
      note1: this.editForm.get(['note1'])!.value,
      scanneNote1ContentType: this.editForm.get(['scanneNote1ContentType'])!.value,
      scanneNote1: this.editForm.get(['scanneNote1'])!.value,
      note2: this.editForm.get(['note2'])!.value,
      scanneNote2ContentType: this.editForm.get(['scanneNote2ContentType'])!.value,
      scanneNote2: this.editForm.get(['scanneNote2'])!.value,
      note3: this.editForm.get(['note3'])!.value,
      scanneNote3ContentType: this.editForm.get(['scanneNote3ContentType'])!.value,
      scanneNote3: this.editForm.get(['scanneNote3'])!.value,
      note4: this.editForm.get(['note4'])!.value,
      scanneNote4ContentType: this.editForm.get(['scanneNote4ContentType'])!.value,
      scanneNote4: this.editForm.get(['scanneNote4'])!.value,
      note5: this.editForm.get(['note5'])!.value,
      scanneNote5ContentType: this.editForm.get(['scanneNote5ContentType'])!.value,
      scanneNote5: this.editForm.get(['scanneNote5'])!.value,
      scanneDiplomeContentType: this.editForm.get(['scanneDiplomeContentType'])!.value,
      scanneDiplome: this.editForm.get(['scanneDiplome'])!.value,
      mention: this.editForm.get(['mention'])!.value,
      formation: this.formationd,
      doctorant: this.editForm.get(['doctorant'])!.value,
    };
  }
}
