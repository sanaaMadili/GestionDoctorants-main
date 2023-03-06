import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublication } from '../publication.model';
import { PublicationService } from '../service/publication.service';

@Component({
  templateUrl: './publication-delete-dialog.component.html',
})
export class PublicationDeleteDialogComponent {
  publication?: IPublication;

  constructor(protected publicationService: PublicationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.publicationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
