import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFormationDoctorant, FormationDoctorant } from '../formation-doctorant.model';
import { FormationDoctorantService } from '../service/formation-doctorant.service';

import { FormationDoctorantRoutingResolveService } from './formation-doctorant-routing-resolve.service';

describe('FormationDoctorant routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FormationDoctorantRoutingResolveService;
  let service: FormationDoctorantService;
  let resultFormationDoctorant: IFormationDoctorant | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(FormationDoctorantRoutingResolveService);
    service = TestBed.inject(FormationDoctorantService);
    resultFormationDoctorant = undefined;
  });

  describe('resolve', () => {
    it('should return IFormationDoctorant returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormationDoctorant = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFormationDoctorant).toEqual({ id: 123 });
    });

    it('should return new IFormationDoctorant if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormationDoctorant = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFormationDoctorant).toEqual(new FormationDoctorant());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FormationDoctorant })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormationDoctorant = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFormationDoctorant).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
