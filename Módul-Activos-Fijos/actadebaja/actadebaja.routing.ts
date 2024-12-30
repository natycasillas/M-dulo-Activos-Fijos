import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActadeBajaComponent } from './componentes/actadebaja.component';

const routes: Routes = [
  { path: '', component: ActadeBajaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActadeBajaRoutingModule {}
