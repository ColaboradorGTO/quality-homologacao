import { Fragment, useEffect, useRef, useState } from "react"
import { FaCheck, FaExclamation, FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { get } from "../../../../api/funcRequest";
import { GrView } from "react-icons/gr";
import { ActionImprimirEtiquetaOT } from "./ActionImprimirEtiquetaOT/actionImprimirEtiquetaOT";
import { useCancelarFaturaOT } from "./hooks/useCancelarFaturaOT";
import { toFloat } from "../../../../utils/toFloat";
import { ActionObservacaoOT } from "./ActionObservacaoOT/actionObservacaoOTModal";
import { useProcessarFaturamentoOT } from "./hooks/useProcessarFaturamentoOT";
import { useProcessarSefazOT } from "./hooks/useProcessarSefazOT";
import { ActionVisualizarOTModal } from "./ActionVisualizarOT/actionVisualizarOTModal";

export const ActionListaFaturasOT = ({
  dadosFaturaOT,
  optionsModulos,
  usuarioLogado,
  refetchFaturaOT,
  setSelectedRows,
  selectedIds,
  setSelectedIds,

}) => {

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

  const dataTableRef = useRef();

  const {
    handleCancelar
  } = useCancelarFaturaOT({ usuarioLogado, refetchFaturaOT, optionsModulos });

  const {
    handleProcessarFaturamento,
  } = useProcessarFaturamentoOT({ usuarioLogado, refetchFaturaOT, optionsModulos });

  const {
    handleProcessarSefaz
  } = useProcessarSefazOT({ usuarioLogado, refetchFaturaOT, optionsModulos });

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
                const isChecked = e.target.checked;
                const id = parseInt(row.IDRESUMOOT);
                if (isChecked) {
                  setSelectedIds(prev =>
                    prev.includes(id)
                      ? prev
                      : [...prev, id]
                  );

                  setSelectedRows(prev =>
                    prev.some(item => parseInt(item.IDRESUMOOT) === id)
                      ? prev
                      : [...prev, row]
                  );

                } else {
                  setSelectedIds(prev =>
                    prev.filter(PrevId => PrevId !== id)
                  );

                  setSelectedRows(prev =>
                    prev.filter(item => parseInt(item.IDRESUMOOT) !== id)
                  );
                }
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
      body: row => <th style={{
        color: row.DESCRICAOOT == 'CANCELADO' || 'red' &&
          row.DESCRICAOOT == 'FECHADO' ? 'red' : ''
      }} >{row.DESCRICAOOT}</th>,
      sortable: true,
    },
    {
      field: 'IDSTATUSOT',
      header: 'Opções',
      body: (row) => {
        const colorButton = row.ERRORLOGSAP?.length
          ? 'danger'
          : (row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0)
            ? 'success'
            : 'warning';

        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" }}>

            <div>
              <ButtonTable
                titleButton={"Visualizar"}
                onClickButton={() => handleClickVisualizar(row)}
                Icon={GrView}
                iconSize={16}
                width="32px"
                height="32px"
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
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"danger"}
                disabledBTN={[1, 3].indexOf(row.IDSTATUSOT) < 0}
              />
            </div>

            <div>
              <ButtonTable
                titleButton={"Processar Faturamento"}
                onClickButton={() => handleProcessarFaturamento([row.IDRESUMOOT], false)}
                Icon={FaCheck}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"warning"}
                disabledBTN={row.IDSTATUSOT !== 3}
              />
            </div>

            <div>
              <ButtonTable
                titleButton={"Processar SEFAZ"}
                onClickButton={() => handleProcessarSefaz([row.IDSAPORIGEM])}
                Icon={FaCheck}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"info"}
                disabledBTN={row.IDSTATUSOT !== 9}
              />
            </div>

            <div>
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
            </div>

            <div>
              <ButtonTable
                titleButton={"Status Nota Fiscal"}
                onClickButton={() => handleClickStatusNota(row)}
                Icon={FaExclamation}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={colorButton}
              />
            </div>

            <div>
              <ButtonTable
                titleButton={"Imprimir Nota Fiscal"}
                onClickButton={() => window.open(`http://164.152.244.96:3000/files/NFe${row.CHAVESEFAZ}.pdf`)}
                Icon={MdOutlineLocalPrintshop}
                iconSize={16}
                width="32px"
                height="32px"
                iconColor={"#fff"}
                cor={"success"}
                disabledBTN={!row.CHAVESEFAZ}
              />
            </div>

          </div>
        );
      }
    }

  ]

  const handleVisualizar = async (IDRESUMOOT) => {
    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)

      if (response.data && response.data.length > 0) {
        setDadosDetalheTransferencia(response.data);
        setModalVisualizar(true);
      } else {
        Swal.fire({
          title: 'Nao foram encontrados produtos para essa OT',
          icon: 'info',
          confirmButtonText: 'OK',
          customClass: {
            container: 'custom-swal',
          }
        })
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

  const handleImprimir = async (IDRESUMOOT) => {
    try {
      const response = await get(`/impressao-etiqueta-ot?idResumoOT=${IDRESUMOOT}`)
      if (response.data && response.data.length > 0) {
        setDadosImprimirOT(response.data);
        setModalImprimir(true);
      } else {
        Swal.fire({
          title: 'Nao foram encontrados etiquetas para essa OT',
          icon: 'info',
          confirmButtonText: 'OK',
          customClass: {
            container: 'custom-swal',
          }
        })
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

  return (
    <Fragment>
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

      <ActionVisualizarOTModal
        show={modalVisualizar}
        handleClose={() => setModalVisualizar(false)}
        dadosDetalheTransferencia={dadosDetalheTransferencia}
      />

      <ActionImprimirEtiquetaOT
        show={modalImprimir}
        handleClose={() => setModalImprimir(false)}
        dadosImprimirOT={dadosImprimirOT}
        usuarioLogado={usuarioLogado}
      />

      <ActionObservacaoOT
        show={modalObservacao}
        handleClose={() => setModalObservacao(false)}
        dadosObservacaoOT={dadosObservacaoOT}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}


