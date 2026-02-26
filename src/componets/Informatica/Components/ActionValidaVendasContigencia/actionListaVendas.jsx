import React, { Fragment, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { ActionVendaXMLModal } from "./ActionVendasXML/actionVendaXMLModal";
import { BsFiletypeXml, BsTrash3 } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { FiSend } from "react-icons/fi";
import { FaDownload } from "react-icons/fa6";
import { useConsultarNFCe } from "./hooks/useConsultarNFCe";
import { useConsultarNFe } from "./hooks/useConsultarNfe";
import Swal from "sweetalert2";
import { get } from "../../../../api/funcRequest";
import { ActionConsultaSefazModal } from "./ActionSefaz/actionConsultaSefazModal";


export const ActionListaVendas = ({ dadosVendas, usuarioLogado, optionsModulos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [modal, setModal] = useState(false);
  const [modalNFCe, setModalNFCe] = useState(false);
  const [modalNFe, setModalNFe] = useState(false);
  const [modalConsultaSefaz, setModalConsultaSefaz] = useState(false);
  const [dadosDetalheVendasXML, setDadosDetalheVendasXML] = useState([]);
  const [dadosSefaz, setDadosSefaz] = useState(null);
  const dataTableRef = useRef();
  const { onSubmit } = useConsultarNFCe({dadosDetalheVendasXML, usuarioLogado, optionsModulos }); 
  const { onSubmitNFe } = useConsultarNFe({dadosDetalheVendasXML, usuarioLogado, optionsModulos }); 

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
      head: [['Nº', 'Nº Venda', 'UF Venda', 'Chave']],
      body: dados.map(item => [
        item.contador,
        item.IDVENDA,
        item.UF,
        item.CHAVE,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_vendas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Nº Venda', 'UF Venda', 'Chave']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 200, caption: 'Nº Venda' },
      { wpx: 100, caption: 'UF Venda' },
      { wpx: 100, caption: 'Chave' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Vendas');
    XLSX.writeFile(workbook, 'lista_vendas.xlsx');
  };

  const dados = dadosVendas.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDVENDA: item.IDVENDA,
      UF: item.UF,
      CHAVE: item.CHAVE,
      CSTAT: item.CSTAT,
      XML: item.XML
    };
  });

  const colunas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <p style={{ color: 'blue' }} >{row.contador}</p>,
      sortable: true,
      width: "7%"
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <th style={{ color: 'blue' }} >{row.IDVENDA}</th>,
      sortable: true,
      minWidth: "250px"
    },
    {
      field: 'UF',
      header: 'UF VENDA',
      body: row => <th style={{ color: 'blue' }} >{row.UF}</th>,
      sortable: true,
      width: "150px"
    },
    {
      field: 'CHAVE',
      header: 'Chave',
      body: row => <th style={{ color: 'blue' }} >{row.CHAVE}</th>,
      sortable: true,
      width: "150px"
    },
    {
      field: 'CSTAT',
      header: 'CStat',
      body: row => <th style={{ color: 'blue' }} >{row.CSTAT}</th>,
      sortable: true,
      width: "150px"
    },
    {
      header: 'Opções',
      body: (row) => (
        <div style={{ justifyContent: "space-between", display: "flex" }}>

          <div className="p-1">
            <ButtonTable
              onClickButton={() => clickDetalharVendaXML(row)}
              titleButton={"Visualizar XML"}
              Icon={GrView}
              iconSize={20}
              iconColor={"#fff"}
              cor={"primary"}
              width="40px"
              height="40px"

            />
          </div>
          {/* <div className="p-1">
            <ButtonTable
              onClickButton={() => clickDetalharVendaXML(row)}
              titleButton={"XML"}
              Icon={BsFiletypeXml}
              iconSize={20}
              iconColor={"#fff"}
              cor={"info"}
              width="40px"
              height="40px"

            />
          </div> */}
          {/* <div className="p-1">
            <ButtonTable
              onClickButton={() => clickDetalharVendaXML(row)}
              titleButton={"Inutilizar XML"}
              // textButton={"Inutilizar"}
              Icon={BsTrash3}
              iconSize={20}
              iconColor={"#fff"}
              cor={"danger"}
              width="40px"
              height="40px"

            />
          </div>
          <div className="p-1">
            <ButtonTable
              onClickButton={() => clickDetalharVendaXML(row)}
              titleButton={"Download XML"}
              // textButton={"Download"}
              Icon={FaDownload}
              iconSize={20}
              iconColor={"#fff"}
              cor={"warning"}
              width="40px"
              height="40px"

            />
          </div>
          <div className="p-1">
            <ButtonTable
              onClickButton={() => clickDetalharVendaXML(row)}
              titleButton={"Enviar Sefaz"}
              // textButton={"Enviar"}
              Icon={FiSend}
              iconSize={20}
              iconColor={"#fff"}
              cor={"success"}
              width="40px"
              height="40px"

            />
          </div>
          <div className="p-1">
            <ButtonTable
              onClickButton={() => clickDetalharVendaXML(row)}
              titleButton={"Cancelar Sefaz"}
              // textButton={"Cancelar"}
              Icon={MdClose}
              iconSize={20}
              iconColor={"#fff"}
              cor={"danger"}
              width="40px"
              height="40px"

            />
          </div> */}

        </div>
      ),
    }
  ]

  const clickDetalharVendaXML = (row) => {
    if (row && row.IDVENDA && row.XML) {
      setModal(true);
      setDadosDetalheVendasXML(row)
    }
  };

  const handleDetalheSefaz = async (IDVENDA) => {
    try {
      const response = await get(`/status-sefaz?idVenda=${IDVENDA}`)
      
      if (response.data && response.data.length > 0) {
        setDadosSefaz(response.data);
        setModalConsultaSefaz(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Nenhum dado encontrado',
          text: 'Não foram encontrados dados de consulta para esta venda.',
          customClass: {
            container: 'custom-swal',
          }
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClick = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDVENDA) {
        handleDetalheSefaz(row.IDVENDA);
      }
    } else {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Você não tem permissão para acessar esta funcionalidade.',
        icon: 'warning',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };

  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Vendas Contigência</h2>
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
            size={'small'}
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
            {colunas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem', border: '1px solid #e9e9e9' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionVendaXMLModal
        show={modal}
        handleClose={() => setModal(false)}
        dadosDetalheVendasXML={dadosDetalheVendasXML}
      />

      <ActionConsultaSefazModal
        show={modalConsultaSefaz}
        handleClose={() => setModalConsultaSefaz(false)}
        dadosSefaz={dadosSefaz}
      />
    </Fragment>
  )
}
