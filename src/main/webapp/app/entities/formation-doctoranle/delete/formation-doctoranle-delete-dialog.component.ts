import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormationDoctoranle } from '../formation-doctoranle.model';
import { FormationDoctoranleService } from '../service/formation-doctoranle.service';

@Component({
  templateUrl: './formation-doctoranle-delete-dialog.component.html',
})
export class FormationDoctoranleDeleteDialogComponent {
  formationDoctoranle?: IFormationDoctoranle;

  constructor(protected formationDoctoranleService: FormationDoctoranleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.formationDoctoranleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
