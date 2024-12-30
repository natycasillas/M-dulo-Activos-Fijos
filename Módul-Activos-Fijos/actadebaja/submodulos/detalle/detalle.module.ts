import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';
import { DetalleComponent } from './componentes/_detalle.component';
import { LovCodificadosModule } from '../../../../lov/codificados/lov.codificados.module';


@NgModule({
  imports: [SharedModule, DetalleRoutingModule, LovCodificadosModule ],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
