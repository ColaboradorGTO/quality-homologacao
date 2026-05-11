import { Fragment, useRef, useState } from "react"
import { get } from "../../../../api/funcRequest"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from 'primereact/row';
import { GrView } from "react-icons/gr";
import { toFloat } from "../../../../utils/toFloat";
import { ActionVendaRecebimentoModal } from "../ActionModaisVendas/actionVendaRecebimentoModal";
import HeaderTable from "../../../Tables/headerTable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaVendasRecebidoEletronico = ({ 
  dadosDespesas,
  dadosAdiantamentoSalarial,
  dadosResumoVoucher,
  dadosDetalheFatura,
  dadosTotalRecebidoEletronico, 
  dadosTotalRecebidoPeriodo, 
  dataPesquisaInicio, 
  dataPesquisaFim ,
  empresaSelecionada,
  usuarioLogado,
  optionsModulos
}) => {
  const [dadosDetalheRecebimentosEletronico, setDadosDetalheRecebimentosEletronico] = useState([]);
  const [modalDetalheRecebimentos, setModalDetalheRecebimento] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
  

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Recebimentos Eletrônicos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Vendas Form Pag', 'Parcelas', 'Qtd Pagamento', 'Vr.Venda']],
      body: dados.map(item => [
        item.NOTEF,
        item.NPARCELAS,
        item.QTDPGTOS,
        item.VALORRECEBIDO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas-recebimentos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Venda Form Pagamento', 'Parcelas', 'Qtd Pagamento', 'Valor Recebido'];
    worksheet['!cols'] = [
      { wpx: 150, caption: 'Venda Form Pagamento' },
      { wpx: 50, caption: 'Parcelas' },
      { wpx: 50, caption: 'Qtd Pagamento' },
      { wpx: 100, caption: 'Valor Recebido' }
    ]
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Recebimentos');
    XLSX.writeFile(workbook, 'vendas_recebimentos.xlsx');
  };

  const calcularTotalConvenio = () => {
    return dadosPeriodo.reduce((total, dados) => total + parseFloat(dados.VALORTOTALCONVENIO ), 0);
  }
  const calcularTotalDinheiro = () => {
    return dadosPeriodo.reduce((total, dados) => total + parseFloat(dados.VALORTOTALDINHEIRO ), 0);
  }
  const calcularTotalFatura = () => {
    return dadosTotalRecebidoPeriodo.reduce((total, item) =>
      total + parseFloat(item.VALORTOTALFATURA), 0
    );
  }

  const calcularTotalPagamentoDespesas = () =>
  dadosTotalRecebidoPeriodo.reduce(
    (total, item) =>
      total +
      parseFloat(item.VALORTOTALDESPESA || 0) +
      parseFloat(item.VALORTOTALADIANTAMENTOSALARIAL || 0),
    0
  );
  const dadosPeriodo = Array.isArray(dadosTotalRecebidoPeriodo) ? dadosTotalRecebidoPeriodo.map((item, index) => {

    const calcularTotalConvenio = () => {
      return dadosTotalRecebidoPeriodo.reduce((total, dados) => total + parseFloat(dados.VALORTOTALCONVENIO ), 0);
    }
    const calcularTotalDinheiro = () => {
      return dadosTotalRecebidoPeriodo.reduce((total, dados) => total + parseFloat(dados.VALORTOTALDINHEIRO ), 0);
    }
    const valorTotalRecebidoMapaVenda = parseFloat(item.VALORTOTALCONVENIO) + parseFloat(item.VALORTOTALDINHEIRO);
    const valorTotalPagamentoMapaDespesas = parseFloat(item.VALORTOTALDESPESA) + parseFloat(item.VALORTOTALADIANTAMENTOSALARIAL)
    const valorTotalDisponivelMapaDinheiro = calcularTotalDinheiro() - valorTotalPagamentoMapaDespesas;
    const valorTotalDisponivelMapaDinheiroFatura = valorTotalDisponivelMapaDinheiro + calcularTotalFatura();
    const totalDinheiro = calcularTotalDinheiro();
    const totalConvenio = calcularTotalConvenio();

    return {

      VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
      VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
      VALORTOTALFATURA: item.VALORTOTALFATURA,
      VALORTOTALDESPESA: item.VALORTOTALDESPESA,
      VALORRECEBIDO: item.VALORRECEBIDO,
      VALORTOTALADIANTAMENTOSALARIAL: item.VALORTOTALADIANTAMENTOSALARIAL,
      valorTotalPagamentoMapaDespesas: valorTotalPagamentoMapaDespesas,
      valorTotalRecebidoMapaVenda: valorTotalRecebidoMapaVenda,
      valorTotalDisponivelMapaDinheiro: valorTotalDisponivelMapaDinheiro,
      valorTotalDisponivelMapaDinheiroFatura: parseFloat(valorTotalDisponivelMapaDinheiroFatura),

    }
  }) : [];



  const dados = Array.isArray(dadosTotalRecebidoEletronico) ?   dadosTotalRecebidoEletronico
    .filter(item => item.DSTIPOPAGAMENTO !== 'VALE FUNCIONÁRIO')  
    .map((item, index) => ({
      NOTEF: item.NOTEF,
      NPARCELAS: item.NPARCELAS,
      QTDPGTOS: item.QTDPGTOS,
      VALORRECEBIDO: item.VALORRECEBIDO,
      NOAUTORIZADOR: item.NOAUTORIZADOR,
      DSTIPOPAGAMENTO: item.DSTIPOPAGAMENTO,
      QTDE: item.QTDE,
    })) 
  : [];

  const dadosTodosCartoes = Array.isArray(dadosTotalRecebidoEletronico)
  ? dadosTotalRecebidoEletronico
  : [];

  const calcularTotalCartoes = () =>
  dadosTotalRecebidoEletronico
    .filter(item => item.DSTIPOPAGAMENTO !== 'VALE FUNCIONÁRIO')
    .reduce(
      (total, item) =>
        total + parseFloat(item.VALORRECEBIDO || 0),
      0
    );

 const calcularTotalVendas = () =>
  calcularTotalConvenio() +
  calcularTotalDinheiro() +
  calcularTotalCartoes();

const calcularTotalDisponivelDinheiro = () =>
  calcularTotalDinheiro() - calcularTotalPagamentoDespesas();

const calcularTotalDisponivelDinheiroFatura = () =>
  calcularTotalDisponivelDinheiro() + calcularTotalFatura();

  const calcularTotalValorRecebido = () => {
    let total = 0;
    for (let resultado of dados) {
      total += toFloat(resultado.VALORRECEBIDO);
    }
    return toFloat(total).toFixed(2);
  }

  const calcularValorTotalRecebidoMapaVenda = () => {
    let total = 0;
    for (let resultado of dadosPeriodo) {
      total += parseFloat(resultado.valorTotalDisponivelMapaDinheiroFatura);
    }
    return parseFloat(total).toFixed(2);
  }

  const dadosListaDespesass = dadosDespesas?.map((item, index) => {
    let contador = index + 1;
    return {

      VRDESPESA: item.VRDESPESA,
    }
  });

  const calcularTotalDespesas = () => {
    let total = 0;
    for (let resultado of dadosListaDespesass) {
      total += toFloat(resultado.VRDESPESA);
    }
    return total;
  }

  
  const calcularTotalMapaVenda = () =>
  dadosPeriodo.reduce(
    (total, item) => total + toFloat(item.valorTotalRecebidoMapaVenda || 0), 0
  );

  const calculoValorTotalRecebidoMapaVenda = (calcularTotalMapaVenda() + toFloat(dadosPeriodo[0]?.VALORRECEBIDO));

  const headerGroup = (
    <ColumnGroup style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}>

      <Row >
        <Column header="Vendas Formas de Pagamentos" style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} sortable />
        <Column header="Parcelas" style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} sortable />
        <Column header="Qtd Pagamento" style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} sortable />
        <Column header="Vr.Venda" style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} sortable />
        <Column header="Opções" style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }} sortable />
      </Row>
      <Row>
        <Column header="CONVÊNIO" />
        <Column header="" />
        <Column header="" />
        <Column header={formatMoeda(calcularTotalConvenio())} />


      </Row>
      <Row>
        <Column header="DINHEIRO" />
        <Column header="" />
        <Column header="" />
        <Column header={formatMoeda(calcularTotalDinheiro())} />
      </Row>

    </ColumnGroup>
  )

  const calcularTotalDisponivel = dadosPeriodo[0]?.valorTotalDisponivelMapaDinheiroFatura + calcularValorTotalRecebidoMapaVenda()

  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total das Vendas:" colSpan={4} style={{ textAlign: 'right' }} />
          <Column footer={formatMoeda(calcularTotalVendas())} />
      </Row>
      <Row>
        <Column footer="Recebimento Cartões:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotalCartoes())} />
      </Row>
      <Row>
        <Column footer="Recebimento Convênio:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotalConvenio())} />
      </Row>
      <Row>
        <Column footer="Recebimento Dinheiro:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotalDinheiro())} />

      </Row>
      <Row>
        <Column footer="Pagamento das Despesas:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotalPagamentoDespesas())} />
      </Row>
      <Row>
        <Column footer="Total Dispónivel em Dinheiro:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotalDisponivelDinheiro())} />
      </Row>
      <Row>
        <Column footer="Recebimento Faturas:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotalFatura())} />

      </Row>
      <Row>
        <Column footer="Total Dispónivel (Dinheiro + Fatura):" colSpan={4} style={{ textAlign: 'right' }} />
         <Column footer={formatMoeda(calcularTotalDisponivelDinheiroFatura())} />
      </Row>
    </ColumnGroup>
  )

  const colunasEmpresas = [
    {
      field: 'NOTEF',
      body: row => <th>{row.NOTEF} - {row.DSTIPOPAGAMENTO}</th>,

    },
    {
      field: 'NPARCELAS',
      body: row => <th > {row.NPARCELAS}  </th>,

    },
    {
      field: 'QTDPGTOS',
      body: row => <th > {row.QTDPGTOS}  </th>,
      footer: 'Total'
    },
    {
      field: 'VALORRECEBIDO',
      body: row => <th > {formatMoeda(row.VALORRECEBIDO)}  </th>,
      footer: formatMoeda(calcularTotalValorRecebido()),
      sortable: true,
    },

    {
      field: 'QTDE',
      header: 'Opções',

      body: row => {

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: '100px'

            }}
          >
            <div>
              <ButtonTable
                titleButton={"Detalhar Vendas"}
                onClickButton={() => handleClickEditar(row)}
                Icon={GrView}
                iconSize={25}
                width="35px"
                height="35px"
                iconColor={"#fff"}
                cor={"success"}
              />

            </div>
          </div>
        )


      }
    }
  ]

  const handleEditar = async (NOTEF, NOAUTORIZADOR, NPARCELAS) => {
    try {
      // Garante que os valores não sejam null/undefined antes de codificar
      const nomeTefEncoded = NOTEF ? encodeURIComponent(NOTEF.toString()) : '';
      const nomeAutorizadorEncoded = NOAUTORIZADOR ? encodeURIComponent(NOAUTORIZADOR.toString()) : '';
      const numeroParcelasEncoded = NPARCELAS ? encodeURIComponent(NPARCELAS.toString()) : '0';
      
      const response = await get(`/venda-detalhe-recebimento-eletronico?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&nomeTef=${nomeTefEncoded}&nomeAutorizador=${nomeAutorizadorEncoded}&numeroParcelas=${numeroParcelasEncoded}`);
      if (response.data && response.data.length > 0) {
        setDadosDetalheRecebimentosEletronico(response.data)
        setModalDetalheRecebimento(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };
  
  
  const handleClickEditar = (row) => {
    // Verifica se os valores existem e não são vazios
    if (row && row.NOTEF && row.NOAUTORIZADOR && row.NPARCELAS !== undefined && row.NPARCELAS !== null) {
      handleEditar(row.NOTEF, row.NOAUTORIZADOR, row.NPARCELAS);
    } else {
      console.warn('Dados insuficientes para buscar detalhes:', { 
        NOTEF: row?.NOTEF, 
        NOAUTORIZADOR: row?.NOAUTORIZADOR, 
        NPARCELAS: row?.NPARCELAS 
      });
    }
  };

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr mb-4">
          <h2>
            Lista de Vendas Por Período - Recebimentos

            <span className="fw-300">
              Por Marca
            </span>
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


        <div className="panel-container">
          <div className="panel-content" ref={dataTableRef}>

            <DataTable
              title="Recebimentos "
              value={dados}
              globalFilter={globalFilterValue}
              size="small"
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              headerColumnGroup={headerGroup}
              footerColumnGroup={footerGroup}
              paginator={true}
              rows={dados.length}
              selectionMode="single"
              selection={rowSelection}
              onSelectionChange={(e) => setRowSelection(e.value)}
              rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
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
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                  bodyStyle={{ fontSize: '1rem' }}

                />
              ))}

            </DataTable>
          </div>
        </div>
      </div>
      <ActionVendaRecebimentoModal
        show={modalDetalheRecebimentos}
        handleClose={() => setModalDetalheRecebimento(false)}
        dadosDetalheRecebimentosEletronico={dadosDetalheRecebimentosEletronico}
      />
    </Fragment>
  )
}