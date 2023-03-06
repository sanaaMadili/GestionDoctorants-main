import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChefEquipeService } from '../service/chef-equipe.service';
import { IChefEquipe, ChefEquipe } from '../chef-equipe.model';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';
import { IEquipe } from 'app/entities/equipe/equipe.model';
import { EquipeService } from 'app/entities/equipe/service/equipe.service';

import { ChefEquipeUpdateComponent } from './chef-equipe-update.component';

describe('ChefEquipe Management Update Component', () => {
  let comp: ChefEquipeUpdateComponent;
  let fixture: ComponentFixture<ChefEquipeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chefEquipeService: ChefEquipeService;
  let extraUserService: ExtraUserService;
  let equipeService: EquipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChefEquipeUpdateComponent],
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
      .overrideTemplate(ChefEquipeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChefEquipeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chefEquipeService = TestBed.inject(ChefEquipeService);
    extraUserService = TestBed.inject(ExtraUserService);
    equipeService = TestBed.inject(EquipeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call extraUser query and add missing value', () => {
      const chefEquipe: IChefEquipe = { id: 456 };
      const extraUser: IExtraUser = { id: 15852 };
      chefEquipe.extraUser = extraUser;

      const extraUserCollection: IExtraUser[] = [{ id: 12997 }];
      jest.spyOn(extraUserService, 'query').mockReturnValue(of(new HttpResponse({ body: extraUserCollection })));
      const expectedCollection: IExtraUser[] = [extraUser, ...extraUserCollection];
      jest.spyOn(extraUserService, 'addExtraUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chefEquipe });
      comp.ngOnInit();

      expect(extraUserService.query).toHaveBeenCalled();
      expect(extraUserService.addExtraUserToCollectionIfMissing).toHaveBeenCalledWith(extraUserCollection, extraUser);
      expect(comp.extraUsersCollection).toEqual(expectedCollection);
    });

    it('Should call equipe query and add missing value', () => {
      const chefEquipe: IChefEquipe = { id: 456 };
      const equipe: IEquipe = { id: 54490 };
      chefEquipe.equipe = equipe;

      const equipeCollection: IEquipe[] = [{ id: 31052 }];
      jest.spyOn(equipeService, 'query').mockReturnValue(of(new HttpResponse({ body: equipeCollection })));
      const expectedCollection: IEquipe[] = [equipe, ...equipeCollection];
      jest.spyOn(equipeService, 'addEquipeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chefEquipe });
      comp.ngOnInit();

      expect(equipeService.query).toHaveBeenCalled();
      expect(equipeService.addEquipeToCollectionIfMissing).toHaveBeenCalledWith(equipeCollection, equipe);
      expect(comp.equipesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chefEquipe: IChefEquipe = { id: 456 };
      const extraUser: IExtraUser = { id: 90917 };
      chefEquipe.extraUser = extraUser;
      const equipe: IEquipe = { id: 46273 };
      chefEquipe.equipe = equipe;

      activatedRoute.data = of({ chefEquipe });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chefEquipe));
      expect(comp.extraUsersCollection).toContain(extraUser);
      expect(comp.equipesCollection).toContain(equipe);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChefEquipe>>();
      const chefEquipe = { id: 123 };
      jest.spyOn(chefEquipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefEquipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chefEquipe }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chefEquipeService.update).toHaveBeenCalledWith(chefEquipe);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChefEquipe>>();
      const chefEquipe = new ChefEquipe();
      jest.spyOn(chefEquipeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefEquipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chefEquipe }));
      saveSubject.complete();

      // THEN
      expect(chefEquipeService.create).toHaveBeenCalledWith(chefEquipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChefEquipe>>();
      const chefEquipe = { id: 123 };
      jest.spyOn(chefEquipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefEquipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chefEquipeService.update).toHaveBeenCalledWith(chefEquipe);
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

    describe('trackEquipeById', () => {
      it('Should return tracked Equipe primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEquipeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
