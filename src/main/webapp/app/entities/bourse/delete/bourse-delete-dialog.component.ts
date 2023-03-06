import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBourse } from '../bourse.model';
import { BourseService } from '../service/bourse.service';

@Component({
  templateUrl: './bourse-delete-dialog.component.html',
})
export class BourseDeleteDialogComponent {
  bourse?: IBourse;

  constructor(protected bourseService: BourseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bourseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
