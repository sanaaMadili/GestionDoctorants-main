import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DoctorantService } from '../service/doctorant.service';
import { IDoctorant, Doctorant } from '../doctorant.model';
import { ISujet } from 'app/entities/sujet/sujet.model';
import { SujetService } from 'app/entities/sujet/service/sujet.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPromotion } from 'app/entities/promotion/promotion.model';
import { PromotionService } from 'app/entities/promotion/service/promotion.service';
import { ICursus } from 'app/entities/cursus/cursus.model';
import { CursusService } from 'app/entities/cursus/service/cursus.service';

import { DoctorantUpdateComponent } from './doctorant-update.component';

describe('Doctorant Management Update Component', () => {
  let comp: DoctorantUpdateComponent;
  let fixture: ComponentFixture<DoctorantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let doctorantService: DoctorantService;
  let sujetService: SujetService;
  let userService: UserService;
  let promotionService: PromotionService;
  let cursusService: CursusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DoctorantUpdateComponent],
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
      .overrideTemplate(DoctorantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DoctorantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    doctorantService = TestBed.inject(DoctorantService);
    sujetService = TestBed.inject(SujetService);
    userService = TestBed.inject(UserService);
    promotionService = TestBed.inject(PromotionService);
    cursusService = TestBed.inject(CursusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call sujet query and add missing value', () => {
      const doctorant: IDoctorant = { id: 456 };
      const sujet: ISujet = { id: 32069 };
      doctorant.sujet = sujet;

      const sujetCollection: ISujet[] = [{ id: 36542 }];
      jest.spyOn(sujetService, 'query').mockReturnValue(of(new HttpResponse({ body: sujetCollection })));
      const expectedCollection: ISujet[] = [sujet, ...sujetCollection];
      jest.spyOn(sujetService, 'addSujetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      expect(sujetService.query).toHaveBeenCalled();
      expect(sujetService.addSujetToCollectionIfMissing).toHaveBeenCalledWith(sujetCollection, sujet);
      expect(comp.sujetsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const doctorant: IDoctorant = { id: 456 };
      const user: IUser = { id: 83540 };
      doctorant.user = user;

      const userCollection: IUser[] = [{ id: 56314 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Promotion query and add missing value', () => {
      const doctorant: IDoctorant = { id: 456 };
      const promotion: IPromotion = { id: 61852 };
      doctorant.promotion = promotion;

      const promotionCollection: IPromotion[] = [{ id: 64260 }];
      jest.spyOn(promotionService, 'query').mockReturnValue(of(new HttpResponse({ body: promotionCollection })));
      const additionalPromotions = [promotion];
      const expectedCollection: IPromotion[] = [...additionalPromotions, ...promotionCollection];
      jest.spyOn(promotionService, 'addPromotionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      expect(promotionService.query).toHaveBeenCalled();
      expect(promotionService.addPromotionToCollectionIfMissing).toHaveBeenCalledWith(promotionCollection, ...additionalPromotions);
      expect(comp.promotionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cursus query and add missing value', () => {
      const doctorant: IDoctorant = { id: 456 };
      const cursus: ICursus = { id: 20372 };
      doctorant.cursus = cursus;

      const cursusCollection: ICursus[] = [{ id: 59330 }];
      jest.spyOn(cursusService, 'query').mockReturnValue(of(new HttpResponse({ body: cursusCollection })));
      const additionalCursuses = [cursus];
      const expectedCollection: ICursus[] = [...additionalCursuses, ...cursusCollection];
      jest.spyOn(cursusService, 'addCursusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      expect(cursusService.query).toHaveBeenCalled();
      expect(cursusService.addCursusToCollectionIfMissing).toHaveBeenCalledWith(cursusCollection, ...additionalCursuses);
      expect(comp.cursusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const doctorant: IDoctorant = { id: 456 };
      const sujet: ISujet = { id: 17417 };
      doctorant.sujet = sujet;
      const user: IUser = { id: 82816 };
      doctorant.user = user;
      const promotion: IPromotion = { id: 43986 };
      doctorant.promotion = promotion;
      const cursus: ICursus = { id: 50390 };
      doctorant.cursus = cursus;

      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(doctorant));
      expect(comp.sujetsCollection).toContain(sujet);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.promotionsSharedCollection).toContain(promotion);
      expect(comp.cursusesSharedCollection).toContain(cursus);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Doctorant>>();
      const doctorant = { id: 123 };
      jest.spyOn(doctorantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: doctorant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(doctorantService.update).toHaveBeenCalledWith(doctorant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Doctorant>>();
      const doctorant = new Doctorant();
      jest.spyOn(doctorantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: doctorant }));
      saveSubject.complete();

      // THEN
      expect(doctorantService.create).toHaveBeenCalledWith(doctorant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Doctorant>>();
      const doctorant = { id: 123 };
      jest.spyOn(doctorantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ doctorant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(doctorantService.update).toHaveBeenCalledWith(doctorant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSujetById', () => {
      it('Should return tracked Sujet primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSujetById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPromotionById', () => {
      it('Should return tracked Promotion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPromotionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCursusById', () => {
      it('Should return tracked Cursus primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCursusById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
