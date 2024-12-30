import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoproductoComponent } from './componentes/tipoproducto.component';

const routes: Routes = [
  { path: '', component: TipoproductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoproductoRoutingModule {}
