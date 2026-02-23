import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarCoresModal } from "./ActioneditarCores/actionEditarCoresModal";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaCores = ({ dadosCores, usuarioLogado, optionsModulos, refetchListaCores }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheCores, setDadosDetalheCores] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Relatórios de Cores',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Sigla', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DS_COR,
        item.DS_GRUPOCOR,
        item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relatorio_cores.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descrição', 'Sigla', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Sigla' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório de Cores');
    XLSX.writeFile(workbook, 'relatorio_cores.xlsx');
  };

  const dados = dadosCores.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      DS_COR: item.DS_COR,
      DS_GRUPOCOR: item.DS_GRUPOCOR,
      STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      ID_COR: item.ID_COR,
    }
  })

  const colunasCores = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DS_COR',
      header: 'Descrição',
      body: row => <th>{row.DS_COR}</th>,
      sortable: true,
    },
    {
      field: 'DS_GRUPOCOR',
      header: 'Sigla',
      body: row => {
        return (
          <th>{row.DS_GRUPOCOR}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row.STATIVO == 'ATIVO' ? 'blue' : 'red' }} >{row.STATIVO }</th>
        )
      },
      sortable: true,
    },

    {
      field: 'ID_COR',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Cores"}
              onClickButton={() => clickEditar(row)}
              cor={"primary"}
              Icon={CiEdit}
              iconSize={25}
              iconColor={"#fff"}
              width="35px"
              height="35px"
            />
          </div>
        )
      },
      sortable: true,
    }
  ]

  const clickEditar = (row) => {
    if (row && row.ID_COR) {
      handleEditar(row.ID_COR);
    }
  };

  const handleEditar = async (ID_COR) => {
    try {
      const response = await get(`/listaCores?idCor=${ID_COR}`);
      setDadosDetalheCores(response.data);
      setModalEditar(true)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <div className="panel" style={{ marginTop: "4rem" }}>
        <div className="panel-hdr">
          <h2>Relatório de Cores</h2>
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
        <div className="card mb-4" ref={dataTableRef}>

          <DataTable
            title="Relatório de Cores"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 50, 100, 500, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasCores.map(coluna => (
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

      <ActionEditarCoresModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheCores={dadosDetalheCores}
        usuarioLogado={usuarioLogado}
        refetchListaCores={refetchListaCores}
        optionsModulos={optionsModulos}
      />
    </Fragment>
  )
}