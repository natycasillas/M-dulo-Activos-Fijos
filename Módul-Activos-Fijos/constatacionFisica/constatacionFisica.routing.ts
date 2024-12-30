import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConstatacionFisicaComponent } from './componentes/constatacionFisica.component';

const routes: Routes = [
  { path: '', component: ConstatacionFisicaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstatacionFisicaRoutingModule {}
