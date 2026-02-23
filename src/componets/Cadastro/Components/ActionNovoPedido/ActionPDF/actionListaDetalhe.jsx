import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

//  ERRO RETORNAR AQUI PARA FAZER A TABELA DA FORMA CORRETA
export const ActionListaDetalhe = ({ dadosPedido }) => {


  const dados = dadosPedido.map((item, index) => {
    let contador = index + 1;
 
    return {
      contador,
      CODBARRAS: item?.CODBARRAS,
      DSPRODUTO: item?.DSPRODUTO,
      NUNCM: item?.NUNCM,
      DSTAMANHO: item?.DSTAMANHO,
      QTDPRODUTO: item?.QTDPRODUTO,
      VRCUSTO: toFloat(item?.VRCUSTO),
      VRVENDA: toFloat(item?.VRVENDA),
      VRTOTALCUSTO: toFloat(item?.VRTOTALCUSTO),
      QTDESTOQUEIDEAL: toFloat(item?.QTDESTOQUEIDEAL),
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

  const colunasPedidos = [

    {
      field: 'contador',
      header: '#',
      body: row => <th style={{width: '10px'}}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'CODBARRAS',
      header: 'Cód Barra',
      body: row => <th>{row.CODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: row => <th>{row.DSPRODUTO}</th>,
      footer: 'Total ',
      sortable: true,
    },
    {
      field: 'NUNCM',
      header: 'NCM',
      body: row => <th>{row.NUNCM}</th>,
      sortable: true,
    },
    {
      field: 'DSTAMANHO',
      header: 'TM',
      body: row => <th >{row.DSTAMANHO}</th>,
      sortable: true,
    },
    {
      field: 'QTDPRODUTO',
      header: 'Qtd',
      body: row => <th>{row.QTDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'VRCUSTO',
      header: 'Vr Custo',
      body: row => <th >{formatMoeda(row.VRCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'VRVENDA',
      header: 'Vr Venda',
      body: row => <th >{formatMoeda(row.VRVENDA)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALCUSTO',
      header: 'T. Venda',
      body: row => <th >{formatMoeda(row.VRTOTALCUSTO)} </th>,
      sortable: true,
    },
  ]

  const HeaderTemplate = (rowData) => {
    return (
      <tr className="font-bold" style={{ fontWeight: 600, fontSize: '12px', color: 'blue', margin: '1px', padding: '0px' }}>
        {rowData.DSSUBGRUPOESTRUTURA}
      </tr>
    );
  };


  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total" colSpan={5} footerStyle={{ color: '#212529', border: '1px solid #000', fontSize: '0.625rem', textAlign: 'initial', margin: '0px', padding: '0px' }} />
        <Column footer={calcularQtdTotalPedido()} colSpan={1} footerStyle={{ color: '#212529', border: '1px solid #000', fontSize: '0.8rem' }} />
        <Column footer={""} colSpan={2} footerStyle={{ color: '#212529', border: '1px solid #000', fontSize: '0.8rem', textAlign: 'end' }} />
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
          // emptyMessage={<div className="" style={{border: '1px solid #000'}}></div>}
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
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
                margin: '0px', 
              }}
              footerStyle={{ color: 'white', backgroundColor: 'white', border: '1px solid #000', fontSize: '0.625rem' }}
              bodyStyle={{  fontSize: '9px', backgroundColor: 'white', border: '1px solid #000', textAlign: 'center', alignContent: 'center', alignItems: 'center' }}

            />
          ))}
        </DataTable>
      </div>
    </Fragment>
  )
}