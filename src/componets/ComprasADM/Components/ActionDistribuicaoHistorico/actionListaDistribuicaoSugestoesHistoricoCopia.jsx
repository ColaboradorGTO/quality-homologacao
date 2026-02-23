import React, { Fragment, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { get } from "../../../../api/funcRequest";
import "./styles.css"; 
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaDistribuicaoSugestoesHistorico = ({ dadosSugestoesHistorico }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [dadosDetalhePedido, setDadosDetalhePedido] = useState(null);
  const [modalDetalhePedido, setModalDetalhePedido] = useState(false);

  const dados = dadosSugestoesHistorico.map((item) => {
    let filiaisParaCabecalho = dadosSugestoesHistorico.length > 0 ? dadosSugestoesHistorico[0].filial : [];
    return {
      DescProduto: item.venda.DescProduto,
      CodBarras: item.venda.CodBarras,
      Grade: item.venda.Grade,
      IdEmpresa: item.venda.IdEmpresa,
      IdPedidoCompra: item.venda.IdPedidoCompra,
      PrecoVenda: item.venda.PrecoVenda,
      QtdGrade: item.venda.QtdGrade,
      StConcluido: item.venda.StConcluido,
      IdFilial: item.filial[0]?.IdFilial,
      DescFilial: item.filial[0]?.DescFilial,

      IdDistribuicaoCompras: item.linhas[0]?.IdDistribuicaoCompras,
      IdFilialLinhas: item.linhas[0]?.IdFilial,
      QtdSugestaoAlteracao: item.linhas[0]?.QtdSugestaoAlteracao,
      QtdSugestao: item.linhas[0]?.QtdSugestao,
     
      filiaisParaCabecalho
    };
   
  });

  

  // Função para alterar o valor da sugestão alterada


  // Verifica se há dados processados e pega as filiais do primeiro item (assumindo que todas as filiais são iguais para todos os itens)
 

  // Configuração das colunas para o DataTable
  const colunasPedidos = [
    {
      field: "DescProduto",
      header: "Produto",
      body: (row) => <p style={{width: '350px', fontWeight: 600, margin: '0px'}}>{row.DescProduto}</p>,
      sortable: true,
    },
    {
      field: "PrecoVenda",
      header: "Valor",
      body: (row) => <th>{row.PrecoVenda}</th>,
      sortable: true,
    },
    {
      field: "QtdGrade",
      header: "QTD",
      body: (row) => <th>{row.QtdGrade}</th>,
      sortable: true,
    },
    {
      field: "Grade",
      header: "Grade",
      body: (row) => <th>{row.Grade}</th>,
      sortable: true,
    },
    {
      field: "Total",
      header: "Total",
      body: (row) => (
        <input
          style={{width: '35px', height: '27px', textAlign: 'center'}}
          type="text"
          value={(row.QtdGrade )}
          readOnly
        />
      ),
      sortable: false,
    },
    {
      field: "Sugestoes",
     
      // header:  <tr style={{}} className=""> {console.log(dados[0]?.filiaisParaCabecalho)}  </tr>,
      header: (
        <th style={{height: '200px', width: '100rem', backgroundColor: 'green'}}>
          <span className="rotate-270 text-nowrap h-100 d-flex pos-top" style={{ whiteSpace: "pre-line" }}> 

            {dados[0]?.filiaisParaCabecalho.map((item) => item.DescFilial).join("\n")}
          </span>
        </th>
      ),
      
      body: (row) => {
        return ( 
          <div  style={{display: 'flex'}} >
            {/* {console.log(row)}, */}
            <input
              style={{width: '35px', height: '27px', textAlign: 'center', marginRight: '5px'}}
              className="input"
              type="text"
              value={toFloat(row.qtdsugestaoalterada)}
              onChange={(e) =>
                handleSugestaoAlteradaChange(
                  row.CodBarras,
                  row.IdDistribuicaoCompras,
                  e.target.value
                )
              }
            />
     
          </div>
        );
      },
      sortable: false,
    
    },

  ];

  // Função para alterar o valor da sugestão alterada
  const handleSugestaoAlteradaChange = (codBarras, idDistribuicaoCompras, valor) => {
    console.log("Alteração de sugestão: ", codBarras, idDistribuicaoCompras, valor);
  };

  // Função para abrir detalhes do pedido
  const handleClickDetalhar = (row) => {
    if (row && row.IdPedidoCompra) {
      handleDetalhar(row.IdPedidoCompra);
    }
  };

  const handleDetalhar = async (idPedidoCompra) => {
    try {
      const response = await get(`/detalheDistribuicaoCompras?idPedido=${idPedidoCompra}`);
      setDadosDetalhePedido(response.data);
      setModalDetalhePedido(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido: ", error);
    }
  };

  return (
    <Fragment>
      <div className="card ">
        <DataTable
          style={{ width: "100%" }}
          title="Distribuição de Compras"
          value={dados}
          selectionMode="checkbox"
          selection={empresaSelecionada}
          onSelectionChange={(e) => setEmpresaSelecionada(e.value)}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50, 100]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasPedidos.map((coluna) => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              sortable={coluna.sortable}
              headerStyle={{
                color: "white",
                backgroundColor: "#7a59ad",
                border: "1px solid #e9e9e9",
                fontSize: "0.8rem",
              }}
              bodyStyle={{ fontSize: "0.8rem" }}
            />
          ))}
        </DataTable>
      </div>

 
    </Fragment>
  );
};
