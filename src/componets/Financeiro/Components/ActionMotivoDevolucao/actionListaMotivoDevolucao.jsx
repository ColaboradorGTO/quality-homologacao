import { Fragment, useRef, useState } from "react"
import { get } from "../../../../api/funcRequest"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable"
import { CiEdit } from "react-icons/ci"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ActionEditarMotivoDevolucaoModal } from "./EditarMotivoDevolucao/actionEditarMotivoDevolucaoModal";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";

export const ActionListaMotivoDevolucao = ({ dadosMotivoDevolucao, optionsModulos, usuarioLogado }) => {
  const [dadosDetalheMotivoDevolucao, setDadosDetalheMotivoDevolucao] = useState([])
  const [modalVisivel, setModalVisivel] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Motivo Devolução'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Motivo', 'Motivo', 'Data Criação', 'Status', 'Data Alteração']],
      body: dadosListaMotivoDevolucao.map(item => [
        item.contador,
        item.IDMOTIVODEVOLUCAO,
        item.DSMOTIVO,
        item.DTCRIACAOFORMATADA,
        item.STATIVO == 'True' ? 'Ativo' : 'Inativo',
        item.DTULTALTERACAOFORMATADA
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('motivo_devolucao.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Motivo', 'Motivo', 'Data Criação', 'Status', 'Data Alteração'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 50, caption: 'ID Motivo' },
      { wpx: 200, caption: 'Motivo' },
      { wpx: 150, caption: 'Data Criação' },
      { wpx: 70, caption: 'Status' },
      { wpx: 150, caption: 'Data Alteração' }


    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Motivo Devolução');
    XLSX.writeFile(workbook, 'motivo_devolucao.xlsx');
  };

  const dadosExcel = dadosMotivoDevolucao.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDMOTIVODEVOLUCAO: item.IDMOTIVODEVOLUCAO,
      DSMOTIVO: item.DSMOTIVO,
      DTCRIACAOFORMATADA: item.DTCRIACAOFORMATADA,
      STATIVO: item.STATIVO == 'True' ? 'Ativo' : 'Inativo',
      DTULTALTERACAOFORMATADA: item.DTULTALTERACAOFORMATADA,
    }
  })

  const dadosListaMotivoDevolucao = dadosMotivoDevolucao.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDMOTIVODEVOLUCAO: item.IDMOTIVODEVOLUCAO,
      DSMOTIVO: item.DSMOTIVO,
      DTCRIACAOFORMATADA: item.DTCRIACAOFORMATADA,
      STATIVO: item.STATIVO == 'True' ? 'Ativo' : 'Inativo',
      DTULTALTERACAOFORMATADA: item.DTULTALTERACAOFORMATADA,
    }
  })

  const colunasMotivoDevolucao = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDMOTIVODEVOLUCAO',
      header: 'ID Motivo',
      body: row => <th>{row.IDMOTIVODEVOLUCAO}</th>,
      sortable: true,
    },
    {
      field: 'DSMOTIVO',
      header: 'Motivo',
      body: row => <th>{row.DSMOTIVO}</th>,
      sortable: true,
    },
    {
      field: 'DTCRIACAOFORMATADA',
      header: 'Data Criação',
      body: row => <th>{row.DTCRIACAOFORMATADA}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Status',
      body: row => <th style={{ color: row.STATIVO == 'Ativo' ? 'blue' : 'red' }}>{row.STATIVO}</th>,
    },
    {
      field: 'DTULTALTERACAOFORMATADA',
      header: 'Data Alteração',
      body: row => <th>{row.DTULTALTERACAOFORMATADA}</th>,
      sortable: true,
    },
    {
      field: 'IDMOTIVODEVOLUCAO',
      header: 'Opções',
      body: (row) => {
        return (
          <div >
            <ButtonTable
              titleButton={"Alterar Motivo de Devolução Desta Linha"}
              onClickButton={() => handleClickEditar(row)}
              Icon={CiEdit}
              iconSize={25}
              width="35px"
              height="30px"
              iconColor={"#fff"}
              cor={"primary"}

            />
          </div>
        )
      },

    }
  ]

  const handleEditar = async (IDMOTIVODEVOLUCAO) => {
    try {
      const response = await get(`/motivo-devolucao?idMotivo=${IDMOTIVODEVOLUCAO}`);
      if (response.data && response.data.length > 0) {
        setDadosDetalheMotivoDevolucao(response.data);
        setModalVisivel(true);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'Detalhes do motivo de devolução não encontrados.',
          customClass: {
            container: 'custom-swal',
          },
          showConfirmButton: false,
          timer: 5000
        })
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  
  const handleClickEditar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {

      if (row && row.IDMOTIVODEVOLUCAO) {
        handleEditar(row.IDMOTIVODEVOLUCAO);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para realizar esta ação.`,
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 5000
      })
    }

  }

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2 style={{ marginTop: '1rem' }}>Motivo de Devolução</h2>

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

            title="Vendas por Loja"
            value={dadosListaMotivoDevolucao}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 30, 50, 100, dadosListaMotivoDevolucao.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasMotivoDevolucao.map(coluna => (
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

      <ActionEditarMotivoDevolucaoModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosDetalheMotivoDevolucao={dadosDetalheMotivoDevolucao}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />

    </Fragment>
  )
}

