import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICursus, Cursus } from '../cursus.model';

import { CursusService } from './cursus.service';

describe('Cursus Service', () => {
  let service: CursusService;
  let httpMock: HttpTestingController;
  let elemDefault: ICursus;
  let expectedResult: ICursus | ICursus[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CursusService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      nbFormation: 0,
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

    it('should create a Cursus', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Cursus()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cursus', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          nbFormation: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cursus', () => {
      const patchObject = Object.assign({}, new Cursus());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cursus', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          nbFormation: 1,
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

    it('should delete a Cursus', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCursusToCollectionIfMissing', () => {
      it('should add a Cursus to an empty array', () => {
        const cursus: ICursus = { id: 123 };
        expectedResult = service.addCursusToCollectionIfMissing([], cursus);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cursus);
      });

      it('should not add a Cursus to an array that contains it', () => {
        const cursus: ICursus = { id: 123 };
        const cursusCollection: ICursus[] = [
          {
            ...cursus,
          },
          { id: 456 },
        ];
        expectedResult = service.addCursusToCollectionIfMissing(cursusCollection, cursus);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cursus to an array that doesn't contain it", () => {
        const cursus: ICursus = { id: 123 };
        const cursusCollection: ICursus[] = [{ id: 456 }];
        expectedResult = service.addCursusToCollectionIfMissing(cursusCollection, cursus);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cursus);
      });

      it('should add only unique Cursus to an array', () => {
        const cursusArray: ICursus[] = [{ id: 123 }, { id: 456 }, { id: 65652 }];
        const cursusCollection: ICursus[] = [{ id: 123 }];
        expectedResult = service.addCursusToCollectionIfMissing(cursusCollection, ...cursusArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cursus: ICursus = { id: 123 };
        const cursus2: ICursus = { id: 456 };
        expectedResult = service.addCursusToCollectionIfMissing([], cursus, cursus2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cursus);
        expect(expectedResult).toContain(cursus2);
      });

      it('should accept null and undefined values', () => {
        const cursus: ICursus = { id: 123 };
        expectedResult = service.addCursusToCollectionIfMissing([], null, cursus, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cursus);
      });

      it('should return initial array if no Cursus is added', () => {
        const cursusCollection: ICursus[] = [{ id: 123 }];
        expectedResult = service.addCursusToCollectionIfMissing(cursusCollection, undefined, null);
        expect(expectedResult).toEqual(cursusCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
