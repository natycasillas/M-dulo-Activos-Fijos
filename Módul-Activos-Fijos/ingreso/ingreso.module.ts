import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IngresoRoutingModule } from './ingreso.routing';
import { IngresoComponent } from './componentes/ingreso.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovIngresosModule } from '../../lov/ingresos/lov.ingresos.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, IngresoRoutingModule, CabeceraModule, DetalleModule, JasperModule,LovIngresosModule, LovProveedoresModule,
    LovFuncionariosModule, GestorDocumentalModule],
  declarations: [IngresoComponent]
})
export class IngresoModule { }
