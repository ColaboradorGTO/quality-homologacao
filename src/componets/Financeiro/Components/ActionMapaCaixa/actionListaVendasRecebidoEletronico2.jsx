import { Fragment, useEffect, useRef, useState, useMemo } from "react"
import { get } from "../../../../api/funcRequest"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from 'primereact/row';
import { GrView } from "react-icons/gr";
import { ActionVendaRecebimentoModal } from "../ActionModaisVendas/actionVendaRecebimentoModal";
import HeaderTable from "../../../Tables/headerTable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaVendasRecebidoEletronico = ({ 
  dadosTotalRecebidoEletronico, 
  dadosTotalRecebidoPeriodo, 
  dataPesquisaInicio, 
  dataPesquisaFim,
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

  // FUNÇÃO QUE REPLICA EXATAMENTE A LÓGICA DO JQUERY
  const calcularTotaisComoJquery = useMemo(() => {
    // Inicializar todas as variáveis como no jQuery
    let valorTotalRecebidoMapaVenda = 0
    let valorTotalRecebidoMapaCartoes = 0
    let valorTotalRecebidoMapaConvenio = 0
    let valorTotalRecebidoMapaDinheiro = 0
    let valorTotalPagamentoMapaDespesas = 0
    let valorTotalRecebidoMapaFaturas = 0
    
    // 1. PRIMEIRO LOOP: Dados do período (exatamente como jQuery)
    if (Array.isArray(dadosTotalRecebidoPeriodo)) {
      dadosTotalRecebidoPeriodo.forEach(item => {
        const valorTotalConvenio = parseFloat(item.VALORTOTALCONVENIO || 0)
        const valorTotalDinheiro = parseFloat(item.VALORTOTALDINHEIRO || 0)
        const valorTotalFatura = parseFloat(item.VALORTOTALFATURA || 0)
        const valorTotalDespesa = parseFloat(item.VALORTOTALDESPESA || 0)
        const valorTotalAdiantamentoSalarial = parseFloat(item.VALORTOTALADIANTAMENTOSALARIAL || 0)
        
        // Exatamente como no jQuery
        valorTotalRecebidoMapaVenda = valorTotalRecebidoMapaVenda + valorTotalConvenio + valorTotalDinheiro
        valorTotalRecebidoMapaConvenio = valorTotalRecebidoMapaConvenio + valorTotalConvenio
        valorTotalRecebidoMapaDinheiro = valorTotalRecebidoMapaDinheiro + valorTotalDinheiro
        valorTotalPagamentoMapaDespesas = valorTotalPagamentoMapaDespesas + valorTotalDespesa + valorTotalAdiantamentoSalarial
        valorTotalRecebidoMapaFaturas = valorTotalRecebidoMapaFaturas + valorTotalFatura
      })
    }
    
    // 2. SEGUNDO LOOP: Dados eletrônicos (exatamente como jQuery)
    const dadosFiltrados = []
    
    if (Array.isArray(dadosTotalRecebidoEletronico)) {
      dadosTotalRecebidoEletronico.forEach(item => {
        const valorRecebido = parseFloat(item.VALORRECEBIDO || 0)
        const dsTipoPagamento = item.DSTIPOPAGAMENTO || ''
        
        // ADICIONA CARTÕES ao total de vendas (como jQuery)
        valorTotalRecebidoMapaVenda = valorTotalRecebidoMapaVenda + valorRecebido
        valorTotalRecebidoMapaCartoes = valorTotalRecebidoMapaCartoes + valorRecebido
        
        // Filtrar "VALE FUNCIONÁRIO" como no jQuery
        if (dsTipoPagamento !== 'VALE FUNCIONÁRIO') {
          dadosFiltrados.push({
            NOTEF: item.NOTEF || '',
            DSTIPOPAGAMENTO: dsTipoPagamento,
            NPARCELAS: item.NPARCELAS,
            QTDPGTOS: item.QTDPGTOS,
            VALORRECEBIDO: valorRecebido,
            NOAUTORIZADOR: item.NOAUTORIZADOR,
            QTDE: item.QTDE
          })
        }
      })
    }
    
    // 3. CÁLCULOS FINAIS (DEPOIS dos dois loops, como jQuery)
    const valorTotalDisponivelMapaDinheiro = valorTotalRecebidoMapaDinheiro - valorTotalPagamentoMapaDespesas
    const valorTotalDisponivelMapaDinheiroFatura = valorTotalDisponivelMapaDinheiro + valorTotalRecebidoMapaFaturas
    
    return {
      // Totais (exatamente como jQuery calcula)
      valorTotalRecebidoMapaVenda: valorTotalRecebidoMapaVenda.toFixed(2),
      valorTotalRecebidoMapaCartoes: valorTotalRecebidoMapaCartoes.toFixed(2),
      valorTotalRecebidoMapaConvenio: valorTotalRecebidoMapaConvenio.toFixed(2),
      valorTotalRecebidoMapaDinheiro: valorTotalRecebidoMapaDinheiro.toFixed(2),
      valorTotalPagamentoMapaDespesas: valorTotalPagamentoMapaDespesas.toFixed(2),
      valorTotalRecebidoMapaFaturas: valorTotalRecebidoMapaFaturas.toFixed(2),
      valorTotalDisponivelMapaDinheiro: valorTotalDisponivelMapaDinheiro.toFixed(2),
      valorTotalDisponivelMapaDinheiroFatura: valorTotalDisponivelMapaDinheiroFatura.toFixed(2),
      
      // Dados filtrados para renderizar
      dadosFiltrados
    }
  }, [dadosTotalRecebidoPeriodo, dadosTotalRecebidoEletronico])
  
  // Dados para a tabela (já filtrados como no jQuery)
  const dados = useMemo(() => calcularTotaisComoJquery.dadosFiltrados, [calcularTotaisComoJquery])
  
  // Funções de exportação que usam os dados calculados
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Vendas Form Pag', 'Parcelas', 'Qtd Pagamento', 'Vr.Venda']],
      body: dados.map(item => [
        item.NOTEF ? `${item.NOTEF} - ${item.DSTIPOPAGAMENTO}` : item.DSTIPOPAGAMENTO,
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
  
  // HEADER GROUP (mantendo sua estrutura)
  const headerGroup = useMemo(() => (
    <ColumnGroup style={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}>
      <Row>
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
        <Column header={formatMoeda(calcularTotaisComoJquery.valorTotalRecebidoMapaConvenio)} />
      </Row>
      <Row>
        <Column header="DINHEIRO" />
        <Column header="" />
        <Column header="" />
        <Column header={formatMoeda(calcularTotaisComoJquery.valorTotalRecebidoMapaDinheiro)} />
      </Row>
    </ColumnGroup>
  ), [calcularTotaisComoJquery])
  
  // FOOTER GROUP (com os cálculos corrigidos como jQuery)
  const footerGroup = useMemo(() => (
    <ColumnGroup>
      <Row>
        <Column footer="Total das Vendas:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalRecebidoMapaVenda)} />
      </Row>
      <Row>
        <Column footer="Recebimento Cartões:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalRecebidoMapaCartoes)} />
      </Row>
      <Row>
        <Column footer="Recebimento Convênio:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalRecebidoMapaConvenio)} />
      </Row>
      <Row>
        <Column footer="Recebimento Dinheiro:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalRecebidoMapaDinheiro)} />
      </Row>
      <Row>
        <Column footer="- Pagamento das Despesas:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalPagamentoMapaDespesas)} />
      </Row>
      <Row>
        <Column footer="= Total Dispónivel em Dinheiro:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalDisponivelMapaDinheiro)} />
      </Row>
      <Row>
        <Column footer="+ Recebimento Faturas:" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalRecebidoMapaFaturas)} />
      </Row>
      <Row>
        <Column footer="= Total Dispónivel (Dinheiro + Fatura):" colSpan={4} style={{ textAlign: 'right' }} />
        <Column footer={formatMoeda(calcularTotaisComoJquery.valorTotalDisponivelMapaDinheiroFatura)} />
      </Row>
    </ColumnGroup>
  ), [calcularTotaisComoJquery])
  
  // Colunas da tabela (mantendo sua estrutura)
  const colunasEmpresas = useMemo(() => [
    {
      field: 'NOTEF',
      body: row => <th>{row.NOTEF ? `${row.NOTEF} - ${row.DSTIPOPAGAMENTO}` : row.DSTIPOPAGAMENTO}</th>,
    },
    {
      field: 'NPARCELAS',
      body: row => <th>{row.NPARCELAS}</th>,
    },
    {
      field: 'QTDPGTOS',
      body: row => <th>{row.QTDPGTOS}</th>,
    },
    {
      field: 'VALORRECEBIDO',
      body: row => <th>{formatMoeda(row.VALORRECEBIDO)}</th>,
      sortable: true,
    },
    {
      field: 'QTDE',
      header: 'Opções',
      body: row => (
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: '100px' }}>
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
      )
    }
  ], [])
  
  const handleEditar = async (NOTEF, NOAUTORIZADOR, NPARCELAS) => {
    try {
      const response = await get(`/venda-detalhe-recebimento-eletronico?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&nomeTef=${NOTEF}&nomeAutorizador=${NOAUTORIZADOR}&numeroParcelas=${NPARCELAS}`);
      
      if (response.data) {
        setDadosDetalheRecebimentosEletronico(response.data)
        setModalDetalheRecebimento(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };
  
  const handleClickEditar = (row) => {
    if (row && row.NOAUTORIZADOR && row.NPARCELAS) {
      handleEditar(row.NOTEF || '', row.NOAUTORIZADOR, row.NPARCELAS);
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
              title="Recebimentos"
              value={dados}
              globalFilter={globalFilterValue}
              size="small"
              sortField="VALORRECEBIDO"
              sortOrder={-1}
              headerColumnGroup={headerGroup}
              footerColumnGroup={footerGroup}
              paginator={true}
              rows={dados.length}
              selectionMode="single"
              selection={rowSelection}
              onSelectionChange={(e) => setRowSelection(e.value)}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
              filterDisplay="menu"
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunasEmpresas.map((coluna, index) => (
                <Column
                  key={index}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                  bodyStyle={{ fontSize: '0.8rem' }}
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