import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICursus } from '../cursus.model';
import { CursusService } from '../service/cursus.service';

@Component({
  templateUrl: './cursus-delete-dialog.component.html',
})
export class CursusDeleteDialogComponent {
  cursus?: ICursus;

  constructor(protected cursusService: CursusService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cursusService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
