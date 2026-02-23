import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarEstilosModal } from "./ActionEditar/actionEditarEstilosModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaEstilos = ({ dadosListaEstilos }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheEstilos, setDadosDetalheEstilos] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Pedidos Periodo',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Grupo Estrutura', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DS_ESTILOS,
        `${item.COD_GRUPOESTILOS} - ${item.DS_GRUPOESTILOS}`,
        item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_estilos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descrição', 'Grupo Estrutura', 'Situação']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Grupo Estrutura' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Periodo');
    XLSX.writeFile(workbook, 'lista_estilos.xlsx');
  };


  const dados = dadosListaEstilos.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      DS_ESTILOS: item.DS_ESTILOS,
      COD_GRUPOESTILOS: `${item.COD_GRUPOESTILOS} - ${item.DS_GRUPOESTILOS}`,
      STATIVO: item.STATIVO,
      ID_ESTILOS: item.ID_ESTILOS,
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
      field: 'DS_ESTILOS',
      header: 'Descrição',
      body: row => <th>{row.DS_ESTILOS}</th>,
      sortable: true,
    },
    {
      field: 'COD_GRUPOESTILOS',
      header: 'Grupo Estrutura',
      body: row => {
        return (
          <th>{row.COD_GRUPOESTILOS}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }} >{row.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'}</th>
        )
      },
      sortable: true,
    },

    {
      field: 'ID_ESTILOS',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Estilo"}
              onClickButton={() => clickEditar(row)}
              cor={"success"}
              Icon={CiEdit}
              iconSize={22}
              iconColor={"#fff"}

            />
          </div>
        )
      },
      sortable: true,
    }
  ]

  const clickEditar = (row) => {
    if (row && row.ID_ESTILOS) {
      handleEditar(row.ID_ESTILOS);
    }
  };

  const handleEditar = async (ID_ESTILOS) => {
    try {
      const response = await get(`/listaEstilos?idEstilo=${ID_ESTILOS}`);
      setDadosDetalheEstilos(response.data);
      setModalEditar(true)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <div className="panel">
      <div className="panel-hdr">
        <h2>Lista de Estilos</h2>
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
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
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
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
      </div>
    </div>
      <ActionEditarEstilosModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheEstilos={dadosDetalheEstilos}
      />
    </Fragment>
  )
}