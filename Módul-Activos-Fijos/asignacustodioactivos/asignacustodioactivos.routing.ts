import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignaCustodioActivosComponent } from './componentes/asignacustodioactivos.component';

const routes: Routes = [
  { path: '', component: AsignaCustodioActivosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignaCustodioActivosRoutingModule {}
