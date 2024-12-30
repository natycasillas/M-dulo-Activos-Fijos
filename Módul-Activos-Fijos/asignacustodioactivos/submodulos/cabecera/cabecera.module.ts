import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CabeceraRoutingModule } from './cabecera.routing';
import { CabeceraComponent } from './componentes/_cabecera.component';



@NgModule({
  imports: [SharedModule, CabeceraRoutingModule ],
  declarations: [CabeceraComponent],
  exports: [CabeceraComponent]
})
export class CabeceraModule { }
