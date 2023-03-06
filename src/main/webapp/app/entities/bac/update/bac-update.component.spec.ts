import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BacService } from '../service/bac.service';
import { IBac, Bac } from '../bac.model';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { DoctorantService } from 'app/entities/doctorant/service/doctorant.service';

import { BacUpdateComponent } from './bac-update.component';

describe('Bac Management Update Component', () => {
  let comp: BacUpdateComponent;
  let fixture: ComponentFixture<BacUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bacService: BacService;
  let doctorantService: DoctorantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BacUpdateComponent],
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
      .overrideTemplate(BacUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BacUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bacService = TestBed.inject(BacService);
    doctorantService = TestBed.inject(DoctorantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call doctorant query and add missing value', () => {
      const bac: IBac = { id: 456 };
      const doctorant: IDoctorant = { id: 98545 };
      bac.doctorant = doctorant;

      const doctorantCollection: IDoctorant[] = [{ id: 43502 }];
      jest.spyOn(doctorantService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorantCollection })));
      const expectedCollection: IDoctorant[] = [doctorant, ...doctorantCollection];
      jest.spyOn(doctorantService, 'addDoctorantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bac });
      comp.ngOnInit();

      expect(doctorantService.query).toHaveBeenCalled();
      expect(doctorantService.addDoctorantToCollectionIfMissing).toHaveBeenCalledWith(doctorantCollection, doctorant);
      expect(comp.doctorantsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bac: IBac = { id: 456 };
      const doctorant: IDoctorant = { id: 70147 };
      bac.doctorant = doctorant;

      activatedRoute.data = of({ bac });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bac));
      expect(comp.doctorantsCollection).toContain(doctorant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bac>>();
      const bac = { id: 123 };
      jest.spyOn(bacService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bac });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bac }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bacService.update).toHaveBeenCalledWith(bac);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bac>>();
      const bac = new Bac();
      jest.spyOn(bacService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bac });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bac }));
      saveSubject.complete();

      // THEN
      expect(bacService.create).toHaveBeenCalledWith(bac);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bac>>();
      const bac = { id: 123 };
      jest.spyOn(bacService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bac });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bacService.update).toHaveBeenCalledWith(bac);
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
