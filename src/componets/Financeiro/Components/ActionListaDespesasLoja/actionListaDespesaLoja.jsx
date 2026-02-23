import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AiOutlineDelete } from "react-icons/ai"
import { dataFormatada } from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionAjusteDespesasModal } from "./ActionAjusteDespesaLoja/actionAjusteDespesasModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import { useEditarDespesa } from "./hooks/useEditarDespesa";

export const ActionListaDespesaLoja = ({ dadosDespesasLoja, usuarioLogado, optionsModulos, handleClick }) => {
  const { onSubmit } = useEditarDespesa(usuarioLogado, optionsModulos, handleClick);
  const [modalDespesasVisivel, setModalDespesasVisivel] = useState(false);
  const [dadosDespesasLojaDetalhe, setDadosDespesasLojaDetalhe] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Despesas por Lojas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Data Mov.', 'Descrição', 'Valor', 'Pago A', 'Histórico', 'Tipo Nota', 'Nota Fiscal', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DTDESPESA,
        item.DSCATEGORIA,
        formatMoeda(item.VRDESPESA),
        item.DSPAGOA,
        item.DSHISTORIO,
        item.TPNOTA,
        item.NUNOTAFISCAL,
        item.STCANCELADO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('despesas_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Data Mov.', 'Descrição', 'Valor', 'Pago A', 'Histórico', 'Tipo Nota', 'Nota Fiscal', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Data Mov.' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 100, caption: 'Pago A' },
      { wpx: 200, caption: 'Histórico' },
      { wpx: 100, caption: 'Tipo Nota' },
      { wpx: 200, caption: 'Nota Fiscal' },
      { wpx: 100, caption: 'Situação' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Despesas por Lojas');
    XLSX.writeFile(workbook, 'despesas_loja.xlsx');
  };

  const dados = Array.isArray(dadosDespesasLoja) ? dadosDespesasLoja.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DTDESPESA: item.DTDESPESA,
      IDDESPESASLOJA: item.IDDESPESASLOJA,
      DSCATEGORIA: item.DSCATEGORIA,
      VRDESPESA: item.VRDESPESA,
      DSPAGOA: item.DSPAGOA,
      DSHISTORIO: item.DSHISTORIO,
      TPNOTA: item.TPNOTA,
      NUNOTAFISCAL: item.NUNOTAFISCAL,
      STCANCELADO: item.STCANCELADO,

      IDCATEGORIARECDESP: item.IDCATEGORIARECEITADESPESA,

    }
  }) : [];

  const colunasEmpresas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th style={{ color: 'blue' }}> {row.NOFANTASIA} </th>,
      sortable: true,
    },
    {
      field: 'DTDESPESA',
      header: 'Data Mov',
      body: row => <th style={{ color: 'blue' }}> {dataFormatada(row.DTDESPESA)} </th>,
      sortable: true,
    },
    {
      field: 'DSCATEGORIA',
      header: 'Descrição',
      body: row => <th style={{ color: 'blue' }}> {row.DSCATEGORIA} </th>,
      sortable: true,
    },
    {
      field: 'VRDESPESA',
      header: 'Valor',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRDESPESA)} </th>,
      sortable: true,
    },
    {
      field: 'DSPAGOA',
      header: 'Pago a',
      body: row => <th style={{ color: 'blue' }}> {row.DSPAGOA} </th>,
      sortable: true,
    },
    {
      field: 'DSHISTORIO',
      header: 'Histórico',
      body: row => <th style={{ color: 'blue' }}> {row.DSHISTORIO} </th>,
      sortable: true,
    },
    {
      field: 'TPNOTA',
      header: 'Tipo Nota',
      body: row => <th style={{ color: row.TPNOTA == 1 ? 'blue' : 'red' }}> {row.TPNOTA == 1 ? 'NFE' : 'NFCE'} </th>,
      sortable: true,
    },
    {
      field: 'NUNOTAFISCAL',
      header: 'Nota Fiscal',
      body: row => <th style={{ color: 'blue' }}> {row.NUNOTAFISCAL} </th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => (
        <div style={{ color: row.STCANCELADO == 'False' ? 'blue' : 'red' }}>
          {row.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}
        </div>
      ),
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Opções',
      width: '250px',
      body: row => {
        if (row.STCANCELADO == 'False') {
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
                  titleButton={"Editar Despesa"}
                  onClickButton={() => handleClickEditar(row)}
                  Icon={CiEdit}
                  iconColor={"#fff"}
                  cor={"primary"}
                  iconSize={25}
                  width="30px"
                  height="30px"
                />

              </div>
              <div>

                <ButtonTable
                  titleButton={"Cancelar Despesa"}
                  onClickButton={() => onSubmit(row, true)}
                  Icon={AiOutlineDelete}
                  iconColor={"#fff"}
                  cor={"danger"}
                  iconSize={25}
                  width="30px"
                  height="30px"
                />
              </div>
            </div>
          )

        } else {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",

              }}
            >
              <ButtonTable
                titleButton={"Ativar Despesa"}
                onClickButton={() => onSubmit(row, false)}
                Icon={FaCheck}
                iconSize={25}
                width="30px"
                height="30px"
                iconColor={"#fff"}
                cor={"success"}
              />


            </div>
          )
        }
      }
    }
  ]

  const handleEditar = async (IDDESPESASLOJA) => {
    try {
      const response = await get(`/despesa-Loja-todos?idDespesas=${IDDESPESASLOJA}`);

      if (response.data && response.data.length > 0) {
        setDadosDespesasLojaDetalhe(response.data)
        setModalDespesasVisivel(true);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Erro!',
          text: 'Detalhes da despesa não encontrados.',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            container: 'custom-swal',
          }
        })
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };


  const handleClickEditar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDDESPESASLOJA) {
        handleEditar(row.IDDESPESASLOJA);
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

  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Despesas por Loja</h2>
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
            title="Vendas por Loja"
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
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', color: '#d1cdc7' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionAjusteDespesasModal
        show={modalDespesasVisivel}
        handleClose={() => setModalDespesasVisivel(false)}
        dadosDespesasLojaDetalhe={dadosDespesasLojaDetalhe}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />
    </Fragment>
  )
}