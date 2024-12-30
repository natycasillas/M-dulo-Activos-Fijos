import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoproductoRoutingModule } from './tipoproducto.routing';

import { TipoproductoComponent } from './componentes/tipoproducto.component';


@NgModule({
  imports: [SharedModule, TipoproductoRoutingModule ],
  declarations: [TipoproductoComponent]
})
export class TipoproductoModule { }
