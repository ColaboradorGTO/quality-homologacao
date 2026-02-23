import React, { Fragment, useEffect, useRef, useState } from "react"
import { dataFormatada } from "../../../../utils/dataFormatada"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { get } from "../../../../api/funcRequest"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable"
import { GrView } from "react-icons/gr"
import { FaCashRegister } from "react-icons/fa";
import { ActionDetalheVendaModal } from "../Modal/actionDetalheVendaModal";
import { ActionRelacaoRecebimentosModal } from "../Modal/ActionRecebimento/actionRelacaoRecebimentosModal";
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaVendas = ({ dadosVendasLoja }) => {
  const [dadosPagamentoModal, setDadosPagamentoModal] = useState([]);
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false);
  const [modalDetalheVendasVisivel, setModalDetalheVendasVisivel] = useState(false);
  const [totalVRTOTALPAGO, setTotalVRTOTALPAGO] = useState(0);
  const [dadosVendas, setDadosVendas] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Dados CSV',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Caixa', 'Versão', 'Nº Venda', 'NFC-e', 'Abertura', 'Operador', 'Valor', 'Nota', 'Migrado Sap']],
      body: dados.map(item => [
        item.contador,
        item.IDCAIXAWEB,
        item.VSSISTEMA,
        item.IDVENDA,
        item.NFE_INFNFE_IDE_NNF,
        item.DTHORAFECHAMENTO,
        item.NOFUNCIONARIO,
        formatMoeda(item.VRTOTALPAGO),
        item.STCONTINGENCIA == 'False' ? 'Contigência' : 'Emitida',
        item.STCONFERIDO == 1 ? 'Sim' : 'Não',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_dadosCSV.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Caixa', 'Versão', 'Nº Venda', 'NFC-e', 'Abertura', 'Operador', 'Valor', 'Nota', 'Migrado Sap']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 200, caption: 'Caixa' },
      { wpx: 200, caption: 'Versão' },
      { wpx: 200, caption: 'Nº Venda' },
      { wpx: 200, caption: 'NFC-e' },
      { wpx: 200, caption: 'Abertura' },
      { wpx: 200, caption: 'Operador' },
      { wpx: 200, caption: 'Valor' },
      { wpx: 200, caption: 'Nota' },
      { wpx: 200, caption: 'Migrado Sap' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Dados CSV');
    XLSX.writeFile(workbook, 'lista_dadosCSV.xlsx');
  };

  const dados = dadosVendasLoja.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      IDCAIXAWEB: `${item.IDCAIXAWEB} - ${item.DSCAIXA}`,
      VSSISTEMA: item.VSSISTEMA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      VRTOTALPAGO: item.VRTOTALPAGO,
      STCONTINGENCIA: item.STCONTINGENCIA,
      STCONFERIDO: item.STCONFERIDO,

    };
  });

  useEffect(() => {
    const totalVendas = calcularTotalVendas();
    setTotalVRTOTALPAGO(totalVendas);
  }, []);

  const calcularTotalVendas = () => {
    let total = 0;
    for (let venda of dados) {
      total += parseFloat(venda.VRTOTALPAGO);
    }
    return total;
  }

  const colunasVendas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <p style={{ fontWeight: 700 }}>{row.contador}</p>,
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Caixa',
      body: row => <p style={{ width: '100px', fontWeight: 700 }} >{row.IDCAIXAWEB}</p>,
      sortable: true,

    },
    {
      field: 'VSSISTEMA',
      header: 'Versão',
      body: row => <p style={{ width: '100px', fontWeight: 700 }} >{row.VSSISTEMA}</p>,
      sortable: true,

    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <p style={{ width: '100px', fontWeight: 700 }}>{row.IDVENDA}</p>,
      sortable: true,

    },
    {
      field: 'NFE_INFNFE_IDE_NNF',
      header: 'NFC-e',
      body: row => <p style={{ width: '100px', fontWeight: 700 }}>{toFloat(row.NFE_INFNFE_IDE_NNF)}</p>,
      sortable: true,

    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Abertura',
      body: row => <p style={{ width: '200px', fontWeight: 700 }}>{row.DTHORAFECHAMENTO}</p>,
      sortable: true,

    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <p style={{ width: '300px', fontWeight: 700 }}>{row.NOFUNCIONARIO}</p>,
      sortable: true,
      footer: <p style={{ fontWeight: 700 }}>Total Vendas Ativas</p>,
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Valor',
      body: row => <p style={{ width: '100px', fontWeight: 700 }}>{formatMoeda(row.VRTOTALPAGO)}</p>,
      sortable: true,
      footer: <p style={{ fontWeight: 700 }}>{formatMoeda(calcularTotalVendas())}</p>,
    },
    {
      field: 'STCONTINGENCIA',
      header: 'Nota',
      body: (
        (row) => (
          <p style={{ fontWeight: 700, color: row.STCONTINGENCIA == 'False' ? 'red' : 'blue' }}>
            {row.STCONTINGENCIA == 'False' ? 'Contigência' : 'Emitida'}

          </p>
        )
      ),
      sortable: true,
    },
    {
      field: 'STCONFERIDO',
      header: 'Migrado Sap',
      body: (
        (row) => (
          <p style={{ fontWeight: 700, color: row.STCONFERIDO == 1 ? 'blue' : 'red' }}>
            {row.STCONFERIDO == 1 ? 'Sim' : 'Não'}

          </p>
        )
      ),
      sortable: true,
    },
    {
      field: 'STCONFERIDO',
      header: 'Opções',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="p-1">
              <ButtonTable
                titleButton={"Detalhar Venda"}
                onClickButton={() => handleClickDetalhar(row)}
                Icon={GrView}
                iconSize={18}
                iconColor={"#fff"}
                cor={"primary"}
                width="30px"
                height="30px"

              />

            </div>
            <div className="p-1">
              <ButtonTable
                titleButton={"Recebimento"}
                onClickButton={() => handleClickPagamento(row)}
                Icon={FaCashRegister}
                iconSize={18}
                iconColor={"#fff"}
                cor={"info"}
                width="30px"
                height="30px"
              />

            </div>

          </div>
        )

      ),
      sortable: true,
    },

  ]

  const handleDetalha = async (IDVENDA) => {
    try {
      const response = await get(`/detalhe-Venda?idVenda=${IDVENDA}`);
      if (response.data) {
        setDadosVendas(response.data);
        setModalDetalheVendasVisivel(true);
      }
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, detalhe Venda");
    }
  }

  const handleClickDetalhar = (row) => {
    if (row && row.IDVENDA) {
      handleDetalha(row.IDVENDA);
    }
  }

  const handleEditPagamento = async (IDVENDA) => {
    try {
      const response = await get(`/vendas-recebimentos?idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosPagamentoModal(response.data)
        setModalPagamentoVisivel(true)
      }
    } catch (error) {
      console.log(error, 'não foi possivel pegar os dados da tabela')
    }
  }

  const handleClickPagamento = (row) => {
    if (row.IDVENDA) {
      handleEditPagamento(row.IDVENDA)
    }
  }


  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista Exportar Dados Para CSV</h2>
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
            value={dados}
            size={size}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
          >
            {colunasVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>
        </div>
      </div>

       <ActionDetalheVendaModal
        show={modalDetalheVendasVisivel}
        handleClose={() => setModalDetalheVendasVisivel(false)}
        dadosVendas={dadosVendas}
      />

      <ActionRelacaoRecebimentosModal
        show={modalPagamentoVisivel}
        handleClose={() => setModalPagamentoVisivel(false)}
        dadosPagamentoModal={dadosPagamentoModal}
      /> 
    </Fragment>
  )
}