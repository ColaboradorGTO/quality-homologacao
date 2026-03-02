import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { useCancelarQuebraCaixa } from "./hooks/useCancelar";

export const ActionListaQuebraCaixaLojaPositiva = ({ dadosQuebraDeCaixaPositiva, handleClick, optionsModulos, usuarioLogado }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const {
    handleCancelar
  } = useCancelarQuebraCaixa({ usuarioLogado, optionsModulos, handleClick })
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Quebra de Caixas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação']],
      body: dadosPositiva.map(item => [
        item.IDQUEBRACAIXA,
        item.DTLANCAMENTO,
        item.IDMOVIMENTOCAIXA,
        item.IDFUNCIONARIO,
        item.NOMEOPERADOR,
        item.VRQUEBRASISTEMA,
        item.VRQUEBRAEFETIVADO,
        item.TXTHISTORICO,
        item.STATIVO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('quebra_caixa_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosPositiva);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Quebra de Caixas');
    XLSX.writeFile(workbook, 'quebra_caixa_loja.xlsx');
  };

  const dadosPositiva = dadosQuebraDeCaixaPositiva.map((item) => {
    return {
      IDQUEBRACAIXA: item.IDQUEBRACAIXA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      IDMOVIMENTOCAIXA: item.IDMOVIMENTOCAIXA,
      NOMEOPERADOR: item.NOMEOPERADOR,
      VRQUEBRASISTEMA: item.VRQUEBRASISTEMA,
      VRQUEBRAEFETIVADO: item.VRQUEBRAEFETIVADO,
      TXTHISTORICO: item.TXTHISTORICO,
      STATIVO: item.STATIVO

    }
  });

  const colunasQuebraDeCaixaPositiva = [
    {
      field: 'IDQUEBRACAIXA',
      header: 'ID',
      body: row => <th style={{ color: 'blue' }}> {row.IDQUEBRACAIXA} </th>,
      sortable: true,
    },
    {
      field: 'DTLANCAMENTO',
      header: 'DT Lançamento',
      body: row => <th style={{ color: 'blue' }}> {dataFormatada(row.DTLANCAMENTO)}</th>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTOCAIXA',
      header: 'Nº Movimento',
      body: row => <th style={{ color: 'blue' }}> {row.IDMOVIMENTOCAIXA}</th>,
      sortable: true,
    },
    {
      field: 'NOMEOPERADOR',
      header: 'Colaborador',
      body: row => <th style={{ color: 'blue' }}> {row.NOMEOPERADOR}</th>,
      sortable: true,
    },
    {
      field: 'VRQUEBRASISTEMA',
      header: 'Vr Quebra Sistema',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRQUEBRASISTEMA)}</th>,
      sortable: true,
    },
    {
      field: 'VRQUEBRAEFETIVADO',
      header: 'Vr Quebra Lançado',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRQUEBRAEFETIVADO)}</th>,
      sortable: true,
    },
    {
      field: 'TXTHISTORICO',
      header: 'Histórico',
      body: row => <th style={{ color: 'blue' }}> {row.TXTHISTORICO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (row) => {
        return (
          <th style={{ color: row.STATIVO == "True" ? 'blue' : 'red' }}> {row.STATIVO == 'True' ? "Ativo" : "Inativo"}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Opções',
      body: (row) => {
        if (row.STATIVO == 'True') {
          return (

            <div className="d-flex "
              style={{ justifyContent: "space-between" }}
            >
              <div className="mr-2">
                <ButtonTable
                  titleButton={"Cancelar Quebra"}
                  cor={"danger"}
                  Icon={FaRegTrashAlt}
                  iconSize={18}
                  width="35px"
                  height="35px"
                  onClickButton={() => handleClickCancelar(row.IDQUEBRACAIXA, false)}
                />

              </div>
              <div>
                <ButtonTable
                  titleButton={"Imprimir Quebra"}
                  cor={"primary"}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={18}
                  width="35px"
                  height="35px"
                  onClickButton={() => handleClickImprimir(row)}
                />
              </div>
            </div>
          )
        } else {
          return (
            <div>
              <ButtonTable
                titleButton={"Ativar Quebra"}
                cor={"success"}
                Icon={FaCheck}
                iconSize={18}
                width="35px"
                height="35px"
                onClickButton={() => handleClickCancelar(row.IDQUEBRACAIXA, true)}
              />
            </div>
          )
        }
      }
    },
  ]


  const handleImprimir = async (IDQUEBRACAIXA) => {
    try {
      const response = await get(`/quebraCaixaQuebraCaixa?idQuebraCaixa=${IDQUEBRACAIXA}`);
      if (response.data && response.data.length > 0) {
        setDadosQuebraCaixasModal(response.data);
        setModalVisivel(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Atenção',
          text: 'Detalhes da quebra de caixa não encontrados para impressão.',
          timer: 6000,
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickImprimir = (row) => {
    if (optionsModulos[0]?.IMPRIMIR == 'True') {
      if (row && row.IDQUEBRACAIXA) {
        handleImprimir(row.IDQUEBRACAIXA);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Você não tem permissão para imprimir a quebra de caixa!',
        timer: 3000,
      });
    }
  };

  const handleClickCancelar = (IDQUEBRA, status) => {
    if (IDQUEBRA) {
      handleCancelar(IDQUEBRA, status);
    }
  };

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Quebra Positivas de Caixa das Lojas</h2>
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
            title="Quebra Positivas de Caixa das Lojas"
            value={dadosPositiva}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosPositiva.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado positiva</div>}
          >
            {colunasQuebraDeCaixaPositiva.map(coluna => (
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
  )
}
