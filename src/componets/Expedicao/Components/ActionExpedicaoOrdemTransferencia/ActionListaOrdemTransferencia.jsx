import { Fragment, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaExclamation, FaFileInvoiceDollar, FaRegTrashAlt } from "react-icons/fa";
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
import { ActionEditarOTModal } from "./actionEditarOTModal";

export const ActionListaOrdemTransferencia = ({ dadosConferencia }) => {
  const { register, handleSubmit, errors } = useForm();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalObservacao, setModalObservacao] = useState(false);
  const [modalImprimirOT, setModalImprimirOT] = useState(false);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [dadosImprimirOT, setDadosImprimirOT] = useState([]);
  const [dadosObservacaoOT, setDadosObservacaoOT] = useState([]);
  const [valueLojaOrigem, setValueLojaOrigem] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small')
  const dataTableRef = useRef();

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


  useEffect(() => {
    const timer = setTimeout(() => {
      if (usuarioLogado && usuarioLogado?.NOFANTASIA) {
        // console.log(usuarioLogado?.NOFANTASIA)
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
        if (usuarioLogado?.IDEMPRESA == 101 && [10, 11, 12].indexOf(row.IDSTATUSOT) >= 0) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "15rem",

              }}
            >
              <div>
                <ButtonTable
                  titleButton={"Ajustar Pedido"}
                  // onClickButton={() => IDRESUMOOT + 0 + IDSTATUSOT + DSOBSERVACAO + DATAENTREGAFORMATADA}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={CiEdit}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"success"}
                  disabledBTN={row.IDSTATUSOT != 1}
                />
              </div>

              <div>
                <ButtonTable
                  titleButton={"Liberar Pedido"}
                  // onClickButton={() => IDRESUMOOT + 0 + IDSTATUSOT + DSOBSERVACAO + DATAENTREGAFORMATADA}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={CiEdit}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"success"}
                  disabledBTN={usuarioLogado?.IDEMPRESA == 101 && [10, 11, 12].indexOf(row.IDSTATUSOT) >= 0}
                />
              </div>

              <div>
                <ButtonTable
                  titleButton={"Conferir Itens"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={FaCheck}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"warning"}
                  disabledBTN={[11].indexOf(row.IDSTATUSOT) >= 0}
                />
              </div>

              <div>

                <ButtonTable
                  titleButton={"Conferir Volume"}
                  // onClickButton={() => IDSAPORIGEM}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={FaCheck}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"info"}
                  disabledBTN={[12].indexOf(row.IDSTATUSOT) >= 0}
                />
              </div>

              <div>
                <ButtonTable
                  titleButton={"Imprimir Etiqueta"}
                  // onClickButton={() => IDSAPORIGEM}
                  onClickButton={() => handleClickImprimir(row)}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"dark"}

                />
              </div>

            </div>
          );
        } else {
          if (row.IDEMPRESAORIGEM === usuarioLogado?.IDEMPRESA) {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "15rem",

                }}
              >
                <div>
                  <ButtonTable
                    titleButton={"Editar / Visualizar"}
                    // onClickButton={() => IDRESUMOOT + 0 + IDSTATUSOT + DSOBSERVACAO + DATAENTREGAFORMATADA}
                    onClickButton={() => handleClickEdit(row)}
                    Icon={CiEdit}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"info"}
                  />
                </div>

                <div>
                  <ButtonTable
                    titleButton={"Cancelar"}
                    // onClickButton={() => IDRESUMOOT + 0 + IDSTATUSOT + DSOBSERVACAO + DATAENTREGAFORMATADA}
                    onClickButton={() => handleCancelar(row)}
                    Icon={BsTrash3}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"danger"}
                    disabledBTN={row.IDSTATUSOT != 1}
                  />
                </div>

                <div>
                  <ButtonTable
                    titleButton={"Finalizar OT"}
                    onClickButton={() => handleClickDetalhar(row)}
                    Icon={FaCheck}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"warning"}
                    disabledBTN={row.IDSTATUSOT != 1}
                  />
                </div>

                <div>
                  <ButtonTable
                    titleButton={"Imprimir Etiqueta"}
                    // onClickButton={() => IDSAPORIGEM}
                    onClickButton={() => handleClickImprimir(row)}
                    Icon={MdOutlineLocalPrintshop}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"dark"}
                  />
                </div>

                <div>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() =>  handleClickStatusNota(row)}
                      Icon={FaExclamation}
                      iconSize={20}
                      iconColor={"#fff"}
                      cor={"warning"}

                    />
                </div>

                <div>
                  <ButtonTable
                    titleButton={"Imprimir Nota Fiscal"}
                    onClickButton={() => window.open(`http://164.152.244.96:3000/files/NFe53230636769602000236550000000106301779108247.pdf`, '_blank')}
                    Icon={MdOutlineLocalPrintshop}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"primary"}

                  />
                </div>
                <div>
                  <ButtonTable
                    titleButton={"Processar SEFAZ"}
                    onClickButton={() => handleGetSefazOT(row)}
                    Icon={FaCheck}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"info"}

                  />
                </div>
                <div>
                  <ButtonTable
                    titleButton={"Processar Faturamento"}
                    onClickButton={() => handleFaturarOT(row)}
                    Icon={FaFileInvoiceDollar}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"success"}

                  />
                </div>
              </div>

            );
          } else {
            return (
              <Fragment>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "15rem",
                  }}
                >
                  <ButtonTable
                    titleButton={"Conferir OT"}
                    onClickButton={() => handleClickDetalhar(row)}
                    Icon={FaCheck}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"success"}
                    disabledBTN={row.NUMERONOTASEFAZ === ''}
                  />
                </div>

                {[8, 5].indexOf(row.IDSTATUSOT) >= 0 ? (
                  <div>
                    <ButtonTable
                      titleButton={"Finalizar Recebimento OT"}
                      onClickButton={() => handleClickDetalhar(row)}
                      Icon={MdOutlineLocalPrintshop}
                      iconSize={20}
                      iconColor={"#fff"}
                      cor={"warning"}
                      disabledBTN={row.NUMERONOTASEFAZ === ''}
                    />
                  </div>
                ) : (
                  <></>
                )};
              </Fragment>
            )
          } 

          
        }
      }
    }
  ]

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

  const handleFaturarOT = async (row) => {


    const putData = {
      IDSTATUSOT: parseInt(9),
      IDRESUMOT: row.IDRESUMOT,
      NOTAFISCAL: parseInt(0)
    };

    Swal.fire({
      icon: 'question',
      title: `Deseja Faturar a OT?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim, quero Faturar!',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },
    }).then((result) => {
      if (result.value === true) {
        dados[0].NOTAFISCAL = parseInt(1);
        Swal.fire({
          type: 'info',
          title: 'Emitindo Faturamento, aguarde...',
          timer: 120000,
          onBeForeOpen: async () => {
            Swal.showLoading();
            await put('/resumo-ordem-transferencia/:id', putData);
            Swal.fire('Sucesso!', 'Faturado sucesso.', 'success');
          }
        })
      }
    })
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

          await put('/atualizar-recompra', putData);
          Swal.fire('Sucesso!', 'Recompra atualizada com sucesso.', 'success');
        } catch (error) {
          Swal.fire('Erro!', 'Erro ao atualizar recompra.', 'error');
        }
      }
    });
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

      <ActionEditarOTModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
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
