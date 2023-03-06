import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBac, Bac } from '../bac.model';

import { BacService } from './bac.service';

describe('Bac Service', () => {
  let service: BacService;
  let httpMock: HttpTestingController;
  let elemDefault: IBac;
  let expectedResult: IBac | IBac[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BacService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      serieBac: 'AAAAAAA',
      typeBac: 'AAAAAAA',
      anneeObtention: 'AAAAAAA',
      noteBac: 0,
      scanneBacContentType: 'image/png',
      scanneBac: 'AAAAAAA',
      mention: 'AAAAAAA',
      villeObtention: 'AAAAAAA',
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

    it('should create a Bac', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Bac()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bac', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          serieBac: 'BBBBBB',
          typeBac: 'BBBBBB',
          anneeObtention: 'BBBBBB',
          noteBac: 1,
          scanneBac: 'BBBBBB',
          mention: 'BBBBBB',
          villeObtention: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bac', () => {
      const patchObject = Object.assign(
        {
          noteBac: 1,
          scanneBac: 'BBBBBB',
          mention: 'BBBBBB',
        },
        new Bac()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bac', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          serieBac: 'BBBBBB',
          typeBac: 'BBBBBB',
          anneeObtention: 'BBBBBB',
          noteBac: 1,
          scanneBac: 'BBBBBB',
          mention: 'BBBBBB',
          villeObtention: 'BBBBBB',
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

    it('should delete a Bac', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBacToCollectionIfMissing', () => {
      it('should add a Bac to an empty array', () => {
        const bac: IBac = { id: 123 };
        expectedResult = service.addBacToCollectionIfMissing([], bac);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bac);
      });

      it('should not add a Bac to an array that contains it', () => {
        const bac: IBac = { id: 123 };
        const bacCollection: IBac[] = [
          {
            ...bac,
          },
          { id: 456 },
        ];
        expectedResult = service.addBacToCollectionIfMissing(bacCollection, bac);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bac to an array that doesn't contain it", () => {
        const bac: IBac = { id: 123 };
        const bacCollection: IBac[] = [{ id: 456 }];
        expectedResult = service.addBacToCollectionIfMissing(bacCollection, bac);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bac);
      });

      it('should add only unique Bac to an array', () => {
        const bacArray: IBac[] = [{ id: 123 }, { id: 456 }, { id: 45748 }];
        const bacCollection: IBac[] = [{ id: 123 }];
        expectedResult = service.addBacToCollectionIfMissing(bacCollection, ...bacArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bac: IBac = { id: 123 };
        const bac2: IBac = { id: 456 };
        expectedResult = service.addBacToCollectionIfMissing([], bac, bac2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bac);
        expect(expectedResult).toContain(bac2);
      });

      it('should accept null and undefined values', () => {
        const bac: IBac = { id: 123 };
        expectedResult = service.addBacToCollectionIfMissing([], null, bac, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bac);
      });

      it('should return initial array if no Bac is added', () => {
        const bacCollection: IBac[] = [{ id: 123 }];
        expectedResult = service.addBacToCollectionIfMissing(bacCollection, undefined, null);
        expect(expectedResult).toEqual(bacCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
