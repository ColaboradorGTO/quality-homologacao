import { Fragment, useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../../utils/toFloat";
import { mascaraValor } from "../../../../../utils/mascaraValor";
import { dataFormatada } from "../../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../../utils/formatMoeda";

export const ActionListaQuebra = ({ dadosExtratoQuebra, dadosVendas, dadosTotalFaturas, dadosTotalDespesas, dadosTotalAdiantamentos }) => {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    let saldoAnteriorQuebra = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO) +
      parseFloat(dadosTotalFaturas[0]?.VRRECEBIDO) -
      parseFloat(dadosTotalDespesas[0]?.VRDESPESA ?? 0) -
      parseFloat(dadosTotalAdiantamentos[0]?.VRVALORDESCONTO ?? 0);

    const updatedDados = dadosExtratoQuebra.map((item) => {
      const calcularTotalDinheiroInformado = () => {
        if (item.VRAJUSTDINHEIRO > 0) {
          return toFloat(item.VRAJUSTDINHEIRO);
        } else {
          return toFloat(item.VRRECDINHEIRO);
        }
      };

      const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(item.VRFISICODINHEIRO);
      saldoAnteriorQuebra += parseFloat(totalQuebraCaixa);


      return {
        IDMOV: item.IDMOV,
        DTMOVCAIXA: item.DTMOVCAIXA,
        FUNCIONARIOMOV: item.FUNCIONARIOMOV,
        VRFISICODINHEIRO: item.VRFISICODINHEIRO,
        VRRECDINHEIRO: item.VRRECDINHEIRO,
        VRAJUSTDINHEIRO: toFloat(item.VRAJUSTDINHEIRO),
        saldoAnteriorQuebra: saldoAnteriorQuebra,
        totalQuebraCaixa: totalQuebraCaixa,
        saldoAnterior: saldoAnteriorQuebra - totalQuebraCaixa,
      };
    });

 
  }, [dadosExtratoQuebra, dadosVendas, dadosTotalFaturas, dadosTotalDespesas, dadosTotalAdiantamentos]);

  const colunasQuebra = [
    {
      header: 'Dt. Lançamento',
      field: 'DTMOVCAIXA',
      body: row => <p style={{ margin: '0px', width: '150px' }}>{dataFormatada(row.DTMOVCAIXA)}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: 'IDMOV',
      body: row => <p style={{ margin: '0px' }}>Quebra Caixa Mov.: {row.IDMOV}</p>,
      sortable: true,
    },
    {
      header: 'Pago A',
      field: 'FUNCIONARIOMOV',
      body: row => <p style={{ margin: '0px' }}>Operador: {row.FUNCIONARIOMOV}</p>,
      sortable: true,
    },
    {
      header: 'Despesa',
      field: '',
      body: row => <p style={{ margin: '0px' }}></p>,
    },
    {
      header: 'Débito',
      field: 'totalQuebraCaixa',
      body: row => {
        if (row.totalQuebraCaixa > 0) {
          return <p style={{ margin: '0px' }}>0,00</p>;
        } else {
          return <p style={{ margin: '0px' }}>{mascaraValor(parseFloat(row.totalQuebraCaixa).toFixed(2))}</p>;
        }
      },
      sortable: true,
    },
    {
      header: 'Crédito',
      field: 'totalQuebraCaixa',
      body: row => {
        if (row.totalQuebraCaixa > 0) {
          return <p style={{ margin: '0px' }}>{mascaraValor(parseFloat(row.totalQuebraCaixa).toFixed(2))}</p>;
        } else {
          return <p style={{ margin: '0px' }}>0,00</p>;
        }
      },
      sortable: true,
    },
    {
      field: 'saldoAnteriorQuebra',
      header: 'Saldo',
      body: row => <p style={{ margin: '0px', width: '5rem' }}>{formatMoeda(row.saldoAnteriorQuebra)}</p>,
      sortable: true,
    },
    {
      header: 'Situação',
      field: '',
      body: row => <p style={{ margin: '0px' }}></p>,
      sortable: true,
    },
  ];

  return (
    <Fragment>
      <DataTable
        title="Quebra Extrato"
        value={dados}
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
            footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#212529', border: '1px solid #7a59ad' }}
          />
        ))}
      </DataTable>
    </Fragment>
  );
};


// useEffect(() => {
//   let saldoAnteriorQuebra = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO) +
//     parseFloat(dadosTotalFaturas[0]?.VRRECEBIDO) -
//     parseFloat(dadosTotalDespesas[0]?.VRDESPESA ?? 0) -
//     parseFloat(dadosTotalAdiantamentos[0]?.VRVALORDESCONTO ?? 0);

//   const updatedDados = dadosExtratoQuebra.map((item) => {
//     const calcularTotalDinheiroInformado = () => {
//       if (item.VRAJUSTDINHEIRO > 0) {
//         return toFloat(item.VRAJUSTDINHEIRO);
//       } else {
//         return toFloat(item.VRRECDINHEIRO);
//       }
//     };

//     const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(item.VRFISICODINHEIRO);
//     saldoAnteriorQuebra += parseFloat(totalQuebraCaixa);
//     console.log(parseFloat(saldoAnteriorQuebra).toFixed(2), 'saldoAnteriorQuebra actionListaQuebra');
//     console.log(parseFloat(totalQuebraCaixa).toFixed(2), 'totalQuebraCaixa actionListaQuebra');

//     return {
//       IDMOV: item.IDMOV,
//       DTMOVCAIXA: item.DTMOVCAIXA,
//       FUNCIONARIOMOV: item.FUNCIONARIOMOV,
//       VRFISICODINHEIRO: item.VRFISICODINHEIRO,
//       VRRECDINHEIRO: item.VRRECDINHEIRO,
//       VRAJUSTDINHEIRO: toFloat(item.VRAJUSTDINHEIRO),
//       saldoAnteriorQuebra: saldoAnteriorQuebra,
//       totalQuebraCaixa: totalQuebraCaixa,
//       saldoAnterior: saldoAnteriorQuebra - totalQuebraCaixa,
//     };
//   });

//   setDados(updatedDados);
// }, [dadosExtratoQuebra, dadosVendas, dadosTotalFaturas, dadosTotalDespesas, dadosTotalAdiantamentos]);