import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { ActionUpdateFuncionarioModal } from "./ActionEditarFuncionario/actionUpdateFuncionarioModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaFuncionario = ({
  dadosFuncionarios, 
  dadosEmpresas,
  refetchListaFuncionarios,
  usuarioLogado,
  optionsModulos
}) => {
  const [dadosAtualizarFuncionarios, setDadosAtualizarFuncionarios] = useState([]);
  const [modalAlterarFuncionarioVisivel, setModalAlterarFuncionarioVisivel] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Funcionários',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Funcionário', 'Login', 'Função', 'Tipo', 'Desc %', 'Situação', 'DT Desl.']],
      body: dados.map(item => [
        item.NOFUNCIONARIO,
        item.NOLOGIN,
        item.DSFUNCAO,
        item.DSTIPO,
        item.PERC,
        item.STATIVO,
        item.DTDEMISSAO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_funcionarios.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Funcionário', 'Login', 'Função', 'Tipo', 'Desc %', 'Situação', 'DT Desligamento.'];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'Funcionário' },
      { wpx: 100, caption: 'Login' },
      { wpx: 100, caption: 'Função' },
      { wpx: 200, caption: 'Tipo' },
      { wpx: 100, caption: 'Desc %' },
      { wpx: 100, caption: 'Situação' },
      { wpx: 100, caption: 'DT Desligamento' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Funcionários');
    XLSX.writeFile(workbook, 'lista_funcionarios.xlsx');
  };

  const dados = dadosFuncionarios.map((item, index) => {

    return {
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOLOGIN: item.NOLOGIN,
      DSFUNCAO: item.DSFUNCAO,
      DSTIPO: item.DSTIPO == 'PN' ? 'PARCEIRO DE NEGÓCIOS' : 'FUNCIONÁRIO',
      PERC: item.PERC,
      STATIVO: item.STATIVO == 'True' ? 'Ativo' : 'Inativo',
      DTDEMISSAO: item.DTDEMISSAO,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
    };
  });

  const colunasFuncionarios = [
    {
      field: 'NOFUNCIONARIO',
      header: 'Funcionário',
      body: row => <th>{row.NOFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'NOLOGIN',
      header: 'Login',
      body: row => <th>{row.NOLOGIN}</th>,
      sortable: true,
    },
    {
      field: 'DSFUNCAO',
      header: 'Função',
      body: row => <th>{row.DSFUNCAO}</th>,
      sortable: true,
    },
    {
      field: 'DSTIPO',
      header: 'Tipo',
      body: (row) => (
        <th >
          {row.DSTIPO }
        </th>
      ),
      sortable: true,
    },
    {
      field: 'PERC',
      header: 'Desconto %',
      body: (
        (row) => (
          <th style={{ color: row.PERC == 'False' ? 'red' : 'blue' }}>
            {parseFloat(row.PERC).toFixed(2)}
          </th>
        )
      ),
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (
        (row) => (
          <th style={{ color: row.STATIVO == 'Ativo' ? 'blue' : 'red' }}>
            {row.STATIVO}
          </th>
        )
      ),
      sortable: true,
    },
    {
      field: 'DTDEMISSAO',
      header: 'Data Desligamento',
      body: row => <th>{dataFormatada(row.DTDEMISSAO)}</th>,
      sortable: true,
    },

    {
      field: 'IDFUNCIONARIO',
      header: 'Opções',
      body: (
        (row) => {
          if(row.STATIVO == 'Ativo'){
          return  (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="p-1">
                <ButtonTable
                  titleButton={"Alterar"}
                  onClickButton={() => handleClickEdit(row)}
                  Icon={CiEdit}
                  iconSize={25}
                  iconColor={"#fff"}
                  cor={"success"}
                  width="30px"
                  height="30px"
                />
              </div>
            </div>
          )  
          } else {
            return (
              <div style={{ display: "flex", justifyContent: "space-around" }}>
              </div>
            )
          }
        }
      ),
      sortable: true,
    },

  ]

  const handleEdit = async (IDFUNCIONARIO) => {
    try {
      const response = await get(`/atualizarFuncionario?idFuncionario=${IDFUNCIONARIO}`)
      if (response.data && response.data.length > 0) {
        setDadosAtualizarFuncionarios(response.data)
        setModalAlterarFuncionarioVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do funcionário: ', error);
    }
  };

  const handleClickEdit = (row) => {
    if (row && row.IDFUNCIONARIO) {
      handleEdit(row.IDFUNCIONARIO);
    }
  };

  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Lista de Funcionários</h2>
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
            title="Lista de Funcionários"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
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
            {colunasFuncionarios.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}
              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionUpdateFuncionarioModal
        show={modalAlterarFuncionarioVisivel}
        handleClose={() => setModalAlterarFuncionarioVisivel(false)}
        dadosAtualizarFuncionarios={dadosAtualizarFuncionarios}
        dadosEmpresas={dadosEmpresas}
        refetchListaFuncionarios={refetchListaFuncionarios}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}  
      />
    </Fragment>
  )
}