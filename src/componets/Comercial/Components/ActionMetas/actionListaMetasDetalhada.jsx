import { Fragment, useRef, useState } from "react"
import { GrFormView } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { FaBalanceScale } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import HeaderTable from "../../../Tables/headerTable";
import { get } from "../../../../api/funcRequest";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import  "./styles.css";
import { formatMoeda } from "../../../../utils/formatMoeda";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const ActionListaMetasDetalhadas = ({ 
  dadosMetasDetalhadas,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Metas Detalhada',
  });

  const formatPercent = (value) => `${parseFloat(value || 0)}%`;

  const groupHeaders = [
    { title: 'VENDAS / META GERAL', span: 5, fill: '#7a59ad', text: '#FFFFFF' },
    { title: 'CALCADOS', span: 4, fill: '#FFDB8E', text: '#000000' },
    { title: 'SELECAO FEMININA', span: 12, fill: '#FE85BE', text: '#000000' },
    { title: 'SELECAO MASCULINA', span: 12, fill: '#6AB8F7', text: '#000000' },
    { title: 'SELECAO INFANTIL', span: 12, fill: '#4DE5D5', text: '#000000' },
    { title: 'CMB', span: 4, fill: '#7a59ad', text: '#000000' },
    { title: 'OUTROS', span: 2, fill: '#FE85BE', text: '#000000' },
    { title: 'TOTAL', span: 1, fill: '#FFDB8E', text: '#000000' },
  ];

  const exportColumns = [
    { field: 'contador', header: '#', fill: '#7a59ad', text: '#FFFFFF', value: (item) => item.contador },
    { field: 'NOFANTASIA', header: 'EMPRESA', fill: '#7a59ad', text: '#FFFFFF', value: (item) => item.NOFANTASIA },
    { field: 'VRVENDAGERAL', header: 'Venda', fill: '#7a59ad', text: '#FFFFFF', value: (item) => formatMoeda(item.VRVENDAGERAL) },
    { field: 'PERCMETAVENDAGERAL', header: '% Meta', fill: '#7a59ad', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDAGERAL) },
    { field: 'VRMETAVENDAGERAL', header: 'Vr Meta', fill: '#7a59ad', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDAGERAL) },

    { field: 'VRVENDACALCADOS', header: 'Geral', fill: '#FFDB8E', text: '#000000', value: (item) => formatMoeda(item.VRVENDACALCADOS) },
    { field: 'PERCVENDACALCADOS', header: '%', fill: '#FFDB8E', text: '#000000', value: (item) => formatPercent(item.PERCVENDACALCADOS) },
    { field: 'VRMETAVENDACALCADOS', header: 'Vr Meta', fill: '#ffca5b', text: '#000000', value: (item) => formatMoeda(item.VRMETAVENDACALCADOS) },
    { field: 'PERCMETAVENDACALCADOS', header: '%', fill: '#ffca5b', text: '#000000', value: (item) => formatPercent(item.PERCMETAVENDACALCADOS) },

    { field: 'VRVENDAFEMVERINV', header: 'Verao/Inverno', fill: '#FE85BE', text: '#000000', value: (item) => formatMoeda(item.VRVENDAFEMVERINV) },
    { field: 'PERCVENDAFEMVERINV', header: '%', fill: '#FE85BE', text: '#000000', value: (item) => formatPercent(item.PERCVENDAFEMVERINV) },
    { field: 'VRMETAVENDAFEMVERINV', header: 'Vr Meta', fill: '#fd52a3', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDAFEMVERINV) },
    { field: 'PERCMETAVENDAFEMVERINV', header: '*', fill: '#fd52a3', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDAFEMVERINV) },
    { field: 'VRVENDAFEMPCINTIMA', header: 'Peca Intima', fill: '#FE85BE', text: '#000000', value: (item) => formatMoeda(item.VRVENDAFEMPCINTIMA) },
    { field: 'PERCVENDAFEMPCINTIMA', header: '%', fill: '#FE85BE', text: '#000000', value: (item) => formatPercent(item.PERCVENDAFEMPCINTIMA) },
    { field: 'VRMETAVENDAFEMPCINTIMA', header: 'Vr Meta', fill: '#fd52a3', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDAFEMPCINTIMA) },
    { field: 'PERCMETAVENDAFEMPCINTIMA', header: '*', fill: '#fd52a3', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDAFEMPCINTIMA) },
    { field: 'VRVENDAFEMACESSORIOS', header: 'Acessorios', fill: '#FE85BE', text: '#000000', value: (item) => formatMoeda(item.VRVENDAFEMACESSORIOS) },
    { field: 'PERCVENDAFEMACESSORIOS', header: '%', fill: '#FE85BE', text: '#000000', value: (item) => formatPercent(item.PERCVENDAFEMACESSORIOS) },
    { field: 'VRMETAVENDAFEMACESSORIOS', header: 'Vr Meta', fill: '#fd52a3', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDAFEMACESSORIOS) },
    { field: 'PERCMETAVENDAFEMACESSORIOS', header: '*', fill: '#fd52a3', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDAFEMACESSORIOS) },

    { field: 'VRVENDAMASCVERINV', header: 'Verao/Inverno', fill: '#6AB8F7', text: '#000000', value: (item) => formatMoeda(item.VRVENDAMASCVERINV) },
    { field: 'PERCVENDAMASCVERINV', header: '%', fill: '#6AB8F7', text: '#000000', value: (item) => formatPercent(item.PERCVENDAMASCVERINV) },
    { field: 'VRMETAVENDAMASCVERINV', header: 'Vr Meta', fill: '#39A1F4', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDAMASCVERINV) },
    { field: 'PERCMETAVENDAMASCVERINV', header: '%', fill: '#39A1F4', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDAMASCVERINV) },
    { field: 'VRVENDAMASCPCINTIMA', header: 'Peca Intima', fill: '#6AB8F7', text: '#000000', value: (item) => formatMoeda(item.VRVENDAMASCPCINTIMA) },
    { field: 'PERCVENDAMASCPCINTIMA', header: '%', fill: '#6AB8F7', text: '#000000', value: (item) => formatPercent(item.PERCVENDAMASCPCINTIMA) },
    { field: 'VRMETAVENDAMASCPCINTIMA', header: 'Vr Meta', fill: '#39A1F4', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDAMASCPCINTIMA) },
    { field: 'PERCMETAVENDAMASCPCINTIMA', header: '%', fill: '#39A1F4', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDAMASCPCINTIMA) },
    { field: 'VRVENDAMASCACESSORIOS', header: 'Acessorios', fill: '#6AB8F7', text: '#000000', value: (item) => formatMoeda(item.VRVENDAMASCACESSORIOS) },
    { field: 'PERCVENDAMASCACESSORIOS', header: '%', fill: '#6AB8F7', text: '#000000', value: (item) => formatPercent(item.PERCVENDAMASCACESSORIOS) },
    { field: 'VRMETAVENDAMASCACESSORIOS', header: 'Vr Meta', fill: '#39A1F4', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDAMASCACESSORIOS) },
    { field: 'PERCMETAVENDAMASCACESSORIOS', header: '%', fill: '#39A1F4', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDAMASCACESSORIOS) },

    { field: 'VRVENDAINFANTVERINV', header: 'Verao/Inverno', fill: '#4DE5D5', text: '#000000', value: (item) => formatMoeda(item.VRVENDAINFANTVERINV) },
    { field: 'PERCVENDAINFANTVERINV', header: '%', fill: '#4DE5D5', text: '#000000', value: (item) => formatPercent(item.PERCVENDAINFANTVERINV) },
    { field: 'VRMETAVENDAINFANTVERINV', header: 'Vr Meta', fill: '#21DFCB', text: '#000000', value: (item) => formatMoeda(item.VRMETAVENDAINFANTVERINV) },
    { field: 'PERCMETAVENDAINFANTVERINV', header: '%', fill: '#21DFCB', text: '#000000', value: (item) => formatPercent(item.PERCMETAVENDAINFANTVERINV) },
    { field: 'VRVENDAINFANTPCINTIMA', header: 'Peca Intima', fill: '#4DE5D5', text: '#000000', value: (item) => formatMoeda(item.VRVENDAINFANTPCINTIMA) },
    { field: 'PERCVENDAINFANTPCINTIMA', header: '%', fill: '#4DE5D5', text: '#000000', value: (item) => formatPercent(item.PERCVENDAINFANTPCINTIMA) },
    { field: 'VRMETAVENDAINFANTPCINTIMA', header: 'Vr Meta', fill: '#21DFCB', text: '#000000', value: (item) => formatMoeda(item.VRMETAVENDAINFANTPCINTIMA) },
    { field: 'PERCMETAVENDAINFANTPCINTIMA', header: '%', fill: '#21DFCB', text: '#000000', value: (item) => formatPercent(item.PERCMETAVENDAINFANTPCINTIMA) },
    { field: 'VRVENDAINFANTACESSORIOS', header: 'Acessorios', fill: '#4DE5D5', text: '#000000', value: (item) => formatMoeda(item.VRVENDAINFANTACESSORIOS) },
    { field: 'PERCVENDAINFANTACESSORIOS', header: '%', fill: '#4DE5D5', text: '#000000', value: (item) => formatPercent(item.PERCVENDAINFANTACESSORIOS) },
    { field: 'VRMETAVENDAINFANTACESSORIOS', header: 'Vr Meta', fill: '#21DFCB', text: '#000000', value: (item) => formatMoeda(item.VRMETAVENDAINFANTACESSORIOS) },
    { field: 'PERCMETAVENDAINFANTACESSORIOS', header: '%', fill: '#21DFCB', text: '#000000', value: (item) => formatPercent(item.PERCMETAVENDAINFANTACESSORIOS) },

    { field: 'VRVENDACMB', header: 'CMB', fill: '#B19DCE', text: '#000000', value: (item) => formatMoeda(item.VRVENDACMB) },
    { field: 'PERCVENDACMB', header: '%', fill: '#B19DCE', text: '#000000', value: (item) => formatPercent(item.PERCVENDACMB) },
    { field: 'VRMETAVENDACMB', header: 'Vr Meta', fill: '#7a59ad', text: '#FFFFFF', value: (item) => formatMoeda(item.VRMETAVENDACMB) },
    { field: 'PERCMETAVENDACMB', header: '%', fill: '#7a59ad', text: '#FFFFFF', value: (item) => formatPercent(item.PERCMETAVENDACMB) },

    { field: 'VRMETAVENDAOUTROS', header: 'Outros', fill: '#FE85BE', text: '#000000', value: (item) => formatMoeda(item.VRMETAVENDAOUTROS) },
    { field: 'PERCMETAVENDAOUTROS', header: '%', fill: '#FE85BE', text: '#000000', value: (item) => formatPercent(item.PERCMETAVENDAOUTROS) },

    { field: 'PERCTOTALVENDA', header: '%', fill: '#FFCA5B', text: '#000000', value: (item) => formatPercent(item.PERCTOTALVENDA) },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a3' });

    const headerRows = [
      groupHeaders.map((group) => ({
        content: group.title,
        colSpan: group.span,
        styles: {
          halign: 'center',
          valign: 'middle',
          fillColor: group.fill,
          textColor: group.text,
          fontStyle: 'bold',
          fontSize: 8,
        },
      })),
      exportColumns.map((column) => ({
        content: column.header,
        styles: {
          halign: 'center',
          fillColor: column.fill,
          textColor: column.text,
          fontStyle: 'bold',
          fontSize: 7,
        },
      })),
    ];

    const bodyRows = dados.map((item) => exportColumns.map((column) => column.value(item)));

    doc.autoTable({
      head: headerRows,
      body: bodyRows,
      startY: 10,
      theme: "plain",
      styles: { fontSize: 6, cellPadding: 2, lineColor: [210, 210, 210], lineWidth: 0.2 },
      headStyles: { lineColor: [233, 233, 233], lineWidth: 0.2 },
      bodyStyles: { textColor: [33, 37, 41] },
      horizontalPageBreak: true,
      horizontalPageBreakRepeat: [0, 1],
      didParseCell: (data) => {
        if (data.section === 'body') {
          data.cell.styles.halign = data.column.index <= 1 ? 'left' : 'right';
        }
      },
    });

    doc.save("metas_detalhadas.pdf");
  };


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Metas Detalhadas");

    const toArgb = (hex) => `FF${hex.replace('#', '').toUpperCase()}`;

    let start = 1;
    groupHeaders.forEach((group) => {
      const end = start + group.span - 1;
      worksheet.mergeCells(1, start, 1, end);
      const cell = worksheet.getCell(1, start);
      cell.value = group.title;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: toArgb(group.fill) } };
      cell.font = { color: { argb: toArgb(group.text) }, bold: true, size: 10 };
      start = end + 1;
    });

    const headerRow = worksheet.getRow(2);
    headerRow.values = exportColumns.map((column) => column.header);
    headerRow.eachCell((cell, colNumber) => {
      const column = exportColumns[colNumber - 1];
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: toArgb(column.fill) } };
      cell.font = { color: { argb: toArgb(column.text) }, bold: true, size: 9 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE9E9E9' } },
        left: { style: 'thin', color: { argb: 'FFE9E9E9' } },
        bottom: { style: 'thin', color: { argb: 'FFE9E9E9' } },
        right: { style: 'thin', color: { argb: 'FFE9E9E9' } },
      };
    });

    dados.forEach((item) => {
      const row = worksheet.addRow(exportColumns.map((column) => column.value(item)));
      row.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: colNumber <= 2 ? 'left' : 'right', vertical: 'middle' };
      });
    });

    worksheet.columns = exportColumns.map((column, index) => ({
      width: index === 1 ? 30 : 14,
      key: column.field,
    }));

    worksheet.views = [{ state: 'frozen', ySplit: 2 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "metas_detalhadas.xlsx");
  };

  const dados = dadosMetasDetalhadas.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDMETASLOJA: item.IDMETASLOJA,
      DTMETAINICIO: item.DTMETAINICIO,
      DTMETAFIM: item.DTMETAFIM,
      NOFANTASIA: item.NOFANTASIA,
      VRVENDAGERAL: item.VRVENDAGERAL,
      PERCMETAVENDAGERAL: item.PERCMETAVENDAGERAL,
      VRMETAVENDAGERAL: item.VRMETAVENDAGERAL,
      VRVENDACALCADOS: item.VRVENDACALCADOS,
      PERCVENDACALCADOS: item.PERCVENDACALCADOS,
      VRMETAVENDACALCADOS: item.VRMETAVENDACALCADOS,
      PERCMETAVENDACALCADOS: item.PERCMETAVENDACALCADOS,

      VRVENDAFEMVERINV: item.VRVENDAFEMVERINV,
      PERCVENDAFEMVERINV: item.PERCVENDAFEMVERINV,
      VRMETAVENDAFEMVERINV: item.VRMETAVENDAFEMVERINV,
      PERCMETAVENDAFEMVERINV: item.PERCMETAVENDAFEMVERINV,
      VRVENDAFEMPCINTIMA: item.VRVENDAFEMPCINTIMA,
      PERCVENDAFEMPCINTIMA: item.PERCVENDAFEMPCINTIMA,
      VRMETAVENDAFEMPCINTIMA: item.VRMETAVENDAFEMPCINTIMA,
      PERCMETAVENDAFEMPCINTIMA: item.PERCMETAVENDAFEMPCINTIMA,
      VRVENDAFEMACESSORIOS: item.VRVENDAFEMACESSORIOS,
      PERCVENDAFEMACESSORIOS: item.PERCVENDAFEMACESSORIOS,
      VRMETAVENDAFEMACESSORIOS: item.VRMETAVENDAFEMACESSORIOS,
      PERCMETAVENDAFEMACESSORIOS: item.PERCMETAVENDAFEMACESSORIOS,

      VRVENDAMASCVERINV: item.VRVENDAMASCVERINV,
      PERCVENDAMASCVERINV: item.PERCVENDAMASCVERINV,
      VRMETAVENDAMASCVERINV: item.VRMETAVENDAMASCVERINV,
      PERCMETAVENDAMASCVERINV: item.PERCMETAVENDAMASCVERINV,
      VRVENDAMASCPCINTIMA: item.VRVENDAMASCPCINTIMA,
      PERCVENDAMASCPCINTIMA: item.PERCVENDAMASCPCINTIMA,
      VRMETAVENDAMASCPCINTIMA: item.VRMETAVENDAMASCPCINTIMA,
      PERCMETAVENDAMASCPCINTIMA: item.PERCMETAVENDAMASCPCINTIMA,
      VRVENDAMASCACESSORIOS: item.VRVENDAMASCACESSORIOS,
      PERCVENDAMASCACESSORIOS: item.PERCVENDAMASCACESSORIOS,
      VRMETAVENDAMASCACESSORIOS: item.VRMETAVENDAMASCACESSORIOS,
      PERCMETAVENDAMASCACESSORIOS: item.PERCMETAVENDAMASCACESSORIOS,

      VRVENDAINFANTVERINV: item.VRVENDAINFANTVERINV,
      PERCVENDAINFANTVERINV: item.PERCVENDAINFANTVERINV,
      VRMETAVENDAINFANTVERINV: item.VRMETAVENDAINFANTVERINV,
      PERCMETAVENDAINFANTVERINV: item.PERCMETAVENDAINFANTVERINV,
      VRVENDAINFANTPCINTIMA: item.VRVENDAINFANTPCINTIMA,
      PERCVENDAINFANTPCINTIMA: item.PERCVENDAINFANTPCINTIMA,
      VRMETAVENDAINFANTPCINTIMA: item.VRMETAVENDAINFANTPCINTIMA,
      PERCMETAVENDAINFANTPCINTIMA: item.PERCMETAVENDAINFANTPCINTIMA,
      VRVENDAINFANTACESSORIOS: item.VRVENDAINFANTACESSORIOS,
      PERCVENDAINFANTACESSORIOS: item.PERCVENDAINFANTACESSORIOS,
      VRMETAVENDAINFANTACESSORIOS: item.VRMETAVENDAINFANTACESSORIOS,
      PERCMETAVENDAINFANTACESSORIOS: item.PERCMETAVENDAINFANTACESSORIOS,

      VRVENDACMB: item.VRVENDACMB,
      PERCVENDACMB: item.PERCVENDACMB,
      VRMETAVENDACMB: item.VRMETAVENDACMB,
      PERCMETAVENDACMB: item.PERCMETAVENDACMB,

      VRMETAVENDAOUTROS: item.VRMETAVENDAOUTROS,
      PERCMETAVENDAOUTROS: item.PERCMETAVENDAOUTROS,

      PERCTOTALVENDA: item.PERCTOTALVENDA,
      VRTOTALVENDAVESTUARIO: item.VRTOTALVENDAVESTUARIO,
      VRTOTALMETAVESTUARIO: item.VRTOTALMETAVESTUARIO,

      STATIVO: item.STATIVO,
    };
  });



  const headerGrupo = (
    <ColumnGroup  >
      <Row>
        <Column  
          colSpan="5" 
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#7a59ad", color: 'white' }} 
          headerClassName="grupo-meta-geral"
          header="VENDAS / META GERAL" 
        />
        <Column  
          colSpan="4" 
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FFDB8E", color: 'black' }} 
          headerClassName="grupo-meta-geral"
          header="CALÇADOS" 
        />
        <Column  
          colSpan="12"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FE85BE", color: 'black' }}
          headerClassName="grupo-meta-geral" 
          header="SELEÇÃO FEMININA" 
        />
        <Column  
          colSpan="12"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#6AB8F7", color: 'black' }}
          headerClassName="grupo-meta-geral" 
          header="SELEÇÃO MASCULINA" 
        />
        <Column  
          colSpan="12"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#4DE5D5", color: 'black' }}
          headerClassName="grupo-meta-geral" 
          header="SELEÇÃO INFANTIL" 
        />
        <Column  
          colSpan="4"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#7a59ad", color: 'black' }}
          headerClassName="grupo-meta-geral" 
          header="CMB" 
        />
        <Column  
          colSpan="2"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FE85BE", color: 'black' }}
          headerClassName="grupo-meta-geral" 
          header="OUTROS" 
        />
        <Column  
          colSpan="1"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FFDB8E", color: 'black' }}
          headerClassName="grupo-meta-geral" 
          header="TOTAL" 
        />
      </Row>
     

      <Row>
        <Column 
          field="contador" 
          header="#" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}   
        />
        <Column 
          field="NOFANTASIA" 
          header="EMPRESA" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="VRVENDAGERAL" 
          header="Venda" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="PERCMETAVENDAGERAL" 
          header="% Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="VRMETAVENDAGERAL" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        

        <Column 
          field="VRVENDACALCADOS" 
          header="Geral" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FFDB8E", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="PERCVENDACALCADOS" 
          header="%"
          sortable={true}
          style={{color: 'black', backgroundColor: "#FFDB8E", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="VRMETAVENDACALCADOS" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
         <Column 
          field="PERCMETAVENDACALCADOS" 
          header="%"
          sortable={true}
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />

        <Column 
          field="VRVENDAFEMVERINV" 
          header="Verão/Inverno" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />

        <Column 
          field="PERCVENDAFEMVERINV" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="VRMETAVENDAFEMVERINV" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#fd52a3", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="PERCMETAVENDAFEMVERINV" 
          header="*" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#fd52a3", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="VRVENDAFEMPCINTIMA" 
          header="Peça Intima" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="PERCVENDAFEMPCINTIMA" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="VRMETAVENDAFEMPCINTIMA" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#fd52a3", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="PERCMETAVENDAFEMPCINTIMA" 
          header="*" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#fd52a3", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="VRVENDAFEMACESSORIOS" 
          header="Acessórios" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="PERCVENDAFEMACESSORIOS" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
         <Column 
          field="VRMETAVENDAFEMACESSORIOS" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#fd52a3", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="PERCMETAVENDAFEMACESSORIOS" 
          header="*" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#fd52a3", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />


        <Column 
          field="VRVENDAMASCVERINV" 
          header="Verão/Inverno" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#6AB8F7", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCVENDAMASCVERINV" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#6AB8F7", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRMETAVENDAMASCVERINV" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#39A1F4", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDAMASCVERINV" 
          header="%" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#39A1F4", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRVENDAMASCPCINTIMA" 
          header="Peça Intima" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#6AB8F7", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCVENDAMASCPCINTIMA" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#6AB8F7", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRMETAVENDAMASCPCINTIMA" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#39A1F4", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDAMASCPCINTIMA" 
          header="%" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#39A1F4", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRVENDAMASCACESSORIOS" 
          header="Acessórios" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#6AB8F7", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCVENDAMASCACESSORIOS" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#6AB8F7", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRMETAVENDAMASCACESSORIOS" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#39A1F4", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDAMASCACESSORIOS" 
          header="%" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#39A1F4", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />


        <Column 
          field="VRVENDAINFANTVERINV" 
          header="Verão/Inverno" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#4DE5D5", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />

        <Column 
          field="PERCVENDAINFANTVERINV" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#4DE5D5", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRMETAVENDAINFANTVERINV" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#21DFCB", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDAINFANTVERINV" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#21DFCB", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRVENDAINFANTPCINTIMA" 
          header="Peça Intima" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#4DE5D5", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCVENDAINFANTPCINTIMA" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#4DE5D5", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRMETAVENDAINFANTPCINTIMA" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#21DFCB", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDAINFANTPCINTIMA" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#21DFCB", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRVENDAINFANTACESSORIOS" 
          header="Acessórios" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#4DE5D5", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCVENDAINFANTACESSORIOS" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#4DE5D5", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRMETAVENDAINFANTACESSORIOS" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#21DFCB", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDAINFANTACESSORIOS" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#21DFCB", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />


        <Column 
          field="VRVENDACMB" 
          header="CMB" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#B19DCE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCVENDACMB" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#B19DCE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="VRMETAVENDACMB" 
          header="Vr Meta" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDACMB" 
          header="%" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
     
     
        <Column 
          field="VRMETAVENDAOUTROS" 
          header="Outros" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        <Column 
          field="PERCMETAVENDAOUTROS" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
        
        <Column 
          field="PERCTOTALVENDA" 
          header="%" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FFCA5B", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} 
        />
      </Row>
    </ColumnGroup>
  )

  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>{`Lista Metas Detalhadas do Período: ${dados[0]?.DTMETAINICIO} a ${dados[0]?.DTMETAFIM}`}</h2>
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
            title="Lista Metas Resumida do Período"
            value={dados}
            size="small"
            headerColumnGroup={headerGrupo}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={dados.length}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            
            >
              <Column field="contador" header="#" body={row => <th>{row.contador}</th>} sortable={true} />
              <Column field="NOFANTASIA" header="Empresa" body={row => <p style={{fontWeight: 600, width: '250px'}} >{row.NOFANTASIA}</p>} sortable={true} />
              <Column field="VRVENDAGERAL" header="Venda" body={row => <th>{formatMoeda(row.VRVENDAGERAL)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAGERAL" header="% Meta" body={row => <th>{parseFloat(row.PERCMETAVENDAGERAL)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAGERAL" header="Vr Meta" body={row => <th>{formatMoeda(row.VRMETAVENDAGERAL)}</th>} sortable={true} />
             
            
              <Column field="VRVENDACALCADOS" header="Geral" body={row => <th style={{color: '#FFA500'}}>{formatMoeda(row.VRVENDACALCADOS)}</th>} sortable={true} />
              <Column field="PERCVENDACALCADOS" header="%" body={row => <th style={{color: '#FFA500'}}>{parseFloat(row.PERCVENDACALCADOS)}%</th>} sortable={true} />
              <Column field="VRMETAVENDACALCADOS" header="Vr Meta" body={row => <th style={{color: '#FFA500'}}>{formatMoeda(row.VRMETAVENDACALCADOS)}</th>} sortable={true} />
              <Column field="PERCMETAVENDACALCADOS" header="%" body={row => <th style={{color: '#FFA500'}}>{parseFloat(row.PERCMETAVENDACALCADOS)}%</th>} sortable={true} />
             
              <Column field="VRVENDAFEMVERINV" header="Verão/Inverno" body={row => <th style={{color: '#FE85BE'}}>{formatMoeda(row.VRVENDAFEMVERINV)}</th>} sortable={true} />
              <Column field="PERCVENDAFEMVERINV" header="%" body={row => <th style={{color: '#FE85BE'}}>{parseFloat(row.PERCVENDAFEMVERINV)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAFEMVERINV" header="Vr Meta" body={row => <th style={{color: '#FE85BE'}}>{formatMoeda(row.VRMETAVENDAFEMVERINV)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAFEMVERINV" header="%" body={row => <th style={{color: '#FE85BE'}}>{parseFloat(row.PERCMETAVENDAFEMVERINV)}%</th>} sortable={true} />
              <Column field="VRVENDAFEMPCINTIMA" header="Peça Intima" body={row => <th style={{color: '#FE85BE'}}>{formatMoeda(row.VRVENDAFEMPCINTIMA)}</th>} sortable={true} />
              <Column field="PERCVENDAFEMPCINTIMA" header="%" body={row => <th style={{color: '#FE85BE'}}>{parseFloat(row.PERCVENDAFEMPCINTIMA)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAFEMPCINTIMA" header="Vr Meta" body={row => <th style={{color: '#FE85BE'}}>{formatMoeda(row.VRMETAVENDAFEMPCINTIMA)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAFEMPCINTIMA" header="%" body={row => <th style={{color: '#FE85BE'}}>{parseFloat(row.PERCMETAVENDAFEMPCINTIMA)}%</th>} sortable={true} />
              <Column field="VRVENDAFEMACESSORIOS" header="Acessórios" body={row => <th style={{color: '#FE85BE'}}>{formatMoeda(row.VRVENDAFEMACESSORIOS)}</th>} sortable={true} />
              <Column field="PERCVENDAFEMACESSORIOS" header="%" body={row => <th style={{color: '#FE85BE'}}>{parseFloat(row.PERCVENDAFEMACESSORIOS)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAFEMACESSORIOS" header="Vr Meta" body={row => <th style={{color: '#FE85BE'}}>{formatMoeda(row.VRMETAVENDAFEMACESSORIOS)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAFEMACESSORIOS" header="%" body={row => <th style={{color: '#FE85BE'}}>{parseFloat(row.PERCMETAVENDAFEMACESSORIOS)}%</th>} sortable={true} />
           
              <Column field="VRVENDAMASCVERINV" header="Verão/Inverno" body={row => <th style={{color: '#6AB8F7'}}>{formatMoeda(row.VRVENDAMASCVERINV)}</th>} sortable={true} />
              <Column field="PERCVENDAMASCVERINV" header="%" body={row => <th style={{color: '#6AB8F7'}}>{parseFloat(row.PERCVENDAMASCVERINV)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAMASCVERINV" header="Vr Meta" body={row => <th style={{color: '#6AB8F7'}}>{formatMoeda(row.VRMETAVENDAMASCVERINV)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAMASCVERINV" header="%" body={row => <th style={{color: '#6AB8F7'}}>{parseFloat(row.PERCMETAVENDAMASCVERINV)}%</th>} sortable={true} />
              <Column field="VRVENDAMASCPCINTIMA" header="Peça Intima" body={row => <th style={{color: '#6AB8F7'}}>{formatMoeda(row.VRVENDAMASCPCINTIMA)}</th>} sortable={true} />
              <Column field="PERCVENDAMASCPCINTIMA" header="%" body={row => <th style={{color: '#6AB8F7'}}>{parseFloat(row.PERCVENDAMASCPCINTIMA)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAMASCPCINTIMA" header="Vr Meta" body={row => <th style={{color: '#6AB8F7'}}>{formatMoeda(row.VRMETAVENDAMASCPCINTIMA)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAMASCPCINTIMA" header="%" body={row => <th style={{color: '#6AB8F7'}}>{parseFloat(row.PERCMETAVENDAMASCPCINTIMA)}%</th>} sortable={true} />
              <Column field="VRVENDAMASCACESSORIOS" header="Vr Meta" body={row => <th style={{color: '#6AB8F7'}}>{formatMoeda(row.VRVENDAMASCACESSORIOS)}</th>} sortable={true} />
              <Column field="PERCVENDAMASCACESSORIOS" header="%" body={row => <th style={{color: '#6AB8F7'}}>{parseFloat(row.PERCVENDAMASCACESSORIOS)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAMASCACESSORIOS" header="Vr Meta" body={row => <th style={{color: '#39A1F4'}}>{formatMoeda(row.VRMETAVENDAMASCACESSORIOS)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAMASCACESSORIOS" header="%" body={row => <th style={{color: '#39A1F4'}}>{parseFloat(row.PERCMETAVENDAMASCACESSORIOS)}%</th>} sortable={true} />
           
              <Column field="VRVENDAINFANTVERINV" header="Verão/Inverno" body={row => <th style={{color: '#3cb371'}}>{formatMoeda(row.VRVENDAINFANTVERINV)}</th>} sortable={true} />
              <Column field="PERCVENDAINFANTVERINV" header="%" body={row => <th style={{color: '#3cb371'}}>{parseFloat(row.PERCVENDAINFANTVERINV)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAINFANTVERINV" header="Vr Meta" body={row => <th style={{color: '#3cb371'}}>{formatMoeda(row.VRMETAVENDAINFANTVERINV)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAINFANTVERINV" header="%" body={row => <th style={{color: '#3cb371'}}>{parseFloat(row.PERCMETAVENDAINFANTVERINV)}%</th>} sortable={true} />
              <Column field="VRVENDAINFANTPCINTIMA" header="Peça Intima" body={row => <th style={{color: '#3cb371'}}>{formatMoeda(row.VRVENDAINFANTPCINTIMA)}</th>} sortable={true} />
              <Column field="PERCVENDAINFANTPCINTIMA" header="%" body={row => <th style={{color: '#3cb371'}}>{parseFloat(row.PERCVENDAINFANTPCINTIMA)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAINFANTPCINTIMA" header="Vr Meta" body={row => <th style={{color: '#3cb371'}}>{formatMoeda(row.VRMETAVENDAINFANTPCINTIMA)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAINFANTPCINTIMA" header="%" body={row => <th style={{color: '#3cb371'}}>{parseFloat(row.PERCMETAVENDAINFANTPCINTIMA)}%</th>} sortable={true} />
              <Column field="VRVENDAINFANTACESSORIOS" header="Acessórios" body={row => <th style={{color: '#3cb371'}}>{formatMoeda(row.VRVENDAINFANTACESSORIOS)}</th>} sortable={true} />
              <Column field="PERCVENDAINFANTACESSORIOS" header="%" body={row => <th style={{color: '#3cb371'}}>{parseFloat(row.PERCVENDAINFANTACESSORIOS)}%</th>} sortable={true} />
              <Column field="VRMETAVENDAINFANTACESSORIOS" header="Vr Meta" body={row => <th style={{color: '#3cb371'}}>{formatMoeda(row.VRMETAVENDAINFANTACESSORIOS)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAINFANTACESSORIOS" header="%" body={row => <th style={{color: '#3cb371'}}>{parseFloat(row.PERCMETAVENDAINFANTACESSORIOS)}%</th>} sortable={true} />
              
           
              <Column field="VRVENDACMB" header="CMB" body={row => <th style={{color: '#6a5acd'}}>{formatMoeda(row.VRVENDACMB)}</th>} sortable={true} />
              <Column field="PERCVENDACMB" header="%" body={row => <th style={{color: '#6a5acd'}}>{parseFloat(row.PERCVENDACMB)}%</th>} sortable={true} />
              <Column field="VRMETAVENDACMB" header="Vr Meta" body={row => <th style={{color: '#6a5acd'}}>{formatMoeda(row.VRMETAVENDACMB)}</th>} sortable={true} />
              <Column field="PERCMETAVENDACMB" header="%" body={row => <th style={{color: '#6a5acd'}}>{parseFloat(row.PERCMETAVENDACMB)}%</th>} sortable={true} />
           
              <Column field="VRMETAVENDAOUTROS" header="Vr Meta" body={row => <th style={{color: '#FE85BE'}}>{formatMoeda(row.VRMETAVENDAOUTROS)}</th>} sortable={true} />
              <Column field="PERCMETAVENDAOUTROS" header="%" body={row => <th style={{color: '#FE85BE'}}>{parseFloat(row.PERCMETAVENDAOUTROS)}%</th>} sortable={true} />
            
              <Column field="PERCTOTALVENDA" header="%" body={row => <th style={{color: '#FFA500'}}>{parseFloat(row.PERCTOTALVENDA)}%</th>} sortable={true} />
             
            </DataTable>
        </div>
      </div>
    </Fragment>
  )
}