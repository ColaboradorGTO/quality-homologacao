import React, { Fragment, useRef, useState, useEffect, useCallback } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrFormView } from "react-icons/gr";
import { get } from "../../../../api/funcRequest";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Checkbox } from "primereact/checkbox";
import Swal from "sweetalert2";


export const ActionListaVendasAutorizarTroca = ({
  dadosVendasPrazoExcedido,
  tabelaPrincipal,
  setTabelaPrincipal,
  tabelaSecundaria,
  setTabelaSecundaria,
  setBtnVisivel,
  setBtnAlterarVisivel,
  selectedRows,
  setSelectedRows
}) => {
  const [dadosVisualizarProdutos, setDadosVisualizarProdutos] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [quantidadesProdutos, setQuantidadesProdutos] = useState({});
  const dataTableRef = useRef();

  const onRowSelect = (row, checked) => {
    if (checked) {
      const newSelectedRows = [...selectedRows, row];
      setSelectedRows(newSelectedRows);
      setBtnAlterarVisivel(true)
    } else {
      setBtnAlterarVisivel(false);
      const newSelectedRows = selectedRows.filter(selectedRow => {
        if (row.contadorIndex !== undefined && selectedRow.contadorIndex !== undefined) {
          return selectedRow.contadorIndex !== row.contadorIndex;
        }
        return selectedRow.IDVENDA !== row.IDVENDA;
      });
      setSelectedRows(newSelectedRows);
    }
  };


  const handleQuantidadeChange = (contadorIndex, novaQuantidade) => {
    const quantidade = Math.max(1, parseInt(novaQuantidade) || 1);
    setQuantidadesProdutos(prev => ({
      ...prev,
      [contadorIndex]: quantidade
    }));
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Prazo Excedido',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Nº Venda', 'Cliente', 'CPF/CNPJ', 'Loja', 'Vr. Pago', 'Dt. Venda', 'Status', 'St.Cortesia', 'St.Defeito', 'Dias Passados']],
      body: dados.map(item => [
        item.contador,
        item.IDVENDA,
        item.nomeCliente,
        item.cpfCnpjCliente,
        item.NOFANTASIA,
        formatMoeda(item.VRTOTALPAGO),
        item.DTHORAFECHAMENTO,
        item.STCANCELADO == 'False' ? 'Ativa' : 'Cancelada',
        item.stCortesia,
        item.stDefeito,
        item.DIFERENCAEMDIAS
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_prazo_excedido.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Nº Venda', 'Cliente', 'CPF/CNPJ', 'Loja', 'Vr. Pago', 'Dt. Venda', 'Status', 'St.Cortesia', 'St.Defeito', 'Dias Passados'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 200, caption: 'Cliente' },
      { wpx: 100, caption: 'CPF/CNPJ' },
      { wpx: 150, caption: 'Loja' },
      { wpx: 100, caption: 'Vr. Pago' },
      { wpx: 100, caption: 'Dt. Venda' },
      { wpx: 100, caption: 'Status' },
      { wpx: 100, caption: 'St.Cortesia' },
      { wpx: 100, caption: 'St.Defeito' },
      { wpx: 100, caption: 'Dias Passados' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas prazo excedido');
    XLSX.writeFile(workbook, 'vendas_prazo_excedido.xlsx');
  };



  const dados = dadosVendasPrazoExcedido.map((item, index) => {
    let contador = index + 1;
    let stCortesia;
    let stDefeito;
    let nomeCliente = item.venda.DEST_CPF ? item.venda.DSNOMERAZAOSOCIAL + " " + item.venda.DSAPELIDONOMEFANTASIA : item.venda.DSNOMERAZAOSOCIAL;
    let cpfCnpjCliente = !item.venda.DEST_CNPJ ? item.venda.DEST_CPF : item.venda.DEST_CNPJ;
    const DATAHORAVENDA = new Date(item.venda.DTHORAFECHAMENTO.slice(6, 10), (item.venda.DTHORAFECHAMENTO.slice(3, 5) > 1 ? item.venda.DTHORAFECHAMENTO.slice(3, 5) - 1 : item.venda.DTHORAFECHAMENTO.slice(3, 5)), item.venda.DTHORAFECHAMENTO.slice(0, 2));
    const DATAHORAATUAL = new Date();
    const DIFERENCAEMDIAS = Math.ceil(Math.abs((DATAHORAATUAL.setHours(0, 0, 0, 0)) - DATAHORAVENDA.getTime()) / (1000 * 60 * 60 * 24));

    return {
      contador,
      IDVENDA: item.venda.IDVENDA,
      nomeCliente,
      cpfCnpjCliente,
      NOFANTASIA: item.venda.NOFANTASIA,
      VRTOTALPAGO: item.venda.VRTOTALPAGO,
      DTHORAFECHAMENTO: item.venda.DTHORAFECHAMENTO,
      STCANCELADO: item.venda.STCANCELADO == 'False' ? 'Ativa' : 'Cancelada',
      stCortesia: stCortesia = DIFERENCAEMDIAS <= 32 ? 'Ativa' : 'Inativa',
      stDefeito: stDefeito = DIFERENCAEMDIAS <= 90 ? 'Ativa' : 'Inativa',
      DIFERENCAEMDIAS: DIFERENCAEMDIAS,
    }
  });

  const colunasVendas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <p >{row.contador}</p>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <th >{row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'nomeCliente',
      header: 'Cliente',
      body: row => <th >{row.nomeCliente}</th>,
      sortable: true,
    },
    {
      field: 'cpfCnpjCliente',
      header: 'CPF/CNPJ',
      body: row => <th >{row.cpfCnpjCliente}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ width: '200px', fontWeight: 600 }} >{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Vr. Pago',
      body: row => <th >{formatMoeda(row.VRTOTALPAGO)}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Dt. Venda',
      body: row => <th >{row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Status',
      body: row => <th style={{ color: row.STCANCELADO == 'Ativa' ? '#2196F3' : '#fd3995', fontWeight: 900 }} >{row.STCANCELADO} </th>,
      sortable: true,
    },
    {
      field: 'stCortesia',
      header: 'St.Cortesia',
      body: row => <th style={{ color: row.stCortesia == 'Ativa' ? '#2196F3' || row.stCortesia == 'Inativa' : '#fd3995 ', fontWeight: 900 }} >{row.stCortesia} </th>,
      sortable: true,
    },
    {
      field: 'stDefeito',
      header: 'St.Defeito',
      body: row => <th style={{ color: row.stDefeito == 'Ativa' ? '#2196F3' || row.stDefeito == 'Inativa' : '#fd3995 ', fontWeight: 900 }} >{row.stDefeito} </th>,
      sortable: true,
    },

    {
      field: 'DIFERENCAEMDIAS',
      header: 'Dias Passados',
      body: row => <th style={{ color: row.DIFERENCAEMDIAS <= 32 ? '#fd3995' : '#2196F3', fontWeight: 900 }}>{row.DIFERENCAEMDIAS}</th>,
      sortable: true,
    },
    {
      header: 'Opções',
      body: (row) => (
        <div style={{ display: "flex", justifyContent: "space-around", width: '7rem' }}>
          <div>

            <ButtonTable
              titleButton={"Detalhar Produtos"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={GrFormView}
              iconSize={30}
              iconColor={"#fff"}
              cor={"success"}
              width="35px"
              height="35px"
            />
          </div>
        </div>
      ),
    }

  ]


  const handleClickDetalhar = async (row) => {
    if (row.IDVENDA) {
      handleDetalhar(row.IDVENDA, row.stCortesia, row.stDefeito)
    }
  }

  const handleDetalhar = async (IDVENDA, stCortesia, stDefeito) => {

    if (stCortesia === 'Ativa' && stDefeito === 'Ativa') {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        html:'Venda dentro do prazo de troca! Não há necessidade de autorização para efetuar a troca! <br/> Se não for o caso, verifique os dados da venda!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#886ab5',
        customClass: {
          container: 'custom-swal',
        },
      })
      return 
    }
    try {
      const response = await get(`/vendas-prazo-excedido?idVenda=${IDVENDA}`)
      if (response.data && response.data.length > 0) {
        setDadosVisualizarProdutos(response.data)
        setTabelaPrincipal(false)
        setTabelaSecundaria(true)
        setBtnVisivel(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }


  const dadosProdutos = dadosVisualizarProdutos.flatMap((item) => {
    const { venda, detalhe } = item;
    const DATAHORAVENDA = new Date(item.venda.DTHORAFECHAMENTO.slice(6, 10), (item.venda.DTHORAFECHAMENTO.slice(3, 5) > 1 ? item.venda.DTHORAFECHAMENTO.slice(3, 5) - 1 : item.venda.DTHORAFECHAMENTO.slice(3, 5)), item.venda.DTHORAFECHAMENTO.slice(0, 2));
    const DATAHORAATUAL = new Date();
    const DIFERENCAEMDIAS = Math.ceil(Math.abs((DATAHORAATUAL.setHours(0, 0, 0, 0)) - DATAHORAVENDA.getTime()) / (1000 * 60 * 60 * 24));

    return detalhe.map((detalheItem, index) => {
      const contadorIndex = index + 1;
      const qtdExcecao = Number(detalheItem.det.QTDAUTORIZADA) || 0;
      const quantidade = Number(detalheItem.det.QTD);
      const stCortesia = DIFERENCAEMDIAS >= 33 ? false : true;
      const stDefeito = DIFERENCAEMDIAS >= 91 ? false : true;
      const stTroca = (detalheItem.det.STTROCA === "True" || qtdExcecao === quantidade);
      const isChecked = stTroca;
      const isDisabled = stTroca;

      return {

        CPROD: detalheItem.det.CPROD,
        IDVENDADETALHE: detalheItem.det.IDVENDADETALHE,
        IDVENDA: detalheItem.det.IDVENDA,
        XPROD: detalheItem.det.XPROD,
        NUCODBARRAS: detalheItem.det.NUCODBARRAS,
        QTD: detalheItem.det.QTD,
        VRTOTALLIQUIDO: detalheItem.det.VRTOTALLIQUIDO,
        VUNTRIB: detalheItem.det.VUNTRIB,
        VPROD: detalheItem.det.VPROD,
        VENDEDOR_MATRICULA: detalheItem.det.VENDEDOR_MATRICULA,
        IDEXCECAO: detalheItem.det.IDEXCECAO,
        STEXCECAO: detalheItem.det.STEXCECAO,
        QTDAUTORIZADA: detalheItem.det.QTDAUTORIZADA,
        STTROCA: detalheItem.det.STTROCA,
        TIPOTROCA: detalheItem.det.TIPOTROCA,

        STCANCELADO: detalheItem.det.STCANCELADO,
        contadorIndex: contadorIndex,

        DIFERENCAEMDIAS,
        stCortesia,
        stDefeito,
        isChecked,
        isDisabled,
        // ✅ Tooltip/título para produtos já trocados
        tooltipText: isDisabled && isChecked ?
          (qtdExcecao === quantidade ?
            `PRODUTO JÁ AUTORIZADO PARA EXCEÇÃO: ${detalheItem.det.TIPOTROCA}` :
            'ESTE PRODUTO JÁ FOI TROCADO!') :
          (DIFERENCAEMDIAS >= 33 ?
            `VENDA FORA DO PRAZO DE 30 DIAS PARA A TROCA DO TIPO CORTESIA, JÁ SE PASSARAM: ${DIFERENCAEMDIAS} DIAS APÓS A COMPRA!` :
            (DIFERENCAEMDIAS >= 91 ?
              `VENDA FORA DO PRAZO DE 90 DIAS PARA A TROCAS DO TIPO CORTESIA OU DEFEITO, JÁ SE PASSARAM: ${DIFERENCAEMDIAS} DIAS APÓS A COMPRA!` :
              ''))

      };
    });
  });

  const dadosProdutosVenda = dadosVisualizarProdutos.flatMap((item) => {
    const DATAHORAVENDA = new Date(item.venda.DTHORAFECHAMENTO.slice(6, 10), (item.venda.DTHORAFECHAMENTO.slice(3, 5) > 1 ? item.venda.DTHORAFECHAMENTO.slice(3, 5) - 1 : item.venda.DTHORAFECHAMENTO.slice(3, 5)), item.venda.DTHORAFECHAMENTO.slice(0, 2));
    const DATAHORAATUAL = new Date();
    const DIFERENCAEMDIAS = Math.ceil(Math.abs((DATAHORAATUAL.setHours(0, 0, 0, 0)) - DATAHORAVENDA.getTime()) / (1000 * 60 * 60 * 24));


    return {
      IDVENDA: item.venda.IDVENDA,
      DTHORAFECHAMENTO: item.venda.DTHORAFECHAMENTO,

      DIFERENCAEMDIAS: DIFERENCAEMDIAS
    };

  });

  const getTituloDinamico = () => {
    if (!dadosProdutosVenda[0]) return null;

    const { IDVENDA, DIFERENCAEMDIAS } = dadosProdutosVenda[0];
    const qtdItensTrocados = dadosProdutos.filter(p => p.isDisabled && p.isChecked).length;
    const totalItens = dadosProdutos.length;

    if (totalItens - qtdItensTrocados === 0) {
      return (
        <h2>
          <span style={{ fontWeight: 500 }}>
            <i>Produtos _ Venda: {IDVENDA}</i> &nbsp;&nbsp;
            <i style={{ color: '#fd3995', fontWeight: 900 }}>
              Todos os Produtos Desta Venda Já Foram Trocados
            </i>
          </span>
        </h2>
      );
    } else if (DIFERENCAEMDIAS >= 33 && DIFERENCAEMDIAS < 90) {
      return (
        <h2>
          <span style={{ fontWeight: 500 }}>
            <i>Produtos - Venda: {IDVENDA}</i> &nbsp;&nbsp;
            <i style={{ color: '#fd3995', fontWeight: 900 }}>
              Venda Fora do Prazo de <u><b>30 dias</b></u> Para Troca do Tipo <u><b>CORTESIA</b></u>.
              Dias Passados Após a Compra: <u><b>{DIFERENCAEMDIAS} DIAS</b></u>
            </i>
          </span>
        </h2>
      );
    } else if (DIFERENCAEMDIAS >= 91) {
      return (
        <h2>
          <span style={{ fontWeight: 500 }}>
            <i>Produtos - Venda: {IDVENDA}</i> &nbsp;&nbsp;
            <i style={{ color: '#fd3995', fontWeight: 900 }}>
              Venda Fora do Prazo Para Trocas do Tipo <b>CORTESIA<u>(30 dias)</u></b> ou <b>DEFEITO<u>(90 dias)</u></b>.
              Dias Passados Após a Compra: <u><b>{DIFERENCAEMDIAS} DIAS</b></u>
            </i>
          </span>
        </h2>
      );
    } else {
      return (
        <h2>
          Produtos - Vendas {IDVENDA} &nbsp; - &nbsp;
          <span style={{ color: '#fd3995' }}>
            Dias Passados Após a Compra <b><u>{DIFERENCAEMDIAS} DIAS</u></b>
          </span>
        </h2>
      );
    }
  };

  const colunasProdutoVenda = [
    {
      field: 'contadorIndex',
      header: 'Nº',
      body: row => <p >{row.contadorIndex}</p>,
      sortable: true,
    },
    {
      field: 'contadorIndex',
      header: 'Selecione',
      body: row => (
        <Checkbox
          onChange={e => {
            onRowSelect(row, e.checked);

          }}
          checked={row.isChecked || selectedRows.some(selectedRow => selectedRow.contadorIndex === row.contadorIndex)}
          disabled={row.isDisabled}
        />
      ),
      sortable: true,
    },
    {
      field: 'CPROD',
      header: 'id Produto',
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
      header: 'Cod. Barras',
      body: row => <th >{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'Quantidade',
      body: row => <th >{row.QTD}</th>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'Quantidade',
      body: row => {
        const isCheckboxChecked = row.isChecked || selectedRows.some(selectedRow => selectedRow.contadorIndex === row.contadorIndex);
        const isDisabled = row.isDisabled || row.QTD <= 1 || isCheckboxChecked;
        const quantidadeAtual = quantidadesProdutos[row.contadorIndex] || row.QTD;
        return (
          <div >
            <input
              value={quantidadeAtual}
              min={1}
              max={row.QTD}
              step={1}
              style={{ width: '100px', textAlign: 'center' }}
              onChange={e => {
                handleQuantidadeChange(row.contadorIndex, e.value);
              }}
              disabled={isDisabled}
            />
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Valor',
      body: row => <th style={{}} >{formatMoeda(row.VRTOTALLIQUIDO)} </th>,
      sortable: true,
    },
  ]


  return (

    <Fragment>

      {tabelaPrincipal && (
        <>
          <div className="panel">
            <div className="panel-hdr">
              <h2>Vendas Voucher por Loja</h2>
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
                title="Vendas Voucher por Loja"
                value={dados}
                globalFilter={globalFilterValue}
                size="small"
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
                emptyMessage={<div className="dataTables_empty">Dados não encontrados, verifique os dados inseridos na pesquisa e tente novamente!</div>}
              >
                {colunasVendas.map(coluna => (
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

        </>
      )}

      {tabelaSecundaria && (
        <Fragment>
          <div className="panel">
            <div className="panel-hdr">
              {getTituloDinamico()}

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
                title="Vendas Voucher por Loja"
                value={dadosProdutos}
                globalFilter={globalFilterValue}
                size="small"
                selectionMode={rowClick ? null : 'single'}
                selection={rowClick}
                onSelectionChange={(e) => setRowClick(e.value)}
                sortOrder={-1}
                rowsPerPageOptions={[5, 10, 20, 50, 100, dadosProdutos.length]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                filterDisplay="menu"
                showGridlines
                stripedRows
                rowClassName={(row) => row.isDisabled ? 'row-disabled' : ''}
                emptyMessage={<div className="dataTables_empty">Dados não encontrados, verifique os dados inseridos na pesquisa e tente novamente!</div>}
              >
                {colunasProdutoVenda.map(coluna => (
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
        </Fragment>
      )}
    </Fragment>
  )
}