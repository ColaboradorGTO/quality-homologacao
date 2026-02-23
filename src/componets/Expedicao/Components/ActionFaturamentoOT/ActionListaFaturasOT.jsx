import { Fragment, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaExclamation, FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { MdFormatListBulleted, MdOutlineLocalPrintshop } from "react-icons/md";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ActionEditarOTModal } from "../ActionExpedicaoOrdemTransferencia/actionEditarOTModal";
// import { ActionVisualizarOTModal } from "./ActionVisualizarOT/actionEditarFaturamentoOTModal";
import { get } from "../../../../api/funcRequest";
import { GrDocumentDownload, GrView } from "react-icons/gr";
import { ActionImprimirEtiquetaOT } from "./ActionImprimirEtiquetaOT/actionImprimirEtiquetaOT";
import { useCancelarFaturaOT } from "./hooks/useCancelarFaturaOT";
import { useFaturarOT } from "./hooks/useFaturarOT";
import { toFloat } from "../../../../utils/toFloat";
import { ActionObservacaoOT } from "./ActionObservacaoOT/actionObservacaoOTModal";
import { ButtonType } from "../../../Buttons/ButtonType";
import { FcProcess } from "react-icons/fc";
import { FaTruckFast } from "react-icons/fa6";
import JSZip from "jszip";

export const ActionListaFaturasOT = ({ dadosFaturaOT }) => {
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalImprimir, setModalImprimir] = useState(false);
  const [dadosImprimirOT, setDadosImprimirOT] = useState([]);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [dadosObservacaoOT, setDadosObservacaoOT] = useState([]);
  const [modalObservacao, setModalObservacao] = useState(false);
  const [dadosSelecionados, setDadosSelecionados] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const dataTableRef = useRef();
  const { handleCancelar } = useCancelarFaturaOT();
  const { handleFaturar } = useFaturarOT();

  useEffect(() => {
    setDadosSelecionados(dadosFaturaOT.slice(0, 10));
  }, [dadosFaturaOT]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Faturas OT',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº OT', 'Data Criação', 'Loja Origem', 'Loja Destino', 'Data Nota', 'Número NF-E', 'Status']],
      body: dadosExcel.map(item => [
        item.IDRESUMOOT,
        item.DATAEXPEDICAOFORMATADA,
        item.EMPRESAORIGEM,
        item.EMPRESADESTINO,
        item.DATAEMISSAOSEFAZFORMATADA,
        item.NUMERONOTASEFAZ,
        item.DESCRICAOOT
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('faturas_ot.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº OT', 'Data Criação', 'Loja Origem', 'Loja Destino', 'Data Nota', 'Número NF-E', 'Status'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº OT' },
      { wpx: 100, caption: 'Data Criação' },
      { wpx: 100, caption: 'Loja Origem' },
      { wpx: 100, caption: 'Loja Destino' },
      { wpx: 100, caption: 'Data Nota' },
      { wpx: 100, caption: 'Número NF-E' },
      { wpx: 100, caption: 'Status' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturas OT');
    XLSX.writeFile(workbook, 'faturas_ot.xlsx');
  };


  const dados = dadosFaturaOT.map((item, index) => {
    let contador = index + 1;

    return {
      IDRESUMOOT: item.IDRESUMOOT,
      DATAEXPEDICAOFORMATADA: item.DATAEXPEDICAOFORMATADA,
      EMPRESAORIGEM: item.EMPRESAORIGEM,
      EMPRESADESTINO: item.EMPRESADESTINO,
      DATAEMISSAOSEFAZFORMATADA: item.DATAEMISSAOSEFAZFORMATADA,
      NUMERONOTASEFAZ: item.NUMERONOTASEFAZ,
      DESCRICAOOT: item.DESCRICAOOT,

      QTDCONFERENCIA: item.QTDCONFERENCIA,
      IDSTATUSOT: item.IDSTATUSOT,
      IDSAPORIGEM: toFloat(item.IDSAPORIGEM),
      IDSAPDESTINO: item.IDSAPDESTINO,
      ERRORLOGSAP: item.ERRORLOGSAP,
      CHAVESEFAZ: item.CHAVESEFAZ,
      MSGSEFAZ: item.MSGSEFAZ,
      CODIGORETORNOSEFAZ: item.CODIGORETORNOSEFAZ,
      DSOBSERVACAO: item.DSOBSERVACAO,
      contador
    }
  });

  const colunasFaturasOT = [
    {
      field: 'IDPRODUTO',
      header: '',
      selectionMode: "multiple",
      body: (row) => {
        return (
          <div style={{ background: '', }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(row.IDRESUMOOT)}
                onChange={(e) => {
                  const updatedSelectedIds = e.target.checked
                    ? [...selectedIds, row.IDRESUMOOT]
                    : selectedIds.filter(id => id !== row.IDRESUMOOT);
          
                  setSelectedIds(updatedSelectedIds);
                  setSelectAll(updatedSelectedIds.length === dados.length);
                }}
                
              />
          </div>
        )
      }
    },
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
      field: 'DATAEMISSAOSEFAZFORMATADA',
      header: 'Data Nota',
      body: row => <th>{row.DATAEMISSAOSEFAZFORMATADA}</th>,
      sortable: true,
    },
    {
      field: 'NUMERONOTASEFAZ',
      header: 'Número NF-E',
      body: row => <th>{row.NUMERONOTASEFAZ}</th>,
      sortable: true,
    },
    {
      field: 'DESCRICAOOT',
      header: 'Status',
      body: row => <th style={{ color: row.DESCRICAOOT == 'CANCELADO' || 'red' && row.DESCRICAOOT == 'FECHADO' ? 'red' : '' }} >{row.DESCRICAOOT}</th>,
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
              justifyContent: "space-between",
              alignItems: "center",
              width: "15rem",

            }}
          >
            <div>

              <ButtonTable
                titleButton={"Visualizar"}
                onClickButton={() => handleClickVisualizar(row)}
                Icon={GrView}
                iconSize={16}
                iconColor={"#fff"}
                cor={"success"}

              />
            </div>
            <div>

              <ButtonTable
                titleButton={"Cancelar"}
                onClickButton={() => handleCancelar(row.IDRESUMOOT)}
                Icon={FaRegTrashAlt}
                iconSize={16}
                iconColor={"#fff"}
                cor={"danger"}
                disabledBTN={[1, 3].indexOf(row.IDSTATUSOT) >= 0}
              />
            </div>
            <div>

              <ButtonTable
                titleButton={"Processar Faturamento"}
                onClickButton={() => handleFaturar(row.IDRESUMOOT)}
                Icon={FaCheck}
                iconSize={16}
                iconColor={"#fff"}
                cor={"warning"}
                disabledBTN={row.IDSTATUSOT === 3}
              />
            </div>
            <div>

              <ButtonTable
                titleButton={"Processar SEFAZ"}
                // onClickButton={() => IDSAPORIGEM}
                onClickButton={() => handleConsultarSefazOT(row.IDRESUMOOT)}
                Icon={FaCheck}
                iconSize={16}
                iconColor={"#fff"}
                cor={"info"}
                disabledBTN={row.IDSTATUSOT === 9}
              />
            </div>
            <div>

              <ButtonTable
                titleButton={"Imprimir Etiqueta"}
                // onClickButton={() => IDSAPORIGEM}
                onClickButton={() => handleClickImprimir(row)}
                Icon={MdOutlineLocalPrintshop}
                iconSize={16}
                iconColor={"#fff"}
                cor={"dark"}

              />
            </div>


            <Fragment>

              {row.ERRORLOGSAP !== '' && row.ERRORLOGSAP !== null ? (
                <div>
                  <ButtonTable
                    titleButton={"Status Nota Fiscal"}
                    onClickButton={() => handleClickStatusNota(row)}
                    Icon={FaExclamation}
                    iconSize={16}
                    iconColor={"#fff"}
                    cor={"danger"}

                  />
                </div>
              ) : (
                (row.ERRORLOGSAP === '' || row.ERRORLOGSAP === null) && row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0 ? (
                  <div>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickStatusNota(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"success"}

                    />
                  </div>
                ) : (
                  <div>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickStatusNota(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"warning"}

                    />
                  </div>

                ))}

            </Fragment>
            <div>
              <ButtonTable
                titleButton={"Imprimir Nota Fiscal"}
                onClickButton={() => window.open(`http://164.152.244.96:3000/files/NFe${row.CHAVESEFAZ}.pdf`)}
                Icon={MdOutlineLocalPrintshop}
                iconSize={16}
                iconColor={"#fff"}
                cor={"success"}

              />
            </div>
          </div>
        );
      }
    }

  ]

    // useEffect(() => {
  //   if (selectedIds.length > 0) {
  //     handleDetalhar(selectedIds, 'True');
  //   }
  // }, [selectedIds]);


  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);

    const updatedSelectedIds = isChecked ? dados.map(item => item.IDRESUMOOT) : [];
    setSelectedIds(updatedSelectedIds);

    // if (updatedSelectedIds.length > 0) {
    //   handleDetalhar(updatedSelectedIds, 'True');
    // }
  };

  const handleVisualizar = async (IDRESUMOOT) => {

    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalVisualizar(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickVisualizar = (row) => {
    if (row && row.IDRESUMOOT) {
      handleVisualizar(row.IDRESUMOOT);
    }
  };

  const handleEdit = async (IDRESUMOOT) => {
    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)
      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalEditar(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detahes transferência: ', error);
    }
  };

  const handleClickEdit = (row) => {
    if (row && row.IDRESUMOOT) {
      handleEdit(row.IDRESUMOOT);
    }
  };

  const handleImprimir = async (IDRESUMOOT) => {
    try {
      const response = await get(`/impressao-etiqueta-ot?idResumoOT=${IDRESUMOOT}`)
      if (response.data && response.data.length > 0) {
        setDadosImprimirOT(response.data);
        setModalImprimir(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detahes transferência: ', error);
    }
  };

  const handleClickImprimir = (row) => {
    if (row && row.IDRESUMOOT) {
      handleImprimir(row.IDRESUMOOT);
    }
  };

  const handleConsultarSefazOT = async (IDRESUMOOT) => {
    Swal.fire({
      title: 'Deseja Realizar a Emissão da Nota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero Faturar!',
      cancelButtonText: 'Não',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await get('/consulta-nfe-saida-tranferencia');
          Swal.fire({
            title: 'Sucesso!',
            text: 'Nota Fiscal Emitida com Sucesso!',
            icon: 'success',
            timer: 2000
          })

          return response.data;
        } catch (error) {
          Swal.fire({
            title: 'Erro!',
            text: `Erro ao Consultar a SEFAZ: ${error}`,
            icon: 'success'
          });
        }
      }
    })
  };

  const handleStatusNota = async (IDRESUMOOT) => {

    try {
      const response = await get(`/resumo-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

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

  const selecionarRegistros = () => {
    Swal.fire({
      title: '<strong>Selecionar <u>OT</u></strong>',
      icon: 'info',
      html: 'A rotina irá selecionar os <b>10 (dez) primeiros</b>, registros de acordo com a opção escolhida!',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Faturamento',
      confirmButtonColor: '#ffc241',
      cancelButtonText: 'SEFAZ',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      let selected = [];
      let count = 0;

      if (result.isConfirmed) {
        // Faturamento
        dadosFaturaOT.forEach((item) => {
          if (count < 10 && item.IDSAPORIGEM === 0) {
            selected.push(item.IDRESUMOOT);
            count++;
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // SEFAZ
        dadosFaturaOT.forEach((item) => {
          if (count < 10 && item.IDSAPORIGEM !== 0 && item.IDSTATUSOT === 9) {
            selected.push(item.IDRESUMOOT);
            count++;
          }
        });
      }

      setSelectedIds(selected);
    });
  };

    const baixarPDFs = async (dados) => {
      let pdfDataArray = [];
      let nomeArquivos = [];
  
      try {
        for (const url of dados) {
          const response = await fetch('https://cors-anywhere.herokuapp.com/' + url);
          const pdfData = await response.arrayBuffer();
          pdfDataArray.push(pdfData);
  
          // Extrair nome do arquivo da URL
          const nomeArquivo = url.substring(url.lastIndexOf("/") + 1);
          nomeArquivos.push(nomeArquivo);
        }
  
        return [pdfDataArray, nomeArquivos];
      } catch (error) {
        console.error("Erro ao baixar os arquivos PDF:", error);
        throw error;
      }
    };
  
    // Função para comprimir os PDFs em ZIP
    const comprimirPDFs = async (pdfDataArray, nomeArquivos) => {
      try {
        const zip = new JSZip();
        for (let i = 0; i < pdfDataArray.length; i++) {
          zip.file(nomeArquivos[i], pdfDataArray[i]);
        }
        const zipData = await zip.generateAsync({ type: "blob" });
        return zipData;
      } catch (error) {
        console.error("Erro ao comprimir os arquivos PDF:", error);
        throw error;
      }
    };
  
    // Função para fazer o download do ZIP
    const baixarArquivoZIP = (zipData) => {
      try {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipData);
        link.download = "download_notasfiscais.zip";
        link.click();
      } catch (error) {
        console.error("Erro ao baixar o arquivo ZIP:", error);
        throw error;
      }
    };
  
    // Função principal para baixar as notas fiscais
    const downloadNFE = async () => {
      try {
        if (dadosSelecionados.length === 0) {
          Swal.fire("Atenção", "Nenhuma nota foi selecionada!", "warning");
          return;
        }
  
        const [pdfDataArray, nomeArquivos] = await baixarPDFs(dadosSelecionados);
        const zipData = await comprimirPDFs(pdfDataArray, nomeArquivos);
        baixarArquivoZIP(zipData);
      } catch (error) {
        Swal.fire("Erro", "Ocorreu um erro ao baixar as notas fiscais.", "error");
      }
    };
  
    // Exemplo para seleção de dados (substituir lógica de seleção conforme necessidade)
    const handleSelecionarDados = (CHAVESEFAZ) => {
      const mockDados = [
        `http://164.152.244.96:3000/files/NFe${CHAVESEFAZ}.pdf`,
        `http://164.152.244.96:3000/files/NFe${CHAVESEFAZ}.pdf`,
      ];
      setDadosSelecionados(mockDados);
      Swal.fire("Notas Selecionadas", "As notas foram selecionadas com sucesso!", "success");
    };

  return (
    <Fragment>
      <div className="row mb-4 " style={{marginTop: '1rem'}}>

        <ButtonType
          Icon={MdFormatListBulleted}
          iconSize="16px"
          textButton="Selecionar Registros"
          cor="primary"
          tipo="button"
          onClickButtonType={selecionarRegistros}
        />
        <ButtonType
          Icon={FcProcess}
          iconSize="16px"
          textButton="Processar Faturamento"
          cor="warning"
          tipo="button"
          onClickButtonType={""}
        />
        <ButtonType
          Icon={FcProcess}
          iconSize="16px"
          textButton="Processar SEFAZ"
          cor="info"
          tipo="button"
          onClickButtonType={""}
        />
        <ButtonType
          Icon={GrDocumentDownload}
          iconSize="16px"
          textButton="Download Notas"
          cor="danger"
          tipo="button"
          onClickButtonType={""}
        />
        <ButtonType
          Icon={FaTruckFast}
          iconSize="16px"
          textButton="Conhecimento Entrega"
          cor="danger"
          tipo="button"
          onClickButtonType={""}
        />
        </div>
      <div className="panel">

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>
        <div className="card mb-4" ref={dataTableRef}>
          <DataTable
            title="Faturas OT"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows

            dataKey="IDRESUMOOT"
            selectionMode="checkbox"
            selection={selectedIds}
            onSelectionChange={(e) => setSelectedIds(e.value)}

            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasFaturasOT.map(coluna => (
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

      {/* <ActionVisualizarOTModal
        show={modalVisualizar}
        handleClose={() => setModalVisualizar(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
      /> */}

      <ActionEditarOTModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
      />

      <ActionImprimirEtiquetaOT
        show={modalImprimir}
        handleClose={() => setModalImprimir(false)}
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


