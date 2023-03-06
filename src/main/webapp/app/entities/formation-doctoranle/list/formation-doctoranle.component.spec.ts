import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormationDoctoranleService } from '../service/formation-doctoranle.service';

import { FormationDoctoranleComponent } from './formation-doctoranle.component';

describe('FormationDoctoranle Management Component', () => {
  let comp: FormationDoctoranleComponent;
  let fixture: ComponentFixture<FormationDoctoranleComponent>;
  let service: FormationDoctoranleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FormationDoctoranleComponent],
    })
      .overrideTemplate(FormationDoctoranleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationDoctoranleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FormationDoctoranleService);

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
    expect(comp.formationDoctoranles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
