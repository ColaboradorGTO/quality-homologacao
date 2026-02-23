import { Fragment, useEffect, useRef, useState } from "react"
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaExclamation, FaRegTrashAlt } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { ActionEditarOTModal } from "./actionEditarOTModal";
import { get } from "../../../../api/funcRequest";
import { ActionObservacaoOT } from "./actionObservacaoOT";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ActionMotivoEncerrarOTModal } from "./ActionMotivoEncerramento/actionMotivoEncerrarOTModal";

export const ActionListaOrdemTransferencia = ({dadosConferencia}) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [modalImprimirOT, setModalImprimirOT] = useState(false);
  const [motivoEncerrarOTModal, setMotivoEncerrarOTModal] = useState(false);
  const [dadosEncerrarOT, setDadosEncerrarOT] = useState([]);
  const [dadosImprimirOT, setDadosImprimirOT] = useState([]);
  const [modalObservacao, setModalObservacao] = useState(false);
  const [dadosObservacaoOT, setDadosObservacaoOT] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small')
  const dataTableRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);


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
              disabledBTN={[1, 2].indexOf(row.IDSTATUSOT) >= 0}
            />
            <ButtonTable
              titleButton={"Cancelar"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={FaRegTrashAlt}
              iconSize={16}
              iconColor={"#fff"}
              cor={"danger"}
              disabledBTN={row.IDSTATUSOT === 1}
            />
            <ButtonTable
              titleButton={"Encerrar OT"}
              onClickButton={() => handleEncerrar(row)}
              Icon={FaCheck}
              iconSize={16}
              iconColor={"#fff"}
              cor={"info"}
              disabledBTN={row.IDSTATUSOT === 6}
            />
          

            <Fragment>
              
              { row.ERRORLOGSAP !== '' && row.ERRORLOGSAP !== null ? (
                <Fragment>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickStatusNota(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"danger"}
                      
                    />
                </Fragment>
              ) : (
                (row.ERRORLOGSAP === '' || row.ERRORLOGSAP === null) && row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0 ? (
                <Fragment>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickStatusNota(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"success"}
                      
                    />
                </Fragment>
              ) : (
                <Fragment>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickStatusNota(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"warning"}
                      
                    />
                </Fragment>

                ) ) }

            </Fragment>
          </div>
        );
      }
    }
  ]

  const handleEncerrar = async (IDRESUMOOT) => {
    setMotivoEncerrarOTModal(true);
    setDadosEncerrarOT(IDRESUMOOT);
  }

  const handleEdit = async (IDRESUMOOT) => {

    try {
      const response = await get(`/detalhe-ordem-transferencia-cega?idResumoOT=${IDRESUMOOT}&idTipoFiltro=1`)

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalVisivel(true);
   
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickEdit = (row) => {
    if (row && row.IDRESUMOOT) {
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
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickImprimir = (row) => {
    if (row && row.IDRESUMOOT) {
      handleImprimir(row.IDRESUMOOT);
    }
  };

  const handleCancelar = async (row) => {


    const putData = {
      IDSTATUSOT: parseInt(2),
      IDRESUMOT: row.IDRESUMOT,
      IDUSRCANCELAMENTO: usuarioLogado?.id,
    };

    Swal.fire({
      icon: 'question',
      title: `Deseja realmente CANCELAR essa OT?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim, quero Cancelar!',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },
      timer: 3000,
      preConfirm: async () => {
        try {

          await put('/listaOrdemTransferenciaConferenciaCega/:id', putData);
          Swal.fire('Sucesso!', 'Recompra atualizada com sucesso.', 'success');

        } catch (error) {
          Swal.fire('Erro!', 'Erro ao atualizar recompra.', 'error');
        }
      }
    });
  };

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
            size={size}
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
      />
      
      {/* <ActionImprimirEtiquetaOT
        show={modalImprimirOT}
        handleClose={() => setModalImprimirOT(false)}
        dadosImprimirOT={dadosImprimirOT}
      /> */}

      <ActionObservacaoOT
        show={modalObservacao}
        handleClose={() => setModalObservacao(false)}
        dadosObservacaoOT={dadosObservacaoOT}
      />
      <ActionMotivoEncerrarOTModal
        show={motivoEncerrarOTModal}
        handleClose={() => setMotivoEncerrarOTModal(false)}
        dadosEncerrarOT={dadosEncerrarOT}
      />
    </Fragment>
  )
}