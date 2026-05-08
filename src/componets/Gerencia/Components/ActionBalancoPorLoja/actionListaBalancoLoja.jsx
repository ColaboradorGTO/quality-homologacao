import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { GrFormView } from "react-icons/gr";
import { FaBalanceScale, FaBalanceScaleLeft } from "react-icons/fa";
import { FcCurrencyExchange } from "react-icons/fc";
import { FaScaleUnbalanced } from "react-icons/fa6";
import { get } from "../../../../api/funcRequest";
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import { ActionColetorBalancoModal } from "./actionColetorBalancoModal";
import { ActionPreviaBalancoModal } from "./actionPreviaBalancoModal";
import { ActionVisualizarImprimirPrestacaoContas } from "./actionVisualizarImprimirPrestacaoContas";
import Swal from "sweetalert2";


export const ActionListaBalanco = ({dadosListaBalanco, usuarioLogado, optionsModulos, empresaUsada}) => {
  const [modalPreviaBalanco, setModalPreviaBalanco] = useState(false)
  const [dadosPreviaBalancoModal, setDadosPreviaBalancoModal] = useState([])
  const [modalResumoBalanco, setModalResumoBalanco] = useState(false)
  const [dadosResumoBalancoModal, setDadosResumoBalancoModal] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [modalImprimirVisivel, setModalImprimirVisivel] = useState(false);
  const [dadosListaContasBalanco, setDadosListaContasBalanco] = useState([]);
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Balanço',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº Resumo', 'Empresa', 'Data Abertura', 'Data Fechamento', 'Estoque Atual', 'Contagem', 'Diferença', 'Status']],
      body: dados.map(item => [
        item.IDRESUMOBALANCO,
        item.NOFANTASIA,
        dataFormatada(item.DTABERTURA),
        dataFormatada(item.DTFECHAMENTO),
        item.QTDTOTALANTERIOR,
        item.QTDTOTALCONTAGEM,
        item.QTDTOTALCONTAGEM - item.QTDTOTALANTERIOR,
        item.STCONCLUIDO === 'True' ? 'Concluído' : 'Aberto'

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('balanco_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº Resumo', 'Empresa', 'Data Abertura', 'Data Fechamento', 'Estoque Atual', 'Contagem', 'Diferença', 'Status']
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº Resumo' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Data Abertura' },
      { wpx: 100, caption: 'Data Fechamento' },
      { wpx: 100, caption: 'Estoque Atual' },
      { wpx: 100, caption: 'Contagem' },
      { wpx: 100, caption: 'Diferença' },
      { wpx: 100, caption: 'Status' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Balanço');
    XLSX.writeFile(workbook, 'balanco_loja.xlsx');
  };


  const dados = dadosListaBalanco.map((item, index) => {

   
    return {
      IDRESUMOBALANCO: item.IDRESUMOBALANCO,
      NOFANTASIA: item.NOFANTASIA,
      DTABERTURA: item.DTABERTURA,
      DTFECHAMENTO: item.DTFECHAMENTO,
      QTDTOTALANTERIOR: item.QTDTOTALANTERIOR,
      QTDTOTALCONTAGEM: item.QTDTOTALCONTAGEM,
      DIFERENCA: item.QTDTOTALCONTAGEM - item.QTDTOTALANTERIOR,
      STCONCLUIDO: item.STCONCLUIDO,
      IDEMPRESA: item.IDEMPRESA,
    }
  });

  const colunasBalanco = [
    {
      field: 'IDRESUMOBALANCO',
      header: '*',
      body: row => <th>{row.IDRESUMOBALANCO}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{ margin: 0, width: '250px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'DTABERTURA',
      header: 'Data Abertura',
      body: row => <p style={{ margin: 0, width: '150px', fontWeight: 600 }}>{row.DTABERTURA}</p>,
      sortable: true,
    },
    {
      field: 'DTFECHAMENTO',
      header: 'Data Fechamento',
      body: row => <th>{row.DTFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'QTDTOTALANTERIOR',
      header: 'Estoque Atual',
      body: row => <th>{row.QTDTOTALANTERIOR}</th>,
      sortable: true,
    },
    {
      field: 'QTDTOTALCONTAGEM',
      header: 'Contagem',
      body: row => <th>{row.QTDTOTALCONTAGEM}</th>,
      sortable: true,
    },
    {
      field: 'DIFERENCA',
      header: 'Diferença',
      body: row => <th>{row.DIFERENCA}</th>,
      sortable: true,
    },
    {
      field: 'STCONCLUIDO',
      header: 'Status',
      body: row => (
        <th style={{ color: row.STCONCLUIDO === 'True' ? 'blue' : 'red' }}>
          {row.STCONCLUIDO === 'True' ? 'Concluído' : 'Aberto'}
        </th>
      ),
      sortable: true,
    },
    {
      field: 'IDEMPRESA',
      header: 'Opções',
      body: row => (
        <div className="p-1 "
          style={{ justifyContent: "space-between", display: "flex"}}
        >
          <div className="p-1">
            <ButtonTable
              titleButton={"Prévia Balanço Diferença"}
              cor={"primary"}
              Icon={FaBalanceScaleLeft}
              iconSize={25}
              width="35px"
              height="35px"
              onClickButton={() => handleClickPreviaBalancoDiferenca(row)}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Balanço"}
              cor={"success"}
              Icon={GrFormView}
              iconSize={30}
              width="35px"
              height="35px"
              onClickButton={() => handleClickResumoBalanco(row)}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Prévia Balanço"}
              cor={"warning"}
              Icon={FaScaleUnbalanced}
              iconSize={25}
              width="35px"
              height="35px"
              onClickButton={() => handleClickPreviaBalanco(row)}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Prestação de Contas"}
              cor={"danger"}
              Icon={FcCurrencyExchange}
              iconSize={25}
              width="35px"
              height="35px"
              onClickButton={() => handleClickContaBalanco(row)}
            />
          </div>

          <div className="p-1">
            <ButtonTable
              titleButton={"Prévia Balanço Geral"}
              cor={"info"}
              Icon={FaBalanceScale}
              iconSize={25}
              width="35px"
              height="35px"
              onClickButton={() => handleClickPreviaBalancoGeral(row)}
            />
          </div>
          
          
          
        </div>
      ),
      sortable: true,
    },
  ]

  const handleEditPreviaBalancoGeral = async (IDRESUMOBALANCO, IDEMPRESA) => {
    try {
      const response = await get(`/novo-previa-balanco?idResumo=${IDRESUMOBALANCO}&idEmpresa=${IDEMPRESA}&diferenca=0&processa=0`)
      if (response.data) {
        setDadosPreviaBalancoModal(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickPreviaBalancoGeral = async (row) => {
    if(optionsModulos[0]?.ALTERAR ==  'True') {
      if (row.IDRESUMOBALANCO) {
        setModalPreviaBalanco(true)
        handleEditPreviaBalancoGeral(row.IDRESUMOBALANCO, row.IDEMPRESA)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Você não tem permissão para alterar o status de conferência do caixa.',
        confirmButtonColor: '#7352A5',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
    }  
  }

  const handleEditPreviaBalanco = async (IDRESUMOBALANCO, IDEMPRESA) => {  
    try {
      const response = await get(`/novo-previa-balanco?idResumo=${IDRESUMOBALANCO}&idEmpresa=${IDEMPRESA}&diferenca=1&processa=0`)
      if (response.data) {
        setDadosPreviaBalancoModal(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }
  
  const handleClickPreviaBalanco = async (row) => {
    if(optionsModulos[0]?.ALTERAR ==  'True') {
      if (row.IDRESUMOBALANCO) {
        setModalPreviaBalanco(true)
        handleEditPreviaBalanco(row.IDRESUMOBALANCO, row.IDEMPRESA)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Você não tem permissão para alterar o status de conferência do caixa.',
        confirmButtonColor: '#7352A5',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
    }  
  }

  const handleEditPreviaBalancoDiferenca = async (IDRESUMOBALANCO, IDEMPRESA) => {
   
    try {
      const response = await get(`/novo-previa-balanco?idResumo=${IDRESUMOBALANCO}&idEmpresa=${IDEMPRESA}&diferenca=1&processa=0`)
      if (response.data) {
        setDadosPreviaBalancoModal(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
    

  }
  


  const handleClickPreviaBalancoDiferenca = async (row) => {
    if(optionsModulos[0]?.ALTERAR ==  'True') {
      if (row.IDRESUMOBALANCO) {
        setModalPreviaBalanco(true)
        handleEditPreviaBalancoDiferenca(row.IDRESUMOBALANCO, row.IDEMPRESA)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Você não tem permissão para alterar o status de conferência do caixa.',
        confirmButtonColor: '#7352A5',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
    }  
  }

  const handleEditResumoBalanco = async (IDRESUMOBALANCO, IDEMPRESA) => {
    if(usuarioLogado) {
      try {
        const response = await get(`/coletor-balanco?idResumo=${IDRESUMOBALANCO}&idEmpresa=${IDEMPRESA}`)
        if (response && response.data) {
          setDadosResumoBalancoModal(response.data)
        }
        
        return response.data
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }

  }

  const handleClickResumoBalanco = async (row) => {
    if(optionsModulos[0]?.ALTERAR ==  'True') {
      if (row.IDRESUMOBALANCO) {
        setModalResumoBalanco(true)
        handleEditResumoBalanco(row.IDRESUMOBALANCO, row.IDEMPRESA)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Você não tem permissão para alterar o status de conferência do caixa.',
        confirmButtonColor: '#7352A5',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
    }  
  }

  const handleEditContaBalanco = async (IDRESUMOBALANCO) => {
    try {
      const response = await get(`/prestacao-contas-balanco?idResumoBalanco=${IDRESUMOBALANCO}`)
      if(response.data) {
        setDadosListaContasBalanco(response.data)
        setModalImprimirVisivel(true)
      }
    } catch (error) {
      console.log(error, 'não foi possivel pegar os dados da tabela')
    }
  }

  const handleClickContaBalanco = (row) => {
    if(optionsModulos[0]?.ALTERAR ==  'True') {
      if(row.IDRESUMOBALANCO) {
        handleEditContaBalanco(row.IDRESUMOBALANCO)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Você não tem permissão para alterar o status de conferência do caixa.',
        confirmButtonColor: '#7352A5',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
    }  
  }

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Balanço</h2>
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
            title="Lista de Balanço"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
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
            {colunasBalanco.map(coluna => (
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

      <ActionColetorBalancoModal 
        show={modalResumoBalanco}
        handleClose={() => setModalResumoBalanco(false)}
        dadosResumoBalancoModal={dadosResumoBalancoModal}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos} 
      />

      <ActionPreviaBalancoModal 
        show={modalPreviaBalanco}
        handleClose={() => setModalPreviaBalanco(false)}
        dadosPreviaBalancoModal={dadosPreviaBalancoModal}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos} 
      />

      <ActionVisualizarImprimirPrestacaoContas
        show={modalImprimirVisivel}
        handleClose={() => setModalImprimirVisivel(false)}
        dadosListaContasBalanco={dadosListaContasBalanco}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos} 
      />
    </Fragment>
  )
}