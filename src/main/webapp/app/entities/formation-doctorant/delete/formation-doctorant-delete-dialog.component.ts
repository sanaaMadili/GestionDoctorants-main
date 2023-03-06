import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormationDoctorant } from '../formation-doctorant.model';
import { FormationDoctorantService } from '../service/formation-doctorant.service';

@Component({
  templateUrl: './formation-doctorant-delete-dialog.component.html',
})
export class FormationDoctorantDeleteDialogComponent {
  formationDoctorant?: IFormationDoctorant;

  constructor(protected formationDoctorantService: FormationDoctorantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.formationDoctorantService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
