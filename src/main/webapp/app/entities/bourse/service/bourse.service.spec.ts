import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBourse, Bourse } from '../bourse.model';

import { BourseService } from './bourse.service';

describe('Bourse Service', () => {
  let service: BourseService;
  let httpMock: HttpTestingController;
  let elemDefault: IBourse;
  let expectedResult: IBourse | IBourse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BourseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      type: 'AAAAAAA',
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

    it('should create a Bourse', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Bourse()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bourse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bourse', () => {
      const patchObject = Object.assign({}, new Bourse());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bourse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
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

    it('should delete a Bourse', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBourseToCollectionIfMissing', () => {
      it('should add a Bourse to an empty array', () => {
        const bourse: IBourse = { id: 123 };
        expectedResult = service.addBourseToCollectionIfMissing([], bourse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bourse);
      });

      it('should not add a Bourse to an array that contains it', () => {
        const bourse: IBourse = { id: 123 };
        const bourseCollection: IBourse[] = [
          {
            ...bourse,
          },
          { id: 456 },
        ];
        expectedResult = service.addBourseToCollectionIfMissing(bourseCollection, bourse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bourse to an array that doesn't contain it", () => {
        const bourse: IBourse = { id: 123 };
        const bourseCollection: IBourse[] = [{ id: 456 }];
        expectedResult = service.addBourseToCollectionIfMissing(bourseCollection, bourse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bourse);
      });

      it('should add only unique Bourse to an array', () => {
        const bourseArray: IBourse[] = [{ id: 123 }, { id: 456 }, { id: 97547 }];
        const bourseCollection: IBourse[] = [{ id: 123 }];
        expectedResult = service.addBourseToCollectionIfMissing(bourseCollection, ...bourseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bourse: IBourse = { id: 123 };
        const bourse2: IBourse = { id: 456 };
        expectedResult = service.addBourseToCollectionIfMissing([], bourse, bourse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bourse);
        expect(expectedResult).toContain(bourse2);
      });

      it('should accept null and undefined values', () => {
        const bourse: IBourse = { id: 123 };
        expectedResult = service.addBourseToCollectionIfMissing([], null, bourse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bourse);
      });

      it('should return initial array if no Bourse is added', () => {
        const bourseCollection: IBourse[] = [{ id: 123 }];
        expectedResult = service.addBourseToCollectionIfMissing(bourseCollection, undefined, null);
        expect(expectedResult).toEqual(bourseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
