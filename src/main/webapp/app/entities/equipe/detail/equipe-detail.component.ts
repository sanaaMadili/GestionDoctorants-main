import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMembreEquipe } from 'app/entities/membre-equipe/membre-equipe.model';
import { MembreEquipeService } from 'app/entities/membre-equipe/service/membre-equipe.service';
import { PublicationService } from 'app/entities/publication/service/publication.service';
import { DataUtils } from 'app/core/util/data-util.service';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import { IEquipe } from '../equipe.model';
import { IPublication } from 'app/entities/publication/publication.model';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-equipe-detail',
  templateUrl: './equipe-detail.component.html',
})
export class EquipeDetailComponent implements OnInit {
  equipe!: IEquipe ;
  membresEquipesbd:IMembreEquipe[]=[];
  membresEquipesbd1:IMembreEquipe[]=[];
  membreEquipe!:IMembreEquipe;
  membreSelectionne: any;
  publication:IPublication[]=[];
  publications:IPublication[]=[];
  publicationfinal:IPublication[]=[];
  doctorants:IDoctorant[]=[];
pageSize = 2; // number of items to display per page
currentPage = 1; // current page number
pageSize1 = 2; // number of items to display per page
currentPage1= 1; // current page number
publicationCourante :any;
  t!:number;

  public publicationAffichee = false;


  constructor(protected activatedRoute: ActivatedRoute,public _sanitizer: DomSanitizer,protected doctorantService: DoctorantService, protected dataUtils: DataUtils,protected publicationservice: PublicationService,protected doctorantservice :DoctorantService , protected membreEquipeservice: MembreEquipeService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipe }) => {

      this.membreEquipeservice.querym().subscribe({
        next: (res: HttpResponse<IMembreEquipe[]>) => {
          this.membresEquipesbd = res.body ?? [];
          this.equipe = equipe;
            for (const membreEquipe1 of this.membresEquipesbd) {
              if(membreEquipe1.equipe!.id===equipe.id){
                this.membresEquipesbd1.push(membreEquipe1)
              }

        }
        },

      });

    });

  }

  setMembreSelectionne(membre: any) :void{
    this.publicationfinal.splice(0);
    this.publicationservice.query().subscribe({
      next: (res: HttpResponse<IPublication[]>) => {
        this.publications = res.body ?? [];
        this.publicationservice.Publicationbyuser(membre).subscribe({
          next: (res1: HttpResponse<IPublication[]>) => {
            this.publication = res1.body ?? [];
            for (const publication of this.publications) {
              for (const pub of this.publication) {
                if (publication.id === pub.id) {
                  this.publicationfinal.push(publication);

                }
              }
            }
            this.publicationfinal.sort((a, b) => {
              const dateA = a.date ? new Date(a.date) : new Date('1900-01-01');
              const dateB = b.date ? new Date(b.date) : new Date('1900-01-01');
              return dateB.getTime() - dateA.getTime();
            });

          },
        });

      }
    });

  }

  setMembreSelectionne1(membre: any) :void{
    this.doctorantservice.Docotorantbyuser(membre).subscribe({
      next: (res: HttpResponse<IDoctorant[]>) => {
        this.doctorants = res.body ?? [];
      },
    });
  }
  afficherChamps(pub: any):void {
    if (this.publicationCourante === pub) {
      this.publicationCourante = null;
    } else {
      this.publicationCourante = pub;
    }
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }
  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }


  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
