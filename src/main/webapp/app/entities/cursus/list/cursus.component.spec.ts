import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CursusService } from '../service/cursus.service';

import { CursusComponent } from './cursus.component';

describe('Cursus Management Component', () => {
  let comp: CursusComponent;
  let fixture: ComponentFixture<CursusComponent>;
  let service: CursusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CursusComponent],
    })
      .overrideTemplate(CursusComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CursusComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CursusService);

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
    expect(comp.cursuses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
