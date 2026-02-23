import React, { Fragment, useRef, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType"
import { ActionMain } from "../../../Actions/actionMain"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { InformaticaActionUpdateCaixaModal } from "../../informaticaActionUpdateCaixaModal";
import { get } from "../../../../api/funcRequest";
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import { MdAdd } from "react-icons/md";
import { MdOutlineArrowBackIos } from "react-icons/md";


export const InformaticaActionListCaixa = ({dadosListaCaixa}) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [caixaSelecionadoTabela, setCaixaSelecionadoTabela] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Caixa Empresa'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Caixa', 'Descrição', 'Porta', 'Lote NFCe Prod', 'última NFCe Prod', 'Versão PDV', 'Tipo TEF', 'Status']],
      body: dados.map(item => [
        item.IDCAIXAWEB,
        item.DSCAIXA,
        item.DSPORTACOMUNICACAO,
        item.NUSERIEPROD,
        item.NUNFCEPROD,
        item.VERSAO,
        item.TIPOTEF,
        item.STATIVO == 'True' ? 'Ativo' : 'Inativo'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_caixa_empresas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID Caixa', 'Descrição', 'Porta', 'Lote NFCe Prod', 'última NFCe Prod', 'Versão PDV', 'Tipo TEF', 'Status']
    worksheet['!cols'] = [
      { wpx: 70,  caption: 'ID Caixa'},
      { wpx: 200, caption: 'Descrição'},
      { wpx: 70,  caption: 'Porta'},
      { wpx: 70,  caption: 'Lote NFCe Prod'},
      { wpx: 70,  caption: 'última NFCe Prod'},
      { wpx: 70,  caption: 'Versão PDV'},
      { wpx: 70,  caption: 'Tipo TEF'},
      { wpx: 70,  caption: 'Status'}
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Caixa Empresa');
    XLSX.writeFile(workbook, 'lista_caixa_empresas.xlsx');
  };

  const dados = dadosListaCaixa.map((item) => {

    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      DSPORTACOMUNICACAO: item.DSPORTACOMUNICACAO,
      NUSERIEPROD: item.NUSERIEPROD,
      NUNFCEPROD: item.NUNFCEPROD,
      VERSAO: item.VERSAO,
      TIPOTEF: item.TIPOTEF,
      STATIVO: item.STATIVO,
    }
  });

  const colunasCaixa = [

    {
      field: 'IDCAIXAWEB',
      header: 'ID Caixa',
      body: row => <th>{row.IDCAIXAWEB}</th>,
      sortable: true,
    },
    {
      field: 'DSCAIXA',
      header: 'Descrição',
      body: row => <th>{row.DSCAIXA}</th>,
      sortable: true,
    },
    {
      field: 'DSPORTACOMUNICACAO',
      header: 'Porta',
      body: row => <th>{row.DSPORTACOMUNICACAO}</th>,
      sortable: true,
    },
    {
      field: 'NUSERIEPROD',
      header: 'Lote NFCe Prod',
      body: row => <th>{row.NUSERIEPROD}</th>,
      sortable: true,
    },
    {
      field: 'NUNFCEPROD',
      header: 'Última NFCe Prod',
      body: row => <th>{row.NUNFCEPROD}</th>,
      sortable: true,
    },
    {
      field: 'VERSAO',
      header: 'Versão PDV',
      body: row => <th>{row.VERSAO}</th>,
      sortable: true,
    },
    {
      field: 'TIPOTEF',
      header: 'Tipo TEF',
      body: row => <th>{row.TIPOTEF}</th>,
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
      field: 'IDCAIXAWEB',
      header: 'Editar',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="p-1">

              <ButtonTable
                titleButton={"Editar Caixa"}
                onClickButton={() => handleClickDetalhar(row)}
                Icon={CiEdit}
                iconSize={20}
                iconColor={"#fff"}
                cor={"danger"}

              />

            </div>
          </div>
        )
      ),
    }

  ]

  const handleDetalhar = async (IDCAIXAWEB) => {

    try {
      const response = await get(`/lista-caixas?idCaixa=${IDCAIXAWEB}`);
      if (response.data) {
        setCaixaSelecionadoTabela(response.data)
        console.log(response.data, 'dadosBI')
        setModalVisivel(true)
      }
      return response.data;
      
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  const handleClickDetalhar = (row) => {
    if (row.IDCAIXAWEB) {
      handleDetalhar(row.IDCAIXAWEB)
    }
  }

  const showModal = () => {
    setModalVisivel(true)
  }

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Informática"]}
        title="Lista de Caixas Loja"
        subTitle={dadosListaCaixa[0].NOFANTASIA}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Voltar para Empresas"}
        onButtonClickSearch
        corSearch={"primary"}
        IconSearch={MdOutlineArrowBackIos}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Caixa - PDV"}
        onButtonClickCadastro
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />

    <div className="panel">
        <div className="panel-hdr">
          <h2>Lista Caixa Empresas</h2>
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
            value={dados}
            size={size}
            globalFilter={globalFilterValue}
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
            {colunasCaixa.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>
        </div>
      </div>
      <InformaticaActionUpdateCaixaModal 
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosListaCaixa={dadosListaCaixa}
      />
    </Fragment>
  )
}
