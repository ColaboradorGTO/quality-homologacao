import React, { Fragment, useRef, useState } from "react"
import { get, put } from "../../../../api/funcRequest";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";
import { ActionEditarRelatorioBIModal } from "./actionEditar/actionEditarRelatorioBIModal";

export const ActionListaLinkRelatorioBi = ({ dadosBI, handleTabelaVisivel, optionsModulos, usuarioLogado }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [dadosLinkRelatorioBI, setDadosLinkRelatorioBI] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Relatórios BI',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Filial', 'Descrição', 'Status']],
      body: dados.map(item => [
        item.NOFANTASIA,
        item.DSRELATORIOBI,
        item.STATIVO == 'True' ? 'Ativo' : 'Inativo'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_relatorio.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Filial', 'Descrição', 'Status'];
    worksheet['!cols'] = [
      { wpx: 250, caption: 'Filial' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 70, caption: 'Status' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatórios BI');
    XLSX.writeFile(workbook, 'lista_relatorio.xlsx');
  };

  const dados = dadosBI.map((item, index) => {

    return {
      NOFANTASIA: item.NOFANTASIA,
      DSRELATORIOBI: item.DSRELATORIOBI,
      STATIVO: item.STATIVO,
      IDRELATORIOBI: item.IDRELATORIOBI,
    }
  });

  const colunasBI = [

    {
      field: 'NOFANTASIA',
      header: 'Filial',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'DSRELATORIOBI',
      header: 'Relatório ',
      body: row => <th>{row.DSRELATORIOBI}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Status',
      body: (
        (row) => (
          <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }}>
            {row.STATIVO == 'True' ? 'Ativo' : 'Inativo'}
          </th>
        )
      ),
      sortable: true,
    },
    {
      field: 'IDRELATORIOBI',
      header: 'Opções',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="p-1">

              <ButtonTable
                titleButton={"Alterar"}
                onClickButton={() => handleClickDetalhar(row)}
                Icon={CiEdit}
                iconSize={18}
                iconColor={"#fff"}
                cor={"info"}
                width="40px"
                height="40px"
              />

            </div>
          </div>
        )
      ),
    }

  ]

  const handleDetalhar = async (IDRELATORIOBI) => {
    try {
      const response = await get(`/linkRelatorioBI?idRelatorio=${IDRELATORIOBI}`)
      if (response.data) {
        setDadosLinkRelatorioBI(response.data)
        setModalVisivel(true)
      }

    } catch (error) {
      console.log('Erro ao buscar detalhes do Cliente: ', error)
    }
  }

  const handleClickDetalhar = (row) => {
    if (row && row.IDRELATORIOBI) {
      setEmpresaSelecionada(row)
      handleDetalhar(row.IDRELATORIOBI)

    }
  }

  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Relatórios do BI</h2>
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
            title="Relatórios BI"
            value={dados}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[5, 10, 20, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasBI.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}
              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionEditarRelatorioBIModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosLinkRelatorioBI={dadosLinkRelatorioBI}
        empresaSelecionada={empresaSelecionada}
        handleTabelaVisivel={handleTabelaVisivel}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />

    </Fragment>
  )
}
