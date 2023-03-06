import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFormationDoctoranle, FormationDoctoranle } from '../formation-doctoranle.model';
import { FormationDoctoranleService } from '../service/formation-doctoranle.service';

import { FormationDoctoranleRoutingResolveService } from './formation-doctoranle-routing-resolve.service';

describe('FormationDoctoranle routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FormationDoctoranleRoutingResolveService;
  let service: FormationDoctoranleService;
  let resultFormationDoctoranle: IFormationDoctoranle | undefined;

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
    routingResolveService = TestBed.inject(FormationDoctoranleRoutingResolveService);
    service = TestBed.inject(FormationDoctoranleService);
    resultFormationDoctoranle = undefined;
  });

  describe('resolve', () => {
    it('should return IFormationDoctoranle returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormationDoctoranle = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFormationDoctoranle).toEqual({ id: 123 });
    });

    it('should return new IFormationDoctoranle if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormationDoctoranle = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFormationDoctoranle).toEqual(new FormationDoctoranle());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FormationDoctoranle })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormationDoctoranle = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFormationDoctoranle).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
