import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarTipoTecidosModal } from "./ActionEditarTecido/actionEditarTipoTecidosModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import Swal from "sweetalert2";

export const ActionListaTipoTecidos = ({ dadosTecidos, usuarioLogado, optionsModulos }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheTipoTecido, setDadosDetalheTipoTecido] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
    
    
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Tipos Tecidos',
  });
    
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DSTIPOTECIDO,
        item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('tipos_tecidos.pdf');
  };
    
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descrição', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tipos Tecidos');
    XLSX.writeFile(workbook, 'tipos_tecidos.xlsx');
  };
  
  const dados = dadosTecidos.map((item, index) => {
    let contador = index + 1;
  
    return {
      contador,
      DSTIPOTECIDO: item.DSTIPOTECIDO,
      STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      IDTPTECIDO: item.IDTPTECIDO,
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
      field: 'DSTIPOTECIDO',
      header: 'Descrição',
      body: row => <th>{row.DSTIPOTECIDO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{color: row.STATIVO == 'ATIVO' ? 'blue' : 'red'}} >{row.STATIVO}</th>
        )
      },
      sortable: true,
    },
  
    {
      field: 'IDTPTECIDO',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Tecidos"}
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
    if(optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDTPTECIDO) {
        handleEditar(row.IDTPTECIDO);
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para editar os Tipos de Tecidos!`,
        timer: 5000,
      })
    }
  };

  const handleEditar = async (IDTPTECIDO) => {
    try {
      const response = await get(`/tipoTecidos?idTecido=${IDTPTECIDO}`);
      if(response.data && response.data.length > 0) {
        setDadosDetalheTipoTecido(response.data);
        setModalEditar(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Detalhes do tipo de tecido não encontrados.',
          timer: 5000,
        })
        return;
      }

    } catch (error) {
      console.error(error);
    }
  }


  return (
    <Fragment>
       <div className="panel">
        <div className="panel-hdr">
          <h2>Lista Tipo de Tecidos</h2>
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
        <div className="card"ref={dataTableRef}>

          <DataTable
            title="Tipos de Tecidos"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
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

      <ActionEditarTipoTecidosModal 
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheTipoTecido={dadosDetalheTipoTecido} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />
    </Fragment>
  )
}