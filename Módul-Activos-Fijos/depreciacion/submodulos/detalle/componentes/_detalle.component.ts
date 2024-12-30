import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'app/util/seguridad/sesion/localStorageService';

import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { AccordionModule } from 'primeng/primeng';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @Output() calcularTotalesEvent = new EventEmitter();

  public totalValorUnitario = 0;
  public indice: number;
  private catalogoDetalle: CatalogoDetalleComponent

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'tacfhistorialdepreciacion', 'DETALLE', false);
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'nombre', 'nombre', 't.cproducto = i.cproducto');
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 't.cproducto = i.cproducto');
    consulta.addSubquery('tacfproductocodificado', 'cbarras', 'cbarras1', 't.cproducto = i.cproducto and t.cbarras = i.cbarras');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ncentro', 'i.ccatalogo=1002 and i.cdetalle= t.centrocostoscdetalle');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 'i.ccuenta= t.ccuentadepreciacion');
    consulta.cantidad = 20000000;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    //this.mfiltros.centrocostoscdetalle=='008';
    //
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }
  mfiltrosproductos: any = {};
  mostrarActivos() {

    
    

    this.rqConsulta.CODIGOCONSULTA="PRODUCTOS-DEPRECIAR";
    this.rqConsulta.mdatos.ncentro=this.mcampos.centrocostoscdetalle;
    this.rqConsulta.mdatos.mes=this.mcampos.mes;
    this.rqConsulta.mdatos.anio=this.mcampos.anio;
    

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuesta(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  calculateGroupTotal(ccuenta: string) {
    let total = 0;
    let registrosbusqueda: any;
    if (ccuenta == 'total') {
      registrosbusqueda = this.lregistros;
    } else {
      registrosbusqueda = this.lregistros.filter(x => x.ccuentadepreciacion == ccuenta);
    }
    for (let car of registrosbusqueda) {

      total += this.estaVacio(car.valdepperiodo) ? car.mdatos.valordepperiodo : car.valdepperiodo;

    }
    return total;
  }
  totalVUnitario(ccuenta: string) {
    let total = 0;
    let registrosbusqueda: any;
    if (ccuenta == 'total') {
      registrosbusqueda = this.lregistros;
    } else {
      registrosbusqueda = this.lregistros.filter(x => x.ccuentadepreciacion == ccuenta);
    }
    for (let car of registrosbusqueda) {

      total += car.mdatos.valorcompra;

    }
    return total;
  }
  totalVLibros(ccuenta: string) {
    let total = 0;
    let registrosbusqueda: any;
    if (ccuenta == 'total') {
      registrosbusqueda = this.lregistros;
    } else {
      registrosbusqueda = this.lregistros.filter(x => x.ccuentadepreciacion == ccuenta);
    }
    for (let car of registrosbusqueda) {

      total += this.estaVacio(car.mdatos.valorlibros) ? 0 : car.mdatos.valorlibros;

    }
    return total;
  }
  totalVDepAcum(ccuenta: string) {
    let total = 0;
    let registrosbusqueda: any;
    if (ccuenta === 'total') {
      registrosbusqueda = this.lregistros;
    } else {
      registrosbusqueda = this.lregistros.filter(x => x.ccuentadepreciacion == ccuenta);
    }
    for (let car of registrosbusqueda) {

      total += this.estaVacio(car.mdatos.valdepacumulada) ? 0 : car.mdatos.valdepacumulada;


    }
    return total;
  }
  totalVDepAcumAnt(ccuenta: string) {
    let total = 0;
    let registrosbusqueda: any;
    if (ccuenta === 'total') {
      registrosbusqueda = this.lregistros;
    } else {
      registrosbusqueda = this.lregistros.filter(x => x.ccuentadepreciacion == ccuenta);
    }
    for (let car of registrosbusqueda) {

      total += car.mdatos.valordepreciable;

    }
    return total;
  }


  private manejaRespuesta(resp: any) {
    let valordepreciable = 0;
    let depreciacionperiodo = 0;
    let valorlibros = 0;
    let depacumulada = 0;
/*
    for (const i in resp.DETALLE) {


      let valordepperiodoval = 0;
      let valordepreciacionval = 0;

      this.crearNuevoRegistro();
      const reg = resp.DETALLE[i];
      if (reg.cbarras === "005304") {
        let a = 0;
      }
      let fecha = new Date(reg.fdepreciacion);
      if (reg.valdepacumulada >= reg.vunitario || (fecha.getMonth() === Number(this.mcampos.mes) && fecha.getFullYear() === this.mcampos.anio)) {
        valordepreciable = reg.vunitario - ((reg.vunitario * reg.porcendepreciacion) / 100);
        depreciacionperiodo = valordepreciable / reg.vidautil;
        valordepperiodoval = 0;
        valorlibros = 0;
        depacumulada = (this.estaVacio(reg.valdepacumulada) ? 0 : reg.valdepacumulada);
        valordepreciacionval = 0;
      }
      else {
        valordepreciable = reg.vunitario;
        let mesesant = ((this.estaVacio(reg.valdepacumulada) ? 0 : reg.valdepacumulada) / (valordepreciable / reg.vidautil));
        mesesant = this.redondearDecimales(mesesant, 1);
        let mesesnuevos = mesesant + 1;
        let depmensual = valordepreciable / reg.vidautil;
        let ant= this.redondear(this.estaVacio(reg.valdepacumulada) ? 0 : reg.valdepacumulada,2);
        let nueva=this.redondearDecimales((depmensual * mesesnuevos), 2);
        let depactual = nueva-ant;
        depactual = this.redondearDecimales(depactual, 2);


        // depreciacionperiodo = valordepreciable / reg.vidautil; 
        depreciacionperiodo = depactual
        depacumulada = depreciacionperiodo + (this.estaVacio(reg.valdepacumulada) ? 0 : reg.valdepacumulada);
        valorlibros = reg.vunitario - depacumulada;
        valordepperiodoval = depreciacionperiodo;
        valordepreciacionval = reg.valorlibros - depreciacionperiodo;
      }

      resp.DETALLE[i].esnuevo = true;
      resp.DETALLE[i].crearNuevoRegistro = true;
      resp.DETALLE[i].mdatos.cbarras = reg.cbarras;
      resp.DETALLE[i].mdatos.nombre = reg.mdatos.nombre;
      resp.DETALLE[i].mdatos.ccuenta = reg.ccuenta;
      resp.DETALLE[i].mdatos.centrocostoscdetalle = reg.centrocostoscdetalle;
      resp.DETALLE[i].mdatos.ccuentadepreciacion = reg.ccuentadepreciacion;
      resp.DETALLE[i].mdatos.ccuentadepreciacionacum = reg.ccuentadepreciacionacum;
      resp.DETALLE[i].mdatos.vidautil = reg.vidautil;
      resp.DETALLE[i].mdatos.valorcompra = reg.vunitario;
      resp.DETALLE[i].mdatos.valorlibros = valorlibros;
      resp.DETALLE[i].mdatos.valorresidual = reg.valorresidual;
      resp.DETALLE[i].mdatos.valordepperiodo = valordepperiodoval;
      resp.DETALLE[i].mdatos.valdepacumulada = depacumulada;
      resp.DETALLE[i].mdatos.valordepreciable = reg.valdepacumulada
      resp.DETALLE[i].mdatos.valordepreciacion = valordepreciacionval;
    }
*/
    super.postQueryEntityBean(resp);
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    for (const i in resp.DETALLE) {
      const reg = resp.DETALLE[i];
      resp.DETALLE[i].mdatos.cbarras = reg.cbarras;
      resp.DETALLE[i].mdatos.ccuentadepreciacion = reg.ccuentadepreciacion;
      resp.DETALLE[i].mdatos.ccuentadepreciacion = reg.ccuentadepreciacion;
      resp.DETALLE[i].mdatos.ccuentadepreciacionacum = reg.ccuentadepreciacionacum;
      resp.DETALLE[i].mdatos.centrocostoscdetalle = reg.centrocostoscdetalle;
      resp.DETALLE[i].mdatos.vidautil = reg.vidautil;
      resp.DETALLE[i].mdatos.valorcompra = reg.vunitario;
      resp.DETALLE[i].mdatos.valorlibros = reg.valorlibros;
      resp.DETALLE[i].mdatos.valorresidual = reg.valorresidual;
      resp.DETALLE[i].mdatos.valordepperiodo = reg.valdepperiodo;
      resp.DETALLE[i].mdatos.valdepacumulada = reg.valdepacumulada;
      resp.DETALLE[i].mdatos.valorcompra = reg.valorcompra;
      resp.DETALLE[i].mdatos.valordepreciable = reg.valordepreciable;
      resp.DETALLE[i].mdatos.valordepreciacion = reg.valordepreciable;
    }

    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
  totalPeriodo() {

  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    this.actualizar();
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
  }



}
