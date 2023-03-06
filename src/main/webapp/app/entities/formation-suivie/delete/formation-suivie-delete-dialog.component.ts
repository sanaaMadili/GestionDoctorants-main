import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormationSuivie } from '../formation-suivie.model';
import { FormationSuivieService } from '../service/formation-suivie.service';

@Component({
  templateUrl: './formation-suivie-delete-dialog.component.html',
})
export class FormationSuivieDeleteDialogComponent {
  formationSuivie?: IFormationSuivie;

  constructor(protected formationSuivieService: FormationSuivieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.formationSuivieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
