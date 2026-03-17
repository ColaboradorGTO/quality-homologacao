import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonSearch } from "../../../Buttons/ButtonSearch";
import { toFloat } from "../../../../utils/toFloat";


export const ActionPDFPedidoDetalhado = ({ dadosPedidosDetalhados }) => {


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
      totalValorPercentualLucro: totalValorPercentualLucro.toFixed(2),

      contador
    }
  })

  const calcularTotalContador = () => {
    return dadosListaPedidosResumidos.length;
  }
  const calcularTotalProduto = () => {
    return dadosListaPedidosResumidos.reduce((total, dados) => {
      return total + parseFloat(dados.QTDPRODTOTAL);
    }, 0);
  }
  const calcularTotalCompra = () => {
    return dadosListaPedidosResumidos.reduce((total, dados) => {
      return total + parseFloat(dados.VRTOTALCUSTO);
    }, 0);
  }
  const calcularTotalVenda = () => {
    return dadosListaPedidosResumidos.reduce((total, dados) => {
      return total + parseFloat(dados.VRTOTALVENDA);
    }, 0);
  }

  const calcularTotalLucro = () => {
    return dadosListaPedidosResumidos.reduce((total, dados) => {
      return total + parseFloat(dados.VRTOTALLUCRO);
    }, 0);
  }
  
  const calcularTotalPercentualLucro = () => {
    const totalVenda = calcularTotalVenda();
    const totalCompra = calcularTotalCompra();
    
    return ((totalVenda * 100) / totalCompra) - 100;
  }

  
  const colunasPedidoResumido = [
    // {
    //   field: 'contador',
    //   header: 'Nº',
    //   body: row => row.contador,
    // },
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
      <div className="">
        <DataTable
          title="Vendas por Loja"
          value={dadosListaPedidosResumidos}
          size="small"
          // header={header}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          rows={true}
          // paginator={true}
          // rowsPerPageOptions={[5, 10, 20, 500, 1000, 1500]}

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
        <div className="mt-6">

          <table className="semborda">
            <tr>
              {dadosListaPedidosResumidos && dadosListaPedidosResumidos.length > 0 && (
                <>
                  <th style={{ textAlign: 'left', fontSize: '14px' }}>Quantidade de Pedidos: </th>
                  <th style={{ textAlign: 'right', fontSize: '14px' }}> <b>{calcularTotalContador()}</b> </th>
                </>
              )}
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '14px' }}>QTD Produtos: </th>
              <th style={{ textAlign: 'right', fontSize: '14px' }}><b>{calcularTotalProduto()}</b></th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '14px' }}>Valor Total Compra:</th>
              <th style={{ textAlign: 'right', fontSize: '14px' }}><b>{formatMoeda(calcularTotalCompra())}</b></th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '14px' }}>Valor Total Venda:</th>
              <th style={{ textAlign: 'right', fontSize: '14px' }}><b>{formatMoeda(calcularTotalVenda())}</b></th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '14px' }}>Valor Total Lucro:</th>
              <th style={{ textAlign: 'right', fontSize: '14px' }}><b>{formatMoeda(calcularTotalLucro())}</b></th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '14px' }}>% Total Lucro:</th>
              <th style={{ textAlign: 'right', fontSize: '14px' }}><b>{calcularTotalPercentualLucro().toFixed(2)}</b></th>
            </tr>

          </table>
        </div>
      </div>

    </Fragment>
  )
}