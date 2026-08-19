import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { GrView } from "react-icons/gr";
import { ActionListaLojaModal } from "./actionListaLojaModal";
import { ActionEditarListasPrecosModal } from "./ActionEditarPreco/actionEditarListasPrecosModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import Swal from "sweetalert2";

export const ActionListaPrecos = ({
  dadosListaPreco,
  usuarioLogado,
  optionsModulos,
  refetchListaPreco
}) => {
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosListaLoja, setDadosListaLoja] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Preço',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Número Lista', 'Nome', 'QTD Lojas', 'Data Criação', 'Data Alteração', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.IDRESUMOLISTAPRECO,
        item.NOMELISTA,
        item.detalheLista,
        item.DATACRIACAO,
        item.DATAALTERACAO,
        item.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_preco.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Número Lista', 'Nome', 'QTD Lojas', 'Data Criação', 'Data Alteração', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Número Lista' },
      { wpx: 300, caption: 'Nome' },
      { wpx: 100, caption: 'QTD Lojas' },
      { wpx: 100, caption: 'Data Criação' },
      { wpx: 100, caption: 'Data Alteração' },
      { wpx: 100, caption: 'Situação' },
  
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Preço');
    XLSX.writeFile(workbook, 'lista_preco.xlsx');
  };

  
  const dados = dadosListaPreco?.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDRESUMOLISTAPRECO: item.listaPreco?.IDRESUMOLISTAPRECO,
      NOMELISTA: item.listaPreco?.NOMELISTA,
      detalheLista: item.detalheLista.length,
      DATACRIACAO: item.listaPreco?.DATACRIACAO,
      DATAALTERACAO: item.listaPreco?.DATAALTERACAO,
      STATIVO: item.listaPreco?.STATIVO == 'True' ? 'ATIVA' : 'INATIVA',
    }
  })

  const colunasListaPreco = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDRESUMOLISTAPRECO',
      header: 'Número Lista',
      body: row => <th>{row.IDRESUMOLISTAPRECO}</th>,
      sortable: true,
    },
    {
      field: 'NOMELISTA',
      header: 'Nome',
      body: row => {
        return (
          <th>{row.NOMELISTA}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'detalheLista',
      header: 'QTD Lojas',
      body: row => <th>{row.detalheLista}</th>,
      sortable: true,
    },
    {
      field: 'DATACRIACAO',
      header: 'Data Criação',
      body: row => <th>{row.DATACRIACAO}</th>,
      sortable: true,
    },
    {
      field: 'DATAALTERACAO',
      header: 'Data Alteração',
      body: row => <th>{row.DATAALTERACAO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{color: row.STATIVO == 'ATIVA' ? 'blue' : 'red'}} >{row.STATIVO}</th>
        )
      },
      sortable: true,
    },
  
    {
      field: 'IDRESUMOLISTAPRECO',
      header: 'Opções',
      body: row => {
        return (
          <div style={{ justifyContent: "space-around", display: "flex" }}>
            <div >
              <ButtonTable
                titleButton={"Visualizar Lojas da Lista"}
                onClickButton={() => clickVisualizar(row)}
                cor={"success"}
                Icon={GrView}
                iconSize={20}
                iconColor={"#fff"}
                width="30px"
                height="30px"
              />
            </div>
            <div>
              <ButtonTable
                titleButton={"Editar Lista de Preço"}
                onClickButton={() => clickEditar(row)}
                cor={"primary"}
                Icon={CiEdit}
                iconSize={20}
                iconColor={"#fff"}
                width="30px"
                height="30px"
              />
            </div>

          </div>
        )
      },
      sortable: true,
    }
  ]

  const clickVisualizar = (row) => {
    if (row && row.IDRESUMOLISTAPRECO) {
      handleVisualizar(row.IDRESUMOLISTAPRECO);
    }
  };

  const handleVisualizar = async (IDRESUMOLISTAPRECO) => {
    try {
      const response = await get(`/lista-de-preco?idLista=${IDRESUMOLISTAPRECO}`);
      if(response.data && response.data.length > 0) {
        setDadosListaLoja(response.data);
        setModalVisualizar(true)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Nenhuma loja encontrada para esta lista de preço.',
          text: 'Esta lista de preço não está associada a nenhuma loja.',
        })
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const clickEditar = (row) => {
    if (row && row.IDRESUMOLISTAPRECO) {
      handleEditar(row.IDRESUMOLISTAPRECO);
    }
  };

  const handleEditar = async (IDRESUMOLISTAPRECO) => {
    if(optionsModulos[0]?.ALTERAR !== 'True') {
      Swal.fire({
        icon: 'error',
        title: 'Acesso Negado',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para editar esta lista de preço.`,
      });
      return;
    }
    try {
      const response = await get(`/lista-de-preco?idLista=${IDRESUMOLISTAPRECO}`);
      if(response.data && response.data.length > 0) {
        setDadosListaLoja(response.data);
        setModalEditar(true)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Nenhuma loja encontrada para esta lista de preço.',
          text: 'Esta lista de preço não está associada a nenhuma loja.',
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
          <h2>Lista de Preços</h2>
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
            title="Lista de Preços"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados?.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasListaPreco.map(coluna => (
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
      
      <ActionListaLojaModal
        show={modalVisualizar}
        handleClose={() => setModalVisualizar(false)}
        dadosListaLoja={dadosListaLoja}
      />

      <ActionEditarListasPrecosModal 
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosListaLoja={dadosListaLoja}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        refetchListaPreco={refetchListaPreco}
      />
    </Fragment>
  )
}