import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovProductosComponent} from '../../../lov/productos/componentes/lov.productos.component';
import { LovProveedoresComponent } from '../../../../contabilidad/lov/proveedores/componentes/lov.proveedores.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { LocalStorageService } from 'app/util/seguridad/sesion/localStorageService';

@Component({
  selector: 'app-reporte-constatacionFisica',
  templateUrl: 'constatacionFisica.html'
})
export class ConstatacionFisicaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProductosComponent)
  lovproductos: LovProductosComponent;
 
  @ViewChild(LovFuncionariosComponent)
  lovFuncionario: LovFuncionariosComponent;

  @ViewChild(LovProveedoresComponent)
  lovProveedores: LovProveedoresComponent;
  
  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  public lubicaciones: SelectItem[] = [{ label: '...', value: null }];
  public lcustodio: SelectItem[] = [{ label: '...', value: null },{ label: 'BODEGA', value: 'BODEGA' },{ label: 'ACTIVOS FIJOS', value: 'CUSTODIOAF' }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];  
  public lmarcacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public custodio;
  public estadoActivo;
  constructor(public localStorageService:LocalStorageService, router: Router, dtoServicios: DtoServicios) {
    super(localStorageService,router, dtoServicios, 'tacftipoproducto', 'TACFTIPOPRODUCTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);  
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
      
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosEstado: any = { 'ccatalogo': 1301 };
    const consultaEstado = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosEstado, {});
    consultaEstado.cantidad = 500;
    this.addConsultaCatalogos('ESTADOS', consultaEstado, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.mfiltrosesp.ctipoproducto = 'in(\'1\',\'2\')'; 
    const conTipoProducto = new Consulta('tacftipoproducto', 'Y', 't.nombre',{}, this.mfiltrosesp);
    conTipoProducto.cantidad = 10;
    this.addConsultaCatalogos('TIPOPRODUCTO', conTipoProducto, this.ltipoproducto, this.llenaListaCatalogo, 'ctipoproducto', null);
    
    const mfiltrosUbicaciones: any = { 'ccatalogo': 1002 };
    const consultaUbicaciones = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosUbicaciones, {});
    consultaUbicaciones.cantidad = 100;
    this.addConsultaCatalogos('UBICACIONES', consultaUbicaciones, this.lubicaciones, super.llenaListaCatalogo, 'cdetalle');
    
    const mfiltrosMarca: any = { 'ccatalogo': 1302 };
    const consultaMarca = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMarca, {});    
    consultaMarca.cantidad = 300;
    this.addConsultaCatalogos('MARCAPRODUCTO', consultaMarca, this.lmarcacdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  descargarReporte(): void {

    this.jasper.nombreArchivo = 'ReporteConstatacionFisica';

    if(this.mfiltros.ctipoproducto === undefined ||this.mfiltros.ctipoproducto === null) 
    {
      this.mfiltros.ctipoproducto = -1;
    }
    if(this.mfiltros.codigo === undefined ||this.mfiltros.codigo === null) 
    {
      this.mfiltros.codigo ='';
    }
    if(this.mfiltros.nombre === undefined ||this.mfiltros.nombre === null) 
    {
      this.mfiltros.nombre = '';
    }
    if(this.mfiltros.facturanumero === undefined ||this.mfiltros.facturanumero === null) 
    {
      this.mfiltros.facturanumero = '';
    }
    if(this.mfiltros.serial === undefined ||this.mfiltros.serial === null) 
    {
      this.mfiltros.serial = '';
    }
    if(this.mfiltros.marcacdetalle === undefined ||this.mfiltros.marcacdetalle === null) 
    {
      this.mfiltros.marcacdetalle = '';
    }
    if(this.mfiltros.estadocdetalle === undefined ||this.mfiltros.estadocdetalle === null) 
    {
      this.mfiltros.estadocdetalle = '';
    }
    if(this.mfiltros.modelo === undefined ||this.mfiltros.modelo === null) 
    {
      this.mfiltros.modelo ='';
    }
    if (this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("LA FECHA DESDE ES MAYOR A LA FECHA HASTA");
      return;
    }
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mfiltros.finicio=null;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null) {
      this.mfiltros.ffin=null;
    }
    if (this.registro.cusuarioavala === undefined || this.registro.cusuarioavala === null)
    {
      this.registro.cusuarioavala='';
    }
    if (this.mcampos.cpersona === undefined || this.mcampos.cpersona === null)
    {
      this.mcampos.cpersona=-1;
    }
    if (this.custodio === undefined || this.custodio === null)
    {
      this.custodio= '';
    }
    if (this.mfiltros.ubicacion === undefined || this.mfiltros.ubicacion === null)
    {
      this.mfiltros.ubicacion = '';
    }
    if (this.registro.ccuenta === undefined || this.registro.ccuenta === null)
    {
      this.registro.ccuenta = '';
    }

    let estadoactivo=-1;
    if (this.estadoActivo == false )
    {
      estadoactivo = 0;
    }
    if (this.estadoActivo == true )
    {
      estadoactivo = 1;
    } 
    if (this.estaVacio(this.estadoActivo) )
    {
      estadoactivo = -1;
    }
 
    
    // Agregar parametros
    this.mfiltros.ubicacion;
    this.jasper.parametros['@i_tipo'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['@i_codigo'] = this.mfiltros.codigo;
    this.jasper.parametros['@i_nombre'] = this.mfiltros.nombre;
    this.jasper.parametros['@i_usuario_asig'] = this.registro.cusuarioavala;
    this.jasper.parametros['@i_custodio'] = this.custodio;
    this.jasper.parametros['@i_serial'] = this.mfiltros.serial;
    this.jasper.parametros['@i_marca'] = this.mfiltros.marcacdetalle;
    this.jasper.parametros['@i_estado'] = this.mfiltros.estadocdetalle;
    this.jasper.parametros['@i_modelo'] = this.mfiltros.modelo;
    this.jasper.parametros['@i_provedor'] = this.mcampos.cpersona;
    this.jasper.parametros['@i_factura'] = this.mfiltros.facturanumero;
    this.jasper.parametros['@i_fecha_ini'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_fecha_fin'] = this.mfiltros.ffin;
    this.jasper.parametros['@i_ubicacion'] = this.mfiltros.ubicacion;
    this.jasper.parametros['@i_cuenta'] = this.registro.ccuenta;
    this.jasper.parametros['@i_estadoActivo']= estadoactivo;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfConstatacionFisica';
    this.jasper.generaReporteCore();
    this.mcampos.cpersona=null;
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {

    if (reg.registro !== undefined) {
      this.registro.cusuarioavala = reg.registro.cpersona;
      this.registro.nfuncionarioavala = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.registro.mdatos.nfuncionarioavala = reg.registro.primernombre +" "+reg.registro.primerapellido; 
    }
  }

    /**Muestra lov de proveedores */
    mostrarLovProveedores(): void {
      this.lovProveedores.showDialog();
    }
  
    /**Retorno de lov de proveedores. */
    fijarLovProveedoresSelect(reg: any): void {
      if (reg.registro !== undefined) {
        this.mcampos.cpersona = reg.registro.cpersona;
        this.mcampos.npersona = reg.registro.nombre;
      }
    }

    mostrarlovcuentasContables(): void {
      this.lovcuentasContables.mfiltros.activa = true;
      this.lovcuentasContables.showDialog(true);
    }
  
    /**Retorno de lov de cuentas contables. */
    fijarLovCuentasContablesSelec(reg: any): void {
      if (reg.registro !== undefined) {
        this.registro.mdatos.tipoplancdetalle = reg.registro.tipoplancdetalle;
        this.registro.mdatos.ncuenta = reg.registro.nombre;
        this.registro.ccuenta = reg.registro.ccuenta;
        this.registro.cmoneda = reg.registro.cmoneda;
      }
    }

}
