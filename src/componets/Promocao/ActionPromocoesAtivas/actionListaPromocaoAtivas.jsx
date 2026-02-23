import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";
import { formatMoeda } from "../../../utils/formatMoeda";
import { dataFormatada, dataHoraFormatada } from "../../../utils/dataFormatada";
import { ButtonTable } from "../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { ActionEditarPromocaoAtiva } from "./actionEditarPromocaoAtiva";
import { get } from "../../../api/funcRequest";



export const ActionListaPromocoesAtivas = ({
  dadosListaPromocao,
  usuarioLogado,
  actionPromocaoAtiva,
  setActionPromocaoAtiva,
  actionEditarVisivel,
  setActionEditarVisivel,
  dadosPromocao,
  setDadosPromocao
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [editingRows, setEditingRows] = useState({});
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Promoções Ativas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', , 'Descrição', 'Vr Preço Produto', 'Data Início', 'Data Fim']],
      body: dados.map(item => [
        item.IDRESUMOPROMOCAOMARKETING,
        item.DSPROMOCAOMARKETING,
        formatMoeda(item.VLPRECOPRODUTO),
        dataHoraFormatada(item.DTHORAINICIO),
        dataHoraFormatada(item.DTHORAFIM),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('promocoes_ativas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Descrição', 'Vr Preço Produto', 'Data Início', 'Data Fim'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Vr Preço Produto' },
      { wpx: 100, caption: 'Data Início' },
      { wpx: 100, caption: 'Data Fim' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Promoções Ativas');
    XLSX.writeFile(workbook, 'promocoes_ativas.xlsx');
  };



  const dados = dadosListaPromocao.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
      DSPROMOCAOMARKETING: item.DSPROMOCAOMARKETING,
      DTHORAINICIO: dataFormatada(item.DTHORAINICIO),
      DTHORAFIM: dataFormatada(item.DTHORAFIM),
      TPAPLICADOA: item.TPAPLICADOA,
      APARTIRDEQTD: item.APARTIRDEQTD,
      APARTIRDOVLR: item.APARTIRDOVLR,
      TPFATORPROMO: item.TPFATORPROMO,
      FATORPROMOVLR: item.FATORPROMOVLR,
      FATORPROMOPERC: item.FATORPROMOPERC,
      TPAPARTIRDE: item.TPAPARTIRDE,
      VLPRECOPRODUTO: formatMoeda(item.VLPRECOPRODUTO),
      STEMPRESAPROMO: item.STEMPRESAPROMO,
      STDETPROMOORIGEM: item.STDETPROMOORIGEM,
      STDETPROMODESTINO: item.STDETPROMODESTINO,
      STATIVO: item.STATIVO === 'True' ? 'ATIVO' : 'INATIVO',
    }
  });

    const colunasListaPromocao = [
      {
        field: 'IDRESUMOPROMOCAOMARKETING',
        header: 'ID',
        body: row => <th>{row.IDRESUMOPROMOCAOMARKETING}</th>,
        style: { width: '10%' },
        sortable: true,
      },
      {
        field: 'DSPROMOCAOMARKETING',
        header: 'Descrição',
        body: row => <th>{row.DSPROMOCAOMARKETING}</th>,
        style: { width: '30%' },
        sortable: true,
      },
  
      {
        field: 'DTHORAINICIO',
        header: 'Data Início',
        body: row => <th>{row.DTHORAINICIO}</th>,
        style: { width: '20%' },
        sortable: true,
      },
      {
        field: 'DTHORAFIM',
        header: 'Data Fim',
        body: row => <th>{row.DTHORAFIM}</th>,
        style: { width: '20%' },
        sortable: true,
      },
      {
        field: 'STATIVO',
        header: 'Status',
        body: row => <th style={{ color: row.STATIVO === 'ATIVO' ? 'blue' : 'red', fontWeight: 'bold' }} >{row.STATIVO}</th>,
        style: { width: '10%' },
        bodyStyle: { textAlign: 'center' },
        sortable: true,
      },
      {
        field: 'IDRESUMOPROMOCAOMARKETING',
        header: 'Opções',
        width: "15%",
        body: row => {
  
          return (
            <div >
              <ButtonTable
                titleButton={"Editar "}
                onClickButton={() => handleEdit(row)}
                Icon={CiEdit}
                iconSize={25}
                width="35px"
                height="35px"
                iconColor={"#fff"}
                cor={"primary"}
  
              />
            </div>
          )
        },
        sortable: true,
      },
    ]


  const handleEdit = async (row) => {
    try {
      const response = await get(`/promocoes-ativas?idResumoPromocao=${row.IDRESUMOPROMOCAOMARKETING}`);
      if (response.data && response.data.length > 0) {
        setDadosPromocao(response.data);
        setActionEditarVisivel(true);
        setActionPromocaoAtiva(false);
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }

  }

  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">
          <h2>Lista de Promoções Ativas</h2>

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
            title="Lista de Promoções"
            value={dados}
            size="small"
            dataKey="IDRESUMOPROMOCAOMARKETING"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={
              <div className="dataTables_empty">Nenhum resultado encontrado</div>
            }
          >
            {colunasListaPromocao.map((coluna, index) => (
              <Column
  
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem', border: '1px solid #e9e9e9' }}
              />

            ))}

          </DataTable>
        </div>
      </div>

    </Fragment>
  );
}
