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
import { LovDepreciacionesComponent } from '../../../lov/depreciaciones/componentes/lov.depreciaciones.component';
import { LovIngresosComponent } from '../../../lov/ingresos/componentes/lov.ingresos.component';



@Component({
  selector: 'app-depreciacion',
  templateUrl: 'depreciacion.html'
})
export class DepreciacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovIngresosComponent)
  private lovingresos: LovIngresosComponent;

  @ViewChild(LovDepreciacionesComponent)
  lovdepreciaciones: LovDepreciacionesComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public lmes: SelectItem[] = [{ label: '...', value: null}];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];
  
  public lcentro: SelectItem[] = [{ label: '...', value: null }];

  public nuevo = true;
  public eliminado = false;
  public tienekardex = false;
  public contabilizado = false;
  public mostrarCargarAF = false;

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'ABSTRACT', 'CREARDEPRECIACION', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.cabeceraComponent.registro.periodo = this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)
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
  calcularTotales(){
    
  }
  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    // Consulta datos.
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
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
    this.mcampos.mes = this.cabeceraComponent.registro.periodo.toString().substring(4,6);
    this.nuevo = false;
    if (this.cabeceraComponent.registro.ccomprobante !== null){
      this.mcampos.ccomprobante = this.cabeceraComponent.registro.ccomprobante;
      this.mcampos.numerocomprobantecesantia = this.cabeceraComponent.registro.mdatos.numerocomprobantecesantia;
    }else{
      this.mcampos.ccomprobante = undefined;
      this.mcampos.numerocomprobantecesantia = undefined;
    }
    if (this.cabeceraComponent.registro.estadocdetalle === 'ELIMIN'){
      this.eliminado = this.cabeceraComponent.registro.eliminado;
    }
    if (this.estaVacio(this.cabeceraComponent.registro.ccomprobante)){
      this.contabilizado ==true;
    }
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    this.grabar();
  }

  finalizarIngreso(): void {
    this.rqMantenimiento.mdatos.kardex = true;
    this.cabeceraComponent.registro.tienekardex = true;
    this.grabar();
  }

  contabilizarDepreciacion(): void{
    this.cabeceraComponent.registro.estadocdetalle='CONTAB';
    this.rqMantenimiento.mdatos.generarcomprobante = true;
    this.grabar();
  }

  eliminarDepreciacion(): void {
    this.cabeceraComponent.registro.estadocdetalle='ELIMIN';
    this.rqMantenimiento.mdatos.eliminar = true;
    this.rqMantenimiento.mdatos.cdepreciacion = this.cabeceraComponent.registro.cdepreciacion;
    super.grabar();

  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (this.nuevo) {
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
      this.cabeceraComponent.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;;
      this.cabeceraComponent.registro.fingreso = this.fechaactual;
      
    } else {
      this.cabeceraComponent.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.cabeceraComponent.registro.fmodificacion = this.fechaactual;
    }

    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.cabeceraComponent.registro.cdepreciacion = resp.cdepreciacion;
      this.cabeceraComponent.mfiltros.cdepreciacion = resp.cdepreciacion;
      this.detalleComponent.mfiltros.cdepreciacion = resp.cdepreciacion;
      if (resp.ccomprobante !== undefined){
        this.mcampos.ccomprobante = resp.ccomprobante;
        this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
        this.descargarReporteComprobanteContable();
      }

      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.enproceso = false;
      this.consultar();
    }
  }

  descargarReporteComprobanteContable(): void {
    let tipoComprobante = 'Diario';
    
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }  
  validarPeriodo() {
    let anio=this.cabeceraComponent.registro.periodo;
    this.cabeceraComponent.registro.periodo = this.cabeceraComponent.registro.periodo + this.mcampos.mes;
    this.detalleComponent.mcampos.anio=anio;
    this.detalleComponent.mcampos.mes=this.mcampos.mes;
    this.detalleComponent.mcampos.dia=1;
    
    if (this.cabeceraComponent.registro.periodo.length != 6) {
      super.mostrarMensajeError("SELECCIONE MES PARA DEPRECIACION");
      return;
    }

    this.mfiltrosesp.estadocdetalle = 'In (\'INGRES\',\'CONTAB\')';
    const conHistorial = new Consulta('tacfdepreciacion', 'Y', 'cdepreciacion', { 'periodo': this.cabeceraComponent.registro.periodo,'centrocostoscdetalle': this.cabeceraComponent.registro.centrocostoscdetalle}, this.mfiltrosesp);
    this.addConsultaPorAlias('HISTORIAL', conHistorial);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaHistorial(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaHistorial(resp: any) {
    if (resp.HISTORIAL.length > 0) {
      super.mostrarMensajeError("YA EXISTE DEPRECIACION CON ESTADO INGRES O CONTAB PARA EL PERIODO SELECCIONADO, SELECCIONE DESDE EL BUSCADOR");
      this.detalleComponent.lregistros = [];
      this.cabeceraComponent.registro.periodo = undefined;
      this.mostrarCargarAF = false;
    }else{
      this.mostrarCargarAF = true;
    }
  }

  cargarAF(){
    this.detalleComponent.mcampos.centrocostoscdetalle=this.cabeceraComponent.registro.centrocostoscdetalle;
    this.detalleComponent.mostrarActivos();
  }

  validarGrabar(): string {
    let mensaje: string = '';
    if (this.cabeceraComponent.registro.comentario === null || this.cabeceraComponent.registro.comentario === undefined) {
      mensaje += 'INGRESE COMENTARIO <br />';
    }
    
    for (const i in this.detalleComponent.lregistros){
      const reg = this.detalleComponent.lregistros[i];
      if (reg.mdatos.centrocostoscdetalle === undefined || reg.mdatos.centrocostoscdetalle === null){
       // mensaje += 'LINEA [' + (i+1).toString() + '] NO POSEE CENTRO DE COSTOS  <br />';
      }
      if (reg.mdatos.ccuentadepreciacion === '' || reg.mdatos.ccuentadepreciacion === null){
        mensaje += 'LINEA [' + (i+1).toString() + '] NO POSEE CUENTA DEPRECIACION <br />';
      }
      if (reg.mdatos.ccuentadepreciacionacum === '' || reg.mdatos.ccuentadepreciacion === null){
        mensaje += 'LINEA [' + (i+1).toString() + '] NO POSEE CUENTA DEPRECIACION ACUMULADA <br /> ';
      }
    }
    return mensaje;
  }


  /**Muestra lov de depreciaciones */
  mostrarlovdepreciaciones(): void {
    //this.lovdepreciaciones.mfiltros.estadocdetalle = 'INGRES';
    this.lovdepreciaciones.showDialog(true);
  }


  /**Retorno de lov de Depreciaciones. */
  fijarLovDepreciacionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mostrarCargarAF = false;
      this.cabeceraComponent.mfiltros.cdepreciacion = reg.registro.cdepreciacion;
      this.detalleComponent.mfiltros.cdepreciacion = reg.registro.cdepreciacion;
      let mes= reg.registro.periodo+"";
      this.mcampos.mes=mes.substr(4,5);
      this.msgs = [];
      this.consultar();
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1304;
    const conEstadoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoIngreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOINGRESO', conEstadoIngreso, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1308;
    const conMesPeriodo = this.catalogoDetalle.crearDtoConsulta();
    conEstadoIngreso.cantidad = 20;
    this.addConsultaCatalogos('MESPERIODO', conMesPeriodo, this.lmes, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1002;
    const concentroCosto = this.catalogoDetalle.crearDtoConsulta();
    concentroCosto.cantidad = 20;
    this.addConsultaCatalogos('CENTRO', concentroCosto, this.lcentro, super.llenaListaCatalogo, 'cdetalle');


    this.ejecutarConsultaCatalogos();
  }

  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cdepreciacion === undefined) {
      super.mostrarMensajeError('Por favor seleccione una depreciación');
      return;
    }
    let parametros = new Object();
    parametros['reportes'] = [];
    // Agregar parametros
    this.jasper.parametros=parametros;
    this.jasper.parametros['@i_cdepreciacion'] = this.cabeceraComponent.registro.cdepreciacion;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfHistorialDepreciacionConsolidado';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
