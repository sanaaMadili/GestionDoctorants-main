import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SujetService } from '../service/sujet.service';
import { ISujet, Sujet } from '../sujet.model';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

import { SujetUpdateComponent } from './sujet-update.component';

describe('Sujet Management Update Component', () => {
  let comp: SujetUpdateComponent;
  let fixture: ComponentFixture<SujetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sujetService: SujetService;
  let extraUserService: ExtraUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SujetUpdateComponent],
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
      .overrideTemplate(SujetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SujetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sujetService = TestBed.inject(SujetService);
    extraUserService = TestBed.inject(ExtraUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ExtraUser query and add missing value', () => {
      const sujet: ISujet = { id: 456 };
      const encadrent: IExtraUser = { id: 95122 };
      sujet.encadrent = encadrent;

      const extraUserCollection: IExtraUser[] = [{ id: 27854 }];
      jest.spyOn(extraUserService, 'query').mockReturnValue(of(new HttpResponse({ body: extraUserCollection })));
      const additionalExtraUsers = [encadrent];
      const expectedCollection: IExtraUser[] = [...additionalExtraUsers, ...extraUserCollection];
      jest.spyOn(extraUserService, 'addExtraUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sujet });
      comp.ngOnInit();

      expect(extraUserService.query).toHaveBeenCalled();
      expect(extraUserService.addExtraUserToCollectionIfMissing).toHaveBeenCalledWith(extraUserCollection, ...additionalExtraUsers);
      expect(comp.extraUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sujet: ISujet = { id: 456 };
      const encadrent: IExtraUser = { id: 19644 };
      sujet.encadrent = encadrent;

      activatedRoute.data = of({ sujet });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sujet));
      expect(comp.extraUsersSharedCollection).toContain(encadrent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sujet>>();
      const sujet = { id: 123 };
      jest.spyOn(sujetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sujet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sujet }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sujetService.update).toHaveBeenCalledWith(sujet);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sujet>>();
      const sujet = new Sujet();
      jest.spyOn(sujetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sujet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sujet }));
      saveSubject.complete();

      // THEN
      expect(sujetService.create).toHaveBeenCalledWith(sujet);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sujet>>();
      const sujet = { id: 123 };
      jest.spyOn(sujetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sujet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sujetService.update).toHaveBeenCalledWith(sujet);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackExtraUserById', () => {
      it('Should return tracked ExtraUser primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExtraUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
