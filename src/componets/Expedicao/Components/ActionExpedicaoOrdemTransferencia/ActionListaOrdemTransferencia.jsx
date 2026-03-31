import { Fragment, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaExclamation, FaFileInvoiceDollar, FaList, FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { BsTrash3 } from "react-icons/bs";
import { get, put } from "../../../../api/funcRequest";
import { ActionImprimirEtiquetaOT } from "./actionImprimirEtiquetaOT";
import { ActionObservacaoOT } from "./actionObservacaoOT";
import { ActionEditarOTModal } from "./ActionEditarModalOT/actionEditarOTModal";
import { useCancelarOT } from "../../hooks/useCancelarOT";
import { ActionFinalizarOTModal } from "./ActionFinalizarOT/actionFinalizarOTModal";
import { ActionAjusteOTModal } from "./ActionAjusteModalOT/actionAjusteOTModal";
import { useLiberarPedidoOT } from "../../hooks/useLiberarPedidoOT";
import { ActionConferirItemsModal } from "./ActionConferirItensModal/actionConferirItemsModal";
import { ActionConferirVolumeModal } from "./ActionConferirVolumeModal/actionConferirVolumeModal";

export const ActionListaOrdemTransferencia = ({
  dadosConferencia,
  optionsModulos,
  refetchListaConferencia,
  usuarioLogado
}) => {
  const { register, handleSubmit, errors } = useForm();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalAjustarModalOT, setModalAjustarModalOT] = useState(false);
  const [modalFinalizarOT, setModalFinalizarOT] = useState(false);
  const [modalObservacao, setModalObservacao] = useState(false);
  const [modalImprimirOT, setModalImprimirOT] = useState(false);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [dadosImprimirOT, setDadosImprimirOT] = useState([]);
  const [dadosObservacaoOT, setDadosObservacaoOT] = useState([]);
  const [dadosConferirVolume, setDadosConferirVolume] = useState([]);
  const [valueLojaOrigem, setValueLojaOrigem] = useState('')
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [dadosFinalizarOT, setDadosFinalizarOT] = useState([]);
  const [modalConferirItemsModal, setModalConferirItemsModal] = useState(false);
  const [modalConferirVolumeModal, setModalConferirVolumeModal] = useState(false);

  const [size] = useState('small')
  const dataTableRef = useRef();

  const {
    onSubmit

  } = useCancelarOT({
    optionsModulos,
    refetchListaConferencia,
    usuarioLogado
  })

  const {
    handleLiberarPedido

  } = useLiberarPedidoOT({
    optionsModulos,
    refetchListaConferencia,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (usuarioLogado && usuarioLogado?.NOFANTASIA) {
        setValueLojaOrigem(usuarioLogado?.NOFANTASIA);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [usuarioLogado]);

  const dados = dadosConferencia.map((item, index) => {
    let contador = index + 1;

    return {
      IDRESUMOOT: item.IDRESUMOOT,
      DATAEXPEDICAOFORMATADA: item.DATAEXPEDICAOFORMATADA,
      IDEMPRESAORIGEM: item.IDEMPRESAORIGEM,
      EMPRESAORIGEM: item.EMPRESAORIGEM,
      EMPRESADESTINO: item.EMPRESADESTINO,
      NUMERONOTASEFAZ: item.NUMERONOTASEFAZ,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),
      DESCRICAOOT: item.DESCRICAOOT,
      IDSAPORIGEM: item.IDSAPORIGEM,
      IDSAPDESTINO: item.IDSAPDESTINO,
      CHAVESEFAZ: item.CHAVESEFAZ,
      DSOBSERVACAO: item.DSOBSERVACAO,
      DATAENTREGAFORMATADA: item.DATAENTREGAFORMATADA,
      CONFEREITENS: item.CONFEREITENS,
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
        if (usuarioLogado?.IDEMPRESA === 101 && [10, 11, 12].indexOf(row.IDSTATUSOT) >= 0) {
          return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" }}>

              <ButtonTable
                titleButton={"Ajustar Pedido"}
                onClickButton={() => handleClickAjustar(row)}
                Icon={CiEdit}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"success"}
              />

              <ButtonTable
                titleButton={"Liberar Pedido"}
                onClickButton={() => handleClickLiberarPedido(row)}
                Icon={FaCheck}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"warning"}
                disabledBTN={row.IDSTATUSOT !== 10}
              />

              <ButtonTable
                titleButton={"Conferir Itens"}
                onClickButton={() => handleClickConferirItens(row)}
                Icon={FaCheck}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"info"}
                disabledBTN={row.IDSTATUSOT !== 11}
              />

              <ButtonTable
                titleButton={"Conferir Volume"}
                onClickButton={() => handleClickConferirVolume(row)}
                Icon={FaCheck}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"secondary"}
                disabledBTN={row.IDSTATUSOT !== 12}
              />

              <ButtonTable
                titleButton={"Imprimir Etiqueta"}
                onClickButton={() => handleClickImprimir(row)}
                Icon={MdOutlineLocalPrintshop}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"danger"}
              />

            </div>
          );

        } else if (row.IDEMPRESAORIGEM === usuarioLogado?.IDEMPRESA) {
          return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" }}>

              <ButtonTable
                titleButton={"Editar / Visualizar"}
                onClickButton={() => handleClickEdit(row)}
                Icon={CiEdit}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"info"}
              />

              <ButtonTable
                titleButton={"Cancelar"}
                onClickButton={() => handleCancelarOT(row)}
                Icon={BsTrash3}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"danger"}
                disabledBTN={row.IDSTATUSOT !== 1}
              />

              <ButtonTable
                titleButton={"Finalizar OT"}
                onClickButton={() => handleFinalizarOT(row)}
                Icon={FaCheck}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"warning"}
                disabledBTN={row.IDSTATUSOT !== 1 || !row.NUMERONOTASEFAZ}
              />

              <ButtonTable
                titleButton={"Imprimir Etiqueta"}
                onClickButton={() => handleClickImprimir(row)}
                Icon={MdOutlineLocalPrintshop}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"dark"}
              />


              <ButtonTable
                titleButton={"Status Nota Fiscal"}
                onClickButton={() => handleClickStatusNota(row)}
                Icon={FaExclamation}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={
                  row.ERRORLOGSAP
                    ? "danger"
                    : (!row.ERRORLOGSAP && row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0)
                      ? "success"
                      : "warning"
                }
              />

              <ButtonTable
                titleButton={"Imprimir Nota Fiscal"}
                onClickButton={() => window.open(`http://164.152.244.96:3000/files/NFe${row.CHAVESEFAZ}.pdf`, '_blank')}
                Icon={MdOutlineLocalPrintshop}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"primary"}
                disabledBTN={!row.CHAVESEFAZ}
              />

            </div>
          );

        } else {
          return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" }}>

              <ButtonTable
                titleButton={"Conferir OT"}
                onClickButton={() => handleClickDetalhar(row)}
                Icon={FaCheck}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"success"}
                disabledBTN={!row.NUMERONOTASEFAZ}
              />

              {[8, 5].indexOf(row.IDSTATUSOT) >= 0 && (
                <ButtonTable
                  titleButton={"Finalizar Recebimento OT"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={FaList}
                  iconSize={16}
                  width="32px"
                  height="32px"
                  iconColor={"#fff"}
                  cor={"warning"}
                  disabledBTN={!row.NUMERONOTASEFAZ}
                />
              )}

            </div>
          );
        }
      }
    }
  ];

  const handleConferirItens = async (IDRESUMOOT) => {

    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalConferirItemsModal(true);

      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickConferirItens = (row) => {
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
      handleConferirItens(row.IDRESUMOOT);
    }
  };

  const handleClickLiberarPedido = async (row) => {
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
      await handleLiberarPedido(row);
    }
  }


  const handleConferirVolume = async (IDRESUMOOT) => {

    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalConferirVolumeModal(true);

      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickConferirVolume = (row) => {
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
      handleConferirVolume(row.IDRESUMOOT);
    }
  };


  const handleFinalizarOT = async (IDRESUMOOT) => {
    setModalFinalizarOT(true);
    setDadosFinalizarOT(IDRESUMOOT);
  }


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


  const handleAjuste = async (IDRESUMOOT) => {

    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalAjustarModalOT(true);

      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickAjustar = (row) => {
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
      handleAjuste(row.IDRESUMOOT);
    }
  };

  const handleEdit = async (IDRESUMOOT) => {

    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

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
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

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


  const handleGetSefazOT = async (row) => {

    Swal.fire({
      icon: 'question',
      title: `Deseja Realizar a Emissão da Nota?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },
      timer: 3000,
      preConfirm: async () => {
        try {

          await get(`/consulta-nfe-saida-tranferencia?idSapOrigem=${row.IDSAPORIGEM}`);
          Swal.fire('Sucesso!', 'Nota Emitida com Sucesso!', 'success');
        } catch (error) {
          Swal.fire('Erro!', 'Erro ao Emitir Nota.', 'error');
        }
      }
    });
  };

  const handleChangeAjuste = (e, row) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const updateRow = { ...row, QTDAJUSTE: value };
      const updateData = dadosTransferenciaDetalhe.map((item => (item.IDPRODUTO === row.IDPRODUTO ? updateRow : item)));
      setDadosDetalheTransferencia(updateData);
      setAjusteQuantidade(value);

    }
  }

  const salvarOT = async (data) => {
    let postData = {
      QTDAJUSTE: ajusteQuantidade,
    }
    const response = await put('/updateOrdemTransferencia', postData)

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Ordem de Transferência atualizada com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao atualizar Ordem de Transferência!',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(error)
      })
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
            size={size}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
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

      <ActionConferirVolumeModal
        show={modalConferirVolumeModal}
        handleClose={() => setModalConferirVolumeModal(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
        setDadosDetalheTransferencia={setDadosDetalheTransferencia}
        refetchListaConferencia={refetchListaConferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}

      />

      <ActionConferirItemsModal
        show={modalConferirItemsModal}
        handleClose={() => setModalConferirItemsModal(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
        setModalConferirItemsModal={setModalConferirItemsModal}
        setDadosDetalheTransferencia={setDadosDetalheTransferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        refetchListaConferencia={refetchListaConferencia}
      />

      <ActionAjusteOTModal
        show={modalAjustarModalOT}
        handleClose={() => setModalAjustarModalOT(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
        setDadosDetalheTransferencia={setDadosDetalheTransferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        refetchListaConferencia={refetchListaConferencia}
      />

      <ActionFinalizarOTModal
        show={modalFinalizarOT}
        handleClose={() => setModalFinalizarOT(false)}
        dadosFinalizarOT={dadosFinalizarOT}
        refetchListaConferencia={refetchListaConferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}

      />

      <ActionEditarOTModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
        setDadosDetalheTransferencia={setDadosDetalheTransferencia}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        refetchListaConferencia={refetchListaConferencia}
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
    </Fragment>
  )
}




// {
//   field: 'IDSTATUSOT',
//   header: 'Opções',
//   body: (row) => {
//     if (usuarioLogado?.IDEMPRESA === 101 && [10, 11, 12].indexOf(row.IDSTATUSOT) >= 0) {
//       return (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: "15rem",
//           }}
//         >
//           <div>
//             <ButtonTable
//               titleButton={"Ajustar Pedido"}
//               onClickButton={() => handleClickDetalhar(row)}
//               Icon={CiEdit}
//               iconSize={20}
//               iconColor={"#fff"}
//               cor={"success"}
//               disabledBTN={row.IDSTATUSOT !== 1}
//             />
//           </div>

//           <div>
//             <ButtonTable
//               titleButton={"Liberar Pedido"}
//               onClickButton={() => handleClickDetalhar(row)}
//               Icon={CiEdit}
//               iconSize={20}
//               iconColor={"#fff"}
//               cor={"success"}
//               disabledBTN={usuarioLogado?.IDEMPRESA === 101 && [10, 11, 12].indexOf(row.IDSTATUSOT) >= 0}
//             />
//           </div>

//           <div>
//             <ButtonTable
//               titleButton={"Conferir Itens"}
//               onClickButton={() => handleClickDetalhar(row)}
//               Icon={FaCheck}
//               iconSize={20}
//               iconColor={"#fff"}
//               cor={"warning"}
//               disabledBTN={[11].indexOf(row.IDSTATUSOT) >= 0}
//             />
//           </div>

//           <div>
//             <ButtonTable
//               titleButton={"Conferir Volume"}
//               onClickButton={() => handleClickDetalhar(row)}
//               Icon={FaCheck}
//               iconSize={20}
//               iconColor={"#fff"}
//               cor={"info"}
//               disabledBTN={[12].indexOf(row.IDSTATUSOT) >= 0}
//             />
//           </div>

//           <div>
//             <ButtonTable
//               titleButton={"Imprimir Etiqueta"}
//               onClickButton={() => handleClickImprimir(row)}
//               Icon={MdOutlineLocalPrintshop}
//               iconSize={20}
//               iconColor={"#fff"}
//               cor={"dark"}
//             />
//           </div>
//         </div>
//       );
//     } else {
//       if (row.IDEMPRESAORIGEM === usuarioLogado?.IDEMPRESA) {
//         if (row.ERRORLOGSAP !== '' && row.ERRORLOGSAP !== null) {
//           return (
//             <div>
//               <ButtonTable
//                 titleButton={"Status Nota Fiscal"}
//                 onClickButton={() => handleClickDetalhar(row)}
//                 Icon={FaExclamation}
//                 iconSize={20}
//                 iconColor={"#fff"}
//                 cor={"warning"}
//               />
//             </div>
//           );
//         } else if ((row.ERRORLOGSAP === '' || row.ERRORLOGSAP === null) && row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0 ) {
//           return (
//             <div>
//               <ButtonTable
//                 titleButton={"Status Nota Fiscal"}
//                 onClickButton={() => handleClickDetalhar(row)}
//                 Icon={FaExclamation}
//                 iconSize={20}
//                 iconColor={"#fff"}
//                 cor={"success"}
//               />
//             </div>
//           );
//         } else {
//           return (
//             <div>
//               <ButtonTable
//                 titleButton={"Status Nota Fiscal"}
//                 onClickButton={() => handleClickDetalhar(row)}
//                 Icon={FaExclamation}
//                 iconSize={20}
//                 iconColor={"#fff"}
//                 cor={"warning"}
//               />
//             </div>
//           );
//         }
//       } else {
//         return (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               width: "15rem",
//             }}
//           >
//             <ButtonTable
//               titleButton={"Conferir OT"}
//               onClickButton={() => handleClickDetalhar(row)}
//               Icon={FaCheck}
//               iconSize={20}
//               iconColor={"#fff"}
//               cor={"success"}
//               disabledBTN={row.NUMERONOTASEFAZ === ''}
//             />
//           </div>
//         );
//       }
//     }
//   }
// }
