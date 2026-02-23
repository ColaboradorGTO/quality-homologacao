import { Fragment, useState, useRef } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { get } from "../../../../api/funcRequest";
import { ActionDetalheProdutoPromocao } from "./ActionDetalhar/ActionProduto/actionDetalheProdutoPromocao";
import { ActionDetalheEmpresaPromocao } from "./ActionDetalhar/ActionEmpresa/actionDetalheEmpresaPromocao";
import { FaProductHunt, FaRegBuilding } from "react-icons/fa";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaPromocao = ({ dadosListaPromocao }) => {
  const [dadosListaPromocaoEmpresa, setDadosListaPromocaoEmpresa] = useState([])
  const [modalVisivel, setModalVisivel] = useState(false)
  const [dadosProdutoOrigem, setDadosProdutoOrigem] = useState([])
  const [dadosProdutoDestino, setDadosProdutoDestino] = useState([])
  const [modalDetalhePromocaoVisivel, setModalDetalhePromocaoVisivel] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Promoções',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descição', 'Data Início', 'Data Fim', 'TP Aplicação', 'QTD Apartir', 'Vr. Apartir', 'Vr. Fator', 'Fator %', 'TP Apartir', 'Vr. Produto']],
      body: dados.map(item => [
        item.contador,
        item.DSPROMOCAOMARKETING,
        dataFormatada(item.DTHORAINICIOFORMAT2),
        item.DTHORAFIMFORMAT2,
        item.TPAPLICADOA,
        item.APARTIRDEQTD,
        formatMoeda(item.APARTIRDOVLR),
        formatMoeda(item.FATORPROMOVLR),
        item.FATORPROMOPERC,
        item.TPAPARTIRDE,
        formatMoeda(item.VLPRECOPRODUTO),

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lsita_promocoes.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descição', 'Data Início', 'Data Fim', 'TP Aplicação', 'QTD Apartir', 'Vr. Apartir', 'Vr. Fator', 'Fator %', 'TP Apartir', 'Vr. Produto'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 200, caption: 'Descição' },
      { wpx: 100, caption: 'Data Início' },
      { wpx: 100, caption: 'Data Fim' },
      { wpx: 150, caption: 'TP Aplicação' },
      { wpx: 100, caption: 'QTD Apartir' },
      { wpx: 100, caption: 'Vr. Apartir' },
      { wpx: 100, caption: 'Vr. Fator' },
      { wpx: 100, caption: 'Fator %' },
      { wpx: 100, caption: 'TP Apartir' },
      { wpx: 100, caption: 'Vr. Produto' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Promoções');
    XLSX.writeFile(workbook, 'lista_promocoes.xlsx');
  };

  const dadosPromocao = dadosListaPromocao.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      DSPROMOCAOMARKETING: item.DSPROMOCAOMARKETING,
      DTHORAINICIOFORMAT2: item.DTHORAINICIOFORMAT2,
      DTHORAFIMFORMAT2: item.DTHORAFIMFORMAT2,
      TPAPLICADOA: item.TPAPLICADOA,
      APARTIRDEQTD: item.APARTIRDEQTD,
      APARTIRDOVLR: item.APARTIRDOVLR,
      FATORPROMOVLR: item.FATORPROMOVLR,
      FATORPROMOPERC: item.FATORPROMOPERC,
      TPAPARTIRDE: item.TPAPARTIRDE,
      VLPRECOPRODUTO: item.VLPRECOPRODUTO,

      TPFATORPROMO: item.TPFATORPROMO,
      IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
    }
  });

  const colunasPromocao = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
      width: '5%'
    },
    {
      field: 'DSPROMOCAOMARKETING',
      header: 'Descrição',
      body: row => <th>{row.DSPROMOCAOMARKETING}</th>,
      sortable: true,
      width: '10%'
    },
    {
      field: 'DTHORAINICIOFORMAT2',
      header: 'Data Início',
      body: row => <th>{row.DTHORAINICIOFORMAT2}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFIMFORMAT2',
      header: 'Data Fim',
      body: row => <th>{row.DTHORAFIMFORMAT2}</th>,
      sortable: true,
    },
    {
      field: 'TPAPLICADOA',
      header: 'TP Aplicação',
      body: row => <th>{row.TPAPLICADOA}</th>,
      sortable: true,
      width: '15%'
    },
    {
      field: 'APARTIRDEQTD',
      header: 'QTD Apartir',
      body: row => <th>{row.APARTIRDEQTD}</th>,
      sortable: true,
    },
    {
      field: 'APARTIRDOVLR',
      header: 'Vr. Apartir',
      body: row => <th>{formatMoeda(row.APARTIRDOVLR)}</th>,
      sortable: true,
    },
    {
      field: 'FATORPROMOVLR',
      header: 'Vr. Fator',
      body: row => <th>{formatMoeda(row.FATORPROMOVLR)}</th>,
      sortable: true,
    },
    {
      field: 'FATORPROMOPERC',
      header: 'Fator %',
      body: row => <th>{row.FATORPROMOPERC}</th>,
      sortable: true,
    },
    {
      field: 'TPAPARTIRDE',
      header: 'TP Apartir',
      body: row => <th>{row.TPAPARTIRDE}</th>,
      sortable: true,
    },
    {
      field: 'VLPRECOPRODUTO',
      header: 'Vr. Produto',
      body: row => <th>{formatMoeda(row.VLPRECOPRODUTO)}</th>,
      sortable: true,
    },
    {
      field: 'IDRESUMOPROMOCAOMARKETING',
      header: 'Opções',
      width: '10%',
      button: true,
      body: (row) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Empresas da Promoção"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={FaRegBuilding}
              iconSize={18}
              iconColor={"#fff"}
              cor={"success"}

            />

          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Produtos da Promoção"}
              onClickButton={() => handleClickDetalharProduto(row)}
              Icon={FaProductHunt}
              iconSize={18}
              iconColor={"#fff"}
              cor={"info"}
            />

          </div>

        </div>

      ),
    },

  ]

  const handleDetalhar = async (IDRESUMOPROMOCAOMARKETING) => {

    try {
      const response = await get(`/listaEmpresaPromocoes?idResumoPromocoes${IDRESUMOPROMOCAOMARKETING}`)
      if (response.data && response.data.length > 0) {
        setDadosListaPromocaoEmpresa(response.data)

        setModalVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickDetalhar = (row) => {
    if (row && row.IDRESUMOPROMOCAOMARKETING) {
      handleDetalhar(row.IDRESUMOPROMOCAOMARKETING);
    }
  };

  const handleDetalharProduto = async (IDRESUMOPROMOCAOMARKETING) => {

    try {
      const response = await get(`/listaProdutosOrigemPromocoes?idResumoPromocoes${IDRESUMOPROMOCAOMARKETING}`)
      const response2 = await get(`/listaProdutoDestinoPromocoes?idResumoPromocoes${IDRESUMOPROMOCAOMARKETING}`)
      setDadosProdutoDestino(response2.data)
      if (response.data && response.data.length > 0) {
        setDadosProdutoOrigem(response.data)
        setModalDetalhePromocaoVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickDetalharProduto = (row) => {
    if (row && row.IDRESUMOPROMOCAOMARKETING) {
      handleDetalharProduto(row.IDRESUMOPROMOCAOMARKETING);
    }
  };

  return (
    <Fragment>
      <div className="panel" style={{ marginTop: "5rem" }}>
        <div className="panel-hdr">
          <h2>Lista de Promoções </h2>
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
            title="Progamação Promoções"
            value={dadosPromocao}
            size="small"
            globalFilter={globalFilterValue}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosPromocao.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasPromocao.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
      <ActionDetalheEmpresaPromocao
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosListaPromocaoEmpresa={dadosListaPromocaoEmpresa}
        dadosListaPromocao={dadosListaPromocao}
      />

      <ActionDetalheProdutoPromocao
        show={modalDetalhePromocaoVisivel}
        handleClose={() => setModalDetalhePromocaoVisivel(false)}
        dadosProdutoOrigem={dadosProdutoOrigem}
        dadosProdutoDestino={dadosProdutoDestino}
        dadosListaPromocao={dadosListaPromocao}
      />
    </Fragment>
  )
}