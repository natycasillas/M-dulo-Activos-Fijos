import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActadeBajaRoutingModule } from './actadebaja.routing';
import { ActadeBajaComponent } from './componentes/actadebaja.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';
import { LovCargoModule } from '../../../talentohumano/lov/cargo/lov.cargo.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, ActadeBajaRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovEgresosModule,
            LovCargoModule,  LovFuncionariosModule],
  declarations: [ActadeBajaComponent]
})
export class ActadeBajaModule { }
