import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
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
import { LovProveedoresComponent } from '../../../../contabilidad/lov/proveedores/componentes/lov.proveedores.component';
import { LovIngresosComponent } from '../../../lov/ingresos/componentes/lov.ingresos.component';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';
import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: 'app-ingreso',
  templateUrl: 'ingreso.html'
})
export class IngresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovIngresosComponent)
  private lovingresos: LovIngresosComponent;

  @ViewChild(LovProveedoresComponent)
  lovproveedores: LovProveedoresComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;
  
  @ViewChild(GestorDocumentalComponent)
  private lovGestor: GestorDocumentalComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoingresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcargocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lareacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lporcentajeivacdetalle: SelectItem[] = [{ label: '...', value: null }];

  public nuevo = true;
  public eliminado = false;
  public tienekardex = false;

  public minDateValue: Date;
  public maxDateValue: Date;
  
  public sumatoriobaseiva: number = 0;
  public sumatoriobasecero: number = 0;
  public helper: boolean = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
   

    if (event.keyCode === KEY_CODE.FLECHA_ABAJO && event.ctrlKey) {
      this.detalleComponent.agregarFila();
    }

  }

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'ABSTRACT', 'CREARINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.cabeceraComponent.registro.fechaingreso = this.fechaactual;
    this.cabeceraComponent.registro.fechafactura = this.fechaactual;
    super.init(this.formFiltros);
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

  mostrarLovGestorDocumental(reg: any): void {
    this.selectRegistro(reg);
    this.mostrarDialogoGenerico = false;
    this.lovGestor.showDialog(reg.cgesarchivo);
  }
  /**Retorno de lov de Gestión Documental. */
  fijarLovGestorDocumental(reg: any): void {
    if (reg !== undefined) {
      this.cabeceraComponent.registro.cgesarchivo = reg.cgesarchivo;
      this.cabeceraComponent.registro.mdatos.ndocumento = reg.ndocumento;
      this.actualizar();

      this.grabar();
      

    }
  }
  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    conComprobante.addSubquery('tperproveedor', 'nombre', 'npersonaproveedor', 'i.cpersona = t.cpersonaproveedor');
    conComprobante.addSubquery('tperproveedor', 'identificacion', 'identificacion', 'i.cpersona = t.cpersonaproveedor');
    conComprobante.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cpersona= t.cusuarioadmincontrato and i.verreg = 0' );
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
    this.detalleComponent.calcularTotales();
    this.nuevo = false;
    this.eliminado = this.cabeceraComponent.registro.eliminado;
    this.tienekardex = this.cabeceraComponent.registro.tienekardex;
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    if (this.cabeceraComponent.registro.comentario === undefined) {
      this.cabeceraComponent.registro.comentario = "";
    }
    this.grabar();
  }

  finalizarIngreso(): void {
    this.rqMantenimiento.mdatos.kardex = true;
    this.cabeceraComponent.registro.tienekardex = false;
    this.grabar();
  }

  eliminarIngreso(): void {
    this.rqMantenimiento.mdatos.eliminar = true;
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (!this.validarRegistrosDetalle()) {
      super.mostrarMensajeError('DETALLE DE INGRESO TIENE PRODUCTOS SIN CODIGO');
      return;
    }

    if (this.nuevo) {
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
      this.cabeceraComponent.registro.cusuarioing = '';
    } else {
      this.cabeceraComponent.registro.cusuariomod = 'user';
      this.cabeceraComponent.registro.fmodificacion = this.fechaactual;
    }

    this.cabeceraComponent.registro.optlock = 0;
    this.cabeceraComponent.registro.verreg = 0;
    this.cabeceraComponent.registro.tipoingresoccatalogo = 1303;
    this.cabeceraComponent.registro.estadoingresoccatalogo = 1304;
    this.cabeceraComponent.registro.estadoingresocdetalle = 'INGRES';  
    this.detalleComponent.registro.cantidaddevuelta = 0;  
    this.rqMantenimiento.mdatos.fechafactura = this.cabeceraComponent.registro.fechafactura;
    this.rqMantenimiento.mdatos.fecha = this.cabeceraComponent.registro.fechaingreso;
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
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.cabeceraComponent.registro.cingreso = resp.cingreso;
      this.cabeceraComponent.mfiltros.cingreso = resp.cingreso;
      this.detalleComponent.mfiltros.cingreso = resp.cingreso;
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.tienekardex = this.cabeceraComponent.registro.tienekardex;
      this.enproceso = false;
      this.consultar();
    }
  }

  validarRegistrosDetalle(): boolean {
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.mdatos.codigo === undefined) {
        return false;
      }
    }
    return true;
  }

  validarGrabar(): string {
    let mensaje: string = '';
    if (this.cabeceraComponent.registro.porcentajeiva === null || this.cabeceraComponent.registro.porcentajeiva === undefined) {
      mensaje += 'INGRESE PORCENTAJE DE I.V.A <br />';
    }
    if (this.cabeceraComponent.registro.fechaingreso === null || this.cabeceraComponent.registro.fechaingreso === undefined) {
      mensaje += 'INGRESE FECHA DE INGRESO <br />';
    }
    if (this.cabeceraComponent.registro.facturanumero === undefined || this.cabeceraComponent.registro.facturanumero === "") {
      mensaje += 'INGRESE NÚMERO DE FACTURA <br />';
    }
    if (this.cabeceraComponent.registro.ordendecompra === undefined || this.cabeceraComponent.registro.ordendecompra === "") {
      mensaje += 'INGRESE ORDEN DE COMPRA <br />';
    }
    if (this.cabeceraComponent.registro.fechafactura === null || this.cabeceraComponent.registro.fechafactura === undefined) {
      mensaje += 'INGRESE FECHA DE FACTURA <br />';
    }
    if (this.cabeceraComponent.registro.cusuarioadmincontrato === null || this.cabeceraComponent.registro.cusuarioadmincontrato === undefined) {
      mensaje += 'SELECCIONE ADMINISTRADOR DE CONTRATO <br />';
    }

    if (this.cabeceraComponent.registro.cpersonaproveedor === null || this.cabeceraComponent.registro.cpersonaproveedor === undefined) {
      mensaje += 'SELECCIONE PROVEEDOR <br />';
    }
    if (this.cabeceraComponent.registro.memoautorizacion === null || this.cabeceraComponent.registro.memoautorizacion === undefined) {
      mensaje += 'INGRESE EL MEMO DE AUTORIZACIÓN <br />';
    }
    if (this.cabeceraComponent.registro.tipoingresocdetalle === null || this.cabeceraComponent.registro.tipoingresocdetalle === undefined) {
      mensaje += 'SELECCIONE EL TIPO DE INGRESO <br />';
    }
 
    if (this.detalleComponent.lregistros.length === 0) {
      mensaje += 'NO HA INGRESADO DETALLE DE PRODUCTOS <br />';
    }
    if (this.estaVacio(this.cabeceraComponent.registro.comentario)) {
      mensaje += 'NO HA INGRESADO EL COMENTARIO <br />';
    }
    return mensaje;
  }

  validarInventarioCongelado() {
    const consulta = new Consulta('tacfinventariocongelado', 'Y', '', { 'congelaactivos': true }, {});
    this.addConsultaPorAlias('CONGELAINVENTARIO', consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any) {
    if (resp.CONGELAINVENTARIO !== undefined && resp.CONGELAINVENTARIO !== null) {
      if (resp.CONGELAINVENTARIO.length > 0) {
        super.mostrarMensajeError('INVENTARIO CONGELADO, POR FAVOR TERMINAR PROCESO DE AJUSTE PARA CONTINUAR');
        return;
      }
    }
  }
  /**Muestra lov de ingresos */
  mostrarlovingresos(): void {
    this.lovingresos.mfiltros.tienekardex = false;
    this.lovingresos.mfiltrosesp.tipoingresocdetalle = 'not in(\'DEVFUN\')'
    this.lovingresos.showDialog(true);
  }


  /**Retorno de lov de ingresos. */
  fijarLovIngresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.detalleComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.cabeceraComponent.registro.fechaingreso = reg.registro.fechaingreso;
      this.msgs = [];
      this.consultar();
    }

  }

  fijarLovProveedoresSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cpersonaproveedor = reg.registro.cpersona;
      this.cabeceraComponent.registro.mdatos.identificacion = reg.registro.identificacion;
      this.cabeceraComponent.registro.mdatos.npersonaproveedor = reg.registro.nombre;
    }
  }

  mostrarlovproveedores(): void {
    this.lovproveedores.showDialog();
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
   
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {

    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cusuarioadmincontrato = reg.registro.cpersona;
      this.registro.mdatos.nfuncionario = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.cabeceraComponent.registro.mdatos.nfuncionario = reg.registro.primernombre +" "+reg.registro.primerapellido;           
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1011;
    this.catalogoDetalle.mfiltros.activo=true;
    const conPorcentajeIVA = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO2', conPorcentajeIVA, this.lporcentajeivacdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1303;
    const conTipoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoIngreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOINGRESO', conTipoIngreso, this.ltipoingresocdetalle, this.llenaListaTipoIngreso, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1304;
    const conEstadoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoIngreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOINGRESO', conEstadoIngreso, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  public llenaListaTipoIngreso(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {    
    for(let i in pListaResp){
      let reg = pListaResp[i];  
      if(reg.cdetalle !== 'DEVFUN' && reg.cdetalle !== 'DEVSUM' && reg.cdetalle !== 'DEVBOD'){
        pLista.push({label: reg.nombre, value: reg.cdetalle });
      }
    } 
  }

  calcularIVA() {
    const porcentaje = this.lporcentajeivacdetalle.find(x => x.value === this.cabeceraComponent.registro.porcentajeiva);
    if (porcentaje !== undefined) {
      this.cabeceraComponent.registro.iva = (Number(porcentaje.label) / 100) * this.cabeceraComponent.registro.subtotaliva;
      //this.cabeceraComponent.registro.iva = (Number(porcentaje.label) / 100) * this.sumatoriobaseiva;
      this.cabeceraComponent.registro.iva =this.redondear(this.cabeceraComponent.registro.iva,2);
      //this.sumatoriobaseiva = (1 + Number(porcentaje.label) / 100) * this.sumatoriobaseiva;
    }
    
  }

  calcularTotales() {
   
    let sumatoriobaseiva = 0;
    let sumatoriobasecero =0;

    for (const i in this.detalleComponent.lregistros) {
    const reg = this.detalleComponent.lregistros[i];

      if (!this.estaVacio(reg.mdatos.gravaiva) && reg.mdatos.gravaiva === true) {
        sumatoriobaseiva  += reg.mdatos.vtotal;     
      }
      else {
        sumatoriobasecero += reg.mdatos.vtotal;     
      }
  }
    this.cabeceraComponent.registro.subtotalivacero = sumatoriobasecero;
    this.cabeceraComponent.registro.subtotaliva = sumatoriobaseiva+this.cabeceraComponent.registro.ice;
    this.calcularIVA();
    //this.cabeceraComponent.registro.subtotaliva = this.detalleComponent.totalValorTotal + this.cabeceraComponent.registro.ice;
    //this.cabeceraComponent.registro.subtotalsinimpuestos = this.detalleComponent.totalValorTotal;
    this.cabeceraComponent.registro.subtotalsinimpuestos = sumatoriobasecero;    
    this.cabeceraComponent.registro.valortotal =this.cabeceraComponent.registro.subtotaliva+ this.cabeceraComponent.registro.subtotalsinimpuestos - this.cabeceraComponent.registro.descuento +
    this.cabeceraComponent.registro.iva +  this.cabeceraComponent.registro.ice;
    this.cabeceraComponent.registro.propina = 0;

    
  }


  cambiarMonto() {
    this.cabeceraComponent.registro.valortotal = this.cabeceraComponent.registro.subtotalsinimpuestos - this.cabeceraComponent.registro.descuento +
      this.cabeceraComponent.registro.iva  +  this.cabeceraComponent.registro.ice;
  }

  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cingreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }
    
    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cingreso;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
    this.jasper.parametros['@i_cingreso'] = this.cabeceraComponent.registro.cingreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteIngresoBodega';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
