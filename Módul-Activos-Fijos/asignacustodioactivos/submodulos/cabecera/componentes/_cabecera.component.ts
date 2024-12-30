import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'app/util/seguridad/sesion/localStorageService';

import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';


@Component({
  selector: 'app-cabecera',
  templateUrl: '_cabecera.html'
})
export class CabeceraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public fcontable: string;

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'tacfegreso', 'CABECERA', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.camposfecha.fcontable = null;
    this.crearNuevo();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.tipoegresoccatalogo = 1305;
    this.registro.tipoegresocdetalle = 'ENTREG';
    this.registro.estadoccatalogo = 1306;
    this.registro.estadocdetalle = 'EGRENT';
    this.registro.movimiento='A';
    this.registro.tienekardex = true;

  }

  actualizar() {
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cegreso', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cpersona= t.cusuariorecibe and i.verreg = 0' );
   
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

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }
}
