import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";


export const ActionListaDetalheSempreco = ({ dadosDetalhePedido }) => {


  const dados = dadosDetalhePedido.map((item, index) => {
    let contador = index + 1;
    let txtCxTec = item.detpedido?.DSTIPOTECIDO == 'CALCADOS' ? 'Caixas' : 'Tecido';
    let DadosCxTecido = item.detpedido?.DSTIPOTECIDO == 'CALCADOS' ? item.detpedido?.NUCAIXA : item.detpedido?.DSTIPOTECIDO
    console.log(item.detalhegrade, 'item.detalhegrade?.DSTAMANHO')
    return {
      QTDTOTAL: item.detpedido?.QTDTOTAL,
      DSSIGLA: item.detpedido?.DSSIGLA,
      NUREF: item.detpedido?.NUREF,
      DSPRODUTO: item.detpedido?.DSPRODUTO,
      DSCOR: item.detpedido?.DSCOR,
      DSLOCALEXPOSICAO: item.detpedido?.DSLOCALEXPOSICAO,
      DSESTILO: item.detpedido?.DSESTILO,
      STECOMMERCE: item.detpedido?.STECOMMERCE,
      STREDESOCIAL: item.detpedido?.STREDESOCIAL,
      OBSPRODUTO: item.detpedido?.OBSPRODUTO,
      VRUNITLIQDETALHEPEDIDO: item.detpedido?.VRUNITLIQDETALHEPEDIDO,
      VRVENDADETALHEPEDIDO: item.detpedido?.VRVENDADETALHEPEDIDO,
      VRTOTALDETALHEPEDIDO: toFloat(item.detpedido?.VRTOTALDETALHEPEDIDO),
      IDPEDIDO: item.detpedido?.IDPEDIDO,
      IDDETPEDIDO: item.detpedido?.IDDETPEDIDO,
      DSCATEGORIAPEDIDO: item.detpedido?.DSCATEGORIAPEDIDO,
      DSSUBGRUPOESTRUTURA: item.detpedido?.DSSUBGRUPOESTRUTURA,
      DSGRUPOESTRUTURA: item.detpedido?.DSGRUPOESTRUTURA,
      DSTIPOTECIDO: item.detpedido?.DSTIPOTECIDO,
      NUCAIXA: item.detpedido?.NUCAIXA,
      DSTAMANHO: item.detalhegrade[0]?.DSTAMANHO,
      INDICETAMANHO: item.detalhegrade[0]?.INDICETAMANHO,

      txtCxTec,
      DadosCxTecido,
      contador
    }
  });

  const calcularTotal = (field) => {
    return dados.reduce((total, item) => total + toFloat(item[field]), 0);
  };

  const calcularTotalVrDetalhePedido = () => {
    const total = calcularTotal('VRTOTALDETALHEPEDIDO');
  
    return total;
  }

  const calcularQtdTotalPedido = () => {
    const total = calcularTotal('QTDTOTAL');
    return total;
  }

  // Determinar o header baseado no primeiro item dos dados
  const headerCxTecido = dados.length > 0 ? dados[0].txtCxTec : 'Caixa/Tecido';

  const colunasPedidos = [

    {
      field: 'contador',
      header: '#',
      body: row => <th 
        style={{ 
          textAlign: 'center', 
          padding: '1px', 
          margin: '0px',
          height: '20px',
          width: '20px',
        }}>
        {row.contador}
        </th>,
      sortable: true,
    },
    {
      field: 'QTDTOTAL',
      header: 'Qtd',
      body: row => <th>{row.QTDTOTAL}</th>,
      sortable: true,
    },
    {
      field: 'DSSIGLA',
      header: 'Unid',
      body: row => <th>{row.DSSIGLA}</th>,
      sortable: true,
    },
    {
      field: 'NUREF',
      header: 'Referência',
      body: row => <th>{row.NUREF}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Descrição',
      body: row => <th>{row.DSPRODUTO}</th>,
      footer: 'Total ',
      sortable: true,
    },
    {
      field: 'txtCxTec',
      header: headerCxTecido,
      body: row => <th>{row.DadosCxTecido}</th>,
      footer: 'Total ',
      sortable: true,
    },
    {
      field: 'DSCOR',
      header: 'Cor',
      body: row => <th>{row.DSCOR}</th>,

      sortable: true,
    },
    {
      field: 'DSLOCALEXPOSICAO',
      header: 'Local Exp',
      body: row => <th>{row.DSLOCALEXPOSICAO}</th>,
      sortable: true,
    },
    {
      field: 'DSESTILO',
      header: 'Estilo',
      body: row => <th>{row.DSESTILO}</th>,
      sortable: true,
    },
    {
      field: 'STECOMMERCE',
      header: 'R.Social',
      body: row => {
        return (
      
            <th style={{alignContent: 'center'}} >{row.STECOMMERCE == 'True' ? 'SIM' : 'NÃO'}</th>
       
        )
      },
      sortable: true,
    },
    {
      field: 'OBSPRODUTO',
      header: 'Obs',
      body: row => <th >{row.OBSPRODUTO} </th>,
      sortable: true,
    },
    {
      field: 'DSTAMANHO',
      header: 'Grade',
      body: row => <th >{row.DSTAMANHO}  <br/> {row.INDICETAMANHO}</th>,
      sortable: true,
    },
    {
      field: 'VRUNITLIQDETALHEPEDIDO',
      header: 'Vr Unit',
      body: row => <th >{formatMoeda(row.VRUNITLIQDETALHEPEDIDO)}</th>,
      sortable: true,
    },
    {
      field: 'VRVENDADETALHEPEDIDO',
      header: 'Vr Venda',
      body: row => <th >{formatMoeda(row.VRVENDADETALHEPEDIDO)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALDETALHEPEDIDO',
      header: 'Total',
      body: row => <th >{formatMoeda(row.VRTOTALDETALHEPEDIDO)} </th>,
      sortable: true,
    },
  ]

  const HeaderTemplate = (rowData) => {
    return (
      <div style={{ }}>

        <tr className="font-bold" style={{ fontWeight: 600, fontSize: '12px', color: 'blue', margin: '1px', padding: '0px'}}>
          {rowData.DSGRUPOESTRUTURA} / {rowData.DSSUBGRUPOESTRUTURA}
        </tr>
      </div>
    );
  };


  const footerGroup = (
    <ColumnGroup>

      <Row style={{marginTop: '1rem', background: 'red'}}>
        <Column footer="Qtd Total" colSpan={1} footerStyle={{ color: '#212529', border: '1px solid #000', fontSize: '0.625rem', textAlign: 'initial', margin: '0px', padding: '0px' }} />
        <Column footer={calcularQtdTotalPedido()} colSpan={1} footerStyle={{ color: '#212529', border: '1px solid #000', fontSize: '0.8rem' }} />
        <Column footer={"Valor Total"} colSpan={12} footerStyle={{ color: '#212529', border: '1px solid #000', fontSize: '0.8rem', textAlign: 'end' }} />
        <Column footer={formatMoeda(calcularTotalVrDetalhePedido())} colSpan={1} footerStyle={{ color: '#212529', border: '1px solid #000', fontSize: '0.8rem' }} />

      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>

      <div className="card mt-4">

        <DataTable
          title="Vendas por Loja"
          value={dados}
          size="small"
          sortOrder={-1}
          rowGroupMode="subheader"
          groupRowsBy="DSSUBGRUPOESTRUTURA"
          sortMode="single"
          scrollable
          rowGroupHeaderTemplate={HeaderTemplate}
          footerColumnGroup={footerGroup}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty" style={{border: '1px solid #000'}}></div>}
        >
          {colunasPedidos.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              headerStyle={{
                textAlign: 'center', 
                fontWeight: '700',
                color: '#666', 
                backgroundColor: 'white', 
                border: '1px solid #000', 
                fontSize: '0.75rem', 
                margin: '0px'
                
              }}
              footerStyle={{ color: 'white', backgroundColor: 'white', border: '1px solid #000', fontSize: '0.625rem' }}
              bodyStyle={{  
                fontSize: '11px', 
                backgroundColor: 'white', 
                border: '1px solid #000', 
                textAlign: 'center', 
                alignContent: 'center', 
                alignItems: 'center',
                padding: '1px',
                margin: '0px'
              }}

            />
          ))}
        </DataTable>
      </div>
    </Fragment>
  )
}