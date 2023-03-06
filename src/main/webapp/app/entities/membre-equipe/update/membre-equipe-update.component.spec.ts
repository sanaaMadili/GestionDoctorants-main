import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MembreEquipeService } from '../service/membre-equipe.service';
import { IMembreEquipe, MembreEquipe } from '../membre-equipe.model';
import { IEquipe } from 'app/entities/equipe/equipe.model';
import { EquipeService } from 'app/entities/equipe/service/equipe.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

import { MembreEquipeUpdateComponent } from './membre-equipe-update.component';

describe('MembreEquipe Management Update Component', () => {
  let comp: MembreEquipeUpdateComponent;
  let fixture: ComponentFixture<MembreEquipeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let membreEquipeService: MembreEquipeService;
  let equipeService: EquipeService;
  let extraUserService: ExtraUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MembreEquipeUpdateComponent],
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
      .overrideTemplate(MembreEquipeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MembreEquipeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    membreEquipeService = TestBed.inject(MembreEquipeService);
    equipeService = TestBed.inject(EquipeService);
    extraUserService = TestBed.inject(ExtraUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Equipe query and add missing value', () => {
      const membreEquipe: IMembreEquipe = { id: 456 };
      const equipe: IEquipe = { id: 11298 };
      membreEquipe.equipe = equipe;

      const equipeCollection: IEquipe[] = [{ id: 79532 }];
      jest.spyOn(equipeService, 'query').mockReturnValue(of(new HttpResponse({ body: equipeCollection })));
      const additionalEquipes = [equipe];
      const expectedCollection: IEquipe[] = [...additionalEquipes, ...equipeCollection];
      jest.spyOn(equipeService, 'addEquipeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ membreEquipe });
      comp.ngOnInit();

      expect(equipeService.query).toHaveBeenCalled();
      expect(equipeService.addEquipeToCollectionIfMissing).toHaveBeenCalledWith(equipeCollection, ...additionalEquipes);
      expect(comp.equipesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ExtraUser query and add missing value', () => {
      const membreEquipe: IMembreEquipe = { id: 456 };
      const extraUser: IExtraUser = { id: 92503 };
      membreEquipe.extraUser = extraUser;

      const extraUserCollection: IExtraUser[] = [{ id: 95413 }];
      jest.spyOn(extraUserService, 'query').mockReturnValue(of(new HttpResponse({ body: extraUserCollection })));
      const additionalExtraUsers = [extraUser];
      const expectedCollection: IExtraUser[] = [...additionalExtraUsers, ...extraUserCollection];
      jest.spyOn(extraUserService, 'addExtraUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ membreEquipe });
      comp.ngOnInit();

      expect(extraUserService.query).toHaveBeenCalled();
      expect(extraUserService.addExtraUserToCollectionIfMissing).toHaveBeenCalledWith(extraUserCollection, ...additionalExtraUsers);
      expect(comp.extraUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const membreEquipe: IMembreEquipe = { id: 456 };
      const equipe: IEquipe = { id: 89236 };
      membreEquipe.equipe = equipe;
      const extraUser: IExtraUser = { id: 70040 };
      membreEquipe.extraUser = extraUser;

      activatedRoute.data = of({ membreEquipe });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(membreEquipe));
      expect(comp.equipesSharedCollection).toContain(equipe);
      expect(comp.extraUsersSharedCollection).toContain(extraUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MembreEquipe>>();
      const membreEquipe = { id: 123 };
      jest.spyOn(membreEquipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ membreEquipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: membreEquipe }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(membreEquipeService.update).toHaveBeenCalledWith(membreEquipe);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MembreEquipe>>();
      const membreEquipe = new MembreEquipe();
      jest.spyOn(membreEquipeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ membreEquipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: membreEquipe }));
      saveSubject.complete();

      // THEN
      expect(membreEquipeService.create).toHaveBeenCalledWith(membreEquipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MembreEquipe>>();
      const membreEquipe = { id: 123 };
      jest.spyOn(membreEquipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ membreEquipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(membreEquipeService.update).toHaveBeenCalledWith(membreEquipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEquipeById', () => {
      it('Should return tracked Equipe primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEquipeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackExtraUserById', () => {
      it('Should return tracked ExtraUser primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExtraUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
