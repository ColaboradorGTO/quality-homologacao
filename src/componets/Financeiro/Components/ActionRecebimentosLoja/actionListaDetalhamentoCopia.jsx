import React, { Fragment, useRef, useState, useEffect } from 'react';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import HeaderTable from '../../../Tables/headerTable';

export const ActionListaDetalhamentoCopia = ({ dadosListaRecebimentosLoja }) => {
  const [nodes, setNodes] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  useEffect(() => {
    const formattedData = dadosListaRecebimentosLoja.map(item => {
      const totalRecebido = calcularTotalValorRecebidoLoja(item);

      return {
        key: item.ID,
        data: {
          moeda: "Dinheiro",
          valor: formatMoeda(item.VALORTOTALDINHEIRO),
          percentual: calcularPercentual(item.VALORTOTALDINHEIRO, totalRecebido) + '%'
        },
        children: [

          {
            key: `${item.ID}_cartao`,
            data: {
              moeda: "Cartão TEF",
              valor: formatMoeda(item.VALORTOTALCARTAO),
              percentual: calcularPercentual(item.VALORTOTALCARTAO, totalRecebido) + '%'
            }
          },
          {
            key: `${item.ID}_convenio`,
            data: {
              moeda: "Convênio",
              valor: formatMoeda(item.VALORTOTALCONVENIO),
              percentual: calcularPercentual(item.VALORTOTALCONVENIO, totalRecebido) + '%'
            }
          },
          {
            key: `${item.ID}_voucher`,
            data: {
              moeda: "Voucher",
              valor: formatMoeda(item.VALORTOTALVOUCHER),
              percentual: calcularPercentual(item.VALORTOTALVOUCHER, totalRecebido) + '%'
            }
          },
          {
            key: `${item.ID}_pos`,
            data: {
              moeda: "POS",
              valor: formatMoeda(item.VRPOS),
              percentual: calcularPercentual(item.VRPOS, totalRecebido) + '%'
            }
          },
          {
            key: `${item.ID}_pix`,
            data: {
              moeda: "PIX",
              valor: formatMoeda(item.VRPIX),
              percentual: calcularPercentual(item.VRPIX, totalRecebido) + '%'
            }
          }
        ]
      };
    });

    setNodes(formattedData);
  }, [dadosListaRecebimentosLoja]);

  const calcularTotalValorRecebidoLoja = (item) => (
    toFloat(item.VALORTOTALDINHEIRO) +
    toFloat(item.VALORTOTALCARTAO) +
    toFloat(item.VALORTOTALCONVENIO) +
    toFloat(item.VRPOS) +
    toFloat(item.VALORTOTALVOUCHER) +
    toFloat(item.VRPIX) +
    toFloat(item.VRMOOVPAY)
  );

  const calcularPercentual = (valor, total) => {
    const percentual = (toFloat(valor) / total) * 100;
    return percentual.toFixed(2); // Arredonda para duas casas decimais
  };

  const calcularTotalValores = () => {
    return dadosListaRecebimentosLoja.reduce((total, item) => total + calcularTotalValorRecebidoLoja(item), 0);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Recebimentos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Moeda', 'Valor', '% da Venda']],
      body: nodes.flatMap(node => node.children.map(child => [
        child.data.moeda,
        child.data.valor,
        child.data.percentual
      ])),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('recebimentos_loja.pdf');
  };

  const exportToExcel = () => {
    const flattenedData = nodes.flatMap(node => node.children.map(child => ({
      moeda: child.data.moeda,
      valor: child.data.valor,
      percentual: child.data.percentual
    })));
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Recebimentos');
    XLSX.writeFile(workbook, 'recebimentos_loja.xlsx');
  };

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h1 style={{textAlign: 'center', fontWeight: 600, width: '100%', marginTop: '20px'}}>Detalhamento TEF E POS</h1>
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
        <div className="card" ref={dataTableRef}>
          <TreeTable
            value={nodes}
            size="small"
            expander={true}
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            resizableColumns
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            <Column
              sortable={true}
              field="moeda"
              header="Moeda"
              expander
              footer="Total"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            />
            <Column
              sortable={true}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              field="valor"
              header="Valor"
              footer={formatMoeda(calcularTotalValores())}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            />
            <Column
              sortable={true}
              field="percentual"
              header="% da Venda"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            />
          </TreeTable>
        </div>
      </div>
    </Fragment>
  );
};
