import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarUnidadeMedidaModal } from "./ActionEditarMedida/actionEditarUnidadeMedidaModal";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";

export const ActionListaUnidadeMedida = ({ dadosUnidadeMedidas, usuarioLogado, optionsModulos, handleClick }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheUnidadeMedida, setDadosDetalheUnidadeMedida] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Unidades de Medidas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Sigla', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DSUNIDADE,
        item.DSSIGLA,
        item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relatorio_unidades_medidas.pdf');
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Uniddades de Medidas');
    XLSX.writeFile(workbook, 'relatorio_unidades_medidas.xlsx');
  };

  const dados = dadosUnidadeMedidas.map((item, index) => {
    let contador = index + 1;
    
    return {
      contador,
      DSUNIDADE: item.DSUNIDADE,
      DSSIGLA: item.DSSIGLA,
      STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      IDUNIDADEMEDIDA: item.IDUNIDADEMEDIDA,
    }
  })

  const colunasUnidadeMedida = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSUNIDADE',
      header: 'Descrição',
      body: row => <th>{row.DSUNIDADE}</th>,
      sortable: true,
    },
    {
      field: 'DSSIGLA',
      header: 'Sigla',
      body: row => {
        return (
          <th>{row.DSSIGLA}</th>
        )

      },
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
      field: 'IDSUBGRUPOESTRUTURA',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Unidade de Medida"}
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
    if (row && row.IDUNIDADEMEDIDA) {
      handleEditar(row.IDUNIDADEMEDIDA);
    }
  };

  const handleEditar = async (IDUNIDADEMEDIDA) => {
    try {
      const response = await get(`/unidades-de-Medidas?idUnidadeMedida=${IDUNIDADEMEDIDA}`);
      if(response.data && response.data.length > 0) {
        setDadosDetalheUnidadeMedida(response.data);
        setModalEditar(true)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível obter os detalhes da Unidade de Medida.',
          customClass:{
            container: 'custom-swal',
          }
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
          <h2>Relatório de Unidades de Medidas</h2>
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
            selectionMode={'single'}
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasUnidadeMedida.map(coluna => (
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

      <ActionEditarUnidadeMedidaModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheUnidadeMedida={dadosDetalheUnidadeMedida}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}