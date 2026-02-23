import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import Swal from "sweetalert2";
import { BsTrash3 } from "react-icons/bs";
import { formatarDataDTW } from "../../../../utils/dataFormatada";
import { toFloat } from "../../../../utils/toFloat";
import { useEditarDeposito } from "./hooks/useEditarDeposito";


export const ActionListaConciliacaoBancoDTW = ({ dadosConciliarBanco, contaSelecionada, optionsModulos, usuarioLogado, handleClick }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const {
    handleCancelar
  } = useEditarDeposito({ optionsModulos, usuarioLogado, handleClick })

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Conciliação de Depósitos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Loja', 'Conta Crédito', 'Conta Transitória', 'Data Depósito', 'Data Movimento', 'Banco', 'Valor', 'Doc.', 'Status', 'Situação']],
      body: dadosListaConciliarBanco.map(item => [
        item.NOFANTASIA,
        item.CONTACREDITOSAP,
        item.contaTransitoriaSap,
        item.DTDEPOSITO,
        item.DTMOVIMENTOCAIXA,
        item.DSBANCO,
        formatMoeda(item.VRDEPOSITO),
        parseFloat(item.NUDOCDEPOSITO).toFixed(2),
        item.STCANCELADO === 'False' ? 'Dep. Ativo' : 'Dep. Cancelado',
        item.STCONFERIDO === 'True' ? 'Conciliado' : 'Não Conciliado'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('deposito_conciliacao_banco.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Loja', 'Conta Crédito', 'Conta Transitória', 'Data Depósito', 'Data Movimento', 'Banco', 'Valor', 'Doc.', 'Status', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Conta Crédito' },
      { wpx: 100, caption: 'Conta Transitória' },
      { wpx: 150, caption: 'Data Depósito' },
      { wpx: 150, caption: 'Data Movimento' },
      { wpx: 150, caption: 'Banco' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 150, caption: 'Doc' },
      { wpx: 100, caption: 'Status' },
      { wpx: 100, caption: 'Situação' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Conciliação de Depósitos');
    XLSX.writeFile(workbook, 'deposito_conciliacao_banco.xlsx');
  };

  const calcularValorDeposito = () => {
    let total = 0;
    for (let dados of dadosListaConciliarBanco) {
      if (dados.STCANCELADO === 'False') {
        total += parseFloat(dados.VRDEPOSITO)

      }
    }
    return total
  }

  const dadosExcel = dadosConciliarBanco.map((item) => {
    let contaTransitoriaSap = '';


    if (contaSelecionada === 43 || contaSelecionada === 218 || contaSelecionada === 58 || contaSelecionada === 10006 || contaSelecionada === 10018 || contaSelecionada === 10008) {
      contaTransitoriaSap = '1.01.01.01.0003';
    } else if (contaSelecionada === 3) {
      contaTransitoriaSap = '1.01.01.01.0004';
    } else if (contaSelecionada === 10023) {
      contaTransitoriaSap = '4.01.01.09.0004';
    } else if (contaSelecionada === 10) {
      contaTransitoriaSap = '1.01.01.01.0002';
    }

    return {
      NOFANTASIA: item.NOFANTASIA,
      CONTACREDITOSAP: item.CONTACREDITOSAP,
      contaTransitoriaSap,
      DTDEPOSITO: formatarDataDTW(item.DTDEPOSITO),
      DTMOVIMENTOCAIXA: formatarDataDTW(item.DTMOVIMENTOCAIXA),
      DSBANCO: item.DSBANCO,
      VRDEPOSITO: item.VRDEPOSITO,
      NUDOCDEPOSITO: item.NUDOCDEPOSITO,
      STCANCELADO: item.STCANCELADO === 'False' ? 'Dep. Ativo' : 'Dep. Cancelado',
      STCONFERIDO: item.STCONFERIDO === 'True' ? 'Conciliado' : 'Não Conciliado'


    }
  })

  const dadosListaConciliarBanco = dadosConciliarBanco.map((item) => {
    let contaTransitoriaSap = '';

    if (contaSelecionada === 43 || contaSelecionada === 218 || contaSelecionada === 58 || contaSelecionada === 10006 || contaSelecionada === 10018 || contaSelecionada === 10008) {
      contaTransitoriaSap = '1.01.01.01.0003';
    } else if (contaSelecionada === 3) {
      contaTransitoriaSap = '1.01.01.01.0004';
    } else if (contaSelecionada === 10023) {
      contaTransitoriaSap = '4.01.01.09.0004';
    } else if (contaSelecionada === 10) {
      contaTransitoriaSap = '1.01.01.01.0002';
    }

    return {
      NOFANTASIA: item.NOFANTASIA,
      CONTACREDITOSAP: item.CONTACREDITOSAP,
      contaTransitoriaSap,
      DTDEPOSITO: item.DTDEPOSITO,
      DTMOVIMENTOCAIXA: item.DTMOVIMENTOCAIXA,
      DSBANCO: item.DSBANCO,
      VRDEPOSITO: item.VRDEPOSITO,
      NUDOCDEPOSITO: item.NUDOCDEPOSITO,
      STCANCELADO: item.STCANCELADO,
      STCONFERIDO: item.STCONFERIDO,
      IDDEPOSITOLOJA: item.IDDEPOSITOLOJA,
      DTCOMPENSACAO: item.DTCOMPENSACAO,

    }
  })
  
  
  const colunasConciliarBanco = [
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <th style={{ color: '' }}>{row.NOFANTASIA}</th>,
      sortable: true
    },
    {
      field: 'CONTACREDITOSAP',
      header: 'Conta Crédito',
      body: row => <th style={{ color: '' }}>{row.CONTACREDITOSAP}</th>,
      sortable: true
    },
    {
      field: 'contaTransitoriaSap',
      header: 'Conta Transitória',
      body: row => <th style={{ color: '' }}>{row.contaTransitoriaSap}</th>,
      sortable: true
    },
    {
      field: 'DTDEPOSITO',
      header: 'Data Depósito',
      body: row => <th style={{ color: '' }}>{row.DTDEPOSITO}</th>,
      sortable: true
    },
    {
      field: 'DTMOVIMENTOCAIXA',
      header: 'Data Movimento',
      body: row => <th style={{ color: '' }}>{row.DTMOVIMENTOCAIXA}</th>,
      sortable: true
    },
    {
      field: 'DSBANCO',
      header: 'Banco',
      body: row => <th style={{ color: '' }}>{row.DSBANCO}</th>,
      footer: 'Total',
      sortable: true
    },
    {
      field: 'VRDEPOSITO',
      header: 'Valor',
      body: row => <th style={{ color: '' }}>{formatMoeda(row.VRDEPOSITO)}</th>,
      footer: formatMoeda(calcularValorDeposito()),
      sortable: true
    },
    {
      field: 'NUDOCDEPOSITO',
      header: 'Doc.',
      body: row => <th style={{ color: '' }}>{toFloat(row.NUDOCDEPOSITO)}</th>,
      sortable: true
    },
    {
      field: 'STCANCELADO',
      header: 'Status',
      body: row => (
        <th style={{ color: row.STCANCELADO === 'False' ? 'blue' : 'red' }}>
          {row.STCANCELADO === 'False' ? 'Dep. Ativo' : 'Dep. Cancelado'}
        </th>
      ),
    },
    {
      field: 'STCONFERIDO',
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STCONFERIDO === 'True' ? 'green' : 'red' }}>
          {row.STCONFERIDO === 'True' ? 'Conciliado' : 'Não Conciliado'}
        </th>
      ),
    },
    {
      field: 'STCONFERIDO',
      header: 'Opções',
      button: true,

      body: (row) => {
        if (row.STCONFERIDO == 'True') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between" }}
            >
              <div className="p-1">
                <ButtonTable
                  titleButton={"Cancelar Conciliação"}
                  cor={"danger"}
                  Icon={BsTrash3}
                  iconSize={25}
                  width="35px"
                  height="35px"
                  onClickButton={() => handleClickCancelar(row)}
                />
              </div>
            </div>

          )
        }
      },
    },
  ]

  const handleClickCancelar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro!',
        text: 'Você não tem permissão para cancelar a conciliação do depósito!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 4000
      });
      return
    }
    if (row && row.IDDEPOSITOLOJA) {
      handleCancelar(row.IDDEPOSITOLOJA);
    }
  };

  return (

    <Fragment>


      <div className="panel">
        <div className="panel-hdr">
          <h2>
            Lista de Depósitos <span class="fw-300"><i>Por Bancos</i> Pesquisa pela data do Depósito</span>
          </h2>
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
            value={dadosListaConciliarBanco}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosListaConciliarBanco.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasConciliarBanco.map(coluna => (
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
    </Fragment>
  )
}