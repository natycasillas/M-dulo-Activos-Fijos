import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodificarProductoComponent } from './componentes/codificarproducto.component';

const routes: Routes = [
  { path: '', component: CodificarProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodificarProductoRoutingModule {}
