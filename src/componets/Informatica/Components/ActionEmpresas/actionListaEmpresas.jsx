import React, { Fragment, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { FaCashRegister } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { get } from "../../../../api/funcRequest";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { InformaticaActionUpdateEmpresaModal } from "./informaticaActionUpdateEmpresaModal";
import { InformaticaActionCertificadoModal } from "./informaticaActionCadastroCertificadoModal";
import { InformaticaActionListCaixa } from "./informaticaActionListaCaixa";
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";


export const ActionListaEmpresas = ({ dadosEmpresas }) => {
  const [modalCertificado, setModalCertificado] = useState(false);
  const [modalEditarEmpresa, setModalEditarEmpresa] = useState(false);
  const [dadosDetalheEmpresas, setDadosDetalheEmpresas] = useState([]);
  const [dadosListaCaixa, setDadosListaCaixa] = useState([]);
  const [dadosAtualizaEmpresa, setDadosAtualizaEmpresa] = useState([]);
  const [actionListaCaixaVisivel, setActionListaCaixaVisivel] = useState(false);
  const [actionPrincipalVisivel, setActionPrincipalVisivel] = useState(true);
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Empresas'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'CNPJ', 'IE', 'Certificado', 'Data Validade' ]],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.NUCNPJ,
        item.NUINSCESTADUAL,
        item.DSNOMEPFX,
        item.DTVALIDADECERTIFICADO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_empresas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'CNPJ', 'IE', 'Certificado', 'Data Validade' ]
    worksheet['!cols'] = [
      { wpx: 70,  caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'CNPJ' },
      { wpx: 100, caption: 'IE' },
      { wpx: 300, caption: 'Certificado' },
      { wpx: 100, caption: 'Data Validade' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Empresas');
    XLSX.writeFile(workbook, 'lista_empresas.xlsx');
  };

  const dados = dadosEmpresas.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      NUCNPJ: item.NUCNPJ,
      NUINSCESTADUAL: item.NUINSCESTADUAL,
      DSNOMEPFX: item.DSNOMEPFX,
      DTVALIDADECERTIFICADO: item.DTVALIDADECERTIFICADO,
      IDEMPRESA: item.IDEMPRESA,
      IDCONFIGURACAO: item.IDCONFIGURACAO,
      DTVALIDADECERTIFICADOFORMATADA: item.DTVALIDADECERTIFICADOFORMATADA,

    };
  });

  const colunasEmpresas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <p style={{ color: 'blue' }} >{row.contador}</p>,
      sortable: true,
      width: "7%"
    },
    {
      field: 'IDEMPRESA',
      header: 'Empresa',
      body: row => <p style={{ color: 'blue' }} >{row.NOFANTASIA}</p>,
      sortable: true,
      minWidth: "250px"
    },
    {
      field: 'NUCNPJ',
      header: 'CNPJ',
      body: row => <p style={{ color: 'blue' }} >{parseFloat(row.NUCNPJ)}</p>,
      sortable: true,
      width: "150px"
    },
    {
      field: 'NUINSCESTADUAL',
      header: 'IE',
      body: row => <p style={{ color: 'blue' }} >{parseFloat(row.NUINSCESTADUAL)}</p>,
      sortable: true,
      width: "150px"
    },
    {
      field: 'IDCONFIGURACAO',
      header: 'Certificado',
      body: row => <p style={{ color: 'blue' }} >{row.DSNOMEPFX}</p>,
      sortable: true,
      minWidth: "330px"
    },
    {
      field: 'DTVALIDADECERTIFICADO',
      header: 'Data Validade',
      body: row => <p style={{ color: 'blue' }} >{dataFormatada(row.DTVALIDADECERTIFICADO)}</p>,
      sortable: true,
    },
    {
      field: 'IDCONFIGURACAO',
      header: 'Opções',
      button: true,
      width: "150px",
      body: (row) => {
        if (row.IDCONFIGURACAO > 0) {
          return (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="p-1">
                <ButtonTable
                  titleButton={"Atualizar Certificado"}
                  onClickButton={() => handleClickEditarEmpresa(row)}
                  Icon={GrCertificate}
                  iconSize={18}
                  iconColor={"#fff"}
                  cor={"success"}

                />

              </div>
              <div className="p-1">
                <ButtonTable
                  titleButton={"Editar Status de Atualização Diaria"}
                  onClickButton={() => handleClickAtualizarEmpresa(row)}
                  Icon={CiEdit}
                  iconSize={18}
                  iconColor={"#fff"}
                  cor={"primary"}
                />

              </div>
              <div className="p-1">
                <ButtonTable
                  titleButton={"Listar Caixas PDV"}
                  onClickButton={() => handleClickCaixa(row)}
                  Icon={FaCashRegister}
                  iconSize={18}
                  iconColor={"#fff"}
                  cor={"warning"}
                />

              </div>

            </div>

          )

        }

      },
    },
  ]

  const handleEditarEmpresa = async (IDEMPRESA) => {
    try {
      const response = await get(`/listaEmpresas?idEmpresa=${IDEMPRESA}`);
      if (response.data) {
        setDadosDetalheEmpresas(response.data);
        setModalCertificado(true);

      }
    } catch (error) {
      console.log(error, 'não foi possível carregar os detalhes da empresa')
    }
  }

  const handleClickEditarEmpresa = (row) => {
    if (row.IDEMPRESA) {
      handleEditarEmpresa(row.IDEMPRESA);
    }
  }
  const handleAtualizarEmpresa = async (IDEMPRESA) => {
    try {
      const response = await get(`/lista-caixas?idEmpresa=${IDEMPRESA}`);
      const responseAtualiza = await get(`/atualiza-empresa-diario?idEmpresa=${IDEMPRESA}`);
      if (response.data && responseAtualiza.data) {
        setDadosListaCaixa(response.data);
        setDadosAtualizaEmpresa(responseAtualiza.data);
        setModalEditarEmpresa(true);
      }
    } catch (error) {
      console.log(error, 'não foi possível carregar os detalhes da empresa')
    }
  }

  const handleClickAtualizarEmpresa = (row) => {
    if (row && row.IDEMPRESA) {
      handleAtualizarEmpresa(row.IDEMPRESA);
    }
  }

  const handleEditarCaixa = async (IDEMPRESA) => {
    try {
      const response = await get(`/lista-caixas?idEmpresa=${IDEMPRESA}`);
      
      if (response.data) {
        setDadosListaCaixa(response.data)
        setActionListaCaixaVisivel(true);
        setTabelaVisivel(false);

      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  const handleClickCaixa = (row) => {
    if (row.IDEMPRESA) {
      handleEditarCaixa(row.IDEMPRESA);
    }
  }

  return (

    <Fragment>
      {tabelaVisivel &&  !actionListaCaixaVisivel && (
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Empresas</h2>
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
            title="Lista de Empresas"
            value={dados}
            globalFilter={globalFilterValue}
            size={size}
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
            {colunasEmpresas.map(coluna => (
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

      )}


      <InformaticaActionUpdateEmpresaModal
        show={modalEditarEmpresa}
        handleClose={() => setModalEditarEmpresa(false)}
        dadosListaCaixa={dadosListaCaixa}
        dadosAtualizaEmpresa={dadosAtualizaEmpresa}
      />

      <InformaticaActionCertificadoModal
        show={modalCertificado}
        handleClose={() => setModalCertificado(false)}
        dadosDetalheEmpresas={dadosDetalheEmpresas}
      />

      {actionListaCaixaVisivel && (
        <InformaticaActionListCaixa
          dadosListaCaixa={dadosListaCaixa}
        />

      )}
    </Fragment>
  )
}
