import { Fragment, useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrDocumentPdf } from "react-icons/gr";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonSearch } from "../../../Buttons/ButtonSearch";


export const ActionPDFPedidoResumido = ({ dadosPedidoResumido }) => {


  const dadosListaPedidosResumidos = dadosPedidoResumido.map((item, index) => {
    let contador = index + 1;
    // console.log(contador.length, 'contador')
    return {
      IDPEDIDO: item.IDPEDIDO,
      DTPEDIDO: item.DTPEDIDO,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      STCANCELADO: item.STCANCELADO,
      NOMECOMPRADOR: item.NOMECOMPRADOR,
      NOFANTASIA: item.NOFANTASIA,
      NOFORNECEDOR: item.NOFORNECEDOR,
      DSANDAMENTO: item.DSANDAMENTO,
      DSSETOR: item.DSSETOR,
      contador
    }
  })

  
  const calcularTotalContador = () => {
    return dadosListaPedidosResumidos.length;
  }
  const calcularTotalPedido = () => {
    let total = 0;
    for (let dados of dadosListaPedidosResumidos) {
      total += parseFloat(dados.VRTOTALLIQUIDO);
    }
    return total;
  }

  useEffect(() => {
    const totalPedidos = dadosPedidoResumido.reduce(
      (total, pedido) => total + pedido.quantidade,
      0
    );
    setTotalQuantidadePedidos(totalPedidos);
  }, [dadosPedidoResumido]);

  const [totalQuantidadePedidos, setTotalQuantidadePedidos] = useState(0);
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
      field: 'NOFANTASIA',
      header: 'Marca',
      body: row => row.NOFANTASIA,
    },
    {
      field: 'NOMECOMPRADOR',
      header: 'Comprador',
      body: row => row.NOMECOMPRADOR,
    },
    {
      field: 'NOFORNECEDOR',
      header: 'Fornecedor',
      body: row => row.NOFORNECEDOR,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Valor Pedido',
      body: row => row.VRTOTALLIQUIDO,
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
    {
      field: 'DSANDAMENTO',
      header: 'Status',
      body: (row) => {
        if(row.DSSETOR == 'COMPRAS') {
          if (row.DSANDAMENTO == 'PEDIDO INICIADO') {
            return (
              <p style={{ color: 'blue' }} >PEDIDO INICIADO</p>
            )
  
          } else if (row.DSANDAMENTO == 'PEDIDO FINALIZADO') {
            return (
              <p estyle={{ color: 'tomato' }} >PEDIDO FINALIZADO</p>
            )
  
          } else if (row.DSANDAMENTO == 'PEDIDO CANCELADO') {
            return (
              <p style={{ color: 'red' }}>PEDIDO CANCELADO</p>
            )
          }

        } else if(row.DSSETOR == 'CADASTRO') {
          return (
            <p style={{ color: 'red' }}></p>
          )
        } else if(row.DSSETOR == 'COMPRASADM') {
          return (
            <p style={{ color: 'green' }}>PEDIDO EM ANÁLISE</p>
          )
        }
      }
    }
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
          <h2>RELAÇÃO DE PEDIDOS RESUMIDO</h2>
          
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

        <div>
          {dadosListaPedidosResumidos && dadosListaPedidosResumidos.length > 0 && (

            <p>Quantidade de Pedidos: <b>{calcularTotalContador()}</b></p>
          )}
        </div>
        <div>
          <p>Total de Pedidos: <b>{formatMoeda(calcularTotalPedido())}</b></p>

        </div>
      </div>

    </Fragment>
  )
}