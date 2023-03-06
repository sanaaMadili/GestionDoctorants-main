import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReinscriptionService } from '../service/reinscription.service';

import { ReinscriptionComponent } from './reinscription.component';

describe('Reinscription Management Component', () => {
  let comp: ReinscriptionComponent;
  let fixture: ComponentFixture<ReinscriptionComponent>;
  let service: ReinscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ReinscriptionComponent],
    })
      .overrideTemplate(ReinscriptionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReinscriptionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReinscriptionService);

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
    expect(comp.reinscriptions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
