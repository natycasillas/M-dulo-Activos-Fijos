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
import { LovProductosComponent } from '../../../../../lov/productos/componentes/lov.productos.component';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovProductosComponent)
  private lovproductos: LovProductosComponent;

  @Output() calcularTotalesEvent = new EventEmitter();

  public totalCantidad = 0;
  public totalValorUnitario = 0;
  public totalValorTotal = 0;
  public indice: number;
  public codigo = '';
  private catalogoDetalle: CatalogoDetalleComponent

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'tacfingresodetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
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
    this.calcularTotales();
    this.calcularTotalesEvent.emit();
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
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'stock', 'stock1', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'gravaiva', 'gravaiva', 'i.cproducto = t.cproducto');
    consulta.cantidad = 300;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    let lista = resp.DETALLE;
    let listaResp = [];
    resp.DETALLE = undefined;
    for (const i in lista) {
      if (lista.hasOwnProperty(i)) {
        const reg = lista[i];
        reg.mdatos.codigo = reg.mdatos.codigo;
        reg.mdatos.vtotal = reg.vunitario * reg.cantidad;
        listaResp.push(reg);
      }
    }

    resp.DETALLE = listaResp;
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  mostrarlovproductos(): void {
    this.lovproductos.mfiltros.movimiento = true;
    this.lovproductos.showDialog();
  }

  /**Retorno de lov de concepto contables. */
  fijarLovProductosSelec(reg: any): void {
    
    
    //if (reg.registro !== undefined) {
      this.registro.mdatos.nproducto = reg.registro.nombre;
      this.registro.cproducto = reg.registro.cproducto;     
      this.registro.mdatos.codigo = reg.registro.codigo;
      this.registro.mdatos.stock = reg.registro.stock;
      this.registro.mdatos.gravaiva = reg.registro.gravaiva;
      this.registro.vunitario=0;
  
  }

  buscarProducto(cproducto: any): boolean {
    if (this.lregistros.length > 0) {
      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {
          const reg = this.lregistros[i];
          if (reg.cproducto === cproducto) {
            return true;
          }
        }
      }
    }
    return false;
  }
  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }

  agregarFila() {
    super.crearnuevoRegistro();
    this.actualizar();
  }

  codigoFocus(reg: any, index: number) {
    this.indice = index;
    this.codigo = reg.mdatos.codigo;
  }

  codigoBlur(reg: any, index: number) {

    if (reg.mdatos.codigo === '') {
      this.lregistros[index].mdatos.codigo = undefined;
      this.lregistros[index].mdatos.nproducto = undefined;
      return;
    }

    if (reg.mdatos.codigo === this.codigo) {
      return;
    }

    const consulta = new Consulta('tacfproducto', 'N', '', { 'codigo': reg.mdatos.codigo, 'movimiento': true}, {});
    consulta.addFiltroCondicion('codigo', reg.mdatos.codigo, '=');
    this.addConsultaPorAlias('PRODUCTO', consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp, index);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any, index: number) {
    let producto;
    if (resp.PRODUCTO !== undefined && resp.PRODUCTO !== null) {
      producto = resp.PRODUCTO;
      this.lregistros[index].cproducto = producto.cproducto;
      this.lregistros[index].mdatos.nproducto = producto.nombre;
      this.lregistros[index].mdatos.stock = producto.stock; 
      this.lregistros[index].mdatos.gravaiva=this.estaVacio(producto.gravaiva)?false:producto.gravaiva;
      this.lregistros[index].vunitario=0;     
    }else{
      this.lregistros[index].cproducto = undefined;
      this.lregistros[index].mdatos.codigo = undefined;
    }
  }


  consultarCatalogos(): void {
 
  }

  cerrarDialogo(): void {

    this.registro.mdatos.vtotal = this.registro.vunitario * this.registro.cantidad;
    this.calcularTotales();
  }

  cambiarCantidad(indice, event): void {
    this.lregistros[indice].mdatos.vtotal = this.lregistros[indice].vunitario * this.lregistros[indice].cantidad;
    this.calcularTotales();
  }

  validarCantidad(): void {
  }

  calcularTotales(): void {
    let sumatorioCantidad = 0;
    let sumatorioVunitario = 0;
    let sumatorioVtotal = 0;
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      sumatorioCantidad += Number(reg.cantidad);
      sumatorioVunitario += reg.vunitario;
      sumatorioVtotal += reg.mdatos.vtotal;
    }
    this.totalCantidad = sumatorioCantidad;
    this.totalValorUnitario = sumatorioVunitario;
    this.totalValorTotal = sumatorioVtotal;
    this.calcularTotalesEvent.emit();
  }

}
