import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { GrView } from "react-icons/gr";
import { get } from "../../../../api/funcRequest";
import { ActionClienteModal } from "./actionClienteModal";
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";

export const ActionListaCliente = ({ dadosCliente }) => {
  const [modalClienteVisivel, setModalClienteVisivel] = useState(false);
  const [dadosClienteSelecionado, setDadosClienteSelecionado] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small');
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Clientes'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Nome', 'CPF/CNPJ', 'Telefone', 'E-mail', 'Tipo CLiente', 'Status']],
      body: dados.map(item => [
        item.contador,
        item.DSNOMERAZAOSOCIAL,
        item.NUCPFCNPJ,
        item.NUTELCELULAR,
        item.EEMAIL,
        item.TPCLIENTE,
        item.STATIVO == 'True' ? 'Ativo' : 'Inativo'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_cliente.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Nome', 'CPF/CNPJ', 'Telefone', 'E-mail', 'Tipo CLiente', 'Status']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 300, caption: 'Nome' },
      { wpx: 100, caption: 'CPF/CNPJ' },
      { wpx: 100, caption: 'Telefone' },
      { wpx: 250, caption: 'E-mail' },
      { wpx: 100, caption: 'Tipo Cliente' },
      { wpx: 100, caption: 'Status' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Cliente');
    XLSX.writeFile(workbook, 'lista_cliente.xlsx');
  };

  const dados = dadosCliente.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      DSNOMERAZAOSOCIAL: item.DSNOMERAZAOSOCIAL,
      NUCPFCNPJ: item.NUCPFCNPJ,
      NUTELCELULAR: item.NUTELCELULAR,
      EEMAIL: item.EEMAIL,
      TPCLIENTE: item.TPCLIENTE,
      STATIVO: item.STATIVO,
      IDCLIENTE: item.IDCLIENTE,
    }
  });

  const colunasCliente = [
    {
      field: 'contador',
      header: 'Nº ',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSNOMERAZAOSOCIAL',
      header: 'Nome',
      body: row => <th>{row.DSNOMERAZAOSOCIAL}</th>,
      sortable: true,
    },
    {
      field: 'NUCPFCNPJ',
      header: 'CPF/CNPJ',
      body: row => <th>{row.NUCPFCNPJ}</th>,
      sortable: true,
    },
    {
      field: 'NUTELCELULAR',
      header: 'Telefone',
      body: row => <th>{row.NUTELCELULAR}</th>,
      sortable: true,
    },
    {
      field: 'EEMAIL',
      header: 'E-mail',
      body: row => <th>{row.EEMAIL}</th>,
      sortable: true,
    },
    {
      field: 'TPCLIENTE',
      header: 'Tipo Cliente',
      body: row => <th>{row.TPCLIENTE}</th>,
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
      field: '',
      header: 'Detalhar',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="p-1">
              <ButtonTable
                titleButton={"Visualizar Dados do Cliente"}
                onClickButton={() => handleClickDetalhar(row)}
                Icon={GrView}
                iconSize={18}
                iconColor={"#fff"}
                cor={"success"}
                width="30px"
                height="30px"

              />

            </div>
          </div>
        )
      ),
    }

  ]

  const handleDetalhar = async (IDCLIENTE) => {
    try {
      const response = await get(`/lista-cliente?idCliente=${IDCLIENTE}`)
      if (response.data) {
        setDadosClienteSelecionado(response.data)
        setModalClienteVisivel(true)
      }
    } catch (error) {
      console.log('Erro ao buscar detalhes do Cliente: ', error)
    }
  }

  const handleClickDetalhar = (row) => {
    if (row && row.IDCLIENTE) {
      handleDetalhar(row.IDCLIENTE)
    }
  }


  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Clientes</h2>
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
            title="Lista de Clientes"
            value={dados}
            globalFilter={globalFilterValue}
            size={size}
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
            {colunasCliente.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionClienteModal
        show={modalClienteVisivel}
        handleClose={() => setModalClienteVisivel(false)}
        dadosClienteSelecionado={dadosClienteSelecionado}
      />
    </Fragment>
  )
}
