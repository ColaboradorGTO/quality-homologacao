import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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

export const ActionListaAssistentes = ({ 
  dadosAssistentes,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Premiação Assistentes',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();

    const headerRows = [
      [
        { content: "CLASSIFICAÇÃO", styles: { halign: "center", fillColor: "#967BBD", textColor: "white", fontSize: 10 } },
        { content: "SENIOR/PLENO/JUNIOR", colSpan: 3, styles: { halign: "center", fillColor: "#FFCA5B", textColor: "black", fontSize: 10 } },
      ],
      [
        { content: "INDICADORES", styles: { fillColor: "#B19DCE", textColor: "black", fontSize: 9 } },
        { content: "BÔNUS", styles: { fillColor: "#FFDB8E", textColor: "black", fontSize: 9 } },
        { content: "APURAÇÃO", styles: { fillColor: "#FE85BE", textColor: "white", fontSize: 9 } },
        { content: "BÔNUS", styles: { fillColor: "#6AB8F7", textColor: "white", fontSize: 9 } },
      ],
    ];

    const bodyRows = dados.map((item) => [
      item.NOINDICADOR,
      item.VRBONUSSENIOR,
      formatMoeda(item.VRBONUSPLENO),
      formatMoeda(item.VRBONUSJUNIOR),
    ]);

    doc.autoTable({
      head: headerRows,
      body: bodyRows,
      startY: 10,
      theme: "plain",
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "left" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    });

    doc.save("premiacao_assistentes.pdf");
  };


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Assistentes");

    // Cabeçalho agrupado igual ao DataTable
    worksheet.getCell("A1").value = "CLASSIFICAÇÃO";
    worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF967BBD" } };
    worksheet.getCell("A1").font = { color: { argb: "FFFFFF" }, bold: true };

    worksheet.mergeCells("B1:D1");
    worksheet.getCell("B1").value = "SENIOR/PLENO/JUNIOR";
    worksheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("B1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFCA5B" } };
    worksheet.getCell("B1").font = { color: { argb: "000000" }, bold: true };

    // Segunda linha de cabeçalho
    worksheet.getRow(2).values = [
      "INDICADORES", "BÔNUS", "APURAÇÃO", "BÔNUS"
    ];
    worksheet.getRow(2).eachCell((cell, colNumber) => {
      cell.alignment = { horizontal: "center" };
      cell.font = { bold: true };
      if (colNumber === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB19DCE" } };
        cell.font = { color: { argb: "000000" }, bold: true };
      } else if (colNumber === 2) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDB8E" } };
        cell.font = { color: { argb: "000000" }, bold: true };
      } else if (colNumber === 3) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFE85BE" } };
        cell.font = { color: { argb: "FFFFFF" }, bold: true };
      } else {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6AB8F7" } };
        cell.font = { color: { argb: "FFFFFF" }, bold: true };
      }
    });

    // Dados
    dados.forEach((item) => {
      worksheet.addRow([
        item.NOINDICADOR,
        item.VRBONUSSENIOR,
        formatMoeda(item.VRBONUSPLENO),
        formatMoeda(item.VRBONUSJUNIOR)
      ]);
    });

    // Ajuste de largura das colunas
    worksheet.columns.forEach((col) => {
      col.width = 18;
    });


    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "premiacao_assistentes.xlsx");
  };
 
  const dados = dadosAssistentes?.data?.map((item, index) => {
    let contador = index + 1;

    return {
      NOINDICADOR: item.NOINDICADOR,
      VRBONUSSENIOR: item.VRBONUSSENIOR,
      VRBONUSPLENO: item.VRBONUSPLENO,
      VRBONUSJUNIOR: item.VRBONUSJUNIOR,
    };
  });

  const headerGrupo = (
    <ColumnGroup  >
      <Row>
        <Column  
          colSpan="1" 
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#967BBD", color: 'white' }} 
          headerClassName="grupo-meta-geral"
          header="CLASSIFICAÇÃO" 
        />

        <Column  
          colSpan="2" 
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FFCA5B", color: 'black' }} 
          headerClassName="grupo-meta-geral"
          header="SENIOR/PLENO/JUNIOR"             
        />

      </Row>
     

      <Row>
        <Column 
          field="NOINDICADOR" 
          header="INDICADORES" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#B19DCE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}   
        />
        <Column 
          field="VRBONUSSENIOR" 
          header="BÔNUS" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#FFDB8E", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="VRBONUSPLENO" 
          header="APURAÇÃO" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#FE85BE", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
      </Row>

    </ColumnGroup>
  )
  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          {/* <h2>{`REGRAS PREMIAÇÕES: ${dadosAssistentes?.dsSubGrupo} - ${dadosAssistentes?.dataPesquisaInicio} a ${dadosAssistentes?.dataPesquisaFim}`}</h2> */}
          <h2>{`ASSISTENTES`}</h2>
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
            title="Lista de Premiações - Vendedor"
            value={dados}
            size="small"
            headerColumnGroup={headerGrupo}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={dados?.length}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, dados?.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            
            >
              <Column field="NOINDICADOR" header="INDICADORES" body={row => <th>{row.NOINDICADOR}</th>} sortable={true} />
              <Column field="VRBONUSSENIOR" header="BÔNUS" body={row => <th>{row.VRBONUSSENIOR}</th>} sortable={true} />
              <Column field="VRBONUSPLENO" header="BÔNUS" body={row => <th>{formatMoeda(row.VRBONUSPLENO)}</th>} sortable={true} />
              <Column field="VRBONUSJUNIOR" header="BÔNUS" body={row => <th>{formatMoeda(row.VRBONUSJUNIOR)}</th>} sortable={true} />
              
            </DataTable>
        </div>
      </div>
    </Fragment>
  )
}