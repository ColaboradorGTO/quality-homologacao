import { Fragment, useEffect, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrDocumentPdf } from "react-icons/gr";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonSearch } from "../../../Buttons/ButtonSearch";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionPDFPedidoResumido = ({ dadosPedidos }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [rowSelection, setRowSelection] = useState(null);
    const dataTableRef = useRef();
  
    const onGlobalFilterChange = (e) => {
      setGlobalFilterValue(e.target.value);
    };
  
    const handlePrint = useReactToPrint({
      content: () => dataTableRef.current,
      documentTitle: 'Relacao Detalhe Pedidos',
    });
  
    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'QTD Produto', 'Vr Compra', 'Vr Venda', 'Vr Lucro', '(%) Lucro', 'Setor']],
        body: dados.map(item => [
          item.DTPEDIDO,
          item.IDPEDIDO,
          item.NOFANTASIAGRUPO,
          item.NOMECOMPRADOR,
          item.NOFANTASIAFORN,
          formatMoeda(item.VRTOTALCUSTO),
          formatMoeda(item.VRTOTALVENDA),
          formatMoeda(item.VRTOTALLUCRO),
          item.totalValorPercentualLucro,
          item.DSSETOR == 'CADASTRO' ? 'CADASTRO' : item.DSSETOR == 'COMPRAS' ? 'COMPRAS' : item.DSSETOR == 'COMPRAS ADM' ? 'COMPRAS ADM' : '',
        ]),
        horizontalPageBreak: true,
        horizontalPageBreakBehaviour: 'immediately'
      });
      doc.save('relacao_det_pedidos.pdf');
    };
  
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const workbook = XLSX.utils.book_new();
      const header = ['Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'QTD Produto', 'Vr Compra', 'Vr Venda', 'Vr Lucro', '(%) Lucro', 'Setor'];
      worksheet['!cols'] = [
        { wpx: 150, caption: 'Data' },
        { wpx: 100, caption: 'Nº Pedido' },
        { wpx: 150, caption: 'Marca' },
        { wpx: 200, caption: 'Comprador' },
        { wpx: 200, caption: 'Fornecedor' },
        { wpx: 100, caption: 'QTD Produto' },
        { wpx: 100, caption: 'Vr Compra' },
        { wpx: 100, caption: 'Vr Venda' },
        { wpx: 100, caption: 'Vr Lucro' },
        { wpx: 100, caption: '(%) Lucro' },
        { wpx: 100, caption: 'Setor' },
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relacao Detalhe Pedidos');
      XLSX.writeFile(workbook, 'relacao_det_pedidos.xlsx');
    };
  

  const dados = dadosPedidos.map((item, index) => {
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
    return dados.length;
  }
  const calcularTotalPedido = () => {
    return dados.reduce((total, dados) => {
      return total + parseFloat(dados.VRTOTALLIQUIDO);
    }, 0);
  }


  useEffect(() => {
    const totalPedidos = dadosPedidos.reduce(
      (total, pedido) => total + pedido.quantidade,
      0
    );
    setTotalQuantidadePedidos(totalPedidos);
  }, [dadosPedidos]);

  const [totalQuantidadePedidos, setTotalQuantidadePedidos] = useState(0);
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
      body: row => formatMoeda(row.VRTOTALLIQUIDO),
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
      }
    }
  ]
  return (
    <Fragment>
      <div >

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
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>

        <div className="" ref={dataTableRef}>
          <DataTable
            title="Vendas por Loja"
            value={dados}
            globalFilterValue={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortField="IDPEDIDO"
            sortOrder={-1}
            rows={10}
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
                headerStyle={{ color: '#FFF', backgroundColor: "#7a59ad", border: '1px solid #000', fontSize: '1rem', textAlign: 'center' }}
                footerStyle={{ color: '#212529', backgroundColor: "transparent", border: '1px solid #000', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem', backgroundColor: 'transparent', border: '1px solid #000', textAlign: 'initial', fontWeight: 600 }}

              />
            ))}
          </DataTable>

          <div className="mt-6">
              <table className="semborda">

                {dados && dados.length > 0 && (
                  <>
                    <th style={{ textAlign: 'left', fontSize: '14px' }}>Quantidade de Pedidos: </th>
                    <th style={{ textAlign: 'right', fontSize: '14px' }}> <b>{calcularTotalContador()}</b></th>
                  </>
                )}
                <tr>

                  <th style={{ textAlign: 'left', fontSize: '14px' }}>Total de Pedidos: </th>
                  <th style={{ textAlign: 'right', fontSize: '14px' }}> <b>{formatMoeda(calcularTotalPedido())}</b></th>
                </tr>
              </table>
          </div>
          <div>

          </div>
        </div>

      </div>

    </Fragment>
  )
}