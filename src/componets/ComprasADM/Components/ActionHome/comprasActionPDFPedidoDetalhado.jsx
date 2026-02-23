import { Fragment, useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrDocumentPdf } from "react-icons/gr";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonSearch } from "../../../Buttons/ButtonSearch";


export const ActionPDFPedidoDetalhado = ({ dadosPedidosDetalhados }) => {
  const calcularTotalValorCompra = () => {
    let total = 0;
    for (let dados of dadosListaPedidosResumidos) {
      total += parseFloat(dados.VRTOTALCUSTO);
    }
    return total;
  }

  const calcularTotalValorVenda = () => {
    let total = 0;
    for (let dados of dadosListaPedidosResumidos) {
      total += parseFloat(dados.VRTOTALVENDA);
    }
    return total;
  }
  
  const calcularTotalQuantidadeProduto = () => {
    let total = 0;
    for (let dados of dadosListaPedidosResumidos) {
      total += parseFloat(dados.QTDPRODTOTAL);
    }
    return total;
  }
  
  const calcularValorTotalLucro = () => {
    let total = 0;
    for (let dados of dadosListaPedidosResumidos) {
      total += parseFloat(dados.VRTOTALLUCRO);
    }
    return total;
  }
  
  const calcularTotalValorPercentualLucro = () => {
    const totalVenda = calcularTotalValorVenda();
    const totalCustom = calcularTotalValorCompra();
    const totalPercentual = ((totalVenda * 100) / totalCustom) - 100;
    return totalPercentual;
  }

  const dadosListaPedidosResumidos = dadosPedidosDetalhados.map((item, index) => {
    let contador = index + 1;
    const totalValorPercentualLucro = ((parseFloat(item.VRTOTALVENDA) * 100) / parseFloat(item.VRTOTALCUSTO)) - 100;
   
    return {
      IDPEDIDO: item.IDPEDIDO,
      DTPEDIDO: item.DTPEDIDO,
      NOMECOMPRADOR: item.NOMECOMPRADOR,
      NOFANTASIAGRUPO: item.NOFANTASIAGRUPO,
      NOFANTASIAFORN: item.NOFANTASIAFORN,
      DSANDAMENTO: item.DSANDAMENTO,
      DSSETOR: item.DSSETOR,
      QTDPRODTOTAL: item.QTDPRODTOTAL,
      VRTOTALCUSTO: item.VRTOTALCUSTO,
      VRTOTALVENDA: item.VRTOTALVENDA,
      VRTOTALLUCRO: item.VRTOTALLUCRO,
      totalValorPercentualLucro: parseFloat(totalValorPercentualLucro).toFixed(2),

      contador
    }
  })

  const calcularTotalContador = () => {
    return dadosListaPedidosResumidos.length;
  }

  const colunasPedidoResumido = [
    {
      field: 'DTPEDIDO',
      header: 'Data',
      body: row => row.DTPEDIDO,

    },
    {
      field: 'IDPEDIDO',
      header: 'N Pedido',
      body: row => row.IDPEDIDO,
    },
    {
      field: 'NOFANTASIAGRUPO',
      header: 'Marca',
      body: row => row.NOFANTASIAGRUPO,
    },
    {
      field: 'NOMECOMPRADOR',
      header: 'Comprador',
      body: row => row.NOMECOMPRADOR,
    },
    {
      field: 'NOFANTASIAFORN',
      header: 'Fornecedor',
      body: row => row.NOFANTASIAFORN,
    },
    {
      field: 'QTDPRODTOTAL',
      header: 'QTD Produto',
      body: row => row.QTDPRODTOTAL,

    },
    {
      field: 'VRTOTALCUSTO',
      header: 'Vr Compra',
      body: row => formatMoeda(row.VRTOTALCUSTO),
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Vr Venda',
      body: row => formatMoeda(row.VRTOTALVENDA),
    },
    {
      field: 'VRTOTALLUCRO',
      header: 'Vr Lucro',
      body: row => formatMoeda(row.VRTOTALLUCRO),
    },
    {
      field: 'totalValorPercentualLucro',
      header: '(%) Lucro',
      body: row => row.totalValorPercentualLucro,
    },
    {
      field: 'DSSETOR',
      header: 'Setor',
      body: (row) => {
        if (row.DSSETOR == 'COMPRAS') {
          return (
            <p style={{ color: 'blue' }} >COMPRAS</p>
          )

        } else if (row.DSSETOR == 'CADASTRO') {
          return (
            <p estyle={{ color: 'red' }} >CADASTRO</p>
          )

        } else if (row.DSSETOR == 'COMPRASADM') {
          return (
            <p style={{ color: 'red' }}>COMPRAS ADM</p>
          )
        }
      }
    },
  ]
  return (
    <Fragment>
      <div style={{ marginRight: "10px" }}>

        <ButtonSearch
          textButton="Imprimir PDF"
          onClickButtonType
          cor="info"
          // Icon={GrDocumentPdf}
          // iconColor="#fff"
          iconSize={20}
        />
      </div>
      <div 
        style={{ 
          fontWeight: 700, 
          fontSize: "16px", 
          border: '1px solid #000', 
          textAlign: 'center', 
          marginBottom: '10px', 
          marginTop: '10px' 
        }}>
          
          <h2>RELAÇÃO DE PEDIDOS DETALHADOS</h2>
      </div>
      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dadosListaPedidosResumidos}
          size="small"
          // header={header}
          sortField="VRTOTALPAGO"
          sortOrder={-1}

          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
        >
          {colunasPedidoResumido.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}

              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: '#212529', backgroundColor: "transparent", border: '1px solid #000', fontSize: '0.8rem', textAlign: 'center' }}
              footerStyle={{ color: '#212529', backgroundColor: "transparent", border: '1px solid #000', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.688rem', backgroundColor: 'transparent', border: '1px solid #000', textAlign: 'initial' }}

            />
          ))}
        </DataTable>

         
          <div style={{padding: '10px'}}>
              <p>Quantidade de Pedidos: <b>{calcularTotalContador()}</b></p>
              <p>QTD Produtos: <b>{calcularTotalQuantidadeProduto()}</b></p>
              <p>Valor Total Compra: <b>{formatMoeda(calcularTotalValorCompra())}</b></p>
              <p>Valor Total Venda: <b>{formatMoeda(calcularTotalValorVenda())}</b></p>
              <p>Valor Total Lucro: <b>{formatMoeda(calcularValorTotalLucro())}</b></p>
              <p>% Total Lucro: <b>{calcularTotalValorPercentualLucro().toFixed(2)}</b></p>

            </div>
       
      </div>

    </Fragment>
  )
}