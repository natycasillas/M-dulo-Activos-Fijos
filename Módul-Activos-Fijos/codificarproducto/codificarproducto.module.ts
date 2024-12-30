import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CodificarProductoRoutingModule } from './codificarproducto.routing';
import { CodificarProductoComponent } from './componentes/codificarproducto.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovIngresosModule } from '../../lov/ingresos/lov.ingresos.module';

@NgModule({
  imports: [SharedModule, CodificarProductoRoutingModule, CabeceraModule, DetalleModule, JasperModule,LovIngresosModule],
  declarations: [CodificarProductoComponent]
})
export class CodificarProductoModule { }
