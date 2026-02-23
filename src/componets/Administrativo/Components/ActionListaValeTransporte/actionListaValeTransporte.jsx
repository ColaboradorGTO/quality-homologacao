import React, { Fragment, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { get } from "../../../../api/funcRequest";
import { GrView } from "react-icons/gr";

import { CiEdit } from "react-icons/ci";

export const ActionListaValeTransporte = ({dadosDespesasLoja}) => {
  const [dadosVendasDetalhada, setDadosVendasDetalhada] = useState([]); 
  const [modalVisivel,  setModalVisivel] = useState(false);
  
  
  const dados = dadosDespesasLoja.map((item) => {
    return {
      DTDESPESA: item.DTDESPESA,
      DSCATEGORIA: item.DSCATEGORIA,
      VRDESPESA: item.VRDESPESA,
      NOFUNCVALE: item.NOFUNCVALE,
      DSHISTORIO: item.DSHISTORIO,
      NUNOTAFISCAL: item.NUNOTAFISCAL,
      STCANCELADO: item.STCANCELADO,

    }
  });

  const calcularValor = () => {
    let total = 0;
    for(let dados of dadosVendas) {
      total += parseFloat(dados.VRDESPESA);
    }
    return total;
  }

  const colunasVouchers = [
    {
      field: 'DTDESPESA',
      header: 'Data Mov.',
      body: row => row.DTDESPESA,
      sortable: true,
    },
    {
      field: 'DSCATEGORIA',
      header: 'Descrição',
      body: row => row.DSCATEGORIA,
      footer: 'Total Lançamentos',
      sortable: true,
    },
    {
      field: 'VRDESPESA',
      header: 'Valor',
      body: row => row.VRDESPESA,
      footer: formatMoeda(calcularValor()),
      sortable: true,
    },
    {
      field: 'NOFUNCVALE',
      header: 'Pago a',
      body: row => row.NOFUNCVALE,
      sortable: true,
    },
    {
      field: 'DSHISTORIO',
      header: 'Histórico',
      body: row => row.DSHISTORIO,
      sortable: true,
    },
    {
      field: 'NUNOTAFISCAL',
      header: 'Nota Fiscal',
      body: row => row.NUNOTAFISCAL,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => <p style={{color: row.STCANCELADO == 'False' ? 'blue' : 'red'}}>{row.STCANCELADO == 'False' ? 'ATIVO' : 'CANCELADO'}</p>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Opções',
      button: true,
      body: (row) => (
        <div className="d-flex "
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <ButtonTable  
              titleButton={"Imprimir"}
              onClickButton={() => handleClickEdit(row)} 
              cor={"primary"}
              Icon={CiEdit}
              iconSize={18}
            />
          </div>
        </div>
      ),
    }

  ]

 

  const handleEdit = async (empresaSelecionada, IDVENDA) => {
    try {
      const response = await get(`/listaDetalheVenda?idEmpresa=${empresaSelecionada}&idVenda=${IDVENDA}`);

      if (response.data && response.data.length > 0) {
        setDadosVendasDetalhada(response.data);
        setModalVisivel(true);

      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickEdit = (row) => {

    if (row && empresaSelecionada && row.IDVENDA) {
      handleEdit(empresaSelecionada, row.IDVENDA);
    }

  };


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
          {colunasVouchers.map(coluna => (
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

