import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'app/util/seguridad/sesion/localStorageService';

import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { LovCodificadosComponent } from '../../../../../lov/codificados/componentes/lov.codificados.component';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCodificadosComponent)
  private lovcodificados: LovCodificadosComponent;

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'tacfkardexprodcodi', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
   
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearnuevoRegistro();
    this.mostrarlovcodificados();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar(); 
    if(this.lregistros.length === 0){
      delete this.lovcodificados.mfiltrosesp.cbarras;
    }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.ckardexprodcodi', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto ');
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
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  mostrarlovcodificados(): void {
    this.lovcodificados.mfiltros.cusuarioasignado = 'BODEGA';
    this.lovcodificados.mfiltros.estado = 1;
    this.quitarSeleccionados();
    this.lovcodificados.lregistros = [];
    this.lovcodificados.consultar();
    this.lovcodificados.showDialog();
  }

  fijarlovcodificadosSelec(reg: any): void {
    if (this.validaCbarrasDuplicado(reg)){
      super.mostrarMensajeError('PRODUCTO YA HA SIDO SELECCIONADO');
      return;
    }
   
    this.registro.cproducto = reg.registro.cproducto;
    this.registro.vunitario = reg.registro.vunitario;
    this.registro.serial = reg.registro.serial;
    this.registro.cbarras = reg.registro.cbarras;
    this.registro.mdatos.nproducto = reg.registro.mdatos.nombre;
    this.actualizar(); 
  }

  grabar(): void {
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

  validaCbarrasDuplicado(reg : any): boolean {
    if (this.lregistros.length === 0) return false;
    const regduplicado = this.lregistros.find(x => x.mdatos.cbarras === reg.registro.cbarras);
    if (regduplicado === undefined ) {       
      return false;
    }
    return true;
  }

  quitarSeleccionados(){
    if(this.lregistros.length > 0){
      let filter = "NOT IN (";
      this.lregistros.map(x => {
        filter += x.cbarras + ",";
      })
      filter = filter.slice(0, -1);
      filter += ")";
      this.lovcodificados.mfiltrosesp.cbarras = filter;
    }
  }
}
