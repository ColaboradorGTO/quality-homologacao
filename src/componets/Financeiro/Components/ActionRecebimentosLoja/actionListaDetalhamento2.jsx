import React, { Fragment, useRef, useState, useEffect } from 'react';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from '../../../Tables/headerTable';

export const ActionListaDetalhamento = ({ dadosListaRecebimentosLoja }) => {
  const [dados, setDados] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  useEffect(() => {
    // Replica a lógica do jQuery - filtra apenas valores > 0
    const flatData = dadosListaRecebimentosLoja.flatMap(item => {
      const totalRecebido = calcularTotalValorRecebidoLoja(item);
      
      const tiposPagamento = [
        {
          id: `${item.ID}_dinheiro`,
          moeda: "Dinheiro",
          valor: toFloat(item.VALORTOTALDINHEIRO),
          valorFormatado: formatMoeda(item.VALORTOTALDINHEIRO),
          percentual: calcularPercentual(item.VALORTOTALDINHEIRO, totalRecebido) + '%'
        },
        {
          id: `${item.ID}_cartao`,
          moeda: "Cartão TEF",
          valor: toFloat(item.VALORTOTALCARTAO),
          valorFormatado: formatMoeda(item.VALORTOTALCARTAO),
          percentual: calcularPercentual(item.VALORTOTALCARTAO, totalRecebido) + '%'
        },
        {
          id: `${item.ID}_convenio`,
          moeda: "Convênio",
          valor: toFloat(item.VALORTOTALCONVENIO),
          valorFormatado: formatMoeda(item.VALORTOTALCONVENIO),
          percentual: calcularPercentual(item.VALORTOTALCONVENIO, totalRecebido) + '%'
        },
        {
          id: `${item.ID}_voucher`,
          moeda: "Voucher",
          valor: toFloat(item.VALORTOTALVOUCHER),
          valorFormatado: formatMoeda(item.VALORTOTALVOUCHER),
          percentual: calcularPercentual(item.VALORTOTALVOUCHER, totalRecebido) + '%'
        },
        {
          id: `${item.ID}_pos`,
          moeda: "POS",
          valor: toFloat(item.VRPOS),
          valorFormatado: formatMoeda(item.VRPOS),
          percentual: calcularPercentual(item.VRPOS, totalRecebido) + '%'
        },
        {
          id: `${item.ID}_pix`,
          moeda: "PIX",
          valor: toFloat(item.VRPIX),
          valorFormatado: formatMoeda(item.VRPIX),
          percentual: calcularPercentual(item.VRPIX, totalRecebido) + '%'
        },
        {
          id: `${item.ID}_moovpay`,
          moeda: "POS",  // jQuery também usa "POS" para MOOVPAY
          valor: toFloat(item.VRMOOVPAY),
          valorFormatado: formatMoeda(item.VRMOOVPAY),
          percentual: calcularPercentual(item.VRMOOVPAY, totalRecebido) + '%'
        }
      ];

      // Filtra apenas registros com valor > 0
      return tiposPagamento.filter(tipo => tipo.valor > 0).map(tipo => ({
        id: tipo.id,
        moeda: tipo.moeda,
        valor: tipo.valorFormatado,
        percentual: tipo.percentual
      }));
    });

    setDados(flatData);
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
    return percentual.toFixed(2);
  };

  const calcularTotalValores = () => {
    // Calcula apenas o total da ÚLTIMA loja (igual ao jQuery)
    if (dadosListaRecebimentosLoja.length === 0) return 0;
    
    const ultimaLoja = dadosListaRecebimentosLoja[dadosListaRecebimentosLoja.length - 1];
    return calcularTotalValorRecebidoLoja(ultimaLoja);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Recebimentos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Moeda', 'Valor', '% da Venda']],
      body: dados.map(item => [
        item.moeda,
        item.valor,
        item.percentual
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('recebimentos_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
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
          <DataTable
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            paginator={true}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            rows={dados.length}
            rowsPerPageOptions={[10, 20, 50, 100]}
            filterDisplay="menu"
            resizableColumns
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            <Column
              field="moeda"
              header="Moeda"
              sortable={true}
              footer="Total"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            />
            <Column
              field="valor"
              header="Valor"
              sortable={true}
              footer={formatMoeda(calcularTotalValores())}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            />
            <Column
              field="percentual"
              header="% da Venda"
              sortable={true}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            />
          </DataTable>
        </div>
      </div>
    </Fragment>
  );
};