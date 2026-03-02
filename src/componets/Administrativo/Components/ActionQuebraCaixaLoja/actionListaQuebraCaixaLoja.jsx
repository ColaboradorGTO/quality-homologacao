import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { get} from "../../../../api/funcRequest";
import { ModalImprimirQuebra } from "../../Components/ModalImprimirQuebra";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { mascaraValor } from "../../../../utils/mascaraValor";
import { toFloat } from "../../../../utils/toFloat";
import { useCancelarQuebraCaixa } from "./hooks/useCancelar";


export const ActionListaQuebraCaixaLoja = ({ dadosQuebraDeCaixa, handleClick, quebraSelecionada, optionsModulos, usuarioLogado }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosQuebraCaixasModal, setDadosQuebraCaixasModal] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
  const handleCloseModal = () => setModalVisivel(false);
  const {
    handleCancelar
  } = useCancelarQuebraCaixa({usuarioLogado, optionsModulos, handleClick})
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
      body: dados.map(item => [
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
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'ID' }, 
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

  const dados = dadosQuebraDeCaixa.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      IDQUEBRACAIXA: item.IDQUEBRACAIXA,
      NOFANTASIA: item.NOFANTASIA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      IDMOVIMENTOCAIXA: item.IDMOVIMENTOCAIXA,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      NOMEOPERADOR: item.NOMEOPERADOR,
      CPFOPERADOR: item.CPFOPERADOR,
      VRQUEBRASISTEMA: toFloat(item.VRQUEBRASISTEMA),
      VRQUEBRAEFETIVADO: toFloat(item.VRQUEBRAEFETIVADO),
      TXTHISTORICO: item.TXTHISTORICO,
      STATIVO: item.STATIVO 

    }
  });

  const colunasQuebraDeCaixa = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{width: '200px', fontWeight: 600, margin: '0px' }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'DTLANCAMENTO',
      header: 'DT Lançamento',
      body: row => <th style={{ }}>{row.DTLANCAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTOCAIXA',
      header: 'Nº Movimento',
      body: row => <th style={{ }}>{row.IDMOVIMENTOCAIXA}</th>,
      sortable: true,

    },
    {
      field: 'IDFUNCIONARIO',
      header: 'Nº Matrícula',
      body: row => <th style={{ }}>{row.IDFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'NOMEOPERADOR',
      header: 'Colaborador',
      body: row => <th style={{ }}>{row.NOMEOPERADOR}</th>,
      sortable: true,
    },
    {
      field: 'CPFOPERADOR',
      header: 'CPF',
      body: row => <th style={{ }}>{row.CPFOPERADOR}</th>,
      sortable: true,
    },
    {
      field: 'VRQUEBRASISTEMA',
      header: 'Vr Quebra Sistema',
      body: row => {
        if (parseFloat(row.VRQUEBRASISTEMA) > 0) {
          return <th style={{ color: 'blue' }}> + {mascaraValor(row.VRQUEBRASISTEMA.toFixed(2))}</th>
        } else {
          return <th style={{ color: 'red' }}> - {mascaraValor(row.VRQUEBRASISTEMA.toFixed(2))}</th>
        }

      },
      sortable: true,
    },
    {
      field: 'VRQUEBRAEFETIVADO',
      header: 'Vr Quebra Lançado',
      body: row => {
        if (row.VRQUEBRAEFETIVADO > 0) {
          return <th style={{ color: 'blue' }}> + {mascaraValor(row.VRQUEBRAEFETIVADO.toFixed(2))}</th>
        } else {
          return <th style={{ color: 'red' }}> - {mascaraValor(row.VRQUEBRAEFETIVADO.toFixed(2))}</th>
        }
      },
      sortable: true,
    },
    {
      field: 'TXTHISTORICO',
      header: 'Histórico',
      body: row => <th style={{ }}>{row.TXTHISTORICO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (row) => <th style={{ color: row.STATIVO == "True" ? 'blue' : 'red' }}>{row.STATIVO == "True" ? "Ativo" : "Inativo"}</th>,
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
      const response = await get(`/quebra-caixa?idQuebraCaixa=${IDQUEBRACAIXA}`);
      if (response.data && response.data.length > 0) {
        setDadosQuebraCaixasModal(response.data);
        setModalVisivel(true);
      } else {
        Swal.fire({
          title: 'Nenhum dado encontrado',
          html: `Não foram encontrados dados para a quebra de caixa selecionada.`,
          icon: 'info',
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickImprimir = (row) => {
    if(optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDQUEBRACAIXA) {
        handleImprimir(row.IDQUEBRACAIXA);
      }
    } else {
      Swal.fire({
        title: 'Acesso Negado',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para acessar esta funcionalidade.`,
        icon: 'warning',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };

  const handleClickCancelar = (IDQUEBRACAIXA, status) => {
    if (IDQUEBRACAIXA) {
      handleCancelar(IDQUEBRACAIXA, status);
    }
  };
  
  
  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Quebra de Caixa</h2>
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
            title="Quebra de Caixa das Lojas"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado negativa</div>}
          >
            {colunasQuebraDeCaixa.map(coluna => (
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
        handleClose={handleCloseModal}
        dadosQuebraCaixasModal={dadosQuebraCaixasModal}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}
