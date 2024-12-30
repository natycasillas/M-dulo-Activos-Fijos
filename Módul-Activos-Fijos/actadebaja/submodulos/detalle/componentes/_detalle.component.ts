import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
import { LovCodificadosComponent } from '../../../../../lov/codificados/componentes/lov.codificados.component';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCodificadosComponent)
  private lovcodificados: LovCodificadosComponent;
  public cpersonaasignada ;



  public totalCantidad = 0;
  public totalValorUnitario = 0;
  public totalValorTotal = 0;
  public indice: number;
  public codigo = '';
  public cbarras = '';
  private catalogoDetalle: CatalogoDetalleComponent
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];  

  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'tacfegresodetalle', 'DETALLE', false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'stock', 'stock1', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto','vunitario','vunitario1','t.cproducto = i.cproducto');
    consulta.addSubquery('tacfkardexprodcodi', 'cbarras', 'cbarras','i.cproducto = t.cproducto and i.cmovimiento = t.cegreso');    
    consulta.addSubquery('tacfkardexprodcodi', 'infoadicional', 'infoadicional','i.cproducto = t.cproducto and i.cmovimiento = t.cegreso');
    this.addConsulta(consulta);
    return consulta;
  } 

  public fijarFiltrosConsulta() {
    
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public postQuery(resp: any) {
    let lista = resp.DETALLE;
    let listaResp = [];
    resp.DETALLE = undefined;
  
    for (const i in lista) {
      if (lista.hasOwnProperty(i)) {
        const reg = lista[i];
        reg.mdatos.cbarras = reg.mdatos.cbarras;
        reg.mdatos.infoadicional = reg.mdatos.infoadicional;
        reg.mdatos.codigo = reg.mdatos.codigo;
        reg.mdatos.nproducto = reg.mdatos.nproducto;
        reg.mdatos.vunitario = reg.mdatos.vunitario;
        reg.mdatos.serial = reg.mdatos.serial;
        reg.infoadicional = reg.infoadicional;
        listaResp.push(reg);
      }
    }
    resp.DETALLE = listaResp;
    super.postQueryEntityBean(resp);
  }
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


  // /**Retorno de lov */
  fijarLovCodificadosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      if (!reg.registro.mdatos.depreciable && reg.registro.mdatos.stock === 0) {
        super.mostrarMensajeError('Producto con existencia CERO, no es posible hacer egreso');
        return;
      }
      if(reg.registro.estado === 1 ){
        this.registro.mdatos.nproducto = reg.registro.mdatos.nombre;
        this.registro.mdatos.cbarras = reg.registro.cbarras;
        this.registro.mdatos.infoadicional = reg.registro.infoadicional;
        this.registro.cproducto = reg.registro.cproducto;
        this.registro.mdatos.codigo = reg.registro.mdatos.codigo;
        this.registro.mdatos.stock = reg.registro.mdatos.stock;
        this.registro.mdatos.vunitario = reg.registro.vunitario;
       // this.registro.mdatos.estadocdetalle=reg.registro.estadocdetalle;
        this.registro.mdatos.serial = reg.registro.serial;
        this.registro.mdatos.valorlibros = reg.registro.valorlibros;
        
      }else
      {
        super.mostrarMensajeError('PRODUCTO ASIGNADO. NO SE PUEDE DAR DE BAJA PRODUCTOS ASIGNADOS');
        return;
      }
      
     }
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
    this.cbarras = reg.mdatos.cbarras;
  }

  codigoBlur(reg: any, index: number) {

    if (reg.mdatos.cbarras === '') {
      return;
    }

    if (reg.mdatos.cbarras === this.cbarras) {
      return; 
    }

    const consulta = new Consulta('tacfproductocodificado', 'N', '', { 'cproducto': reg.cproducto, 'cbarras': reg.mdatos.cbarras, 'estado':reg.mdatos.estado }, {});
    consulta.addSubquery('tacfproducto','cproducto','codigo','t.cproducto = i.cproducto');
    consulta.addSubquery('tacfproducto','nombre','nproducto','t.cproducto = i.cproducto');
    consulta.addSubquery('tacfproducto','stock','stock1','t.cproducto = i.cproducto');
    consulta.addSubquery('tacfproducto','vunitario','vunitario1','t.cproducto = i.cproducto');
    this.addConsultaPorAlias('AF_VALIDACBARRAS', consulta);

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
    if (resp.AF_VALIDACBARRAS !== null && resp.AF_VALIDACBARRAS !== undefined ) {  
      if(resp.AF_VALIDACBARRAS.estado === 1 ){     
        this.lregistros[index].mdatos.nproducto = resp.AF_VALIDACBARRAS.mdatos.nproducto;
        this.lregistros[index].mdatos.stock = resp.AF_VALIDACBARRAS.mdatos.stock1;    
        this.lregistros[index].mdatos.vunitario = resp.AF_VALIDACBARRAS.mdatos.vunitario1;
        this.lregistros[index].cproducto = resp.AF_VALIDACBARRAS.mdatos.codigo;  
        this.lregistros[index].mdatos.serial = resp.AF_VALIDACBARRAS.serial;  
        //this.lregistros[index].mdatos.estadocdetalle = resp.AF_VALIDACBARRAS.estadocdetalle;  
        return;
      }  
        super.mostrarMensajeError('PRODUCTO ASIGNADO. NO SE PUEDE DAR DE BAJA PRODUCTOS ASIGNADOS');
        this.lregistros[index].mdatos.cbarras = undefined;
        return;                
       
    }
    else {
      this.lregistros[index].mdatos.cbarras = undefined;
      super.mostrarMensajeError('PRODUCTO NO EXISTE');
    }    
  }

  

  consultarCatalogos(): void {
    this.msgs = [];
    this.lconsulta = [];
  

      const mfiltrosEstado: any = { 'ccatalogo': 1301,'nombre':'%BAJA%' };
      
      const consultaEstado = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosEstado, {});
      consultaEstado.cantidad = 500;
      this.addConsultaCatalogos('ESTADOS', consultaEstado, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

      this.ejecutarConsultaCatalogos();
  }

  mostrarlovcodificados(): void {
    this.lovcodificados.mfiltros.estado = 1;
    this.lovcodificados.mfiltrosesp.cusuarioasignado = "='" + this.cpersonaasignada + "'";
    this.quitarSeleccionados();
    this.lovcodificados.lregistros = [];
    this.lovcodificados.consultar()
    this.lovcodificados.showDialog();
  }
  quitarSeleccionados(){
    if(this.lregistros.length > 0){
      let filter = "NOT IN (";
      this.lregistros.map(x => {
        filter += x.mdatos.cbarras + ",";
      })
      filter = filter.slice(0, -1);
      filter += ")";
      this.lovcodificados.mfiltrosesp.cbarras = filter;
    }
  }
  
}
