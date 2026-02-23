import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
import { toFloat } from "../../../../../utils/toFloat";
import { mascaraValor } from "../../../../../utils/mascaraValor";
import { dataFormatada } from "../../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../../utils/formatMoeda";



export const ActionListaQuebra = ({ dadosExtratoQuebra, dadosVendas, dadosTotalFaturas, dadosTotalDespesas, dadosTotalAdiantamentos }) => {
  
  const dados = dadosExtratoQuebra.map((item) => {
    const saldoAnteriorVendas = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO)
    const saldoAnteriorFaturas = saldoAnteriorVendas + parseFloat(dadosTotalFaturas[0]?.VRRECEBIDO)
    const saldoAnteriorDespesas = saldoAnteriorFaturas - parseFloat(dadosTotalDespesas[0]?.VRDESPESA)

    const saldoAnteriorAdiantamentos = saldoAnteriorDespesas - parseFloat(dadosTotalAdiantamentos[0]?.VRVALORDESCONTO ?? 0)
    
    const calcularTotalDinheiroInformado = () => {
      let totalDinheiroInformado = 0;
      if (item.VRAJUSTDINHEIRO > 0) {
        totalDinheiroInformado = toFloat(item.VRAJUSTDINHEIRO);
        
      } else {
        totalDinheiroInformado = toFloat(item.VRRECDINHEIRO);
      }
      return totalDinheiroInformado;
    };
    const saldoAnterior = saldoAnteriorAdiantamentos
    const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(item.VRFISICODINHEIRO);
    const saldoAnteriorQuebra = saldoAnterior + totalQuebraCaixa;
    

    return {
      IDMOV: item.IDMOV,
      DTMOVCAIXA: item.DTMOVCAIXA,
      FUNCIONARIOMOV: item.FUNCIONARIOMOV,
      VRFISICODINHEIRO: item.VRFISICODINHEIRO,
      VRRECDINHEIRO: item.VRRECDINHEIRO,
      VRAJUSTDINHEIRO: toFloat(item.VRAJUSTDINHEIRO),
      saldoAnteriorQuebra: saldoAnteriorQuebra,
      totalQuebraCaixa: totalQuebraCaixa,

      saldoAnterior: saldoAnterior,
    }
  });
  const colunasQuebra = [
    {
      header: 'Dt. Lançamento',
      field: 'DTMOVCAIXA',
      body: row => <p style={{ margin: '0px', }} >{dataFormatada(row.DTMOVCAIXA)}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: 'IDMOV',
      body: row => <p style={{ margin: '0px' }} > Quebra Caixa Mov.: {row.IDMOV}</p>,
      sortable: true,
    },
    {
      header: 'Pago A',
      field: 'FUNCIONARIOMOV',
      body: row => <p style={{ margin: '0px', }}  >Operador: {row.FUNCIONARIOMOV}</p>,
      sortable: true,
    },
    {
      header: 'Despesa',
      field: '',
      body: row => <p style={{ margin: '0px', }}  > </p>,
    },
    {
      header: 'Débito',
      field: 'totalQuebraCaixa',
      body: row => {
        if (row.totalQuebraCaixa > 0) {
          return (
            <p style={{ margin: '0px', }} >0,00</p>
          )
        } else {
          return (

            <p style={{ margin: '0px', }} >{mascaraValor(parseFloat(row.totalQuebraCaixa).toFixed(2))}</p>
          )
        }
      },
      sortable: true,
    },
    {
      header: 'Crédito',
      field: 'totalQuebraCaixa',
      body: row => {
        if (row.totalQuebraCaixa > 0) {
          return (
            <p style={{ margin: '0px', }} >{mascaraValor(parseFloat(row.totalQuebraCaixa).toFixed(2))}</p>
          )
        } else {
          return (
            <p style={{ margin: '0px', }} >0,00</p>

          )
        }
      },
      sortable: true,
    },
    {
      field: 'saldoAnteriorQuebra',
      header: 'Saldo ',
      body: row => {
        if(row.totalQuebraCaixa > 0) {
          return (
            <p style={{ margin: '0px', width: '5rem' }} >
              {formatMoeda(row.saldoAnteriorQuebra)}
            </p>
          )

        } else {
          return (
            <p style={{ margin: '0px', width: '5rem' }} >
              {formatMoeda(row.saldoAnteriorQuebra)}
            </p>
          )
        }
      },
      sortable: true,
    },
    {
      header: 'Situação ',
      field: '',
      body: row => <p style={{ margin: '0px', }} >  </p>,
      sortable: true,
    },
  ]

  return (

    <Fragment>

      <DataTable
        title="Quebra Extrato"
        value={dados}
        // headerStyle={{display: 'none'}}
        tableStyle={{ minWidth: '50rem' }}
        selectionMode={"single"}
        dataKey="IDEMPRESA"
        sortField="VRTOTALPAGO"
        sortOrder={-1}
        showGridlines
        stripedRows
        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
      >
        {colunasQuebra.map(coluna => (
          <Column
            key={coluna.field}
            field={coluna.field}
            header={coluna.header}
            body={coluna.body}
            footer={coluna.footer}
            headerStyle={{ display: 'none' }}
            // headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
            footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#212529', border: '1px solid #7a59ad' }} />
        ))}
      </DataTable>

    </Fragment>
  )
}