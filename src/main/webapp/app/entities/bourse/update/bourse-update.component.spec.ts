import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BourseService } from '../service/bourse.service';
import { IBourse, Bourse } from '../bourse.model';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

import { BourseUpdateComponent } from './bourse-update.component';

describe('Bourse Management Update Component', () => {
  let comp: BourseUpdateComponent;
  let fixture: ComponentFixture<BourseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bourseService: BourseService;
  let doctorantService: DoctorantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BourseUpdateComponent],
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
      .overrideTemplate(BourseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BourseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bourseService = TestBed.inject(BourseService);
    doctorantService = TestBed.inject(DoctorantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call doctorant query and add missing value', () => {
      const bourse: IBourse = { id: 456 };
      const doctorant: IDoctorant = { id: 41186 };
      bourse.doctorant = doctorant;

      const doctorantCollection: IDoctorant[] = [{ id: 74543 }];
      jest.spyOn(doctorantService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorantCollection })));
      const expectedCollection: IDoctorant[] = [doctorant, ...doctorantCollection];
      jest.spyOn(doctorantService, 'addDoctorantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bourse });
      comp.ngOnInit();

      expect(doctorantService.query).toHaveBeenCalled();
      expect(doctorantService.addDoctorantToCollectionIfMissing).toHaveBeenCalledWith(doctorantCollection, doctorant);
      expect(comp.doctorantsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bourse: IBourse = { id: 456 };
      const doctorant: IDoctorant = { id: 15856 };
      bourse.doctorant = doctorant;

      activatedRoute.data = of({ bourse });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bourse));
      expect(comp.doctorantsCollection).toContain(doctorant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bourse>>();
      const bourse = { id: 123 };
      jest.spyOn(bourseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bourse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bourse }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bourseService.update).toHaveBeenCalledWith(bourse);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bourse>>();
      const bourse = new Bourse();
      jest.spyOn(bourseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bourse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bourse }));
      saveSubject.complete();

      // THEN
      expect(bourseService.create).toHaveBeenCalledWith(bourse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bourse>>();
      const bourse = { id: 123 };
      jest.spyOn(bourseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bourse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bourseService.update).toHaveBeenCalledWith(bourse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDoctorantById', () => {
      it('Should return tracked Doctorant primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDoctorantById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
