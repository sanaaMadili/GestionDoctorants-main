import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IChercheurExterne, ChercheurExterne } from '../chercheur-externe.model';
import { ChercheurExterneService } from '../service/chercheur-externe.service';

import { ChercheurExterneRoutingResolveService } from './chercheur-externe-routing-resolve.service';

describe('ChercheurExterne routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChercheurExterneRoutingResolveService;
  let service: ChercheurExterneService;
  let resultChercheurExterne: IChercheurExterne | undefined;

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
    routingResolveService = TestBed.inject(ChercheurExterneRoutingResolveService);
    service = TestBed.inject(ChercheurExterneService);
    resultChercheurExterne = undefined;
  });

  describe('resolve', () => {
    it('should return IChercheurExterne returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChercheurExterne = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChercheurExterne).toEqual({ id: 123 });
    });

    it('should return new IChercheurExterne if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChercheurExterne = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChercheurExterne).toEqual(new ChercheurExterne());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ChercheurExterne })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChercheurExterne = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChercheurExterne).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
