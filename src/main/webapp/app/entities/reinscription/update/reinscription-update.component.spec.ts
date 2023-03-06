import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReinscriptionService } from '../service/reinscription.service';
import { IReinscription, Reinscription } from '../reinscription.model';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

import { ReinscriptionUpdateComponent } from './reinscription-update.component';

describe('Reinscription Management Update Component', () => {
  let comp: ReinscriptionUpdateComponent;
  let fixture: ComponentFixture<ReinscriptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reinscriptionService: ReinscriptionService;
  let etablissementService: EtablissementService;
  let doctorantService: DoctorantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReinscriptionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ReinscriptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReinscriptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reinscriptionService = TestBed.inject(ReinscriptionService);
    etablissementService = TestBed.inject(EtablissementService);
    doctorantService = TestBed.inject(DoctorantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Etablissement query and add missing value', () => {
      const reinscription: IReinscription = { id: 456 };
      const etablissement: IEtablissement = { id: 69719 };
      reinscription.etablissement = etablissement;

      const etablissementCollection: IEtablissement[] = [{ id: 37715 }];
      jest.spyOn(etablissementService, 'query').mockReturnValue(of(new HttpResponse({ body: etablissementCollection })));
      const additionalEtablissements = [etablissement];
      const expectedCollection: IEtablissement[] = [...additionalEtablissements, ...etablissementCollection];
      jest.spyOn(etablissementService, 'addEtablissementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reinscription });
      comp.ngOnInit();

      expect(etablissementService.query).toHaveBeenCalled();
      expect(etablissementService.addEtablissementToCollectionIfMissing).toHaveBeenCalledWith(
        etablissementCollection,
        ...additionalEtablissements
      );
      expect(comp.etablissementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Doctorant query and add missing value', () => {
      const reinscription: IReinscription = { id: 456 };
      const doctorant: IDoctorant = { id: 75048 };
      reinscription.doctorant = doctorant;

      const doctorantCollection: IDoctorant[] = [{ id: 66151 }];
      jest.spyOn(doctorantService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorantCollection })));
      const additionalDoctorants = [doctorant];
      const expectedCollection: IDoctorant[] = [...additionalDoctorants, ...doctorantCollection];
      jest.spyOn(doctorantService, 'addDoctorantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reinscription });
      comp.ngOnInit();

      expect(doctorantService.query).toHaveBeenCalled();
      expect(doctorantService.addDoctorantToCollectionIfMissing).toHaveBeenCalledWith(doctorantCollection, ...additionalDoctorants);
      expect(comp.doctorantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reinscription: IReinscription = { id: 456 };
      const etablissement: IEtablissement = { id: 50317 };
      reinscription.etablissement = etablissement;
      const doctorant: IDoctorant = { id: 91517 };
      reinscription.doctorant = doctorant;

      activatedRoute.data = of({ reinscription });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(reinscription));
      expect(comp.etablissementsSharedCollection).toContain(etablissement);
      expect(comp.doctorantsSharedCollection).toContain(doctorant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reinscription>>();
      const reinscription = { id: 123 };
      jest.spyOn(reinscriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reinscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reinscription }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(reinscriptionService.update).toHaveBeenCalledWith(reinscription);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reinscription>>();
      const reinscription = new Reinscription();
      jest.spyOn(reinscriptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reinscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reinscription }));
      saveSubject.complete();

      // THEN
      expect(reinscriptionService.create).toHaveBeenCalledWith(reinscription);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reinscription>>();
      const reinscription = { id: 123 };
      jest.spyOn(reinscriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reinscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reinscriptionService.update).toHaveBeenCalledWith(reinscription);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEtablissementById', () => {
      it('Should return tracked Etablissement primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEtablissementById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDoctorantById', () => {
      it('Should return tracked Doctorant primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDoctorantById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
