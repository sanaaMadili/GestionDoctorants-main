import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {Bourse, IBourse} from '../bourse.model';
import { BourseService } from '../service/bourse.service';
import {FormBuilder} from "@angular/forms";
import {Doctorant, IDoctorant} from "../../doctorant/doctorant.model";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {finalize} from "rxjs/operators";

@Component({
  templateUrl: './bourse-add-dialog.component.html',
})
export class BourseAddDialogComponent {
  bourse?: IBourse;
  doc?:Doctorant;
  isSaving = false;
  editForm = this.fb.group({
    id: [],
    type: []
  });
  constructor(protected bourseService: BourseService, protected activeModal: NgbActiveModal, protected fb: FormBuilder
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  save(doctorantId:Doctorant): void {
    const bourse = this.createFromForm();
    bourse.doctorant=doctorantId;
    this.subscribeToSaveResponse(this.bourseService.create(bourse));

  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBourse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }
  protected onSaveSuccess(): void {
    this.activeModal.close('added');
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected createFromForm(): IBourse {
    return {
      ...new Bourse(),
      type: this.editForm.get(['type'])!.value};
  }
}
