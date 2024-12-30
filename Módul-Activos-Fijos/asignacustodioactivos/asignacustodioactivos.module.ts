import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AsignaCustodioActivosRoutingModule } from './asignacustodioactivos.routing';
import { AsignaCustodioActivosComponent } from './componentes/asignacustodioactivos.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';
import { LovCodificadosModule } from '../../lov/codificados/lov.codificados.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, AsignaCustodioActivosRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovEgresosModule, LovCodificadosModule, LovFuncionariosModule],
  declarations: [AsignaCustodioActivosComponent]
})
export class AsignaCustodioActivosModule { }
