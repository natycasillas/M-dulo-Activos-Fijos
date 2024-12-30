import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConstatacionFisicaRoutingModule } from './constatacionFisica.routing';
import { ConstatacionFisicaComponent } from './componentes/constatacionFisica.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
@NgModule({
  imports: [SharedModule, ConstatacionFisicaRoutingModule, JasperModule, LovProductosModule, LovFuncionariosModule, LovProveedoresModule, LovCuentasContablesModule ],
  declarations: [ConstatacionFisicaComponent]
})
export class ConstatacionFisicaModule { }
