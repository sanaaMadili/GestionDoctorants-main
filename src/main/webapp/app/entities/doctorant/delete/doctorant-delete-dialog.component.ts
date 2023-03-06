import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDoctorant } from '../doctorant.model';
import { DoctorantService } from '../service/doctorant.service';

@Component({
  templateUrl: './doctorant-delete-dialog.component.html',
})
export class DoctorantDeleteDialogComponent {
  doctorant?: IDoctorant;

  constructor(protected doctorantService: DoctorantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.doctorantService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
