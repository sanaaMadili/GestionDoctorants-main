import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormationSuivie } from '../formation-suivie.model';
import { FormationSuivieService } from '../service/formation-suivie.service';
import { FormationSuivieDeleteDialogComponent } from '../delete/formation-suivie-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-formation-suivie',
  templateUrl: './formation-suivie.component.html',
})
export class FormationSuivieComponent implements OnInit {
  formationSuivies?: IFormationSuivie[];
  isLoading = false;

  constructor(protected formationSuivieService: FormationSuivieService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formationSuivieService.findbyThis().subscribe({
      next: (res: HttpResponse<IFormationSuivie[]>) => {
        this.isLoading = false;
        this.formationSuivies = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFormationSuivie): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(formationSuivie: IFormationSuivie): void {
    const modalRef = this.modalService.open(FormationSuivieDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formationSuivie = formationSuivie;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
