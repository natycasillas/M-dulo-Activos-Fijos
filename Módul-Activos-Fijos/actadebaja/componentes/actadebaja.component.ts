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
import { LovEgresosComponent } from '../../../lov/egresos/componentes/lov.egresos.component';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-actadebaja',
  templateUrl: 'actadebaja.html'
})
export class ActadeBajaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(JasperComponent)
  public jasper1: JasperComponent;

  @ViewChild(JasperComponent)
  public jasper2: JasperComponent;


  @ViewChild(LovEgresosComponent)
  private lovegresos: LovEgresosComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;
  
  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoegresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];

  public nuevo = true;
  public tienekardex = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
   

  }
  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'ABSTRACT', 'CREAREGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.cabeceraComponent.registro.fecha = this.fechaactual;
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
  calcularTotales(){
    
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
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);    
    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);
   
  }

  consultarDatosFuncionario() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_OBTDATFUNCIONARIO';
    this.rqConsulta.storeprocedure = "sp_AcfConObtenerDatosFuncionario";
    this.rqConsulta.parametro_cegreso = this.cabeceraComponent.mfiltros.cegreso;

    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaFuncionario(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaFuncionario(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.registro.mdatos.nfuncionario = resp.AF_OBTDATFUNCIONARIO[0].nfuncionario;
      this.registro.mdatos.ccargo = resp.AF_OBTDATFUNCIONARIO[0].ccargo;
      this.registro.mdatos.ncargo = resp.AF_OBTDATFUNCIONARIO[0].ncargo;
      this.registro.mdatos.cproceso = resp.AF_OBTDATFUNCIONARIO[0].cproceso;
      this.registro.mdatos.nproceso = resp.AF_OBTDATFUNCIONARIO[0].nproceso;
      
    }
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
    this.tienekardex = this.cabeceraComponent.registro.tienekardex;
    this.consultarDatosFuncionario();
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    if (this.cabeceraComponent.registro.comentario === undefined){
      this.cabeceraComponent.registro.comentario = "";
    }    
    this.grabar();
  }

   grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (!this.validarRegistrosDetalle()) {
      super.mostrarMensajeError('DETALLE DE ACTA DE BAJA TIENE PRODUCTOS SIN CODIGO DE BARRAS');
      return;
    }
    if (this.nuevo) {
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
      this.cabeceraComponent.registro.cusuarioing = '';
    }else{
      this.cabeceraComponent.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.cabeceraComponent.registro.fmodificacion = this.fechaactual;
    }
    this.cabeceraComponent.registro.optlock = 0;
    this.cabeceraComponent.registro.verreg = 0;
    this.detalleComponent.registro.cantidad = 1;
    this.rqMantenimiento.mdatos.infoadicional = this.detalleComponent.lregistros;
    this.cabeceraComponent.registro.tipoegresoccatalogo = 1305;
    this.cabeceraComponent.registro.tipoegresocdetalle = 'ACTBAJ';
    this.cabeceraComponent.registro.estadoccatalogo = 1306;
    this.cabeceraComponent.registro.estadocdetalle = 'EGRESA';
    this.cabeceraComponent.registro.carea = this.registro.mdatos.cproceso;
    this.cabeceraComponent.registro.ccargo = this.registro.mdatos.ccargo;
    this.cabeceraComponent.registro.tienekardex = true;
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validarRegistrosDetalle(): boolean {
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.mdatos.cbarras === undefined) {
        return false;
      }
    }
    return true;
  }

  validarGrabar(): string {
    let mensaje: string = '';
    if (this.cabeceraComponent.registro.cusuarioautorizado === null || this.cabeceraComponent.registro.cusuarioautorizado === undefined) {
      mensaje += 'INGRESE SOLICITADO POR <br />';
    }

    if (this.cabeceraComponent.registro.fecha === null || this.cabeceraComponent.registro.fecha === undefined) {
      mensaje += 'INGRESE FECHA <br />';
    }

    if (this.cabeceraComponent.registro.numeromemo === null || this.cabeceraComponent.registro.numeromemo === undefined) {
      mensaje += 'INGRESE EL MEMO DE AUTORIZACIÓN <br />';
     }

    if (this.cabeceraComponent.registro.numerooficio === null || this.cabeceraComponent.registro.numerooficio === undefined) {
      mensaje += 'INGRESE EL NUMERO DE OFICIO <br />';
    }

    if (this.detalleComponent.lregistros.length === 0) {
      mensaje += 'NO HA INGRESADO DETALLE DE PRODUCTOS <br />';
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
  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommit(resp);
      this.cabeceraComponent.registro.cegreso = resp.cegreso;
      this.cabeceraComponent.mfiltros.cegreso = resp.cegreso;
      this.detalleComponent.mfiltros.cegreso = resp.cegreso;
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.tienekardex = this.cabeceraComponent.registro.tienekardex;
      this.enproceso = false;
     
    }
  }


  /**Muestra lov de egresos */
  mostrarlovegresos(): void {
    this.lovegresos.mfiltros.tipoegresocdetalle = 'ACTBAJ';
   
    this.lovegresos.showDialog(true);
  }


  /**Retorno de lov de egresos. */
  fijarLovEgresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.detalleComponent.mfiltros.cegreso = reg.registro.cegreso;
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
      this.cabeceraComponent.registro.cusuarioautorizado = reg.registro.cpersona;
      this.registro.mdatos.nfuncionario = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.cabeceraComponent.registro.mdatos.nfuncionario = reg.registro.primernombre +" "+reg.registro.primerapellido; 
      this.detalleComponent.cpersonaasignada = reg.registro.cpersona;
      this.registro.mdatos.ccargo = reg.registro.mdatos.ccargo;      
      this.registro.mdatos.ncargo = reg.registro.mdatos.ncargo;          
      this.registro.mdatos.cproceso = reg.registro.mdatos.cproceso; 
      this.registro.mdatos.nproceso = reg.registro.mdatos.nproceso;
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const consultaFuncionarios = new Consulta('tthfuncionariodetalle', 'Y', 't.primernombre + t.primerapellido', { verreg: 0 }, {});
    consultaFuncionarios.cantidad = 500;
    this.addConsultaCatalogos('FUNCIONARIO', consultaFuncionarios, this.lcusuariorecibe, this.llenaListaUsuarioRecibe, 'cfuncionario', null);

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

    this.catalogoDetalle = new CatalogoDetalleComponent(this.localStorageService,this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1306;
    const conEstadoProducto = this.catalogoDetalle.crearDtoConsulta();
    conEstadoProducto.cantidad = 20;
    this.addConsultaCatalogos('ESTADOEGRESO', conEstadoProducto, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  public llenaListaUsuarioRecibe(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    while (pLista.length > 0) {
      pLista.pop();
    }
    if (agregaRegistroVacio) {
      pLista.push({ label: '...', value: null });
    }
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg = pListaResp[i];
        pLista.push({ label: reg.primernombre + ' ' + reg.primerapellido, value: reg.cfuncionario });
      }
    }
  }
  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cegreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un egreso');
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
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfActaDeBaja';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
