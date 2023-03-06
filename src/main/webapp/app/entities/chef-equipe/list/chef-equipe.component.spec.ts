import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChefEquipeService } from '../service/chef-equipe.service';

import { ChefEquipeComponent } from './chef-equipe.component';

describe('ChefEquipe Management Component', () => {
  let comp: ChefEquipeComponent;
  let fixture: ComponentFixture<ChefEquipeComponent>;
  let service: ChefEquipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChefEquipeComponent],
    })
      .overrideTemplate(ChefEquipeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChefEquipeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChefEquipeService);

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
    expect(comp.chefEquipes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
