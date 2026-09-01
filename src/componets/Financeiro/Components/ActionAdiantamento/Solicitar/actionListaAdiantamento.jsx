import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable"
import { formatMoeda } from "../../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaCheck, FaCloudUploadAlt } from "react-icons/fa"
import HeaderTable from "../../../../Tables/headerTable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { ActionEditarModal } from "./EditarSolicitacao/actionEditarModal";
import { get } from "../../../../../api/funcRequest";


export const ActionListaAdiantamento = ({
  dadosAdiantamentos,
  optionsModulos,
  usuarioLogado,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const [dadosDetalheAdiantamento, setDadosDetalheAdiantamento] = useState([]);
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Adiantamento Salarial das Lojas',

  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Data Mov', 'Funcionário', 'CPF', 'Valor', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DTLANCAMENTO,
        item.NOFUNCIONARIO,
        item.NUCPF,
        formatMoeda(item.VRVALORDESCONTO),
        item.STATIVO === 'True' ? 'Ativo' : 'Cancelado',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('adiantamento_salarial.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Data Mov', 'Funcionário', 'CPF', 'Valor', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Data Mov' },
      { wpx: 250, caption: 'Funcionário' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Adiantamento Salarial das Lojas');
    XLSX.writeFile(workbook, 'adiantamento_salarial.xlsx');
  };


  const dadosExcel = dadosAdiantamentos.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NUCPF: item.NUCPF,
      VRVALORDESCONTO: item.VRVALORDESCONTO,
      STATIVO: item.STATIVO === 'True' ? 'Ativo' : 'Cancelado',

    }
  });

  const arraySituacao = [
    { color: '#2196F3', txt: 'Pronto para Integrar SAP' },
    { color: '#886ab5', txt: 'Em Fila' },
    { color: 'success', txt: 'Integrado' },
    { color: '#fd3995', txt: 'Erro ao Tentar Integrar' },
    { color: '#fd3995', txt: 'Cancelado' }
  ]

  const arrayMsgStatusIntegracao = [
    'Adiantamento Pronto Para Integrar',
    'Integração Em Andamento, Aguarde...',
    'Adiantamento Integrado Com Sucesso!',
    'Erro ao Tentar Integrar',
    'Cancelado'
  ];

  const dados = dadosAdiantamentos.map((item, index) => {
    let contador = index + 1;
    const idMovAdiantamento = item?.IDADIANTAMENTOSALARIO;
    const stAdiantamento = item?.STATIVO === 'True';
    const stMigrado = Number(item?.DOCENTRY_SAP_CONTAS_A_PAGAR || 0) > 0;
    const logErrorIntegracao = item?.ERROR_LOG_SAP || '';
    const stAguardandoEmFila = item?.STATUS_BLOQUEIO_ATUALIZACAO === 'True';
    const indexSituacao = !stAdiantamento ? 4 : logErrorIntegracao.length ? 3 : stMigrado ? 2 : stAguardandoEmFila ? 1 : 0;
    const colorSitucao = arraySituacao[indexSituacao].color;

    const msgTitleIntegracao = (logErrorIntegracao.length) ? 'MOTIVO:' : arraySituacao[indexSituacao].txt
    const msgTextIntegracao = logErrorIntegracao || arrayMsgStatusIntegracao[indexSituacao];
    const txtSituacao = arraySituacao[indexSituacao].txt;

    const tagStAdiantamento = `<span class="text-${colorSitucao} fw-900">${txtSituacao}</span>`;
    return {
      IDADIANTAMENTO: item.IDADIANTAMENTO,
      DEPARTAMENTO: item.DEPARTAMENTO,
      NUCNPJEMPRESA: item.NUCNPJEMPRESA,
      POSSUINOTAFISCAL: item.POSSUINOTAFISCAL,
      CNPJFATURAMENTO: item.CNPJFATURAMENTO,
      RAZAOSOCIALFATURAMENTO: item.RAZAOSOCIALFATURAMENTO,
      VRSOLICITADO: item.VRSOLICITADO,
      DESCRICAO: item.DESCRICAO,
      ANEXOORCAMENTO: item.ANEXOORCAMENTO,
      ANEXONOTAFISCAL: item.ANEXONOTAFISCAL,
      STATUS: item.STATUS,
      DSJUSTIFICATIVA: item.DSJUSTIFICATIVA,
      IDUSUARIOCRIACAO: item.IDUSUARIOCRIACAO,
      DATACRIACAO: item.DATACRIACAO,
      IDUSUARIOALTERACAO: item.IDUSUARIOALTERACAO,
      DATAALTERACAO: item.DATAALTERACAO,
      DATAFINALIZACAO: item.DATAFINALIZACAO,
      STATIVO: item.STATIVO,
      tagStAdiantamento,
      colorSitucao,
      msgTitleIntegracao,
      msgTextIntegracao,
      txtSituacao
    }
  });



  const colunasAdiantamentos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
      width: "10%"
    },
    {
      field: 'DEPARTAMENTO',
      header: 'Departamento',
      body: row => <th style={{ color: 'blue' }}>{row.DEPARTAMENTO}</th>,
      sortable: true,
      width: "10%"
    },
    {
      field: 'CNPJFATURAMENTO',
      header: 'CNPJ Faturado',
      body: row => <th style={{ color: 'blue' }}>{row.CNPJFATURAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'RAZAOSOCIALFATURAMENTO',
      header: 'Rz. Social',
      body: row => <th style={{ color: 'blue' }}>{row.RAZAOSOCIALFATURAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'VRSOLICITADO',
      header: 'Vr Lançado',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRSOLICITADO)}</th>,
      sortable: true,
    },
    {
      field: 'RAZAOSOCIALFATURAMENTO',
      header: 'Rz. Social',
      body: row => <th style={{ color: 'blue' }}>{row.RAZAOSOCIALFATURAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'DESCRICAO',
      header: 'Descrição',
      body: row => (
        <th style={{ color: 'blue' }}>

          {row.DESCRICAO}
        </th>
      ),
    },
    {
      field: 'STATUS',
      header: 'Status',
      body: row => (
        <th style={{ color: 'blue' }}>

          {row.STATUS}
        </th>
      ),
    },
    {
      field: 'STATIVO',
      header: 'Opções',
      button: true,
      body: (row) => {
        return (
          <div className="p-1 "
            style={{ justifyContent: "space-between", display: 'flex' }}
          >
            <div className="p-1">
              <ButtonTable
                titleButton={"Aprovar"}
                cor={"success"}
                Icon={FaCheck}
                iconSize={20}
                width="35px"
                height="35px"
                onClickButton={() => handleClickAtivar(row)}
              />
            </div>
            <div className="p-1">
              <ButtonTable
                titleButton={"Reprovar"}
                cor={"danger"}
                Icon={IoMdClose}
                iconSize={20}
                width="35px"
                height="35px"
                onClickButton={() => handleClickAtivar(row)}
              />
            </div>
            <div className="p-1">
              <ButtonTable
                titleButton={"Editar"}
                cor={"primary"}
                Icon={MdEdit}
                iconSize={20}
                width="35px"
                height="35px"
                onClickButton={() => handleClickEditar(row)}
              />
            </div>
          </div>
        )
    
      },
    },
  ]

  const handleClickAtivar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDADIANTAMENTOSALARIO) {
        handleAtivar(row.IDADIANTAMENTOSALARIO);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        text: 'Você não tem permissão para editar esta despesa.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };

  const handleClickCancelar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDADIANTAMENTOSALARIO) {
        handleCancelar(row.IDADIANTAMENTOSALARIO);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        text: 'Você não tem permissão para editar esta despesa.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };

  const handleEditar = async (IDADIANTAMENTO) => {
    try {
      const response = await get(`/lista-adiantamento-departamento?idAdiantamento=${IDADIANTAMENTO}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheAdiantamento(response.data);
        setModalEditarVisivel(true);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Detalhes da conta bancária não encontrados.',
          customClass: {
            container: 'custom-swal',
          }
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhe conta bancária: ', error);
    }
  };


  const handleClickEditar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDADIANTAMENTO) {
        handleEditar(row.IDADIANTAMENTO);
      }

    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br> Você não tem permissão para editar esta conta.`,
        showConfirmButton: true,
        timer: 30000,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };


  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Adiantamentos</h2>
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={() => handlePrint(dados.length)}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />
        </div>

        <div className="card" ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            cellMemo={false}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasAdiantamentos.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>

        <ActionEditarModal 
          show={modalEditarVisivel}
          handleClose={() => setModalEditarVisivel(false)}
          dadosDetalheAdiantamento={dadosDetalheAdiantamento}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      </div>
    </Fragment>
  )
}