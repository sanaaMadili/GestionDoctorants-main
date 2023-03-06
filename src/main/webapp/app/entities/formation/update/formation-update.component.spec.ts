import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FormationService } from '../service/formation.service';
import { IFormation, Formation } from '../formation.model';
import { ICursus } from 'app/entities/cursus/cursus.model';
import { CursusService } from 'app/entities/cursus/service/cursus.service';

import { FormationUpdateComponent } from './formation-update.component';

describe('Formation Management Update Component', () => {
  let comp: FormationUpdateComponent;
  let fixture: ComponentFixture<FormationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formationService: FormationService;
  let cursusService: CursusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FormationUpdateComponent],
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
      .overrideTemplate(FormationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formationService = TestBed.inject(FormationService);
    cursusService = TestBed.inject(CursusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Cursus query and add missing value', () => {
      const formation: IFormation = { id: 456 };
      const cursus: ICursus = { id: 768 };
      formation.cursus = cursus;

      const cursusCollection: ICursus[] = [{ id: 305 }];
      jest.spyOn(cursusService, 'query').mockReturnValue(of(new HttpResponse({ body: cursusCollection })));
      const additionalCursuses = [cursus];
      const expectedCollection: ICursus[] = [...additionalCursuses, ...cursusCollection];
      jest.spyOn(cursusService, 'addCursusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formation });
      comp.ngOnInit();

      expect(cursusService.query).toHaveBeenCalled();
      expect(cursusService.addCursusToCollectionIfMissing).toHaveBeenCalledWith(cursusCollection, ...additionalCursuses);
      expect(comp.cursusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const formation: IFormation = { id: 456 };
      const cursus: ICursus = { id: 68569 };
      formation.cursus = cursus;

      activatedRoute.data = of({ formation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(formation));
      expect(comp.cursusesSharedCollection).toContain(cursus);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Formation>>();
      const formation = { id: 123 };
      jest.spyOn(formationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(formationService.update).toHaveBeenCalledWith(formation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Formation>>();
      const formation = new Formation();
      jest.spyOn(formationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formation }));
      saveSubject.complete();

      // THEN
      expect(formationService.create).toHaveBeenCalledWith(formation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Formation>>();
      const formation = { id: 123 };
      jest.spyOn(formationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formationService.update).toHaveBeenCalledWith(formation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCursusById', () => {
      it('Should return tracked Cursus primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCursusById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
