import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'app/util/seguridad/sesion/localStorageService';

import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovEgresosComponent } from '../../../lov/egresos/componentes/lov.egresos.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { CabeceraRoutingModule } from 'app/modulos/activosfijos/activosfijos/consultaegreso/submodulos/cabecera/cabecera.routing';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';


@Component({
  selector: 'app-asignacustodioactivos',
  templateUrl: 'asignacustodioactivos.html'
})
export class AsignaCustodioActivosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovEgresosComponent)
  private lovegresos: LovEgresosComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoegresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];

  public nuevo = true;

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'ABSTRACT', 'ASIGNAR', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.cabeceraComponent.mcampos.fecha = this.fechaactual;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    conComprobante.addSubquery('tconcomprobante','numerocomprobantecesantia','numerocomprobantecesantia','t.ccomprobante = i.ccomprobante');
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);
  }

  private fijarFiltrosConsulta() {
    this.cabeceraComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
   }
 
  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.cabeceraComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
    this.nuevo = false;
    if (this.cabeceraComponent.registro.ccomprobante !== null){
      this.mcampos.ccomprobante = this.cabeceraComponent.registro.ccomprobante;
      this.mcampos.numerocomprobantecesantia = this.cabeceraComponent.registro.mdatos.numerocomprobantecesantia;
    }else{
      this.mcampos.ccomprobante = undefined;
      this.mcampos.numerocomprobantecesantia = undefined;
    }
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    this.grabar();
  }

  contabilizar(): void {
    this.rqMantenimiento.mdatos.generarcomprobante = true;
    this.grabar();
  }

  eliminarComprobante(): void{
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = [];
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (!this.validarRegistrosDetalle()) {
      super.mostrarMensajeError('NO SE HA REGISTRADO DETALLE');
      return;
    }
    if (this.nuevo) {
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
    }
    this.rqMantenimiento.mdatos.tipomovimiento =this.cabeceraComponent.registro.tipoegresocdetalle;
    this.rqMantenimiento.mdatos.kardexproductocodificado=true;    
    this.rqMantenimiento.mdatos.cegreso = this.cabeceraComponent.registro.cegreso;
    this.rqMantenimiento.mdatos.infoadicional = this.detalleComponent.lregistros;
    this.rqMantenimiento.mdatos.fecha = this.cabeceraComponent.registro.fecha;
    // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  
  validarGrabar(): string {
    let mensaje: string = '';
    if (this.cabeceraComponent.registro.fecha === null || this.cabeceraComponent.registro.fecha === undefined) {
      mensaje += 'INGRESE FECHA <br />';
    }
    // if (this.cabeceraComponent.registro.numeromemo === null || this.cabeceraComponent.registro.numeromemo === undefined) {
    //   mensaje += 'INGRESE MEMO <br />';
    // }
    // if (this.cabeceraComponent.registro.numerooficio === undefined || this.cabeceraComponent.registro.numerooficio === "") {
    //   mensaje += 'INGRESE NÚMERO OFICIO <br />';
    // }
    return mensaje;
  }
  calcularTotales(){
    
  }
  validarRegistrosDetalle(): boolean {
    if(this.detalleComponent.lregistros.length === 0)
      {
        return false;
      }
      else
      {
        return true;
      }
  }


  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK'){
      //this.grabo = true;
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.cabeceraComponent.registro.cegreso = resp.cegreso;
      this.cabeceraComponent.mfiltros.cegreso = resp.cegreso;
      this.detalleComponent.mfiltros.cmovimiento = resp.cegreso;     
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.enproceso = false;
      this.consultar();
    }
  }


  /**Muestra lov de egresos */
  mostrarlovegresos(): void {
    this.lovegresos.mfiltros.tienekardex = true;
    this.lovegresos.mfiltros.movimiento = 'A';
    this.lovegresos.showDialog(true);
  }


  /**Retorno de lov de concepto contables. */
  fijarLovEgresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.detalleComponent.mfiltros.cmovimiento = reg.registro.cegreso;
      this.msgs = [];
      this.consultar();
    }
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
    
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cusuariorecibe = reg.registro.cpersona;
      this.registro.mdatos.nfuncionario = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.cabeceraComponent.registro.mdatos.nfuncionario = reg.registro.primernombre +" "+reg.registro.primerapellido; 
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const consultaFuncionarios = this.cabeceraComponent.crearDtoConsulta();
    consultaFuncionarios.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cpersona= t.cusuariorecibe and i.verreg = 0' );
    consultaFuncionarios.cantidad = 500;
    this.addConsultaPorAlias(this.cabeceraComponent.alias, consultaFuncionarios);

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1305;
    const conTipoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoEgreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOEGRESO', conTipoEgreso, this.ltipoegresocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1306;
    const conEstadoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoEgreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOEGRESO', conEstadoEgreso, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');
 
    this.ejecutarConsultaCatalogos();
  }

  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cegreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cegreso;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
    this.jasper.parametros['@i_cegreso'] = this.cabeceraComponent.registro.cegreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfEntregaCustodioActivosFijos';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
