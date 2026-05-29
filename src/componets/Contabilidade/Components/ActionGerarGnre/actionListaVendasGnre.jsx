import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { get } from "../../../../api/funcRequest";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { GrView } from "react-icons/gr";
import { TbFileTypeXml } from "react-icons/tb";
import Swal from "sweetalert2";
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FiSend } from "react-icons/fi";
import { ActionVendasGnreModal } from "./actionModalGnre/actionVendasGnreModal";
import gnre from "../../../../../public/img/icons/marca-gnre.png"
import "./styles.css";

export const ActionListaVendasGnre = ({
  dadosVendasGnre,
  usuarioLogado,
  optionsModulos,
}) => {
  const [dadosDetalheVendas, setDadosDetalheVendas] = useState([]);
  const [rowSelection, setRowSelection] = useState(null);
  const [dadosDetalhePagamento, setDadosDetalhePagamento] = useState([]);
  const [detalheVendaXMLModal, setDetalheVendaXMLModal] = useState(false);
  const [dadosDetalhesVendas, setDadosDetalhesVendas] = useState([]);
  const [modalVendas, setModalVendas] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Contigência',
  });

  const dados = dadosVendasGnre.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      DocEntry: item.DocEntry,
      nNF: item.nNF,
      TaxIdNum: item.TaxIdNum,
      xNomeEmitente: item.xNomeEmitente,
      estadoEmitente: item.estadoEmitente,
      cnpjEmitente: item.cnpjEmitente,
      xLgr: item.xLgr,
      xMun: item.xMun,
      municipioEmitente: item.municipioEmitente,
      CEP: item.CEP,
      fone: item.fone,

      UF: item.UF,
      xNomeDestinatario: item.xNomeDestinatario,
      CPFCNPJDestinatario: item.CPFCNPJDestinatario,
      xMunDestinatario: item.xMunDestinatario,
      municipioDestinatario: item.municipioDestinatario,
      CodItem: item.CodItem,
      Descricao: item.Descricao,
      vProd: item.vProd,
      vNF: item.vNF,
    }

  })

  const exportColumns = [
    { key: 'contador', label: '#' },
    { key: 'DocEntry', label: 'DocEntry' },
    { key: 'xNomeEmitente', label: 'Empresa Emitente' },
    { key: 'estadoEmitente', label: 'Estado' },
    { key: 'cnpjEmitente', label: 'CNPJ' },
    { key: 'xMun', label: 'Município' },
    { key: 'municipioEmitente', label: 'Nº Município' },
    { key: 'CPFCNPJDestinatario', label: 'CPF/CNPJ' },
    { key: 'xNomeDestinatario', label: 'Destinatário' },
    { key: 'xMunDestinatario', label: 'Município' },
    { key: 'municipioDestinatario', label: 'Nº Município' },
    { key: 'vNF', label: 'Valor NF', formatter: (value) => formatMoeda(value) }
  ];

  const rowsToExport = dados.map((item) =>
    exportColumns.map((column) => {
      const rawValue = item[column.key];
      return column.formatter ? column.formatter(rawValue) : rawValue;
    })
  );

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const headerRows = [
      [
        { content: "Dados do Emitente", colSpan: 7, styles: { halign: "center", fillColor: "#7a59ad", textColor: "white", fontSize: 10 } },
        { content: "Dados do Destinatário", colSpan: 5, styles: { halign: "center", fillColor: "#FFDB8E", textColor: "black", fontSize: 10 } },
      ],
      exportColumns.map((column, index) => ({
        content: column.label,
        styles: {
          fillColor: index <= 6 ? '#7a59ad' : '#ffca5b',
          textColor: index <= 6 ? 'white' : 'black',
          fontSize: 9
        }
      }))
    ]

    doc.autoTable({
      head: headerRows,
      body: rowsToExport,
      startY: 8,
      margin: { top: 8, right: 6, bottom: 8, left: 6 },
      theme: "grid",
      tableWidth: 'auto',
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        lineColor: [190, 190, 190],
        lineWidth: 0.2,
        overflow: 'linebreak',
        valign: 'middle'
      },
      headStyles: {
        lineColor: [160, 160, 160],
        lineWidth: 0.25,
        halign: 'center',
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 16 },
        2: { cellWidth: 42 },
        3: { cellWidth: 12, halign: "center" },
        4: { cellWidth: 26 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
        7: { cellWidth: 26 },
        8: { cellWidth: 42 },
        9: { cellWidth: 25 },
        10: { cellWidth: 20 },
        11: { cellWidth: 18, halign: "right" },
      },
    });
    doc.save('vendas_gnre.pdf');
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("GNRE");

    worksheet.getCell('A1').value = "Dados do Emitente";
    worksheet.getCell('A1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7A59AD' } };
    worksheet.mergeCells('A1:G1');

    worksheet.getCell('H1').value = "Dados do Destinatário";
    worksheet.getCell('H1').font = { bold: true, color: { argb: 'FF000000' } };
    worksheet.getCell('H1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('H1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDB8E' } };
    worksheet.mergeCells('H1:L1');

    worksheet.getRow(2).values = exportColumns.map((column) => column.label);
    worksheet.getRow(2).eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
      if (colNumber >= 1 && colNumber <= 7) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7A59AD' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      } else if (colNumber >= 8 && colNumber <= 12) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCA5B' } };
        cell.font = { color: { argb: 'FF000000' }, bold: true };
      }
    });

    rowsToExport.forEach((row) => worksheet.addRow(row));

   
    worksheet.columns.forEach((column) => {
      column.width = 18;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "vendas-gnre.xlsx");

  };


  const headerGrupo = (
    <ColumnGroup>
      <Row>
        <Column
          colSpan="7"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#7a59ad", color: 'white' }}
          headerClassName="grupo-meta-geral"
          header="Dados do Emitente"
          body={(row) => <p style={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#7a59ad", color: 'white' }}>{row.xNomeEmitente}</p>}
        />
        <Column
          colSpan="6"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FFDB8E", color: 'black' }}
          headerClassName="grupo-meta-geral"
          header="Dados do Destinatário"
          body={(row) => <p style={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FFDB8E", color: 'black' }}>{row.xNomeDestinatario}</p>}
        />

      </Row>


      <Row>
        <Column
          field="contador"
          header="#"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="DocEntry"
          header="DocEntry"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="xNomeEmitente"
          header="Empresa Emitente"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="estadoEmitente"
          header="Estado"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="cnpjEmitente"
          header="CNPJ"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="xMun"
          header="Município "
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="municipioEmitente"
          header="Nº Município"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

        <Column
          field="CPFCNPJDestinatario"
          header="CPF/CNPJ"
          sortable={true}
          style={{ color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="xNomeDestinatario"
          header="Destinatário"
          sortable={true}
          style={{ color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="xMunDestinatario"
          header="Município"
          sortable={true}
          style={{ color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="municipioDestinatario"
          header="Nº Município"
          sortable={true}
          style={{ color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="vNF"
          header="Valor NF"
          sortable={true}
          style={{ color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

        <Column
          field="vNF"
          header="Ações"
          sortable={true}
          style={{ color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
      </Row>
    </ColumnGroup>
  )

  const handleEdit = async (DocEntry) => {
    try {
      const response = await get(`/vendas-gnre?docEntry=${DocEntry}`);
      if (response.data && response.data.length > 0) {
        setDadosDetalhesVendas(response.data)
        setModalVendas(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sem Detalhes',
          html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Não foi possível encontrar os detalhes para esta venda.`,
          customClass: {
          }
        })
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickEdit = (row) => {
    if (row && row.DocEntry) {
      handleEdit(row.DocEntry);
    }
  };

  return (

    <Fragment>
      <div className="panel">

        <div className="panel-hdr mb-4">
          <h2>Vendas Para Gerar GNRE</h2>
        </div>

        <div style={{ marginBottom: "1rem" }}>
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
            title="Vendas Para Gerar GNRE"
            value={dados}
            size="small"
            headerColumnGroup={headerGrupo}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode={"single"}
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            <Column field="contador" header="#" body={row => <th style={{ fontSize: '0.8rem' }}>{row.contador}</th>} sortable={true} />
            <Column field="DocEntry" header="DocEntry" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.DocEntry}</th>} sortable={true} />
            <Column field="xNomeEmitente" header="Empresa" body={row => <p style={{ width: '200px', margin: '0px', fontSize: '0.8rem', fontWeight: 600 }}>{row.xNomeEmitente}</p>} sortable={true} />
            <Column field="estadoEmitente" header="Estado" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.estadoEmitente}</th>} sortable={true} />
            <Column field="cnpjEmitente" header="CNPJ" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.cnpjEmitente}</th>} sortable={true} />
            <Column field="xMun" header="Município" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.xMun}</th>} sortable={true} />
            <Column field="municipioEmitente" header="Município Emitente" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.municipioEmitente}</th>} sortable={true} />
            {/* <Column field="CEP" header="CEP" body={row => <th style={{ margin: '0px' }}>{row.CEP}</th>} sortable={true} /> */}

            <Column field="CPFCNPJDestinatario" header="CPF/CNPJ" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.CPFCNPJDestinatario}</th>} sortable={true} />
            <Column field="xNomeDestinatario" header="Destinatário" body={row => <p style={{ width: '200px', margin: '0px', fontSize: '0.8rem', fontWeight: 600 }}>{row.xNomeDestinatario}</p>} sortable={true} />
            <Column field="xMunDestinatario" header="Município" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.xMunDestinatario}</th>} sortable={true} />
            <Column field="municipioDestinatario" header="Nº Município" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.municipioDestinatario}</th>} sortable={true} />
            <Column field="vNF" header="Valor NF" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{formatMoeda(row.vNF)}</th>} sortable={true} />
            <Column header="Ações" body={(row) => (
              <div style={{ justifyContent: "space-between", display: "flex" }}>
                <div className="p-1">
                  <ButtonTable
                    titleButton={"Gerar GNRE"}
                    onClickButton={() => handleClickEdit(row)}
                    Icon={FiSend}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"success"}
                    width="30px"
                    height="30px"
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    titleButton={"Visualizar XML"}
                    onClickButton={() => handleClickEdit(row)}
                    Icon={GrView}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"primary"}
                    width="30px"
                    height="30px"
                  />
                </div>

              </div>
            )}

            />
          </DataTable>
        </div>
      </div>

      <ActionVendasGnreModal
        show={modalVendas}
        handleClose={() => setModalVendas(false)}
        dadosDetalhesVendas={dadosDetalhesVendas}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />

    </Fragment>
  )
}