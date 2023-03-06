import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LaboratoireService } from '../service/laboratoire.service';
import { ILaboratoire, Laboratoire } from '../laboratoire.model';

import { LaboratoireUpdateComponent } from './laboratoire-update.component';

import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

describe('Laboratoire Management Update Component', () => {
  let comp: LaboratoireUpdateComponent;
  let fixture: ComponentFixture<LaboratoireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let laboratoireService: LaboratoireService;
  let extraUserService: ExtraUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LaboratoireUpdateComponent],
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
      .overrideTemplate(LaboratoireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaboratoireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    laboratoireService = TestBed.inject(LaboratoireService);
    extraUserService = TestBed.inject(ExtraUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const laboratoire: ILaboratoire = { id: 456 };
      const extrauser: IExtraUser = { id: 95122 };
      laboratoire.extrauser = extrauser;
      const extraUserCollection: IExtraUser[] = [{ id: 27854 }];
      jest.spyOn(extraUserService, 'query').mockReturnValue(of(new HttpResponse({ body: extraUserCollection })));
      const additionalExtraUsers = [extrauser];
      const expectedCollection: IExtraUser[] = [...additionalExtraUsers, ...extraUserCollection];
      jest.spyOn(extraUserService, 'addExtraUserToCollectionIfMissing').mockReturnValue(expectedCollection);
      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      expect(extraUserService.query).toHaveBeenCalled();
      expect(extraUserService.addExtraUserToCollectionIfMissing).toHaveBeenCalledWith(extraUserCollection, ...additionalExtraUsers);
      expect(comp.extraUsersSharedCollection).toEqual(expectedCollection);
    });



    it('Should update editForm', () => {
      const laboratoire: ILaboratoire = { id: 456 };
      const extrauser: IExtraUser = { id: 19644 };
      laboratoire.extrauser = extrauser;

      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(laboratoire));
      expect(comp.extraUsersSharedCollection).toContain(extrauser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN


      const saveSubject = new Subject<HttpResponse<Laboratoire>>();
      const laboratoire = { id: 123 };
      jest.spyOn(laboratoireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: laboratoire }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(laboratoireService.update).toHaveBeenCalledWith(laboratoire);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Laboratoire>>();
      const laboratoire = new Laboratoire();
      jest.spyOn(laboratoireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: laboratoire }));
      saveSubject.complete();

      // THEN
      expect(laboratoireService.create).toHaveBeenCalledWith(laboratoire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Laboratoire>>();
      const laboratoire = { id: 123 };
      jest.spyOn(laboratoireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(laboratoireService.update).toHaveBeenCalledWith(laboratoire);
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

