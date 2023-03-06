import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFormationDoctorant, FormationDoctorant } from '../formation-doctorant.model';

import { FormationDoctorantService } from './formation-doctorant.service';

describe('FormationDoctorant Service', () => {
  let service: FormationDoctorantService;
  let httpMock: HttpTestingController;
  let elemDefault: IFormationDoctorant;
  let expectedResult: IFormationDoctorant | IFormationDoctorant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FormationDoctorantService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      specialite: 'AAAAAAA',
      type: 'AAAAAAA',
      dateObtention: 'AAAAAAA',
      note1: 0,
      scanneNote1ContentType: 'image/png',
      scanneNote1: 'AAAAAAA',
      note2: 0,
      scanneNote2ContentType: 'image/png',
      scanneNote2: 'AAAAAAA',
      note3: 0,
      scanneNote3ContentType: 'image/png',
      scanneNote3: 'AAAAAAA',
      note4: 0,
      scanneNote4ContentType: 'image/png',
      scanneNote4: 'AAAAAAA',
      note5: 0,
      scanneNote5ContentType: 'image/png',
      scanneNote5: 'AAAAAAA',
      scanneDiplomeContentType: 'image/png',
      scanneDiplome: 'AAAAAAA',
      mention: 'AAAAAAA',
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

    it('should create a FormationDoctorant', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FormationDoctorant()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FormationDoctorant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          specialite: 'BBBBBB',
          type: 'BBBBBB',
          dateObtention: 'BBBBBB',
          note1: 1,
          scanneNote1: 'BBBBBB',
          note2: 1,
          scanneNote2: 'BBBBBB',
          note3: 1,
          scanneNote3: 'BBBBBB',
          note4: 1,
          scanneNote4: 'BBBBBB',
          note5: 1,
          scanneNote5: 'BBBBBB',
          scanneDiplome: 'BBBBBB',
          mention: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FormationDoctorant', () => {
      const patchObject = Object.assign(
        {
          dateObtention: 'BBBBBB',
          note2: 1,
          scanneNote2: 'BBBBBB',
          scanneNote4: 'BBBBBB',
          scanneNote5: 'BBBBBB',
          mention: 'BBBBBB',
        },
        new FormationDoctorant()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FormationDoctorant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          specialite: 'BBBBBB',
          type: 'BBBBBB',
          dateObtention: 'BBBBBB',
          note1: 1,
          scanneNote1: 'BBBBBB',
          note2: 1,
          scanneNote2: 'BBBBBB',
          note3: 1,
          scanneNote3: 'BBBBBB',
          note4: 1,
          scanneNote4: 'BBBBBB',
          note5: 1,
          scanneNote5: 'BBBBBB',
          scanneDiplome: 'BBBBBB',
          mention: 'BBBBBB',
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

    it('should delete a FormationDoctorant', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFormationDoctorantToCollectionIfMissing', () => {
      it('should add a FormationDoctorant to an empty array', () => {
        const formationDoctorant: IFormationDoctorant = { id: 123 };
        expectedResult = service.addFormationDoctorantToCollectionIfMissing([], formationDoctorant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formationDoctorant);
      });

      it('should not add a FormationDoctorant to an array that contains it', () => {
        const formationDoctorant: IFormationDoctorant = { id: 123 };
        const formationDoctorantCollection: IFormationDoctorant[] = [
          {
            ...formationDoctorant,
          },
          { id: 456 },
        ];
        expectedResult = service.addFormationDoctorantToCollectionIfMissing(formationDoctorantCollection, formationDoctorant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FormationDoctorant to an array that doesn't contain it", () => {
        const formationDoctorant: IFormationDoctorant = { id: 123 };
        const formationDoctorantCollection: IFormationDoctorant[] = [{ id: 456 }];
        expectedResult = service.addFormationDoctorantToCollectionIfMissing(formationDoctorantCollection, formationDoctorant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formationDoctorant);
      });

      it('should add only unique FormationDoctorant to an array', () => {
        const formationDoctorantArray: IFormationDoctorant[] = [{ id: 123 }, { id: 456 }, { id: 31352 }];
        const formationDoctorantCollection: IFormationDoctorant[] = [{ id: 123 }];
        expectedResult = service.addFormationDoctorantToCollectionIfMissing(formationDoctorantCollection, ...formationDoctorantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formationDoctorant: IFormationDoctorant = { id: 123 };
        const formationDoctorant2: IFormationDoctorant = { id: 456 };
        expectedResult = service.addFormationDoctorantToCollectionIfMissing([], formationDoctorant, formationDoctorant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formationDoctorant);
        expect(expectedResult).toContain(formationDoctorant2);
      });

      it('should accept null and undefined values', () => {
        const formationDoctorant: IFormationDoctorant = { id: 123 };
        expectedResult = service.addFormationDoctorantToCollectionIfMissing([], null, formationDoctorant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formationDoctorant);
      });

      it('should return initial array if no FormationDoctorant is added', () => {
        const formationDoctorantCollection: IFormationDoctorant[] = [{ id: 123 }];
        expectedResult = service.addFormationDoctorantToCollectionIfMissing(formationDoctorantCollection, undefined, null);
        expect(expectedResult).toEqual(formationDoctorantCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
