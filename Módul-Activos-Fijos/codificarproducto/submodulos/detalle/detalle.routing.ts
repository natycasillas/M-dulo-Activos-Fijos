import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleComponent } from './componentes/_detalle.component';

const routes: Routes = [
  { path: '', component: DetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleRoutingModule {}
