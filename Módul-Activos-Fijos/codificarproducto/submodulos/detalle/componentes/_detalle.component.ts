import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'app/util/seguridad/sesion/localStorageService';

import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { environment } from '../../../../../../../../environments/environment.prod';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public totalCantidad = 0;
  public totalValorUnitario = 0;
  public totalValorTotal = 0;  
  private catalogoDetalle: CatalogoDetalleComponent;
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];  
  public lubicacioncdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lmarca: SelectItem[] = [{ label: '...', value: null }];

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'tacfingresodetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.consultaDetalleProducto();
    //this.consultarCatalogos();    
  }

  public crearDtoConsulta() {
    this.consultaDetalleProducto();    
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }
  consultaDetalleProducto() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_PRODUCTOCODIFICADO';
    if(environment.AcfSpIVA)  this.rqConsulta.storeprocedure = 'sp_AcfConCodificaProducto';
    else this.rqConsulta.storeprocedure = 'sp_AcfConCodificaProductoSinIVA';
    this.rqConsulta.parametro_cingreso = this.mfiltros.cingreso === undefined ? "" : this.mfiltros.cingreso;
    this.msgs = [];

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
    this.lregistros = [];
    if (resp.cod === 'OK') {
      for (const i in resp.AF_PRODUCTOCODIFICADO) {
      
        let reg = resp.AF_PRODUCTOCODIFICADO[i];
       
        reg.esnuevo = true;
        reg.mdatos = {serial: '',cbarras: resp.AF_PRODUCTOCODIFICADO[i].cbarras, vunitario: resp.AF_PRODUCTOCODIFICADO[i].vunitario,
                     valorlibros: resp.AF_PRODUCTOCODIFICADO[i].valorlibros,valorresidual: resp.AF_PRODUCTOCODIFICADO[i].valorresidual,
                     vidautil: resp.AF_PRODUCTOCODIFICADO[i].vidautil, porcendepreciacion: resp.AF_PRODUCTOCODIFICADO[i].porcendepreciacion, 
                     ccuenta: resp.AF_PRODUCTOCODIFICADO[i].ccuenta, ccuentadepreciacion: resp.AF_PRODUCTOCODIFICADO[i].ccuentadepreciacion,
                     ccuentagasto: resp.AF_PRODUCTOCODIFICADO[i].ccuentagasto, ccuentadepreciacionacum: resp.AF_PRODUCTOCODIFICADO[i].ccuentadepreciacionacum,
                     centrocostosccatalogo: resp.AF_PRODUCTOCODIFICADO[i].centrocostosccatalogo, centrocostoscdetalle: resp.AF_PRODUCTOCODIFICADO[i].centrocostoscdetalle,
                     fdepreciacion: resp.AF_PRODUCTOCODIFICADO[i].fdepreciacion,fcompra: resp.AF_PRODUCTOCODIFICADO[i].fcompra,
                    estadoccatalogo: 1301, estadocdetalle: '', ubicacionccatalogo: 1309, ubicacioncdetalle: '', infoadicional:'', comentario:'',
                    marcaccatalogo:1302, marcacdetalle:resp.AF_PRODUCTOCODIFICADO[i].marcacdetalle,valdepacumulada:resp.AF_PRODUCTOCODIFICADO[i].valdepacumulada };
        this.lregistros.push(reg);
      }
    }
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.actualizar();
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }


  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }


  consultarCatalogos(): void {
    this.msgs = [];
    this.lconsulta = [];
    
    // this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    //   .subscribe(
    //   resp => {
    //     this.encerarMensajes();
    //     this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
   
    //   },
    //   error => {
    //     this.dtoServicios.manejoError(error);
    //   });

      const mfiltrosEstado: any = { 'ccatalogo': 1301 };
      const consultaEstado = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosEstado, {});
      consultaEstado.cantidad = 500;
      this.addConsultaCatalogos('ESTADOS', consultaEstado, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

      const mfiltrosUbicacion: any = { 'ccatalogo': 1309, 'activo' : true };
      const consultaUbicacion = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosUbicacion, {});
      consultaUbicacion.cantidad = 500;
      this.addConsultaCatalogos('UBICACION', consultaUbicacion, this.lubicacioncdetalle, super.llenaListaCatalogo, 'cdetalle');   

      const mfiltrosMarca: any = { 'ccatalogo': 1302 };
      const consultaMarca = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMarca, {});
      consultaMarca.cantidad = 500;
      this.addConsultaCatalogos('MARCA', consultaMarca, this.lmarca, super.llenaListaCatalogo, 'cdetalle');   

      this.ejecutarConsultaCatalogos();
  }

}
