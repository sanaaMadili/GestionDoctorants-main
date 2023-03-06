import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInformation } from '../information.model';

import { InformationService } from './information.service';

describe('Information Service', () => {
  let service: InformationService;
  let httpMock: HttpTestingController;
  let elemDefault: IInformation;
  let expectedResult: IInformation | IInformation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InformationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should return a list of Information', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    describe('addInformationToCollectionIfMissing', () => {
      it('should add a Information to an empty array', () => {
        const information: IInformation = { id: 123 };
        expectedResult = service.addInformationToCollectionIfMissing([], information);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(information);
      });

      it('should not add a Information to an array that contains it', () => {
        const information: IInformation = { id: 123 };
        const informationCollection: IInformation[] = [
          {
            ...information,
          },
          { id: 456 },
        ];
        expectedResult = service.addInformationToCollectionIfMissing(informationCollection, information);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Information to an array that doesn't contain it", () => {
        const information: IInformation = { id: 123 };
        const informationCollection: IInformation[] = [{ id: 456 }];
        expectedResult = service.addInformationToCollectionIfMissing(informationCollection, information);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(information);
      });

      it('should add only unique Information to an array', () => {
        const informationArray: IInformation[] = [{ id: 123 }, { id: 456 }, { id: 75258 }];
        const informationCollection: IInformation[] = [{ id: 123 }];
        expectedResult = service.addInformationToCollectionIfMissing(informationCollection, ...informationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const information: IInformation = { id: 123 };
        const information2: IInformation = { id: 456 };
        expectedResult = service.addInformationToCollectionIfMissing([], information, information2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(information);
        expect(expectedResult).toContain(information2);
      });

      it('should accept null and undefined values', () => {
        const information: IInformation = { id: 123 };
        expectedResult = service.addInformationToCollectionIfMissing([], null, information, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(information);
      });

      it('should return initial array if no Information is added', () => {
        const informationCollection: IInformation[] = [{ id: 123 }];
        expectedResult = service.addInformationToCollectionIfMissing(informationCollection, undefined, null);
        expect(expectedResult).toEqual(informationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
