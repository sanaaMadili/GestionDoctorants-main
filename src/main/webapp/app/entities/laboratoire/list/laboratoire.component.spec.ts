import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LaboratoireService } from '../service/laboratoire.service';

import { LaboratoireComponent } from './laboratoire.component';

describe('Laboratoire Management Component', () => {
  let comp: LaboratoireComponent;
  let fixture: ComponentFixture<LaboratoireComponent>;
  let service: LaboratoireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LaboratoireComponent],
    })
      .overrideTemplate(LaboratoireComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaboratoireComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LaboratoireService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
  });
});
