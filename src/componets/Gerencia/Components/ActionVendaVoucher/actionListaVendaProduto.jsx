import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { GrAdd, GrFormView } from 'react-icons/gr';
import HeaderTable from '../../../Tables/headerTable';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import { get } from '../../../../api/funcRequest';
import { retornaDiasEntreDatas } from '../../../../utils/retornoEntreDias';
import { Checkbox } from "primereact/checkbox";

export const ActionListaVendaProduto = ({ dadosVoucher, tipoTroca = 'CORTESIA' }) => {
  const [dadosVisualizarProdutos, setDadosVisualizarProdutos] = useState([])
  const [tabelaPrincipal, setTabelaPrincipal] = useState(true);
  const [tabelaSecundaria, setTabelaSecundaria] = useState(false);
  const [size, setSize] = useState('small');
  const [rowClick, setRowClick] = useState(true);
  const [selectedRows, setSelectedRows] = useState([])
  const [quantidade, setQuantidade] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  
  const DATAAUTORIZADA = tipoTroca === 'CORTESIA' ? 32 : 90;

  const onRowSelect = (row, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, row]); 
    } else {
      setSelectedRows(selectedRows.filter(selectedRow => selectedRow.IDVENDA !== row.IDVENDA)); 
    }
  };

  
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };
  
  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vouchers Emitidos',
  });
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Nº Venda', 'Cliente', 'CPF/CNPJ' , 'Loja', 'Valor Pago', 'Data', 'Situação']
    worksheet['!cols'] = [
      { wpx: 50,  caption: 'Nº' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 200, caption: 'Cliente' },
      { wpx: 100, caption: 'CPF/CNPJ' },
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Valor Pago' },
      { wpx: 100, caption: 'Data' },
      { wpx: 100, caption: 'Situação' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vouchers Emitidos');
    XLSX.writeFile(workbook, 'venda_cliente_vouchers.xlsx');
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Nº Venda', 'Cliente', 'CPF/CNPJ' , 'Loja', 'Valor Pago', 'Data', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.IDVENDA,
        item.nomeClienteVenda,
        item.DEST_CPF,
        item.NOFANTASIA,
        formatMoeda(item.VRTOTALPAGO),
        item.DTHORAFECHAMENTO,
        item.STCANCELADO == 'True' ? 'Ativa' : 'Cancelada'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('venda_cliente_vouchers.pdf');
  };


  const dados = dadosVoucher.map((item, index) => {
    let contador = index + 1;
    const nomeClienteVenda = item.venda.DEST_CPF ? item.venda.DSNOMERAZAOSOCIAL + ' - ' + item.venda.DSAPELIDONOMEFANTASIA : item.venda.DSNOMERAZAOSOCIAL;
    return {
      contador,
      IDVENDA: item.venda.IDVENDA,
      nomeClienteVenda: nomeClienteVenda,
      DEST_CPF: item.venda.DEST_CPF,
      NOFANTASIA: item.venda.NOFANTASIA,
      VRTOTALPAGO: item.venda.VRTOTALPAGO,
      DTHORAFECHAMENTO: item.venda.DTHORAFECHAMENTO,
      STCANCELADO: item.venda.STCANCELADO,
      DSNOMERAZAOSOCIAL: item.venda.DSNOMERAZAOSOCIAL,
      DSAPELIDONOMEFANTASIA: item.venda.DSAPELIDONOMEFANTASIA,
      DEST_CNPJ: item.venda.DEST_CNPJ,
    }
  });

  const colunasVouchers = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{color: 'blue'}}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      // body: row => <th style={{color: 'blue'}}>{ocultaParteDosDadosVoucher(row.NUVOUCHER)}</th>,
      body: row => <th style={{color: 'blue'}}>{row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'nomeClienteVenda',
      header: 'Cliente',
      body: row => <th style={{color: 'blue'}}>{row.nomeClienteVenda}</th>,
      sortable: true,
    },
    {
      field: 'DEST_CPF',
      header: 'CPF/CNPJ',
      body: row => <th style={{color: 'blue'}}>{row.DEST_CPF}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <th style={{color: 'blue'}}>{row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Valor Pago',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRTOTALPAGO)}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Data',
      body: row => <th style={{color: 'green'}}>{row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => <th style={{color: 'green'}}>{row.STCANCELADO == 'True' ? 'Ativa' : 'Cancelada'}</th>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Opções',
      body: (row) => (
        <div style={{ display: "flex", justifyContent: "space-around", width: '7rem' }}>
          <div>

            <ButtonTable
              titleButton={"Visualizar Detalhes"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={GrFormView}
              iconSize={18}
              iconColor={"#fff"}
              cor={"success"}
            />
          </div>
        </div>
      ),
    }

  ]


  const handleClickDetalhar = async (row) => {
    if (row.IDVENDA) {
      handleDetalhar(row.IDVENDA)
    }

  }

  const handleDetalhar = async (IDVENDA) => {
    try {
      const response = await get(`/lista-venda-cliente?idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosVisualizarProdutos(response.data)
        setTabelaPrincipal(false)
        setTabelaSecundaria(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }
  

    const dadosProdutos = dadosVisualizarProdutos.flatMap((item) => {
    const { venda, detalhe } = item;
    
    return detalhe
      .filter(detalheItem => detalheItem.det.STCANCELADO === 'False') // ✅ Filtro produtos cancelados
      .map((detalheItem, index) => {
        const contadorIndex = index + 1;
        const quantidade = Number(detalheItem.det.QTD);
        const valorProd = Number(detalheItem.det.VRTOTALLIQUIDO);
        const valorProdUnit = Number(detalheItem.det.VUNTRIB);
        const valorTotalProdBruto = Number(detalheItem.det.VPROD);
        const descontoProduto = valorProdUnit - valorProd;
        
        return {
          CPROD: detalheItem.det.CPROD,
          IDVENDADETALHE: detalheItem.det.IDVENDADETALHE,
          XPROD: detalheItem.det.XPROD,
          NUCODBARRAS: detalheItem.det.NUCODBARRAS,
          QTD: quantidade,
          VRTOTALLIQUIDO: valorProd,
          VUNTRIB: valorProdUnit,
          VPROD: valorTotalProdBruto,
          STTROCA: detalheItem.det.STTROCA,
          VENDEDOR_MATRICULA: detalheItem.det.VENDEDOR_MATRICULA,
          STCANCELADO: detalheItem.det.STCANCELADO,
          contadorIndex: contadorIndex,
          // ✅ Campos adicionais para lógica de voucher
          descontoProduto: descontoProduto,
          idVenda: venda.IDVENDA,
          cpfCnpjCliente: venda.DEST_CPF || venda.DEST_CNPJ || "",
        };
      });
  });

   const dadosProdutosVenda = dadosVisualizarProdutos.length > 0 ? {
    IDVENDA: dadosVisualizarProdutos[0].venda.IDVENDA,
    DTHORAFECHAMENTO: dadosVisualizarProdutos[0].venda.DTHORAFECHAMENTO,
    diferenciaDias: retornaDiasEntreDatas(dadosVisualizarProdutos[0].venda.DTHORAFECHAMENTOFORMATEUA || dadosVisualizarProdutos[0].venda.DTHORAFECHAMENTO),
  } : {};

  const isProdutoForaDoPrazo = dadosProdutosVenda.diferenciaDias > DATAAUTORIZADA;

  const validaQtdDigitada = (row, novaQuantidade) => {
    const qtdOriginal = row.QTD;
    const qtdDigitada = Number(novaQuantidade) || 0;
    
    if (qtdDigitada > 0 && qtdDigitada <= qtdOriginal) {
      setQuantidade(prev => ({
        ...prev,
        [row.IDVENDADETALHE]: qtdDigitada
      }));
      return true;
    } else {
      alert(`Quantidade Inválida! Quantidade disponível: ${qtdOriginal}`);
      setQuantidade(prev => ({
        ...prev,
        [row.IDVENDADETALHE]: qtdOriginal
      }));
      return false;
    }
  };

  const colunasVouchers2 = [
    {
      field: 'contadorIndex',
      header: 'Nº',
      body: row => <p >{row.contadorIndex}</p>,
      sortable: true,
    },
    {
      field: 'IDVENDADETALHE',
      header: 'Selecione',
      body: row => {
        // ✅ CORREÇÃO: Lógica completa de disable do checkbox
        const isJaTrocado = row.STTROCA === "True";
        const isForaDoPrazo = isProdutoForaDoPrazo;
        const isQuantidadeBaixa = row.QTD <= 1;
        
        return (
          <Checkbox 
            onChange={e => onRowSelect(row, e.checked)} 
            checked={selectedRows.some(selectedRow => selectedRow.IDVENDADETALHE === row.IDVENDADETALHE)}
            disabled={isJaTrocado || isForaDoPrazo}
            title={
              isJaTrocado ? "PRODUTO JÁ TROCADO" :
              isForaDoPrazo ? `FORA DO PRAZO DE ${DATAAUTORIZADA} DIAS` :
              ""
            }
          />
        );
      },
      sortable: true,
    },
    {
      field: 'CPROD',
      header: 'Codigo Produto',
      body: row => <th >{row.CPROD}</th>,
      sortable: true,
    },
    {
      field: 'XPROD',
      header: 'Produto',
      body: row => <th >{row.XPROD}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Codigo Barras',
      body: row => <th >{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'Quantidade',
      body: row => {
        const isCheckboxChecked = selectedRows.some(selectedRow => selectedRow.IDVENDADETALHE === row.IDVENDADETALHE);
        const isDisabled = !isCheckboxChecked || row.QTD <= 1 || row.STTROCA === "True" || isProdutoForaDoPrazo;
        const currentQtd = quantidade[row.IDVENDADETALHE] || row.QTD;
         
        return (
          <div>
            <input 
              type="number" 
              name="quantidadeProduto"
              min="1"
              max={row.QTD}
              value={currentQtd}
              style={{ width: '80px', textAlign: 'center' }} 
              onChange={(e) => validaQtdDigitada(row, e.target.value)}
              disabled={isDisabled}
            />
          </div>
        );
      },
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Valor',
      body: row => <th style={{}} >{row.VRTOTALLIQUIDO} </th>,
      sortable: true,
    },
  ]



  return (
    <Fragment>
      {tabelaPrincipal && (
        <div className="panel">
          <div className="panel-hdr">
            <h2>Vouchers </h2>
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
              title="Vouchers "
              value={dados}
              globalFilter={globalFilterValue} 
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
            >
              {colunasVouchers.map(coluna => (
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
      )}

       {tabelaSecundaria && (
        <Fragment>
          <div className="panel">
            <div className="panel-hdr">
              {/* ✅ CORREÇÃO: Mensagem completa de prazo */}
              {isProdutoForaDoPrazo ? (
                <h2>
                  <span className="fw-500">
                    <i>Produtos - Venda: {dadosProdutosVenda.IDVENDA}</i>&nbsp;&nbsp;
                    <i className="text-danger h4">
                      Venda Fora do Prazo de <u><b>{DATAAUTORIZADA} DIAS</b></u> Para Troca do Tipo <u><b>{tipoTroca}</b></u>. 
                      Dias Passados Após a Compra: <u><b>{dadosProdutosVenda.diferenciaDias} DIAS</b></u>
                    </i>
                  </span>
                </h2>
              ) : (
                <h2>
                  <span className="fw-500">
                    <i>Produtos - Venda: {dadosProdutosVenda.IDVENDA}</i>
                  </span>
                </h2>
              )}
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
            
            <div className="card">
              <DataTable
                title="Produtos da Venda"
                value={dadosProdutos}
                globalFilter={globalFilterValue}
                size={size}
                sortOrder={-1}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[10, 20, 50, 100, dadosProdutos.length]}
                showGridlines
                stripedRows
                emptyMessage={<div className="dataTables_empty">Não há Produtos Na Venda</div>}
              >
                {colunasVouchers2.map(coluna => (
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
      )}
    </Fragment>
  )
}