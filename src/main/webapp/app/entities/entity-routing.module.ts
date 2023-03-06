import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'doctorant',
        data: { pageTitle: 'doctorantApp.doctorant.home.title' },
        loadChildren: () => import('./doctorant/doctorant.module').then(m => m.DoctorantModule),
      },
      {
        path: 'formation',
        data: { pageTitle: 'doctorantApp.formation.home.title' },
        loadChildren: () => import('./formation/formation.module').then(m => m.FormationModule),
      },
      {
        path: 'formation-doctorant',
        data: { pageTitle: 'doctorantApp.formationDoctorant.home.title' },
        loadChildren: () => import('./formation-doctorant/formation-doctorant.module').then(m => m.FormationDoctorantModule),
      },
      {
        path: 'cursus',
        data: { pageTitle: 'doctorantApp.cursus.home.title' },
        loadChildren: () => import('./cursus/cursus.module').then(m => m.CursusModule),
      },
      {
        path: 'bac',
        data: { pageTitle: 'doctorantApp.bac.home.title' },
        loadChildren: () => import('./bac/bac.module').then(m => m.BacModule),
      },
      {
        path: 'etablissement',
        data: { pageTitle: 'doctorantApp.etablissement.home.title' },
        loadChildren: () => import('./etablissement/etablissement.module').then(m => m.EtablissementModule),
      },
      {
        path: 'equipe',
        data: { pageTitle: 'doctorantApp.equipe.home.title' },
        loadChildren: () => import('./equipe/equipe.module').then(m => m.EquipeModule),
      },
      {
        path: 'promotion',
        data: { pageTitle: 'doctorantApp.promotion.home.title' },
        loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule),
      },
      {
        path: 'publication',
        data: { pageTitle: 'doctorantApp.publication.home.title' },
        loadChildren: () => import('./publication/publication.module').then(m => m.PublicationModule),
      },
      {
        path: 'sujet',
        data: { pageTitle: 'doctorantApp.sujet.home.title' },
        loadChildren: () => import('./sujet/sujet.module').then(m => m.SujetModule),
      },
      {
        path: 'laboratoire',
        data: { pageTitle: 'doctorantApp.laboratoire.home.title' },
        loadChildren: () => import('./laboratoire/laboratoire.module').then(m => m.LaboratoireModule),
      },
      {
        path: 'membre-equipe',
        data: { pageTitle: 'doctorantApp.membreEquipe.home.title' },
        loadChildren: () => import('./membre-equipe/membre-equipe.module').then(m => m.MembreEquipeModule),
      },
      {
        path: 'extra-user',
        data: { pageTitle: 'doctorantApp.extraUser.home.title' },
        loadChildren: () => import('./extra-user/extra-user.module').then(m => m.ExtraUserModule),
      },
      {
        path: 'chef-equipe',
        data: { pageTitle: 'doctorantApp.chefEquipe.home.title' },
        loadChildren: () => import('./chef-equipe/chef-equipe.module').then(m => m.ChefEquipeModule),
      },
      {
        path: 'chef-lab',
        data: { pageTitle: 'doctorantApp.chefLab.home.title' },
        loadChildren: () => import('./chef-lab/chef-lab.module').then(m => m.ChefLabModule),
      },
      {
        path: 'bourse',
        data: { pageTitle: 'doctorantApp.bourse.home.title' },
        loadChildren: () => import('./bourse/bourse.module').then(m => m.BourseModule),
      },
      {
        path: 'formation-doctoranle',
        data: { pageTitle: 'doctorantApp.formationDoctoranle.home.title' },
        loadChildren: () => import('./formation-doctoranle/formation-doctoranle.module').then(m => m.FormationDoctoranleModule),
      },
      {
        path: 'formation-suivie',
        data: { pageTitle: 'doctorantApp.formationSuivie.home.title' },
        loadChildren: () => import('./formation-suivie/formation-suivie.module').then(m => m.FormationSuivieModule),
      },
      {
        path: 'diplomes',
        data: { pageTitle: 'doctorantApp.diplomes.home.title' },
        loadChildren: () => import('./diplomes/diplomes.module').then(m => m.DiplomesModule),
      },
      {
        path: 'profile',
        data: { pageTitle: 'doctorantApp.profile.home.title' },
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'information',
        data: { pageTitle: 'doctorantApp.information.home.title' },
        loadChildren: () => import('./information/information.module').then(m => m.InformationModule),
      },
      {
        path: 'chercheur-externe',
        data: { pageTitle: 'doctorantApp.chercheurExterne.home.title' },
        loadChildren: () => import('./chercheur-externe/chercheur-externe.module').then(m => m.ChercheurExterneModule),
      },
      {
        path: 'reinscription',
        data: { pageTitle: 'doctorantApp.reinscription.home.title' },
        loadChildren: () => import('./reinscription/reinscription.module').then(m => m.ReinscriptionModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'doctorantApp.notification.home.title' },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
