import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';

@Component({
  templateUrl: './laboratoire-delete-dialog.component.html',
})
export class LaboratoireDeleteDialogComponent {
  laboratoire?: ILaboratoire;

  constructor(protected laboratoireService: LaboratoireService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.laboratoireService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
