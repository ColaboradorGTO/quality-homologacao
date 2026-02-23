import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { ActionEditarCondicaoPagamentoModal } from "./ActionEditar/editarCondicaoPagamentoModal";
import { get } from "../../../../api/funcRequest";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";

export const ActionListaCondicoesPagamentos = ({ 
  dadosCondicoesPagamentos,
  usuarioLogado,
  optionsModulos,
  handleClick
 }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheCondPagamento, setDadosDetalheCondPagamento] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Condições de Pagamentos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Parcelado', 'QTD Parcelas', '1 Parcela', 'Dias Entre Parcelas', 'Tipo Pagamento', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DSCONDICAOPAG,
        item.STPARCELADO,
        item.NUPARCELAS,
        item.NUNDIA1PAG,
        item.QTDDIAS,
        item.DSTPDOCUMENTO,
        item.STATIVO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('condicoes_pagamentos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descrição', 'Parcelado', 'QTD Parcelas', '1 Parcela', 'Dias Entre Parcelas', 'Tipo Pagamento', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Parcelado' },
      { wpx: 100, caption: 'QTD Parcelas' },
      { wpx: 100, caption: '1 Parcela' },
      { wpx: 100, caption: 'Dias Entre Parcelas' },
      { wpx: 100, caption: 'Tipo Pagamento' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Condições de Pagamentos');
    XLSX.writeFile(workbook, 'condicoes_pagamentos.xlsx');
  };


  const dados = dadosCondicoesPagamentos.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      DSCONDICAOPAG: item.DSCONDICAOPAG,
      STPARCELADO: item.STPARCELADO == 'True' ? 'SIM' : 'NÃO',
      NUPARCELAS: item.NUPARCELAS,
      NUNDIA1PAG: item.NUNDIA1PAG,
      QTDDIAS: item.QTDDIAS,
      DSTPDOCUMENTO: item.DSTPDOCUMENTO,
      STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
      IDCONDICAOPAGAMENTO: item.IDCONDICAOPAGAMENTO,
    }
  })

  const colunasPagamentos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSCONDICAOPAG',
      header: 'Descrição',
      body: row => <th>{row.DSCONDICAOPAG}</th>,
      sortable: true,
    },
    {
      field: 'STPARCELADO',
      header: 'Parcelado',
      body: row => {
        return (
          <th style={{ color: row.STPARCELADO == 'SIM' ? 'blue' : 'red' }}>{row.STPARCELADO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'NUPARCELAS',
      header: 'QTD Parcelas',
      body: row => <th>{row.NUPARCELAS}</th>,
      sortable: true,
    },
    {
      field: 'NUNDIA1PAG',
      header: '1 Parcela',
      body: row => <th>{row.NUNDIA1PAG}</th>,
      sortable: true,
    },
    {
      field: 'QTDDIAS',
      header: 'Dias Entre Parcelas',
      body: row => <th>{row.QTDDIAS}</th>,
      sortable: true,
    },
    {
      field: 'DSTPDOCUMENTO',
      header: 'Tipo Pagamento',
      body: row => <th>{row.DSTPDOCUMENTO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row.STATIVO == 'ATIVO' ? 'blue' : 'red' }}>{row.STATIVO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'IDCONDICAOPAGAMENTO',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Transportador"}
              onClickButton={() => clickEditar(row)}
              cor={"primary"}
              Icon={CiEdit}
              iconSize={25}
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
      if (row && row.IDCONDICAOPAGAMENTO) {
        handleEditar(row.IDCONDICAOPAGAMENTO);
      }
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para editar a Condição de Pagamento!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      })
      return;
    }
  };

  const handleEditar = async (IDCONDICAOPAGAMENTO) => {
    try {
      const response = await get(`/condicaoPagamento?idCondPagamento=${IDCONDICAOPAGAMENTO}`);
      setDadosDetalheCondPagamento(response.data);
      setModalEditar(true)
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <Fragment>
      <div className="panel" style={{ marginTop: "4rem" }}>
        <div className="panel-hdr">
          <h2>Relatório Condições de Pagamentos</h2>
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
            title="Condições de Pagamentos"
            value={dados}
            size="small"
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
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasPagamentos.map(coluna => (
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

      <ActionEditarCondicaoPagamentoModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheCondPagamento={dadosDetalheCondPagamento}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}