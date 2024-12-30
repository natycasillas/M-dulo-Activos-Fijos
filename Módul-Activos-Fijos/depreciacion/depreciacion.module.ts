import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DepreciacionRoutingModule } from './depreciacion.routing';
import { DepreciacionComponent } from './componentes/depreciacion.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovDepreciacionesModule } from '../../lov/depreciaciones/lov.depreciaciones.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';

@NgModule({
  imports: [SharedModule, DepreciacionRoutingModule, CabeceraModule, DetalleModule, JasperModule,LovDepreciacionesModule, LovProveedoresModule ],
  declarations: [DepreciacionComponent]
})
export class DepreciacionModule { }
