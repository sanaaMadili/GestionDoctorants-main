import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormationSuivieService } from '../service/formation-suivie.service';

import { FormationSuivieComponent } from './formation-suivie.component';

describe('FormationSuivie Management Component', () => {
  let comp: FormationSuivieComponent;
  let fixture: ComponentFixture<FormationSuivieComponent>;
  let service: FormationSuivieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FormationSuivieComponent],
    })
      .overrideTemplate(FormationSuivieComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationSuivieComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FormationSuivieService);

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
    expect(comp.formationSuivies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
