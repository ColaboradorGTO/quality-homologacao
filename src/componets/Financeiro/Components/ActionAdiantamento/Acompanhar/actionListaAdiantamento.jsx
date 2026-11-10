import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable"
import { formatMoeda } from "../../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import HeaderTable from "../../../../Tables/headerTable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { MdEdit, MdMoneyOff, MdOutlineAttachMoney } from "react-icons/md";
import { get } from "../../../../../api/funcRequest";
import { ActionPagamentoModal } from "../Pagamento/actionPagamentoModal";
import { formatarDataParaBR } from "../../../../../utils/dataFormatada";
import { GrView } from "react-icons/gr";
import { ActionDetalhesModal } from "./DetalhesSolicitacao/actionDetalhesModal";

export const ActionListaAdiantamento = ({
  dadosAdiantamentos,
  optionsModulos,
  usuarioLogado,
  handleClick
}) => {
  const [rowSelection, setRowSelection] = useState(null);
  const [dadosDetalheAdiantamento, setDadosDetalheAdiantamento] = useState([]);
  const [dadosDetalhePagamento, setDadosDetalhePagamento] = useState([]);
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [modalDetalhesVisivel, setModaDetalhesVisivel] = useState(false);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Adiantamento Departamento',

  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Departamento', 'CNPJ Faturado', 'Rz. Social', 'Vr.Lançado', 'Decrição', 'Status', 'Possui Nota', 'Orçamento']],
      body: dados.map(item => [
        item.contador,
        item.DEPARTAMENTO,
        item.CNPJFATURAMENTO,
        item.RAZAOSOCIALFATURAMENTO,
        formatMoeda(item.VRSOLICITADO),
        item.DESCRICAO,
        item.STATUS,
        item.POSSUINOTAFISCAL == 'True' ? 'SIM' : 'NÃO',
        item.ANEXOORCAMENTO ? 'SIM' : 'NÃO'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('adiantamento_departamento.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados.map(item => ({
      'Nº': item.contador,
      'Departamento': item.DEPARTAMENTO,
      'CNPJ Faturado': item.CNPJFATURAMENTO,
      'Rz. Social': item.RAZAOSOCIALFATURAMENTO,
      'Vr.Lançado': formatMoeda(item.VRSOLICITADO),
      'Decrição': item.DESCRICAO,
      'Status': item.STATUS,
      'Possui Nota': item.POSSUINOTAFISCAL == 'True' ? 'SIM' : 'NÃO',
      'Orçamento': item.ANEXOORCAMENTO ? 'SIM' : 'NÃO'
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Departamento', 'CNPJ Faturado', 'Rz. Social', 'Vr.Lançado', 'Descrição', 'Status', 'Possui Nota', 'Orçamento'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Departamento' },
      { wpx: 100, caption: 'CNPJ Faturado' },
      { wpx: 200, caption: 'Rz. Social' },
      { wpx: 100, caption: 'Vr.Lançado' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Status' },
      { wpx: 100, caption: 'Possui Nota' },
      { wpx: 100, caption: 'Orçamento' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Adiantamento Departamento');
    XLSX.writeFile(workbook, 'adiantamento_departamento.xlsx');
  };


  const dados = dadosAdiantamentos.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDADIANTAMENTO: item.IDADIANTAMENTO,
      DEPARTAMENTO: item.DEPARTAMENTO,
      NUCNPJEMPRESA: item.NUCNPJEMPRESA,
      POSSUINOTAFISCAL: item.POSSUINOTAFISCAL,
      CNPJFATURAMENTO: item.CNPJFATURAMENTO || item.NUCPFBENEFICIARIO,
      RAZAOSOCIALFATURAMENTO: item.RAZAOSOCIALFATURAMENTO || item.NOBENEFICIARIO,
      VRSOLICITADO: item.VRSOLICITADO,
      DESCRICAO: item.DESCRICAO,
      ANEXOORCAMENTO: item.ANEXOORCAMENTO,
      ANEXONOTAFISCAL: item.ANEXONOTAFISCAL,
      STATUS: item.STATUS,
      DSJUSTIFICATIVA: item.DSJUSTIFICATIVA,
      IDUSUARIOCRIACAO: item.IDUSUARIOCRIACAO,
      DATACRIACAO: item.DATACRIACAO,
      DTPAGAMENTO: item.DTPAGAMENTO,
      IDUSUARIOALTERACAO: item.IDUSUARIOALTERACAO,
      DATAALTERACAO: item.DATAALTERACAO,
      DATAFINALIZACAO: item.DATAFINALIZACAO,
      STATIVO: item.STATIVO,
      FORMAPAGAMENTO: item.FORMAPAGAMENTO,
      STATUSPAGAMENTO: item.STATUSPAGAMENTO,
      NOMESOLICITANTE: item.NOMESOLICITANTE,
      DSJUSTIFICATIVAPAGAMENTO: item.DSJUSTIFICATIVAPAGAMENTO
    }
  });



  const colunasExportacao = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
      width: "10%"
    },
    {
      field: 'DATACRIACAO',
      header: 'Data Solocitação',
      body: row => <th style={{ color: 'blue' }}>{formatarDataParaBR(row.DATACRIACAO)}</th>,
      sortable: true,
    },
    {
      field: 'DTPAGAMENTO',
      header: 'Data Pagamento',
      body: row => <th style={{ color: 'blue' }}>{formatarDataParaBR(row.DTPAGAMENTO)}</th>,
      sortable: true,
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
      header: 'CNPJ/CPF',
      body: row => <th style={{ color: 'blue' }}>{row.CNPJFATURAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'RAZAOSOCIALFATURAMENTO',
      header: 'Rz. Social',
      body: row => <p style={{ color: 'blue', width: '300px', fontWeight: 600 }}>{row.RAZAOSOCIALFATURAMENTO}</p>,
      sortable: true,
    },
    {
      field: 'VRSOLICITADO',
      header: 'Vr Lançado',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRSOLICITADO)}</th>,
      sortable: true,
    },
    {
      field: 'NOMESOLICITANTE',
      header: 'Solicitante',
      body: row => (
        <th style={{ color: 'blue' }}>

          {row.NOMESOLICITANTE}
        </th>
      ),
    },
    {
      field: 'DSJUSTIFICATIVA',
      header: 'Justificativa',
      body: row => (
        <th style={{ color: 'blue' }}>

          {row.DSJUSTIFICATIVA}
        </th>
      ),
    },
    {
      field: 'POSSUINOTAFISCAL',
      header: 'Possui Nota',
      sortable: true,
      body: row => (
        <th style={{ color: row.POSSUINOTAFISCAL == 'True' ? 'blue' : '#FD1381' }}>

          {row.POSSUINOTAFISCAL == 'True' ? 'SIM' : 'NÃO'}
        </th>
      ),
    },
    {
      field: 'ANEXOORCAMENTO',
      header: 'Orçamento',
      sortable: true,
      body: row => (
        <th style={{ color: row.ANEXOORCAMENTO ? 'blue' : '#FD1381' }}>

          {row.ANEXOORCAMENTO ? 'SIM' : 'NÃO'}
        </th>
      ),
    },
    {
      field: 'DSJUSTIFICATIVAPAGAMENTO',
      header: 'Orçamento',
      sortable: true,
      body: row => (
        <th style={{ color: 'blue' }}>
          {row.DSJUSTIFICATIVAPAGAMENTO}
        </th>
      ),
    },
    {
      field: 'STATUS',
      header: 'Status',
      sortable: true,
      body: row => (
        <th style={{
            color: row.STATUS == 'Autorizado' ? '#1DC9B7' 
            : row.STATUS == 'aguardando comprovante' ? 'blue' 
            : row.STATUS == 'AGUARDANDO FINANCEIRO' ? '#6e4e9e' 
            : row.STATUS == 'comprovante anexado' ? '#FD1381' 
            : row.STATUS == 'Aguardando nota fiscal' ? '#ffc241' : row.STATUS == 'Pago' ? '#1DC9B7' : '',
          fontWeight: 800
        }}>

          {row.STATUS}
        </th>
      ),
    },
    {
      field: 'STATIVO',
      header: 'Status Final',
      sortable: true,
      body: row => (
        <th style={{ color: row.STATIVO == 'False' ? '#FD1381' : 'blue', fontWeight: 800  }}>

          {row.STATIVO == 'False' ? 'FINALIZADO' : 'ABERTO'}
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
              {/* {row.STATIVO == 'True' && (

              )} */}
              <ButtonTable
                titleButton={"Aprovar Pagamento"}
                cor={"success"}
                Icon={MdOutlineAttachMoney}
                iconSize={30}
                width="35px"
                height="35px"
                onClickButton={() => handleClickAprovar(row)}
                // disabledBTN={row.STATIVO == 'False' ? true : false}
              />
            </div>
            <div className="p-1">
              <ButtonTable
                titleButton={"Detalhes"}
                cor={"primary"}
                Icon={GrView}
                iconSize={20}
                width="35px"
                height="35px"
                onClickButton={() => handleClickVisualizar(row)}
              />
            </div>
          </div>
        )

      },
    },
  ]


  const handleClickAprovar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDADIANTAMENTO) {
        handleAprovar(row.IDADIANTAMENTO);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        text: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão.`,
        showConfirmButton: false,
        timer: 5000,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };

  const handleAprovar = async (IDADIANTAMENTO) => {
    try {
      const response = await get(`/lista-adiantamento-departamento?idAdiantamento=${IDADIANTAMENTO}`);
      const responsePagamento = await get(`/pagamento-adiantamento?idAdiantamento=${IDADIANTAMENTO}`);

      if (response.data && responsePagamento.data &&  response.data.length > 0) {
        setDadosDetalheAdiantamento(response.data);
        setDadosDetalhePagamento(responsePagamento.data);

        setModalPagamento(true);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Detalhes não encontrados.',
          customClass: {
            container: 'custom-swal',
          }
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes: ', error);
    }
  };

  const handleVisualizar = async (IDADIANTAMENTO) => {
    try {
      const response = await get(`/lista-adiantamento-departamento?idAdiantamento=${IDADIANTAMENTO}`);
    
      if (response.data && response.data.length > 0) {
        setDadosDetalheAdiantamento(response.data);
        setModaDetalhesVisivel(true);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Detalhes não encontrados.',
          customClass: {
            container: 'custom-swal',
          }
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes: ', error);
      Swal.fire({
        icon: 'info',
        title: 'Não existe dados nesta solicitação'
      })
    }
  };

  const handleClickVisualizar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDADIANTAMENTO) {
        handleVisualizar(row.IDADIANTAMENTO);
      }

    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br> Você não tem permissão.`,
        showConfirmButton: true,
        timer: 30000,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };


  const headerGrupo = (
    <ColumnGroup  >
      <Row>
        <Column
          colSpan="11"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#7a59ad", color: 'white' }}
          headerClassName="grupo-meta-geral"
          header="SOLICITAÇÃO"
        />
        <Column
          colSpan="4"
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FD1381", color: 'black' }}
          headerClassName="grupo-meta-geral"
          header="PAGAMENTO"
        />
      </Row>

      <Row>

        <Column
          field="contador"
          header="#"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="DATACRIACAO"
          header="Dt Solocitação"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="DTPAGAMENTO"
          header="Dt Pagamento"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="DEPARTAMENTO"
          header="Departamento"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="CNPJFATURAMENTO"
          header="CNPJ/CPF"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="RAZAOSOCIALFATURAMENTO"
          header="Rz. Social"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="VRSOLICITADO"
          header="Vr Lançado"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="NOMESOLICITANTE"
          header="Solicitante"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

        <Column
          field="DSJUSTIFICATIVA"
          header="Justificativa"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

        <Column
          field="POSSUINOTAFISCA"
          header="Possui Nota"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

        <Column
          field="ANEXOORCAMENTO"
          header="Possui Orçamento"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

       

       
        <Column
          field="DSJUSTIFICATIVAPAGAMENTO"
          header="Justificativa"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#FD1381", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column
          field="STATUS"
          header="Status"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#FD1381", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

        <Column 
          field="STATIVO" 
          header="Status Final" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#FD1381", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}   
        />

        <Column
          field="IDADIANTAMENTO"
          header="Opções"
          sortable={true}
          style={{ color: 'white', backgroundColor: "#FD1381", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        /> 
      </Row>


    </ColumnGroup>
  )

  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Acompanhar Adiantamentos</h2>
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
            headerColumnGroup={headerGrupo}
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
            {colunasExportacao.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>


        <ActionPagamentoModal
          show={modalPagamento}
          handleClose={() => setModalPagamento(false)}
          handleClick={handleClick}
          dadosDetalheAdiantamento={dadosDetalheAdiantamento}
          dadosDetalhePagamento={dadosDetalhePagamento}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />

        <ActionDetalhesModal
          show={modalDetalhesVisivel}
          handleClose={() => setModaDetalhesVisivel(false)}
          dadosDetalheAdiantamento={dadosDetalheAdiantamento}
        />
      </div>
    </Fragment>
  )
}

