import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FormationSuivieService } from '../service/formation-suivie.service';
import { IFormationSuivie, FormationSuivie } from '../formation-suivie.model';
import { IFormationDoctoranle } from 'app/entities/formation-doctoranle/formation-doctoranle.model';
import { FormationDoctoranleService } from 'app/entities/formation-doctoranle/service/formation-doctoranle.service';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

import { FormationSuivieUpdateComponent } from './formation-suivie-update.component';

describe('FormationSuivie Management Update Component', () => {
  let comp: FormationSuivieUpdateComponent;
  let fixture: ComponentFixture<FormationSuivieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formationSuivieService: FormationSuivieService;
  let formationDoctoranleService: FormationDoctoranleService;
  let doctorantService: DoctorantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FormationSuivieUpdateComponent],
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
      .overrideTemplate(FormationSuivieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationSuivieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formationSuivieService = TestBed.inject(FormationSuivieService);
    formationDoctoranleService = TestBed.inject(FormationDoctoranleService);
    doctorantService = TestBed.inject(DoctorantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FormationDoctoranle query and add missing value', () => {
      const formationSuivie: IFormationSuivie = { id: 456 };
      const formationDoctoranle: IFormationDoctoranle = { id: 82578 };
      formationSuivie.formationDoctoranle = formationDoctoranle;

      const formationDoctoranleCollection: IFormationDoctoranle[] = [{ id: 27356 }];
      jest.spyOn(formationDoctoranleService, 'query').mockReturnValue(of(new HttpResponse({ body: formationDoctoranleCollection })));
      const additionalFormationDoctoranles = [formationDoctoranle];
      const expectedCollection: IFormationDoctoranle[] = [...additionalFormationDoctoranles, ...formationDoctoranleCollection];
      jest.spyOn(formationDoctoranleService, 'addFormationDoctoranleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formationSuivie });
      comp.ngOnInit();

      expect(formationDoctoranleService.query).toHaveBeenCalled();
      expect(formationDoctoranleService.addFormationDoctoranleToCollectionIfMissing).toHaveBeenCalledWith(
        formationDoctoranleCollection,
        ...additionalFormationDoctoranles
      );
      expect(comp.formationDoctoranlesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Doctorant query and add missing value', () => {
      const formationSuivie: IFormationSuivie = { id: 456 };
      const doctorant: IDoctorant = { id: 9739 };
      formationSuivie.doctorant = doctorant;

      const doctorantCollection: IDoctorant[] = [{ id: 52751 }];
      jest.spyOn(doctorantService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorantCollection })));
      const additionalDoctorants = [doctorant];
      const expectedCollection: IDoctorant[] = [...additionalDoctorants, ...doctorantCollection];
      jest.spyOn(doctorantService, 'addDoctorantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formationSuivie });
      comp.ngOnInit();

      expect(doctorantService.query).toHaveBeenCalled();
      expect(doctorantService.addDoctorantToCollectionIfMissing).toHaveBeenCalledWith(doctorantCollection, ...additionalDoctorants);
      expect(comp.doctorantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const formationSuivie: IFormationSuivie = { id: 456 };
      const formationDoctoranle: IFormationDoctoranle = { id: 19802 };
      formationSuivie.formationDoctoranle = formationDoctoranle;
      const doctorant: IDoctorant = { id: 11559 };
      formationSuivie.doctorant = doctorant;

      activatedRoute.data = of({ formationSuivie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(formationSuivie));
      expect(comp.formationDoctoranlesSharedCollection).toContain(formationDoctoranle);
      expect(comp.doctorantsSharedCollection).toContain(doctorant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationSuivie>>();
      const formationSuivie = { id: 123 };
      jest.spyOn(formationSuivieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationSuivie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formationSuivie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(formationSuivieService.update).toHaveBeenCalledWith(formationSuivie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationSuivie>>();
      const formationSuivie = new FormationSuivie();
      jest.spyOn(formationSuivieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationSuivie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formationSuivie }));
      saveSubject.complete();

      // THEN
      expect(formationSuivieService.create).toHaveBeenCalledWith(formationSuivie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationSuivie>>();
      const formationSuivie = { id: 123 };
      jest.spyOn(formationSuivieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationSuivie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formationSuivieService.update).toHaveBeenCalledWith(formationSuivie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFormationDoctoranleById', () => {
      it('Should return tracked FormationDoctoranle primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFormationDoctoranleById(0, entity);
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
