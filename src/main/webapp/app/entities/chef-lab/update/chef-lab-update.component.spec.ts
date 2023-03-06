import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChefLabService } from '../service/chef-lab.service';
import { IChefLab, ChefLab } from '../chef-lab.model';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';
import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { LaboratoireService } from 'app/entities/laboratoire/service/laboratoire.service';

import { ChefLabUpdateComponent } from './chef-lab-update.component';

describe('ChefLab Management Update Component', () => {
  let comp: ChefLabUpdateComponent;
  let fixture: ComponentFixture<ChefLabUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chefLabService: ChefLabService;
  let extraUserService: ExtraUserService;
  let laboratoireService: LaboratoireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChefLabUpdateComponent],
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
      .overrideTemplate(ChefLabUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChefLabUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chefLabService = TestBed.inject(ChefLabService);
    extraUserService = TestBed.inject(ExtraUserService);
    laboratoireService = TestBed.inject(LaboratoireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call extraUser query and add missing value', () => {
      const chefLab: IChefLab = { id: 456 };
      const extraUser: IExtraUser = { id: 96242 };
      chefLab.extraUser = extraUser;

      const extraUserCollection: IExtraUser[] = [{ id: 99541 }];
      jest.spyOn(extraUserService, 'query').mockReturnValue(of(new HttpResponse({ body: extraUserCollection })));
      const expectedCollection: IExtraUser[] = [extraUser, ...extraUserCollection];
      jest.spyOn(extraUserService, 'addExtraUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chefLab });
      comp.ngOnInit();

      expect(extraUserService.query).toHaveBeenCalled();
      expect(extraUserService.addExtraUserToCollectionIfMissing).toHaveBeenCalledWith(extraUserCollection, extraUser);
      expect(comp.extraUsersCollection).toEqual(expectedCollection);
    });

    it('Should call laboratoire query and add missing value', () => {
      const chefLab: IChefLab = { id: 456 };
      const laboratoire: ILaboratoire = { id: 70382 };
      chefLab.laboratoire = laboratoire;

      const laboratoireCollection: ILaboratoire[] = [{ id: 30592 }];
      jest.spyOn(laboratoireService, 'query').mockReturnValue(of(new HttpResponse({ body: laboratoireCollection })));
      const expectedCollection: ILaboratoire[] = [laboratoire, ...laboratoireCollection];
      jest.spyOn(laboratoireService, 'addLaboratoireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chefLab });
      comp.ngOnInit();

      expect(laboratoireService.query).toHaveBeenCalled();
      expect(laboratoireService.addLaboratoireToCollectionIfMissing).toHaveBeenCalledWith(laboratoireCollection, laboratoire);
      expect(comp.laboratoiresCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chefLab: IChefLab = { id: 456 };
      const extraUser: IExtraUser = { id: 258 };
      chefLab.extraUser = extraUser;
      const laboratoire: ILaboratoire = { id: 3477 };
      chefLab.laboratoire = laboratoire;

      activatedRoute.data = of({ chefLab });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chefLab));
      expect(comp.extraUsersCollection).toContain(extraUser);
      expect(comp.laboratoiresCollection).toContain(laboratoire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChefLab>>();
      const chefLab = { id: 123 };
      jest.spyOn(chefLabService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefLab });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chefLab }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chefLabService.update).toHaveBeenCalledWith(chefLab);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChefLab>>();
      const chefLab = new ChefLab();
      jest.spyOn(chefLabService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefLab });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chefLab }));
      saveSubject.complete();

      // THEN
      expect(chefLabService.create).toHaveBeenCalledWith(chefLab);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChefLab>>();
      const chefLab = { id: 123 };
      jest.spyOn(chefLabService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefLab });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chefLabService.update).toHaveBeenCalledWith(chefLab);
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

    describe('trackLaboratoireById', () => {
      it('Should return tracked Laboratoire primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLaboratoireById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
