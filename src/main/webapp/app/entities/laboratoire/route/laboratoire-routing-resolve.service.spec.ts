import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ILaboratoire, Laboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';

import { LaboratoireRoutingResolveService } from './laboratoire-routing-resolve.service';

describe('Laboratoire routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LaboratoireRoutingResolveService;
  let service: LaboratoireService;
  let resultLaboratoire: ILaboratoire | undefined;

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
    routingResolveService = TestBed.inject(LaboratoireRoutingResolveService);
    service = TestBed.inject(LaboratoireService);
    resultLaboratoire = undefined;
  });

  describe('resolve', () => {
    it('should return ILaboratoire returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaboratoire = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLaboratoire).toEqual({ id: 123 });
    });

    it('should return new ILaboratoire if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaboratoire = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLaboratoire).toEqual(new Laboratoire());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Laboratoire })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaboratoire = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLaboratoire).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
