import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarGrupoEstruturaModal } from "./ActionEditar/actionEditarGrupoEstruturaModal";
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";


export const ActionListaGrupoEstrutura = ({ dadosGrupoEstrutura, usuarioLogado, optionsModulos, handleClick }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheGrupo, setDadosDetalheGrupo] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Grupo Estruturas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DSGRUPOESTRUTURA,
        item.STATIVO,

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('grupo_estruturas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descrição', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grupo Estruturas');
    XLSX.writeFile(workbook, 'grupo_estruturas.xlsx');
  };

  const dados = dadosGrupoEstrutura.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      DSGRUPOESTRUTURA: item.DSGRUPOESTRUTURA,
      STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      IDGRUPOESTRUTURA: item.IDGRUPOESTRUTURA,
    }
  })

  const colunasGrupos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSGRUPOESTRUTURA',
      header: 'Descrição',
      body: row => <th>{row.DSGRUPOESTRUTURA}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row.STATIVO == 'ATIVO' ? 'blue' : 'red' }} >{row.STATIVO}</th>
        )
      },
      sortable: true,
    },

    {
      field: 'IDGRUPOESTRUTURA',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Grupo Estrutura"}
              onClickButton={() => clickEditar(row)}
              cor={"primary"}
              Icon={CiEdit}
              iconSize={25}
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
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para editar SubGrupo de Estrutura Mercadológica!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    } else {
      if (row && row.IDGRUPOESTRUTURA) {
        handleEditar(row.IDGRUPOESTRUTURA);
      }
    }
  };

  const handleEditar = async (IDGRUPOESTRUTURA) => {
    try {
      const response = await get(`/grupoEstrutura?idGrupoEstrutura=${IDGRUPOESTRUTURA}`);
      if (response.data && response.data.length > 0) {
        setDadosDetalheGrupo(response.data);
        setModalEditar(true)
      } else {
        Swal.fire({
          title: 'Erro!',
          text: `Não foi possível obter os detalhes do Grupo de Estrutura selecionado.`,
          icon: 'error',
          customClass: {
            container: 'custom-swal',
          },
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Relatórios - Grupos Estruturas Mercadológicas</h2>
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
            title="SubGrupo Estruturas"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasGrupos.map(coluna => (
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

      <ActionEditarGrupoEstruturaModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheGrupo={dadosDetalheGrupo}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}