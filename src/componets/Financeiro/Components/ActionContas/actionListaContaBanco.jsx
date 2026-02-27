import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarContaBancoModal } from "./EditarContas/actionEditarContaBancoModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import Swal from "sweetalert2";


export const ActionListaContaBanco = ({
  dadosContaBanco,
  optionsModulos,
  usuarioLogado,
  dadosBanco,
  handleClick
}) => {
  const [modalFaturaVisivel, setModalFaturaVisivel] = useState(false);
  const [dadosDetalheContaBanco, setDadosDetalheContaBanco] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Contas Bancárias',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Banco', 'Ds. Conta', 'Nº Agência', 'Nº Conta', 'Tp. Conta', 'Status']],
      body: dados.map(item => [
        item.contador,
        item.DSBANCO,
        item.DSCONTABANCO,
        item.NUAGENCIA,
        item.NUDIGITOAGENCIA,
        item.NUCONTA,
        item.NUDIGITOCONTA,
        item.TPPESSOA,
        item.STATIVO == 'True' ? 'ATIVA' : 'INATIVA',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('contas_bancarias.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Banco', 'Ds. Conta', 'Nº Agência', 'Nº Conta', 'Tp. Conta', 'Status'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 150, caption: 'Banco' },
      { wpx: 200, caption: 'Ds. Conta' },
      { wpx: 100, caption: 'Nº Agência' },
      { wpx: 100, caption: 'Nº Conta' },
      { wpx: 100, caption: 'Tp. Conta' },
      { wpx: 100, caption: 'Status' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contas Bancárias');
    XLSX.writeFile(workbook, 'contas_bancarias.xlsx');
  };

  const dados = dadosContaBanco.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDCONTABANCO: item.IDCONTABANCO,
      DSCONTABANCO: `${item.IDCONTABANCO} - ${item.DSCONTABANCO}`,
      DSBANCO: item.DSBANCO,
      NUAGENCIA: item.NUAGENCIA ? item.NUAGENCIA : 'Não Informado',
      NUDIGITOAGENCIA: item.NUDIGITOAGENCIA,
      NUCONTA: item.NUCONTA ? item.NUCONTA : 'Não Informado',
      NUDIGITOCONTA: item.NUDIGITOCONTA,
      TPPESSOA: item.TPPESSOA,
      STATIVO: item.STATIVO == 'True' ? 'ATIVA' : 'INATIVA',
    }
  });

  const colunasListaFatura = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{}}>  {row.contador} </th>,
      sortable: true,

    },
    {
      field: 'DSBANCO',
      header: 'Banco',
      body: row => <th style={{}}>  {row.DSBANCO} </th>,
      sortable: true,
    },
    {
      field: 'DSCONTABANCO',
      header: 'Ds. Conta',
      body: row => <th style={{}}>  {row.DSCONTABANCO}</th>,
      sortable: true,
    },
    {
      field: 'NUAGENCIA',
      header: 'Nº Agência',
      body: row => <th style={{}}> {!row.NUAGENCIA} </th>,
      sortable: true,
    },
    {
      field: 'NUCONTA',
      header: 'Nº Conta',
      body: row => <th style={{}}> {!row.NUCONTA} </th>,
      sortable: true,
    },
    {
      field: 'TPPESSOA',
      header: 'Tp. Conta',
      body: row => <th style={{}}> {row.TPPESSOA} </th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Status',
      body: row => (
        <th style={{ color: row.STATIVO == 'ATIVA' ? '#2196F3' : '#fd3995 ' }}>
          {row.STATIVO}
        </th>
      ),
    },
    {
      field: 'IDCONTABANCO',
      header: 'Opções',
      button: true,
      width: '10%',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between", display: "flex" }}
        >

          <ButtonTable
            titleButton={"Editar Fatura"}
            cor={"primary"}
            Icon={CiEdit}
            onClickButton={() => handleClickEditar(row)}
            iconSize={25}
            width="30px"
            height="30px"
          />

        </div>
      ),
    },

  ]

  const handleEditar = async (IDCONTABANCO) => {
    try {
      const response = await get(`/conta-banco?idContaBanco=${IDCONTABANCO}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheContaBanco(response.data);
        setModalFaturaVisivel(true);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Detalhes da conta bancária não encontrados.',
          customClass: {
            container: 'custom-swal',
          }
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhe conta bancária: ', error);
    }
  };


  const handleClickEditar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      if (row && row.IDCONTABANCO) {
        handleEditar(row.IDCONTABANCO);
      }

    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br> Você não tem permissão para editar esta conta.`,
        showConfirmButton: true,
        timer: 30000,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };


  return (

    <Fragment>
      <div id="panel-1" className="panel">
        <div className="panel-hdr">
          <h2>
            Contas <span className="fw-300"><i></i>Por Loja</span>
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
        <div className="card" ref={dataTableRef}>
          <DataTable
            title="Lista de Contas Bancárias"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasListaFatura.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', }}

              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionEditarContaBancoModal
        show={modalFaturaVisivel}
        handleClose={() => setModalFaturaVisivel(false)}
        dadosDetalheContaBanco={dadosDetalheContaBanco}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        dadosBanco={dadosBanco}
        handleClick={handleClick}
      />
      
    </Fragment>
  )
}