import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILaboratoire, Laboratoire } from '../laboratoire.model';

import { LaboratoireService } from './laboratoire.service';

describe('Laboratoire Service', () => {
  let service: LaboratoireService;
  let httpMock: HttpTestingController;
  let elemDefault: ILaboratoire;
  let expectedResult: ILaboratoire | ILaboratoire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LaboratoireService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      abreviation: 'AAAAAAA',
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

    it('should create a Laboratoire', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Laboratoire()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Laboratoire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          abreviation: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Laboratoire', () => {
      const patchObject = Object.assign(
        {
          nom: 'BBBBBB',
          abreviation: 'BBBBBB',
        },
        new Laboratoire()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Laboratoire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          abreviation: 'BBBBBB',
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

    it('should delete a Laboratoire', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLaboratoireToCollectionIfMissing', () => {
      it('should add a Laboratoire to an empty array', () => {
        const laboratoire: ILaboratoire = { id: 123 };
        expectedResult = service.addLaboratoireToCollectionIfMissing([], laboratoire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(laboratoire);
      });

      it('should not add a Laboratoire to an array that contains it', () => {
        const laboratoire: ILaboratoire = { id: 123 };
        const laboratoireCollection: ILaboratoire[] = [
          {
            ...laboratoire,
          },
          { id: 456 },
        ];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, laboratoire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Laboratoire to an array that doesn't contain it", () => {
        const laboratoire: ILaboratoire = { id: 123 };
        const laboratoireCollection: ILaboratoire[] = [{ id: 456 }];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, laboratoire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(laboratoire);
      });

      it('should add only unique Laboratoire to an array', () => {
        const laboratoireArray: ILaboratoire[] = [{ id: 123 }, { id: 456 }, { id: 25251 }];
        const laboratoireCollection: ILaboratoire[] = [{ id: 123 }];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, ...laboratoireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const laboratoire: ILaboratoire = { id: 123 };
        const laboratoire2: ILaboratoire = { id: 456 };
        expectedResult = service.addLaboratoireToCollectionIfMissing([], laboratoire, laboratoire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(laboratoire);
        expect(expectedResult).toContain(laboratoire2);
      });

      it('should accept null and undefined values', () => {
        const laboratoire: ILaboratoire = { id: 123 };
        expectedResult = service.addLaboratoireToCollectionIfMissing([], null, laboratoire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(laboratoire);
      });

      it('should return initial array if no Laboratoire is added', () => {
        const laboratoireCollection: ILaboratoire[] = [{ id: 123 }];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, undefined, null);
        expect(expectedResult).toEqual(laboratoireCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
