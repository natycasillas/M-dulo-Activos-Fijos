import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoComponent } from './componentes/ingreso.component';

const routes: Routes = [
  { path: '', component: IngresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoRoutingModule {}
