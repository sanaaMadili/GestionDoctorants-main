import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FormationDoctorantService } from '../service/formation-doctorant.service';
import { IFormationDoctorant, FormationDoctorant } from '../formation-doctorant.model';
import { IFormation } from 'app/entities/formation/formation.model';
import { FormationService } from 'app/entities/formation/service/formation.service';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

import { FormationDoctorantUpdateComponent } from './formation-doctorant-update.component';

describe('FormationDoctorant Management Update Component', () => {
  let comp: FormationDoctorantUpdateComponent;
  let fixture: ComponentFixture<FormationDoctorantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formationDoctorantService: FormationDoctorantService;
  let formationService: FormationService;
  let doctorantService: DoctorantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FormationDoctorantUpdateComponent],
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
      .overrideTemplate(FormationDoctorantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationDoctorantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formationDoctorantService = TestBed.inject(FormationDoctorantService);
    formationService = TestBed.inject(FormationService);
    doctorantService = TestBed.inject(DoctorantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Formation query and add missing value', () => {
      const formationDoctorant: IFormationDoctorant = { id: 456 };
      const formation: IFormation = { id: 63490 };
      formationDoctorant.formation = formation;

      const formationCollection: IFormation[] = [{ id: 69686 }];
      jest.spyOn(formationService, 'query').mockReturnValue(of(new HttpResponse({ body: formationCollection })));
      const additionalFormations = [formation];
      const expectedCollection: IFormation[] = [...additionalFormations, ...formationCollection];
      jest.spyOn(formationService, 'addFormationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formationDoctorant });
      comp.ngOnInit();

      expect(formationService.query).toHaveBeenCalled();
      expect(formationService.addFormationToCollectionIfMissing).toHaveBeenCalledWith(formationCollection, ...additionalFormations);
      expect(comp.formationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Doctorant query and add missing value', () => {
      const formationDoctorant: IFormationDoctorant = { id: 456 };
      const doctorant: IDoctorant = { id: 76827 };
      formationDoctorant.doctorant = doctorant;

      const doctorantCollection: IDoctorant[] = [{ id: 90578 }];
      jest.spyOn(doctorantService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorantCollection })));
      const additionalDoctorants = [doctorant];
      const expectedCollection: IDoctorant[] = [...additionalDoctorants, ...doctorantCollection];
      jest.spyOn(doctorantService, 'addDoctorantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formationDoctorant });
      comp.ngOnInit();

      expect(doctorantService.query).toHaveBeenCalled();
      expect(doctorantService.addDoctorantToCollectionIfMissing).toHaveBeenCalledWith(doctorantCollection, ...additionalDoctorants);
      expect(comp.doctorantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const formationDoctorant: IFormationDoctorant = { id: 456 };
      const formation: IFormation = { id: 90559 };
      formationDoctorant.formation = formation;
      const doctorant: IDoctorant = { id: 60660 };
      formationDoctorant.doctorant = doctorant;

      activatedRoute.data = of({ formationDoctorant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(formationDoctorant));
      expect(comp.formationsSharedCollection).toContain(formation);
      expect(comp.doctorantsSharedCollection).toContain(doctorant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationDoctorant>>();
      const formationDoctorant = { id: 123 };
      jest.spyOn(formationDoctorantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationDoctorant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formationDoctorant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(formationDoctorantService.update).toHaveBeenCalledWith(formationDoctorant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationDoctorant>>();
      const formationDoctorant = new FormationDoctorant();
      jest.spyOn(formationDoctorantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationDoctorant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formationDoctorant }));
      saveSubject.complete();

      // THEN
      expect(formationDoctorantService.create).toHaveBeenCalledWith(formationDoctorant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationDoctorant>>();
      const formationDoctorant = { id: 123 };
      jest.spyOn(formationDoctorantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationDoctorant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formationDoctorantService.update).toHaveBeenCalledWith(formationDoctorant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFormationById', () => {
      it('Should return tracked Formation primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFormationById(0, entity);
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
