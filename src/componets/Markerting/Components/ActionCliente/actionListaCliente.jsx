import React, { Fragment, useRef, useState } from "react"
import { get } from "../../../../api/funcRequest"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable"
import { CiEdit } from "react-icons/ci"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { ActionEditarClienteModal } from "./ActionEditarCliente/actionEditarClienteModal";
import Swal from "sweetalert2";

export const ActionListaCliente = ({ dadosListaCampanhaCliente, optionsModulos, usuarioLogado }) => {
  const [dadosCampanhaCliente, setDadosCampanhaCliente] = useState([])
  const [modalEditarCliente, setModalEditarCliente] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
 

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Campanhas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'CPF', 'Telefone', 'Nome', 'Campanha']],
      body: dados.map(item => [
        item.ID,
        item.NUCPFCNPJ,
        item.NUTELEFONE,
        item.NOME,
        item.DSCAMPANHA,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_campanha.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'CPF', 'Telefone', 'Nome', 'Campanha'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'ID' },
      { wpx: 200, caption: 'CPF' },
      { wpx: 100, caption: 'Telefone' },
      { wpx: 200, caption: 'Nome' },
      { wpx: 100, caption: 'Campanha' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Campanha');
    XLSX.writeFile(workbook, 'lista_campanha.xlsx');
  };


  const dados = dadosListaCampanhaCliente.map((item, index) => {
    return {
      ID: item.ID,
      NUCPFCNPJ: item.NUCPFCNPJ,
      NUTELEFONE: item.NUTELEFONE,
      NOME: item.NOME,
      DSCAMPANHA: item.DSCAMPANHA,

      IDCAMPANHA: item.IDCAMPANHA,
      EBAIRRO: item.EBAIRRO,
      ECIDADE: item.ECIDADE,
      ECOMPLEMENTO: item.ECOMPLEMENTO,
      EEMAIL: item.EEMAIL,
      EENDERECO: item.EENDERECO,
      NUCEP: item.NUCEP,
      NUENDERECO: item.NUENDERECO,
      SGUF: item.SGUF,


    }
  });

  const colunasListaCamapanhaCliente = [
    {
      header: 'ID',
      body: row =><th>{row.ID}</th>,
      sortable: true,
    },
    {
      header: 'CPF',
      body: row => <th>{row.NUCPFCNPJ}</th>,
      sortable: true,
    },
    {
      header: 'Telefone',
      body: row => <th>{row.NUTELEFONE}</th>,
      sortable: true,
    },
    {
      header: 'Nome',
      body: row => <th>{row.NOME}</th>,
      sortable: true,
    },
    {
      header: 'Campanha',
      body: row => <th>{row.DSCAMPANHA}</th>,
      sortable: true,
    },
    {
      header: 'Opções',
      button: true,
      width: '10%',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between" }}
        >
          <div className="p-1">
            <ButtonTable
              titleButton={"Editar"}
              cor={"primary"}
              Icon={CiEdit}
              iconSize={22}
              onClickButton={() => handleClickEdit(row)}
              width="40px"
              height="40px"
              size="small"
              
            />
          </div>
        </div>
      ),
    },
  ]

  const handleClickEdit = async (row) => {
    if(optionsModulos[0]?.ALTERAR == 'True') {
      if (row.ID) {
        handleEdit(row.ID)
      }
    } else {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para editar clientes.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
    }  
  }


  const handleEdit = async (ID) => {
    try {
      const response = await get(`/campanha-cliente?idCampanha=${ID}`)
      if (response.data) {
        setDadosCampanhaCliente(response.data)
        setModalEditarCliente(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }



  return (

    <Fragment>


      <div className="panel">

        <div className="panel-hdr mb-4">
          <h2> Lista de Produtos </h2>
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
            title="Lista de Camapanha Cliente"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
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
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasListaCamapanhaCliente.map(coluna => (
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
      <ActionEditarClienteModal
        show={modalEditarCliente}
        handleClose={() => setModalEditarCliente(false)}
        dadosCampanhaCliente={dadosCampanhaCliente}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment >
  )
}

