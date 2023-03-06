import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DiplomesService } from '../service/diplomes.service';

import { DiplomesComponent } from './diplomes.component';

describe('Diplomes Management Component', () => {
  let comp: DiplomesComponent;
  let fixture: ComponentFixture<DiplomesComponent>;
  let service: DiplomesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DiplomesComponent],
    })
      .overrideTemplate(DiplomesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiplomesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DiplomesService);

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
    expect(comp.diplomes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
