import React, { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { get } from "../../../../api/funcRequest";
import { toFloat } from "../../../../utils/toFloat";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";
import Swal from "sweetalert2";
import { GoDownload } from "react-icons/go";
import { GrView } from "react-icons/gr";
import { useEnviarMalote } from "./hooks/useEnviarMalote";
import { ActionDetalheMaloteModal } from "./ActionDetalheMalote/actionDetalheMaloteModal";
import { FaUpload } from "react-icons/fa";


export const ActionListaConferenciaMalotes = ({ dadosMalotes, handleClick, usuarioLogado, optionsModulos, refetch }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [salvarDadosMalotes, setSalvarDadosMalotes] = useState([]);
  const [dadosDetalhesMalote, setDadosDetalhesMalote] = useState([]);
  const [dadosPendenciasMalotes, setDadosPendenciasMalotes] = useState([]);
  const [modalDetalhe, setModalDetalhe] = useState(false);
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
  const {
    onSalvarMalote
  } = useEnviarMalote({ salvarDadosMalotes, handleClick, usuarioLogado, optionsModulos, refetch });

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Movimento dos Caixas',
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimento dos Caixas');
    XLSX.writeFile(workbook, 'conferencia_caixa.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.autoTable({
      head: [['Nº', 'Caixa', 'Fechamento', 'Operador', 'Venda Dinheiro', 'Dineiro Informado', 'Recebido Fatura', 'Quebra Sistema', 'Situação', 'Conferido']],
      body: dados.map(item => [
        item.contador,
        item.DSCAIXAFECHAMENTO,
        item.DTABERTURA,
        item.OPERADORFECHAMENTO,
        formatMoeda(item.TOTALFECHAMENTODINHEIROFISICO),
        formatMoeda(item.TOTALFECHAMENTODINHEIRO),
        formatMoeda(item.TOTALAJUSTEFATURA),
        formatM(item.vrFechamentoQuebraCaixa),
        formatMoeda(item.VRQUEBRAEFETIVADO),
        item.STFECHADOMOVIMENTO,
        item.STCONFERIDOMOVIMENTO
      ]),
      autoPrint: true,
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('conferencia_caixa.pdf');
  };

  const formatarStatus = (item) => {
    let status = item.STATUSMALOTE || 'Pendente de Envio';
    let classe = 'text-danger';
    let msg = status;

    if (status == 'Enviado' || status == 'Reenviado') {
      classe = 'text-info';
      msg += ' e Aguardando Recepção...';
    } else if (status == 'Recepcionado') {
      classe = 'text-info';
      msg += ' e Aguardando Conferência...';
    } else if (status == 'Conferido') {
      classe = 'text-success';
      if ((item.OBSERVACAOADMINISTRATIVOMALOTE || '').trim().length > 0) {
        classe = 'text-primary';
        msg += ' Com Observações e/ou Pendências';
      }
    } else if (status == 'Devolvido') {
      msg += ' e Aguardando Reenvio...';
    }

    return { classe, msg };
  };


  const dados = dadosMalotes.map((item, index) => {
    let contador = index + 1;

    let vrTotalDespesa = item.IDMALOTE ? toFloat(item.VALORTOTALDESPESA) : toFloat(item.VALORTOTALDESPESA) + toFloat(item.VALORTOTALADIANTAMENTOSALARIAL);
    let vrTotalVendido = item.IDMALOTE ? toFloat(item.VRTOTALRECEBIDO) : toFloat(item.VALORTOTALDINHEIRO) + toFloat(item.VALORTOTALCARTAO) + toFloat(item.VALORTOTALPOS) + toFloat(item.VALORTOTALPIX) + toFloat(item.VALORTOTALMOOVPAY) + toFloat(item.VALORTOTALCONVENIO) + toFloat(item.VALORTOTALVOUCHER)
    let vrDisponivelBruto = toFloat(item.VALORTOTALDINHEIRO) + toFloat(item.VALORTOTALFATURA)
    let vrQuebraCaixa = (toFloat(item.VRRECDINHEIRO)) - toFloat(item.VRFISICODINHEIRO)
    let vrDisponivel = item.IDMALOTE ? toFloat(item.VRDISPONIVEL) : vrDisponivelBruto - vrTotalDespesa + vrQuebraCaixa

    const { classe, msg } = formatarStatus(item);
    return {
      IDMALOTE: item.IDMALOTE,
      DTHORAFECHAMENTOFORMATADA: item.DTHORAFECHAMENTOFORMATADA,
      NOFANTASIA: item.NOFANTASIA,
      VALORTOTALDINHEIRO: toFloat(item.VALORTOTALDINHEIRO),
      VALORTOTALCARTAO: toFloat(item.VALORTOTALCARTAO),
      VALORTOTALPOS: toFloat(item.VALORTOTALPOS),
      VALORTOTALPIX: toFloat(item.VALORTOTALPIX),
      VALORTOTALMOOVPAY: toFloat(item.VALORTOTALMOOVPAY),
      VALORTOTALCONVENIO: toFloat(item.VALORTOTALCONVENIO),
      VALORTOTALVOUCHER: toFloat(item.VALORTOTALVOUCHER),
      VALORTOTALFATURA: toFloat(item.VALORTOTALFATURA),
      VALORTOTALFATURAPIX: toFloat(item.VALORTOTALFATURAPIX),
      VALORTOTALDESPESA: toFloat(item.VALORTOTALDESPESA),
      VALORTOTALADIANTAMENTOSALARIAL: toFloat(item.VALORTOTALADIANTAMENTOSALARIAL),
      VRFISICODINHEIRO: toFloat(item.VRFISICODINHEIRO),
      VRAJUSTEDINHEIRO: toFloat(item.VRAJUSTEDINHEIRO),
      VRRECDINHEIRO: toFloat(item.VRRECDINHEIRO),
      VRTOTALRECEBIDO: item.VRTOTALRECEBIDO,
      VRDISPONIVEL: toFloat(item.VRDISPONIVEL),
      OBSERVACAOADMINISTRATIVOMALOTE: item.OBSERVACAOADMINISTRATIVOMALOTE || '',
      OBSERVACAOLOJAMALOTE: item.OBSERVACAOLOJAMALOTE || '',
      STATIVOMALOTE: item.STATIVOMALOTE,
      DATAHORACRIACAOMALOTE: item.DATAHORACRIACAOMALOTE,
      STATUSMALOTE: item.STATUSMALOTE || 'Pendente de Envio',
      STSTATUS: item.STSTATUS,
      vrTotalDespesa: vrTotalDespesa,
      vrTotalVendido: vrTotalVendido,
      vrQuebraCaixa: vrQuebraCaixa,
      vrDisponivel: vrDisponivel,
      statusFormatado: msg,
      statusClasse: classe,
      contador
    }
  });

  const colunasMovimentoCixa = [
    {
      field: 'contador',
      header: 'Nº ',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTOFORMATADA',
      header: 'Data',
      body: row => <th>{row.DTHORAFECHAMENTOFORMATADA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ width: '250px', margin: 0, fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'VALORTOTALDINHEIRO',
      header: 'Dinheiro',
      body: row => (
        <th>
          {formatMoeda(row.VALORTOTALDINHEIRO)}
        </th>
      ),
      sortable: true,
    },
    {
      field: 'VALORTOTALCARTAO',
      header: 'Cartão',
      body: row => <th>{formatMoeda(row.VALORTOTALCARTAO)}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALPOS',
      header: 'POS',
      body: row => <th>{formatMoeda(row.VALORTOTALPOS)}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALPIX',
      header: 'PIX',
      body: row => <th>{formatMoeda(row.VALORTOTALPIX)}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALCONVENIO',
      header: 'Convênio',
      body: row => <th>{formatMoeda(row.VALORTOTALCONVENIO)}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALVOUCHER',
      header: 'Voucher',
      body: row => (
        <th style={{ color: '#008000' }}> {formatMoeda(row.VALORTOTALVOUCHER)} </th>
      ),
      sortable: true,
    },
    {
      field: 'VALORTOTALFATURA',
      header: 'Fatura',
      body: row => <th>{formatMoeda(row.VALORTOTALFATURA)}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALFATURAPIX',
      header: 'Fatura PIX',
      body: row => <th>{formatMoeda(row.VALORTOTALFATURAPIX)}</th>,
      sortable: true,
    },
    {
      field: 'vrTotalDespesa',
      header: 'Despesa',
      body: row => <th>{formatMoeda(row.vrTotalDespesa)}</th>,
      sortable: true,
    },
    {
      field: 'vrTotalVendido',
      header: 'Total Recebido',
      body: row => <th>{formatMoeda(row.vrTotalVendido)}</th>,
      sortable: true,
    },
    {
      field: 'vrDisponivel',
      header: 'Disponível',
      body: row => (
        <th style={{ color: '#008000' }}>
          {formatMoeda(row.vrDisponivel)}
        </th>
      ),
      sortable: true,
    },
    {
      field: 'statusFormatado',
      header: 'Status',
      body: (rowData) => <span className={`${rowData.statusClasse} text-truncate fw-900`}>{rowData.statusFormatado}</span>,
      sortable: true
    },
    {
      field: 'STATUSMALOTE',
      header: 'Ações',
      width: '300px',
      body: (row) => {
        if (row.STATUSMALOTE == 'Pendente de Envio') {
          return (
            <div className="p-1">
              <ButtonTable
                titleButton={"Enviar"}
                cor={"primary"}
                Icon={GoDownload}
                onClickButton={() => handleEnviarMalote(row)}
                iconSize={20}
                width="85px"
                height="40px"
                textButton={"Enviar"}

              />

            </div>
          )
        } else if(row.STATUSMALOTE == 'Devolvido') {
            return (
              <div className="p-1">
                <ButtonTable
                  titleButton={"Reenviar"}
                  cor={"warning"}
                  Icon={FaUpload}
                  onClickButton={() => handleClickDetalhar(row)}
                  iconSize={16}
                  width="85px"
                  height="40px"
                  textButton={"Detalhe"}

                />
              </div>
            )
        } else {
          return (
            <div className="p-1">
              <ButtonTable
                titleButton={"Detalhe"}
                cor={"info"}
                Icon={GrView}
                onClickButton={() => handleClickDetalhar(row)}
                iconSize={16}
                width="85px"
                height="40px"
                textButton={"Detalhe"}

              />
            </div>
          )
        }
      },
    },
  ]

  const handleEnviarMalote =  (row) => {
    if (optionsModulos[0]?.CRIAR == 'True') {
      if (row) {
        setSalvarDadosMalotes(row);
         onSalvarMalote(row);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Você não tem permissão para enviar malotes.',
        timer: 3000,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      })
    }
  }

  const handleClickDetalhar = async (row) => {
    if (row.IDMALOTE) {
      handleDetalhar(row.IDMALOTE)
    }

  }

  const handleDetalhar = async (IDMALOTE) => {
    try {
      const responsePendencia = await get(`/pendencias-malotes`)
      const response = await get(`/detalhe-malotes-por-loja?idMalote=${IDMALOTE}`)
      if (response.data && responsePendencia.data) {
        setDadosPendenciasMalotes(responsePendencia.data)
        setDadosDetalhesMalote(response.data)
        setModalDetalhe(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>
            Lista de Malotes Enviados
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
            title="Envio de Malotes"
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
            response
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasMovimentoCixa.map(coluna => (
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

      <ActionDetalheMaloteModal
        show={modalDetalhe}
        handleClose={() => setModalDetalhe(false)}
        dadosDetalhesMalote={dadosDetalhesMalote}
        dadosPendenciasMalotes={dadosPendenciasMalotes}
        salvarDadosMalotes={salvarDadosMalotes}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}

      />
    </Fragment>
  )
}