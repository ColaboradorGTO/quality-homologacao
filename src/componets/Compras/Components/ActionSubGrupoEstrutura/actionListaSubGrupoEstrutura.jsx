import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarEstruturaModal } from "./ActionEditar/actionEditarEstruturaModal";
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";

export const ActionListaSubGrupoEstrutura = ({ dadosSubGrupo, usuarioLogado, optionsModulos, handleClick }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheSubGrupo, setDadosDetalheSubGrupo] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  
  
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'SubGrupo Estruturas',
  });
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Grupo', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DSSUBGRUPOESTRUTURA,
        item.CODGRUPOESTRUTURA,
        item.STATIVO 
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('subGrupo_estruturas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descrição', 'Grupo', 'Situação' ];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 200, caption: 'Grupo' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SubGrupo Estruturas');
    XLSX.writeFile(workbook, 'subGrupo_estruturas.xlsx');
  };

  const dados = dadosSubGrupo.map((item, index) => {
    let contador = index + 1;
 
    return {
      contador,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
      CODGRUPOESTRUTURA: `${item.CODGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`,
      STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      IDSUBGRUPOESTRUTURA: item.IDSUBGRUPOESTRUTURA,  
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
      field: 'DSSUBGRUPOESTRUTURA',
      header: 'Descrição',
      body: row => <th>{row.DSSUBGRUPOESTRUTURA}</th>,
      sortable: true,
    },
    {
      field: 'CODGRUPOESTRUTURA',
      header: 'Grupo',
      body: row => {
        return (
          <th>{row.CODGRUPOESTRUTURA}</th>
        )
      
      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{color: row.STATIVO == 'ATIVO' ? 'blue' : 'red'}} >{row.STATIVO }</th>
        )
      },
      sortable: true,
    },
  
    {
      field: 'IDSUBGRUPOESTRUTURA',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Estrutura Mercadológica"}
              onClickButton={() => clickEditar(row)}
              cor={"primary"}
              Icon={CiEdit}
              iconSize={22}
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
    if(optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para alterar a SubGrupo de Estrutura Mercadológica!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    } else {

      if (row && row.IDSUBGRUPOESTRUTURA) {
        handleEditar(row.IDSUBGRUPOESTRUTURA);
      }
    }
  };

  const handleEditar = async (IDSUBGRUPOESTRUTURA) => {
    try {
      const response = await get(`/subGrupoEstrutura?idSubGrupoEstrutura=${IDSUBGRUPOESTRUTURA}`);
      setDadosDetalheSubGrupo(response.data);
      setModalEditar(true)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
            <h2>Relatórios - Sub Grupos Estruturas</h2>
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
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
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
      <ActionEditarEstruturaModal 
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheSubGrupo={dadosDetalheSubGrupo} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}