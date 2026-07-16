import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { get } from "../../../../api/funcRequest";
import { ModalImprimirQuebra } from "../../Components/ModalImprimirQuebra";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useCancelarQuebraCaixa } from "./hooks/useCancelar";
import Swal from "sweetalert2";

export const ActionListaQuebraCaixaLojaNegativa = ({ dadosQuebraDeCaixaNegativa, handleClick, optionsModulos, usuarioLogado }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosQuebraCaixasModal, setDadosQuebraCaixasModal] = useState([])
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
      head: [['Nº', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação']],
      body: dadosNegativo.map(item => [
        item.IDQUEBRACAIXA,
        item.DTLANCAMENTO,
        item.IDMOVIMENTOCAIXA,
        item.IDFUNCIONARIO,
        item.NOMEOPERADOR,
        formatMoeda(item.VRQUEBRASISTEMA),
        formatMoeda(item.VRQUEBRAEFETIVADO),
        item.TXTHISTORICO,
        item.STATIVO == 'True' ? 'Ativo' : 'Inativo'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('quebra_caixa_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosNegativo);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'DT Lançamento' },
      { wpx: 150, caption: 'Nº Mov' },
      { wpx: 100, caption: 'Matrícula' },
      { wpx: 150, caption: 'Colaborador' },
      { wpx: 100, caption: 'Vr. Quebra Sistema' },
      { wpx: 100, caption: 'Vr. Quebra Lançado' },
      { wpx: 150, caption: 'Historíco' },
      { wpx: 100, caption: 'Situação' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Quebra de Caixas');
    XLSX.writeFile(workbook, 'quebra_caixa_loja.xlsx');
  };

  const dadosNegativo = dadosQuebraDeCaixaNegativa.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      IDMOVIMENTOCAIXA: item.IDMOVIMENTOCAIXA,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      NOMEOPERADOR: item.NOMEOPERADOR,
      CPFOPERADOR: item.CPFOPERADOR,
      IDQUEBRACAIXA: item.IDQUEBRACAIXA,
      VRQUEBRASISTEMA: item.VRQUEBRASISTEMA,
      VRQUEBRAEFETIVADO: item.VRQUEBRAEFETIVADO,
      TXTHISTORICO: item.TXTHISTORICO,
      STATIVO: item.STATIVO == 'True' ? 'Ativo' : 'Inativo',

    }
  });

  const colunasQuebraDeCaixaNegativa = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}> {row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th style={{ color: 'blue' }}> {row.NOFANTASIA} </th>,
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
      field: 'IDFUNCIONARIO',
      header: 'Matrícula',
      body: row => <th style={{ color: 'blue' }}> {row.IDFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'NOMEOPERADOR',
      header: 'Colaborador',
      body: row => <th style={{ color: 'blue' }}> {row.NOMEOPERADOR}</th>,
      sortable: true,
    },
    {
      field: 'CPFOPERADOR',
      header: 'CPF',
      body: row => <th style={{ color: 'blue' }}> {row.CPFOPERADOR}</th>,
      sortable: true,
    },
    {
      field: 'VRQUEBRASISTEMA',
      header: 'Vr Quebra Sistema',
      body: row => <th style={{ color: row.VRQUEBRASISTEMA > 0 ? 'blue' : 'red' }}> {formatMoeda(row.VRQUEBRASISTEMA)}</th>,
      sortable: true,
    },
    {
      field: 'VRQUEBRAEFETIVADO',
      header: 'Vr Quebra Lançado',
      body: row => <th style={{ color: row.VRQUEBRAEFETIVADO > 0 ? 'blue' : 'red' }}> {formatMoeda(row.VRQUEBRAEFETIVADO)}</th>,
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
          <div style={{ color: row.STATIVO == "True" ? 'blue' : 'red' }}>
            <th style={{}}> {row.STATIVO == 'True' ? "Ativo" : "Inativo"}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'Opcoes',
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
                  disabledBTN={optionsModulos[0]?.ALTERAR == 'False' ? true : false}

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
                width="35px"
                height="35px"
                iconSize={18}
                onClickButton={() => handleClickCancelar(row.IDQUEBRACAIXA, true)}
                disabledBTN={optionsModulos[0]?.ALTERAR == 'False' ? true : false}

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
          position: 'center',
          icon: 'warning',
          title: 'Nenhum dado encontrado para esta quebra de caixa!',
          showConfirmButton: false,
          timer: 5000,
          customClass: {
            container: 'custom-swal',
          }
        })
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickImprimir = (row) => {
    if (row && row.IDQUEBRACAIXA) {
      handleImprimir(row.IDQUEBRACAIXA);
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
          <h2>Quebra Negativas de Caixa das Lojas</h2>
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
            title="Quebra Negativas de Caixa das Lojas"
            value={dadosNegativo}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosNegativo.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            cellMemo={false}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado negativa</div>}
          >
            {colunasQuebraDeCaixaNegativa.map(coluna => (
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

      <ModalImprimirQuebra
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosQuebraCaixasModal={dadosQuebraCaixasModal}
      />
    </Fragment>
  )
}
