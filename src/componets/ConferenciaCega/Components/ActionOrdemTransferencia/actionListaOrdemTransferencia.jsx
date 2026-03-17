import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import Swal from "sweetalert2";
import { CiEdit } from "react-icons/ci";
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { DataTable } from 'primereact/datatable';
import { get } from "../../../../api/funcRequest";
import { Fragment, useRef, useState } from "react";
import HeaderTable from "../../../Tables/headerTable";
import { ActionObservacaoOT } from "./actionObservacaoOT";
import { useCancelarOT } from "../../hooks/useCancelarOT";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { FaCheck, FaExclamation, FaRegTrashAlt } from "react-icons/fa";
import { ActionEditarOTModal } from "./ActionEditarVisualizarOT/actionEditarOTModal";
import { ActionMotivoEncerrarOTModal } from "./ActionMotivoEncerramento/actionMotivoEncerrarOTModal";

export const ActionListaOrdemTransferencia = ({
  dadosConferencia,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado

}) => {

  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [motivoEncerrarOTModal, setMotivoEncerrarOTModal] = useState(false);
  const [dadosEncerrarOT, setDadosEncerrarOT] = useState([]);
  const [modalObservacao, setModalObservacao] = useState(false);
  const [dadosObservacaoOT, setDadosObservacaoOT] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const {
    onSubmit
  } = useCancelarOT({
    refetchListaConferencia,
    optionsModulos,
    usuarioLogado
  })

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Controle de Transferência',
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº OT', 'Data Criação', 'Loja Origem', 'Loja Destino', 'Número NF-e', 'Status'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº OT' },
      { wpx: 100, caption: 'Data Criação' },
      { wpx: 200, caption: 'Loja Origem' },
      { wpx: 200, caption: 'Loja Destino' },
      { wpx: 100, caption: 'Número NF-e' },
      { wpx: 100, caption: 'Status' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Controle de Transferência');
    XLSX.writeFile(workbook, 'controle_transferencia.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº OT', 'Data Criação', 'Loja Origem', 'Loja Destino', 'Número NF-e', 'Status']],
      body: dados.map(item => [item.IDRESUMOOT, item.DATAEXPEDICAOFORMATADA, item.EMPRESAORIGEM, item.EMPRESADESTINO, item.NUMERONOTASEFAZ, item.DESCRICAOOT]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('controle_transferencia.pdf');
  };


  const dados = dadosConferencia.map((item, index) => {
    let contador = index + 1;

    return {
      IDRESUMOOT: item.IDRESUMOOT,
      DATAEXPEDICAOFORMATADA: item.DATAEXPEDICAOFORMATADA,
      EMPRESAORIGEM: item.EMPRESAORIGEM,
      EMPRESADESTINO: item.EMPRESADESTINO,
      NUMERONOTASEFAZ: item.NUMERONOTASEFAZ,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),
      DESCRICAOOT: item.DESCRICAOOT,
      IDSAPORIGEM: item.IDSAPORIGEM,
      IDSAPDESTINO: item.IDSAPDESTINO,
      ERRORLOGSAP: item.ERRORLOGSAP,
      contador
    }
  });

  const colunasConferencia = [
    {
      field: 'IDRESUMOOT',
      header: 'Nº OT',
      body: row => <th>{row.IDRESUMOOT}</th>,
      sortable: true,
    },
    {
      field: 'DATAEXPEDICAOFORMATADA',
      header: 'Data Criação',
      body: row => <th>{row.DATAEXPEDICAOFORMATADA}</th>,
      sortable: true,
    },
    {
      field: 'EMPRESAORIGEM',
      header: 'Loja Origem',
      body: row => <th>{row.EMPRESAORIGEM}</th>,
      sortable: true,
    },
    {
      field: 'EMPRESADESTINO',
      header: 'Loja Destino',
      body: row => <th>{row.EMPRESADESTINO}</th>,
      sortable: true,
    },
    {
      field: 'NUMERONFE',
      header: 'Número NF-e',
      body: row => <th>{row.NUMERONFE}</th>,
      sortable: true,
    },
    {

      field: 'DESCRICAOOT',
      header: 'Status',
      body: row => <th>{row.DESCRICAOOT}</th>,
      sortable: true,
    },
    {
      field: 'IDSTATUSOT',
      header: 'Opções',
      body: (row) => {

        const corStatusNota = () => {
          if (row.ERRORLOGSAP !== '' && row.ERRORLOGSAP !== null) return 'danger';
          if (
            (row.ERRORLOGSAP === '' || row.ERRORLOGSAP === null) &&
            row.IDSAPORIGEM > 0 &&
            row.IDSAPDESTINO > 0
          ) return 'success';
          return 'warning';
        };
        return (
          <div

            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "150px",

            }}
          >
            <ButtonTable
              titleButton={"Editar / Visualizar"}
              onClickButton={() => handleClickEdit(row)}
              Icon={CiEdit}
              iconSize={16}
              iconColor={"#fff"}
              cor={"primary"}
              width="32px"
              height="32px"

            />
            <ButtonTable
              titleButton={"Cancelar"}
              onClickButton={() => handleCancelarOT(row)}
              Icon={FaRegTrashAlt}
              iconSize={16}
              iconColor={"#fff"}
              cor={"danger"}
              width="32px"
              height="32px"
              disabledBTN={row.IDSTATUSOT !== 1}
            />
            <ButtonTable
              titleButton={"Encerrar OT"}
              onClickButton={() => handleEncerrar(row)}
              Icon={FaCheck}
              iconSize={16}
              iconColor={"#fff"}
              cor={"info"}
              width="32px"
              height="32px"
              disabledBTN={row.IDSTATUSOT !== 6}
            />
            <ButtonTable
              titleButton={"Status Nota Fiscal"}
              onClickButton={() => handleClickStatusNota(row)}
              Icon={FaExclamation}
              iconSize={16}
              iconColor={"#fff"}
              width="32px"
              height="32px"
              cor={corStatusNota()}
              disabledBTN={false}
            />

          </div>
        );
      }
    }
  ]

  const handleEncerrar = async (IDRESUMOOT) => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para encerrar a OT.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }
    if (IDRESUMOOT) {
      setMotivoEncerrarOTModal(true);
      setDadosEncerrarOT(IDRESUMOOT);
    }

  }


  const handleEdit = async (IDRESUMOOT) => {
    try {
      const response = await get(`/detalhe-ordem-transferencia-cega?idResumoOT=${IDRESUMOOT}&idTipoFiltro=1`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalVisivel(true);
      } else {
        Swal.fire({
          title: 'Não foram encontrados produtos para essa OT',
          icon: 'info',
          confirmButtonText: 'OK',
          customClass: {
            container: 'custom-swal',
          }
        });
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da OT: ', error);
    }
  };

  const handleClickEdit = (row) => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para editar/visualizar a OT.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (row?.IDRESUMOOT) {
      handleEdit(row.IDRESUMOOT);
    }
  };


  const handleStatusNota = async (IDRESUMOOT) => {

    try {
      const response = await get(`/listaOrdemTransferenciaConferenciaCega?idResumoOT=${IDRESUMOOT}&idtipofiltro=1`)
      if (response.data && response.data.length > 0) {
        setDadosObservacaoOT(response.data);
        setModalObservacao(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickStatusNota = (row) => {

    if (row && row.IDRESUMOOT) {
      handleStatusNota(row.IDRESUMOOT);
    }
  };

  const handleCancelarOT = async (row) => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        html: `${usuarioLogado?.NOFUNCIONARIO} < br/> Você não tem permissão para cancelar a OT.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        }
      });
      return

    } else {
      await onSubmit(row);
    }
  }

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>
            Lista de Ordem de Transferência
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
            title="Lista de Ordem de Transferência"
            value={dados}
            globalFilter={globalFilterValue}
            size={"small"}
            sortOrder={-1}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 30, 50, 100, dados.length]}

            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasConferencia.map(coluna => (
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

      <ActionEditarOTModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
        refetchListaConferencia={refetchListaConferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />

      <ActionObservacaoOT
        show={modalObservacao}
        handleClose={() => setModalObservacao(false)}
        dadosObservacaoOT={dadosObservacaoOT}
      />

      <ActionMotivoEncerrarOTModal
        show={motivoEncerrarOTModal}
        handleClose={() => setMotivoEncerrarOTModal(false)}
        dadosEncerrarOT={dadosEncerrarOT}
        refetchListaConferencia={refetchListaConferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}