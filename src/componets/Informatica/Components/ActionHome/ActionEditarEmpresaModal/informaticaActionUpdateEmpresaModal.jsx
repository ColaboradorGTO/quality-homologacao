import React, { Fragment, useEffect, useState, useRef } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import Formulario from "./formulario";


export const InformaticaActionUpdateEmpresaModal = ({ show, handleClose, dadosListaCaixa, dadosAtualizaEmpresa, usuarioLogado }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [caixaListaAtualiza, setCaixaListaAtualiza] = useState([]);
  const [caixaListaLimpar, setCaixaListaLimpar] = useState([]);
  const dataTableRef = useRef();

  const handleCheckboxChange = (id, tipo) => {
    if (tipo === 'atualizar') {
      setCaixaListaAtualiza(prevState => {
        const item = `A${id}`;
        return prevState.includes(item) ? prevState.filter(i => i !== item) : [...prevState, item];
      });
    } else if (tipo === 'limpar') {
      setCaixaListaLimpar(prevState => {
        const item = `L${id}`;
        return prevState.includes(item) ? prevState.filter(i => i !== item) : [...prevState, item];
      });
    }
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Empresas'
  });


  const dados = dadosListaCaixa.map((item, index) => {
    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      NOFANTASIA: item.NOFANTASIA,
    }
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Caixa']],
      body: dados.map(item => [
        item.IDCAIXAWEB,
        item.DSCAIXA,
        item.NOFANTASIA,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_caixas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Caixa']
    worksheet['!cols'] = [
      { wpx: 100, caption: 'ID' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 250, caption: 'Empresa' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Caixas');
    XLSX.writeFile(workbook, 'lista_caixas.xlsx');
  };

  const colunasCaixa = [
    {
      field: 'IDCAIXAWEB',
      header: 'ID',
      key: 'id',
      body: row => <th>{row.IDCAIXAWEB}</th>,
      sortable: true,

    },
    {
      field: 'DSCAIXA',
      header: 'CAIXA',
      body: row => <th>{row.DSCAIXA}</th>,
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Atualizar',
      key: 'atualizar',
      body: (row) => {
        return (
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              //id={row.IDCAIXAWEB}
              //checked={caixaListaAtualiza.includes(row.IDCAIXAWEB)}
              id={`atualizar-${row.IDCAIXAWEB}`}
              checked={caixaListaAtualiza.includes(`A${row.IDCAIXAWEB}`)}
              onChange={() => handleCheckboxChange(row.IDCAIXAWEB, 'atualizar')}
            />
          </div>
        )
      },
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Limpar e Atualizar',
      body: (row) => {
        return (
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              //id={row.IDCAIXAWEB}
              //checked={caixaListaLimpar.includes(row.IDCAIXAWEB)}
              id={`limpar-${row.IDCAIXAWEB}`}
              checked={caixaListaLimpar.includes(`L${row.IDCAIXAWEB}`)}
              onChange={() => handleCheckboxChange(row.IDCAIXAWEB, 'limpar')}

            />
          </div>
        )
      },
      sortable: true,
    },

  ]

  const atualizacaoDiario = [
    { value: "True", label: "SIM" },
    { value: "False", label: "NÃO" }
  ]
  const status = [
    { value: "True", label: "Aberta" },
    { value: "False", label: "Fechada" }
  ]


  return (
    <Fragment>


      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Dados de Empresa"}
          subTitle={"Atualização Diária dos PDVs da Empresa"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <Formulario
            dadosListaCaixa={dadosListaCaixa}
            globalFilterValue={globalFilterValue}
            setGlobalFilterValue={setGlobalFilterValue}
            caixaListaAtualiza={caixaListaAtualiza}
            setCaixaListaAtualiza={setCaixaListaAtualiza}
            caixaListaLimpar={caixaListaLimpar}
            status={status}
            atualizacaoDiario={atualizacaoDiario}
            handleClose={handleClose}
            dadosAtualizaEmpresa={dadosAtualizaEmpresa}
            usuarioLogado={usuarioLogado}
          />

          <div className="panel" style={{ marginTop: "4rem", marginBottom: "1rem" }}>
            <div className="panel-hdr">
              <h2> Caixas </h2>
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
                sortOrder={-1}
                rows={true}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                filterDisplay="menu"
                showGridlines
                cellMemo={false}
                stripedRows
              >
                {colunasCaixa.map(coluna => (
                  <Column
                    //key={`${coluna.field}-${index}`}
                    key={coluna.field}
                    field={coluna.field}
                    header={coluna.header}
                    body={coluna.body}
                    footer={coluna.footer}
                    sortable={coluna.sortable}
                    headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
                    footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                    bodyStyle={{ fontSize: '0.8rem', border: '1px solid #e9e9e9' }}
                  />
                ))}
              </DataTable>

            </div>
          </div>


        </Modal.Body>

      </Modal>
    </Fragment>
  )
}                      
