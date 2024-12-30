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
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.numeromemo="S/N";
    this.registro.numerooficio="S/N";
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cegreso', this.mfiltros, this.mfiltrosesp);
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
