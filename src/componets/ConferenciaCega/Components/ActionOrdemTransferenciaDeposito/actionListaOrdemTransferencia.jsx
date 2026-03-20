import { Fragment, useRef, useState } from "react"
import { CiEdit } from "react-icons/ci";
import { FaExclamation, FaList, FaRegTrashAlt } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { ActionEditarOTModal } from "./ActionEditarOTModal/actionEditarOTModal";
import { get } from "../../../../api/funcRequest";
import { ActionObservacaoOT } from "./actionObservacaoOT";
import Swal from "sweetalert2";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { ActionImprimirEtiquetaOT } from "./actionImprimirEtiquetaOT";
import { ActionSalvarVolumeOTModal } from "./ActionVolume/actionSalvarVolumeOT";
import { useCancelarOT } from "../../hooks/useCancelarOT";
import { ActionConferirOT } from "./ActionConferirOT/actionConferirOTModal";
import { useFinalizarRecebimentoOT } from "../../hooks/useFinalizarRecebimentoOT";

export const ActionListaOrdemTransferencia = ({
  dadosConferencia,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado

}) => {

  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [modalImprimirOT, setModalImprimirOT] = useState(false);
  const [conferirOTModal, setConferirOTModal] = useState(false);
  const [dadosEncerrarOT, setDadosEncerrarOT] = useState([]);
  const [dadosImprimirOT, setDadosImprimirOT] = useState([]);
  const [modalObservacao, setModalObservacao] = useState(false);
  const [modalSalvarVolume, setModalSalvarVolume] = useState(false);
  const [dadosSalvarVolume, setDadosSalvarVolume] = useState([]);
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

  const {
    handleFinalizarRecebimento

  } = useFinalizarRecebimentoOT({
    refetchListaConferencia,
    optionsModulos,
    usuarioLogado,
  });

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
      IDEMPRESADESTINO: item.IDEMPRESADESTINO,
      IDEMPRESAORIGEM: item.IDEMPRESAORIGEM,
      NUMERONOTASEFAZ: item.NUMERONOTASEFAZ,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),
      DESCRICAOOT: item.DESCRICAOOT,
      IDSAPORIGEM: item.IDSAPORIGEM,
      IDSAPDESTINO: item.IDSAPDESTINO,
      ERRORLOGSAP: item.ERRORLOGSAP,
      NUMERONFE: item.NUMERONFE,
      CHAVESEFAZ: item.CHAVESEFAZ,
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

        const isOrigem = row.IDEMPRESAORIGEM !== usuarioLogado?.IDEMPRESA;

        const corStatusNF = () => {
          if (row.ERRORLOGSAP !== '' && row.ERRORLOGSAP !== null) return 'danger';
          if (row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0) return 'success';
          return 'warning';
        };

        return (
          <div style={{
            display: "flex",
            justifyContent: "start",
            gap: "10px",
            alignItems: "center",
            width: "100%",
          }}>

            {isOrigem && (
              <>
                <ButtonTable
                  titleButton={"Editar / Visualizar"}
                  onClickButton={() => handleClickEdit(row)}
                  Icon={CiEdit}
                  iconSize={16}
                  iconColor={"#fff"}
                  cor={"success"}
                  width="32px"
                  height="32px"
                  disabledBTN={false}
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
                  titleButton={"Finalizar OT"}
                  onClickButton={() => handleSalvarVolume(row)}
                  Icon={FaList}
                  iconSize={16}
                  iconColor={"#fff"}
                  cor={"warning"}
                  width="32px"
                  height="32px"
                  disabledBTN={row.IDSTATUSOT !== 1}
                />

                <ButtonTable
                  titleButton={"Imprimir Etiqueta"}
                  onClickButton={() => handleClickImprimir(row)}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={16}
                  iconColor={"#fff"}
                  cor={"secondary"}
                  width="32px"
                  height="32px"
                  disabledBTN={false}
                />

                <ButtonTable
                  titleButton={"Status Nota Fiscal"}
                  onClickButton={() => handleClickStatusNota(row)}
                  Icon={FaExclamation}
                  iconSize={16}
                  iconColor={"#fff"}
                  cor={corStatusNF()}
                  width="32px"
                  height="32px"
                  disabledBTN={false}
                />

                <ButtonTable
                  titleButton={"Imprimir Nota Fiscal"}
                  onClickButton={() => window.open(`http://164.152.244.96:3000/files/NFe${row.CHAVESEFAZ}.pdf`, '_blank')}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={16}
                  iconColor={"#fff"}
                  cor={"danger"}
                  width="32px"
                  height="32px"
                  disabledBTN={row.CHAVESEFAZ === null || row.CHAVESEFAZ === ''}
                />
              </>
            )}

            {!isOrigem && (
              <>
                <ButtonTable
                  titleButton={"Conferir OT"}
                  onClickButton={() => handleClickConferirOT(row)}
                  Icon={CiEdit}
                  iconSize={16}
                  iconColor={"#fff"}
                  cor={"primary"}
                  width="32px"
                  height="32px"
                  disabledBTN={row.NUMERONFE === '' || row.NUMERONFE === null}
                />

                {[8, 5].indexOf(row.IDSTATUSOT) >= 0 && (
                  <ButtonTable
                    titleButton={"Finalizar Recebimento OT"}
                    onClickButton={() => handleFinalizarRecebimento(row)}
                    Icon={FaList}
                    iconSize={16}
                    iconColor={"#fff"}
                    cor={"warning"}
                    width="32px"
                    height="32px"
                    disabledBTN={row.NUMERONFE === '' || row.NUMERONFE === null}
                  />
                )}
              </>
            )}
          </div>
        );
      }
    }
  ]

  const handleSalvarVolume = async (IDRESUMOOT) => {
    setModalSalvarVolume(true);
    setDadosSalvarVolume(IDRESUMOOT);
  }

  const handleConferirOT = async (IDRESUMOOT) => {
    try {
      const response = await get(`/detalhe-ordem-transferencia-cega?idResumoOT=${IDRESUMOOT}&idTipoFiltro=1`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setConferirOTModal(true);
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

  const handleClickConferirOT = (row) => {
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
      handleConferirOT(row.IDRESUMOOT);
    }
  };

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
      const response = await get(`/listaOrdemTransferenciaConferenciaCega?idResumoOT=${IDRESUMOOT}`)

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

  const handleImprimir = async (IDRESUMOOT) => {

    try {
      const response = await get(`/impressao-etiqueta-ot?idResumoOT=${IDRESUMOOT}`)

      if (response.data && response.data.length > 0) {
        setDadosImprimirOT(response.data);
        setModalImprimirOT(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Não foram encontrados Etiquetas para essa OT',
          confirmButtonColor: 'primary',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickImprimir = (row) => {
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

    if (row && row.IDRESUMOOT) {
      handleImprimir(row.IDRESUMOOT);
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
        setDadosDetalheTransferencia={setDadosDetalheTransferencia}
        refetchListaConferencia={refetchListaConferencia}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />

      <ActionImprimirEtiquetaOT
        show={modalImprimirOT}
        handleClose={() => setModalImprimirOT(false)}
        dadosImprimirOT={dadosImprimirOT}
      />

      <ActionObservacaoOT
        show={modalObservacao}
        handleClose={() => setModalObservacao(false)}
        dadosObservacaoOT={dadosObservacaoOT}
      />
      <ActionConferirOT
        show={conferirOTModal}
        handleClose={() => setConferirOTModal(false)}
        dadosEncerrarOT={dadosEncerrarOT}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
        setDadosDetalheTransferencia={setDadosDetalheTransferencia}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        refetchListaConferencia={refetchListaConferencia}
      />

      <ActionSalvarVolumeOTModal
        show={modalSalvarVolume}
        handleClose={() => setModalSalvarVolume(false)}
        dadosSalvarVolume={dadosSalvarVolume}
        refetchListaConferencia={refetchListaConferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}

      />
    </Fragment>

  )
}
