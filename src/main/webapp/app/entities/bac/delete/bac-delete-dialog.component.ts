import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBac } from '../bac.model';
import { BacService } from '../service/bac.service';

@Component({
  templateUrl: './bac-delete-dialog.component.html',
})
export class BacDeleteDialogComponent {
  bac?: IBac;

  constructor(protected bacService: BacService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bacService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
