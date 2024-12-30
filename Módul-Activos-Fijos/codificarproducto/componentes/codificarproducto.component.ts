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
import { LovIngresosComponent } from '../../../lov/ingresos/componentes/lov.ingresos.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-codificar-producto',
  templateUrl: 'codificarproducto.html'
})
export class CodificarProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovIngresosComponent)
  private lovingresos: LovIngresosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoingresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcargocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lareacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'ABSTRACT', 'CODIFICARPRODUCTO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.cabeceraComponent.mcampos.fechaingreso = this.fechaactual;
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
  calcularTotales(){
    
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
    conComprobante.addSubquery('tperproveedor', 'nombre', 'nproveedor', 'i.cpersona = t.cpersonaproveedor');
    conComprobante.addSubquery('tperproveedor', 'identificacion', 'identificacion', 'i.cpersona = t.cpersonaproveedor');
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
    this.detalleComponent.consultaDetalleProducto();
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
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    this.grabar();
  }

  finalizarIngreso(): void {
    this.grabar();
  }

  eliminarComprobante(): void{
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    let mensaje = this.validarIngreso();
    if ( mensaje !== ''){
      super.mostrarMensajeError(mensaje);
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.cingreso = this.cabeceraComponent.registro.cingreso;
    this.rqMantenimiento.mdatos.memocodificacion = 'S/N';
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
    if (resp.cod === 'OK'){
      this.grabo = true;
      //this.descargarEtiquetas();
      //this.descargarReporte();
    }

    this.router.navigate([''], {skipLocationChange: true});
     }


  /**Muestra lov de ingresos */
  mostrarlovingresos(): void {
    this.lovingresos.mfiltros.eliminado = false;
    this.lovingresos.mfiltros.tienekardex = false;
    this.lovingresos.mfiltros.estadoingresocdetalle = "INGRES";
    this.lovingresos.mfiltros.tipoingresocdetalle = 'COMPRA';
    this.consultar();
    this.lovingresos.showDialog(true);
   
  }

  /**Retorno de lov de Ingresos. */
  fijarLovIngresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.detalleComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.msgs = [];
      this.consultar();
    }

  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const conUsuarios = new Consulta('tperpersonadetalle', 'Y', 't.nombre', {}, {});
    conUsuarios.addSubquery('tsegusuariodetalle','ccompania','ncompania','t.cpersona = i.cpersona and t.ccompania = i.ccompania and t.ccompania=1 AND i.optlock = i.veractual and t.verreg = i.verreg and i.verreg=0')
    conUsuarios.cantidad = 100;
    this.addConsultaCatalogos('USUARIOS', conUsuarios, this.lcusuariorecibe, super.llenaListaCatalogo ,'cpersona');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1303;
    const conTipoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoIngreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOINGRESO', conTipoIngreso, this.ltipoingresocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1304;
    const conEstadoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoIngreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOINGRESO', conEstadoIngreso, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  validarIngreso(): string{
    let contadorRegistros = 0;
    let contadorNoIngresados = 0;

    
    
      return '';
    
    
  }
  //#region Reporte
  descargarReporte() {
    if (this.cabeceraComponent.registro.cingreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }
    // Agregar parametros
    this.jasper.parametros['@i_cingreso'] = this.cabeceraComponent.registro.cingreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfConsultaProductoCodificado';
    this.jasper.generaReporteCore();
  }
  // descargarEtiquetas(){

  //   this.jasper.nombreArchivo = 'ReporteSimulacion';
  //   // Agregar parametros
  //   this.jasper.parametros['@i_cingreso'] = this.cabeceraComponent.registro.cingreso;
  //   this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfImpresionCodigoQR';
  //   this.jasper.generaReporteCore();
  // }
  //#endregion
}
