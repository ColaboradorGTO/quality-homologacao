import React, { Fragment } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const ActionListaPrimeiroBalanco = (dadosVendasMarca) => {


  const dados = dadosVendasMarca.map((item) => {

    let total = parseFloat(item.VRDINHEIRO) +
      parseFloat(item.VRCARTAO) +
      parseFloat(item.VRPOS) +
      parseFloat(item.CONVENIO) +
      parseFloat(item.VRPIX);


    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      QTDVENDA: parseFloat(item.QTDVENDA),
      VRTOTALPAGO: parseFloat(item.VRTOTALPAGO),
      QTDVENDA: item.QTDVENDA,
      VRCARTAO: item.VRCARTAO,
      VRDINHEIRO: item.VRDINHEIRO,
      VRPOS: item.VRPOS,
      CONVENIO: item.CONVENIO,
      VRPIX: item.VRPIX,
      total: formatMoeda(total),
    }
  });


  const colunasVendas = [
    {
      field: 'IDEMPRESA',
      header: 'ID',
      body: row => row.IDEMPRESA,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => row.NOFANTASIA,
      sortable: true,
    },
    {
      field: 'QTDVENDA',
      header: 'QTD Clientes',
      body: row => parseFloat(row.QTDVENDA),
      sortable: true,
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Total Vendas',
      body: row => formatMoeda(row.VRTOTALPAGO),
      sortable: true,
    },
    {
      field: 'total',
      header: 'Ticket Médio',
      body: row => row.total,
      sortable: true,
    },
  ]

  return (
    <Fragment>

      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dados}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasVendas.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}

              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>

      </div>
    </Fragment>
  )
}