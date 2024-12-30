import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';
import { DetalleComponent } from './componentes/_detalle.component';
import { LovProductosModule } from '../../../../lov/productos/lov.productos.module';


@NgModule({
  imports: [SharedModule, DetalleRoutingModule, LovProductosModule ],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
