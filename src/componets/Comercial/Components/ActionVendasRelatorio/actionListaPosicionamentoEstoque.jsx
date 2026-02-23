import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaPosicionamentoEstoque  = ({dadosEstoqueVendasPosicionamento}) => {
  const [rowSelection, setRowSelection] = useState(null);


  const calcularValorPrecoMedio = (item) => {
    return toFloat(item.vendaMarca.TOTALCUSTO) / toFloat(item.vendaMarca.QTD) 
  }
  const calcularValorPrecoMedioVenda = (item) => {
    return toFloat(item.vendaMarca.VRTOTALLIQUIDO) / toFloat(item.vendaMarca.QTD) 
  }

  const calcularQuantidadeEntrada = (item) => {
    return toFloat(item.qtdEntradaSaida.QTDENTRADA) + toFloat(item.qtdVoucher.QTDVOUCHERS)
  }

  const calcularQuantidadeSaida = (item) => {
    return toFloat(item.vendaMarca.QTD) + toFloat(item.qtdEntradaSaida.QTDSAIDAS)
  }

  const dados = dadosEstoqueVendasPosicionamento.map((item, index) => {
    let contador = index + 1;

    const totalQtdEntrada = calcularQuantidadeEntrada(item);  
    const totalQtdSaida = calcularQuantidadeSaida(item);
    const qtdPosionamento = totalQtdEntrada - totalQtdSaida;
    const valorPrecoMedio = calcularValorPrecoMedio(item);
    const valorPrecoMedioVenda = calcularValorPrecoMedioVenda(item);  


    return {
      NOFANTASIA: item.vendaMarca.NOFANTASIA,
      GRUPO:  item.vendaMarca.GRUPO,
      SUBGRUPO: item.vendaMarca.SUBGRUPO,
      MARCA: item.vendaMarca.MARCA,
      NUCODBARRAS: item.vendaMarca.NUCODBARRAS,
      DSNOME: item.vendaMarca.DSNOME,
      QTD: item.vendaMarca.QTD,
      TOTALCOMPRADO: item.vendaMarca.TOTALCOMPRADO,
      TOTALCUSTO: item.vendaMarca.TOTALCUSTO,
      TOTALBRUTO: item.vendaMarca.TOTALBRUTO,
      TOTALDESCONTO: item.vendaMarca.TOTALDESCONTO,
      VRTOTALLIQUIDO: item.vendaMarca.VRTOTALLIQUIDO,

      QTDVOUCHERS: item.qtdVoucher.QTDVOUCHERS,

      QTDENTRADA: item.qtdEntradaSaida.QTDENTRADA,
      QTDSAIDAS: item.qtdEntradaSaida.QTDSAIDAS,


      totalQtdEntrada: totalQtdEntrada,
      totalQtdSaida: totalQtdSaida,
      qtdPosionamento: qtdPosionamento,
      valorPrecoMedio: valorPrecoMedio,
      valorPrecoMedioVenda: valorPrecoMedioVenda,
      contador,
    }
  })

  const colunasEstoqueVendasPosicionamento = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => row.NOFANTASIA,
      sortable: true,
    },
    {
      field: 'GRUPO',
      header: 'Grupo',
      body: row => row.GRUPO,
      sortable: true,
    },
    {
      field: 'SUBGRUPO',
      header: 'Sub Grupo',
      body: row => row.SUBGRUPO,
      sortable: true,
    },
    {
      field: 'MARCA',
      header: 'Marca',
      body: row => row.MARCA,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => row.NUCODBARRAS,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => row.DSNOME,
      sortable: true,
    },

    {
      field: 'TOTALCOMPRADO',
      header: 'Qtd. Total Compra',
      body: row => parseFloat(row.TOTALCOMPRADO),
      sortable: true,
    },
    {
      field: 'valorPrecoMedio',
      header: 'Custo Médio(R$)',
      body: row => formatMoeda(row.valorPrecoMedio),
      sortable: true,
    },
    {
      field: ' valorPrecoMedioVenda',
      header: 'Venda Média(R$)',
      body: row => formatMoeda(row. valorPrecoMedioVenda),
      sortable: true,
    },
    {
      field: 'QTDENTRADA',
      header: 'Qtd. Entrada',
      body: row => parseFloat(row.QTDENTRADA),
      sortable: true,
    },
    {
      field: 'QTDSAIDAS',
      header: 'Qtd. Saída',
      body: row => parseFloat(row.QTDSAIDAS),
      sortable: true,
    },
    {
      field: 'QTDVOUCHERS',
      header: 'Qtd. Troca(Ent.)',
      body: row => parseFloat(row.QTDVOUCHERS),
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'Qtd. Venda(Saída)',
      body: row => parseFloat(row.QTD),
      sortable: true,
    },
    {
      field: 'TOTALCUSTO',
      header: 'Custo Total(R$)',
      body: row => formatMoeda(row.TOTALCUSTO),
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Venda Total(R$)',
      body: row => formatMoeda(row.VRTOTALLIQUIDO),
      sortable: true,
    },
    {
      field: 'qtdPosionamento',
      header: 'Estoque',
      body: (row) => {
        return(
          <div>          
            <p style={{ color: row.qtdPosionamento > 0 ? 'blue' : 'red' }}> {row.qtdPosionamento}</p>    
          </div>
        )
      },
      sortable: true,
    },
  ]
  
  return (

    <Fragment>
      <div className="card">
        <DataTable
          size={'small'}
          title="Vendas por Loja"
          value={dados}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator
          rows={10}
          selectionMode="single"
          selection={rowSelection}
          onSelectionChange={(e) => setRowSelection(e.value)}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
          filterDisplay="menu"
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasEstoqueVendasPosicionamento.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}                          
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
              footerStyle={{ color: '', backgroundColor: "", border: '1px solid #e9e9e9',fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>
      </div>
      
    </Fragment>
  )
}