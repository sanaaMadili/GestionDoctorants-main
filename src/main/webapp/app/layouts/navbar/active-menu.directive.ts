import { Directive, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ChefLabService } from 'app/entities/chef-lab/service/chef-lab.service';
import { IChefLab } from 'app/entities/chef-lab/chef-lab.model';
import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
@Directive({
  selector: '[jhiActiveMenu]',
})
export class ActiveMenuDirective implements OnInit {
  chefLabs?: IChefLab[];

  @Input() jhiActiveMenu?: string;

  constructor(private el: ElementRef, private renderer: Renderer2 ,protected cheflaboratoireservice: ChefLabService ,private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateActiveFlag(event.lang);
    });

    this.updateActiveFlag(this.translateService.currentLang);
    
  }

  updateActiveFlag(selectedLanguage: string): void {
    if (this.jhiActiveMenu === selectedLanguage) {
      this.renderer.addClass(this.el.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'active');
    }
  }
}
