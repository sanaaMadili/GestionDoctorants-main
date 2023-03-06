import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChercheurExterne, ChercheurExterne } from '../chercheur-externe.model';

import { ChercheurExterneService } from './chercheur-externe.service';

describe('ChercheurExterne Service', () => {
  let service: ChercheurExterneService;
  let httpMock: HttpTestingController;
  let elemDefault: IChercheurExterne;
  let expectedResult: IChercheurExterne | IChercheurExterne[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChercheurExterneService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      prenom: 'AAAAAAA',
      email: 'AAAAAAA',
      pays: 'AAAAAAA',
      universite: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ChercheurExterne', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ChercheurExterne()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChercheurExterne', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          email: 'BBBBBB',
          pays: 'BBBBBB',
          universite: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ChercheurExterne', () => {
      const patchObject = Object.assign({}, new ChercheurExterne());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChercheurExterne', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          email: 'BBBBBB',
          pays: 'BBBBBB',
          universite: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ChercheurExterne', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChercheurExterneToCollectionIfMissing', () => {
      it('should add a ChercheurExterne to an empty array', () => {
        const chercheurExterne: IChercheurExterne = { id: 123 };
        expectedResult = service.addChercheurExterneToCollectionIfMissing([], chercheurExterne);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chercheurExterne);
      });

      it('should not add a ChercheurExterne to an array that contains it', () => {
        const chercheurExterne: IChercheurExterne = { id: 123 };
        const chercheurExterneCollection: IChercheurExterne[] = [
          {
            ...chercheurExterne,
          },
          { id: 456 },
        ];
        expectedResult = service.addChercheurExterneToCollectionIfMissing(chercheurExterneCollection, chercheurExterne);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChercheurExterne to an array that doesn't contain it", () => {
        const chercheurExterne: IChercheurExterne = { id: 123 };
        const chercheurExterneCollection: IChercheurExterne[] = [{ id: 456 }];
        expectedResult = service.addChercheurExterneToCollectionIfMissing(chercheurExterneCollection, chercheurExterne);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chercheurExterne);
      });

      it('should add only unique ChercheurExterne to an array', () => {
        const chercheurExterneArray: IChercheurExterne[] = [{ id: 123 }, { id: 456 }, { id: 45849 }];
        const chercheurExterneCollection: IChercheurExterne[] = [{ id: 123 }];
        expectedResult = service.addChercheurExterneToCollectionIfMissing(chercheurExterneCollection, ...chercheurExterneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chercheurExterne: IChercheurExterne = { id: 123 };
        const chercheurExterne2: IChercheurExterne = { id: 456 };
        expectedResult = service.addChercheurExterneToCollectionIfMissing([], chercheurExterne, chercheurExterne2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chercheurExterne);
        expect(expectedResult).toContain(chercheurExterne2);
      });

      it('should accept null and undefined values', () => {
        const chercheurExterne: IChercheurExterne = { id: 123 };
        expectedResult = service.addChercheurExterneToCollectionIfMissing([], null, chercheurExterne, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chercheurExterne);
      });

      it('should return initial array if no ChercheurExterne is added', () => {
        const chercheurExterneCollection: IChercheurExterne[] = [{ id: 123 }];
        expectedResult = service.addChercheurExterneToCollectionIfMissing(chercheurExterneCollection, undefined, null);
        expect(expectedResult).toEqual(chercheurExterneCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
