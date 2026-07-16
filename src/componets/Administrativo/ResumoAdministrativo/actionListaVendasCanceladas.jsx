import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { get } from "../../../api/funcRequest";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { ActionRelacaoRecebimentosModal } from "../Components/ActionsModaisVendas/ActionRecebimentos/actionRelacaoRecebimentosModal";
import { ActionDetalheVendaProdutosModal } from "../Components/ActionsModaisVendas/actionDetalheVendaProdutosModal";
import { ActionDetalheVendaModal } from "../Components/ActionsModaisVendas/actionDetalheVendaModal";
import { toFloat } from "../../../utils/toFloat";
import { TbFileTypeXml } from "react-icons/tb";
import { ActionVendaXMLModal } from "./ActionVendasXML/actionVendaXMLModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";
import Swal from "sweetalert2";

export const ActionListaVendasCanceladas = ({ dadosVendasCanceladas, empresaSelecionada, usuarioLogado, optionsModulos }) => {
  const [modalVendaVisivel, setModalVendaVisivel] = useState(false);
  const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false);
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false);
  const [dadosVendas, setDadosVendas] = useState([]);
  const [dadosProdutoModal, setDadosProdutoModal] = useState([]);
  const [dadosDetalheRecebimentos, setDadosDetalheRecebimentos] = useState([]);
  const [dadosDetalheVendasXML, setDadosDetalheVendasXML] = useState([]);
  const [modalXmlVisivel, setModalXmlVisivel] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Canceladas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Valor', 'Nota', 'Cancelado Por', 'Motivo']],
      body: dadosVendasAtivas.map(item => [
        item.contador,
        item.DSCAIXA,
        item.IDVENDA,
        item.NFE_INFNFE_IDE_NNF,
        item.DTHORAFECHAMENTO,
        item.NOFUNCIONARIO,
        formatMoeda(item.VRTOTALPAGO),
        item.STCONTINGENCIA == 'True' ? 'Emitida' : 'Não Emitida',
        item.NOFUNCIOCANCEL,
        item.TXTMOTIVOCANCELAMENTO ? 'Motivo Não Informado' : 'Motivo Não Informado',

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_canceladas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVendasAtivas);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Valor', 'Nota', 'Cancelado Por', 'Motivo'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 100, caption: 'NFCe' },
      { wpx: 150, caption: 'Abertura' },
      { wpx: 200, caption: 'Operador' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 100, caption: 'Nota' },
      { wpx: 100, caption: 'Cancelado Por' },
      { wpx: 150, caption: 'Motivo' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Canceladas');
    XLSX.writeFile(workbook, 'vendas_canceladas.xlsx');
  };

  const dadosVendasAtivas = dadosVendasCanceladas.map((item, index) => {
    let contador = index + 1;
    
    return {
      contador,
      DSCAIXA: `${item.IDCAIXAWEB} - ${item.DSCAIXA}`,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      VRTOTALPAGO: toFloat(item.VRTOTALPAGO),
      STCONTINGENCIA: item.STCONTINGENCIA == 'True' ? 'Contigência' : 'Emitida',
      NOFUNCIOCANCEL: item.NOFUNCIOCANCEL,
      TXTMOTIVOCANCELAMENTO: item.TXTMOTIVOCANCELAMENTO,
      XML_FORMATADO: item.XML_FORMATADO || '',
      STCONFERIDO: item.STCONFERIDO,
      VRTOTALDESCONTO: toFloat(item.VRTOTALDESCONTO),
      VRTOTALVENDA: toFloat(item.VRTOTALVENDA),
    };
  });

 const calcularTotal = (field) => {
    return dadosVendasAtivas.reduce((total, item) => total + toFloat(item[field]), 0);
  };


  const calcularValorTotaPago = () => {
  const total = calcularTotal('VRTOTALPAGO');
    return total;
  }

  const colunaVendasCanceladas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'red' }}>{row.contador}</th>,
      sortable: true,
      width: "5%"
    },
    {
      field: 'DSCAIXA',
      header: 'Caixa',
      body: row => <th style={{ color: 'red' }}>{row.DSCAIXA}</th>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <th style={{ color: 'red' }}>{row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'NFE_INFNFE_IDE_NNF',
      header: 'NFCe',
      body: row => <th style={{ color: 'red' }}>{row.NFE_INFNFE_IDE_NNF}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Abertura',
      body: row => <th style={{ color: 'red' }}>{row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <th style={{ color: 'red' }}>{row.NOFUNCIONARIO}</th>,
      footer: 'Total Vendas Cancelada',
      sortable: true,
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Valor',
      body: row => <th style={{ color: 'red' }}>{formatMoeda(row.VRTOTALPAGO)}</th>,
      footer: formatMoeda(calcularValorTotaPago()),
      sortable: true,
    },
    {
      field: 'STCONTINGENCIA',
      header: 'Nota',
      body: row => (
        <th style={{ color: row.STCONTINGENCIA == 'Contigência' ? 'blue' : 'red' }}>
          {row.STCONTINGENCIA}
        </th>
      ),
      sortable: true,
    },
    {
      field: 'NOFUNCIOCANCEL',
      header: 'Cancelado Por',
      body: row => <th style={{ color: 'red' }}>{row.NOFUNCIOCANCEL}</th>,
      sortable: true,
    },
    {
      field: 'TXTMOTIVOCANCELAMENTO',
      header: 'Motivo',
      body: row => <th style={{ color: 'red' }}>{row.TXTMOTIVOCANCELAMENTO}</th>,
      sortable: true,
    },

    {
      field: 'STCONFERIDO',
      header: 'Opções',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Venda"}
              onClickButton={() => handleClickVenda(row)}
              Icon={GrView}
              iconSize={20}
              cor={"info"}
              width="30px"
              height="30px"
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Produtos"}
              onClickButton={() => handleClickProduto(row)}
              Icon={FaProductHunt}
              iconSize={20}
              cor={"warning"}
              width="30px"
              height="30px"
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Recebimentos"}
              onClickButton={() => handleClickPagamento(row)}
              Icon={MdOutlineAttachMoney}
              iconSize={20}
              cor={"success"}
              width="30px"
              height="30px"
              disabledBTN={optionsModulos[0]?.ALTERAR == 'False' ? true : false}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={`${row.XML_FORMATADO?.length > 0 ? 'Visualizar Xml da Venda' : 'Venda Sem XML'}`}
              disabledBTN={row.XML_FORMATADO?.length === 0}
              onClickButton={() => clickDetalharVendaXML(row)}
              Icon={TbFileTypeXml}
              iconSize={20}
              iconColor={"#fff"}
              cor={"info"}
              width="30px"
              height="30px"

            />
          </div>
        </div>
      ),
    },

  ]

  const handleEditProduto = async (IDVENDA, empresaSelecionada) => {
    try {
      const response = await get(`/detalhe-venda?idVenda=${IDVENDA}&idEmpresa=${empresaSelecionada}`)
      if (response.data && response.data.length > 0) {
        setDadosProdutoModal(response.data)
        setModalProdutoVisivel(true)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sem Produtos',
          html: `A venda selecionada não possui produtos vinculados.`,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          },
        })
        return;
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickProduto = async (row) => {
    if (row && row.IDVENDA && empresaSelecionada) {
      handleEditProduto(row.IDVENDA, empresaSelecionada)
    }
  }

  const handleClickVenda = async (row) => {
    if (row && row.IDVENDA && empresaSelecionada) {
      handleEditVenda(row.IDVENDA, empresaSelecionada);
    }
  }

  const handleEditVenda = async (IDVENDA, empresaSelecionada) => {

    try {
      const response = await get(`/resumo-venda-caixa-detalhado?idVenda=${IDVENDA}&idEmpresa=${empresaSelecionada}`);
      if (response.data && response.data.length > 0) {
        setDadosVendas(response.data);
        setModalVendaVisivel(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sem Vendas',
          html: `A venda selecionada não possui detalhes vinculados.`,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          },
        });
        return;
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ");
    }
  }

  const handleEditPagamento = async (IDVENDA) => {
    try {
      const response = await get(`/recebimento-resumo?idVenda=${IDVENDA}`)
      if (response.data && response.data.length > 0) {
        setDadosDetalheRecebimentos(response.data)
        setModalPagamentoVisivel(true)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sem Recebimentos',
          html: `A venda selecionada não possui recebimentos vinculados.`,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          },
        });
        return;
      }
    } catch (error) {
      console.log(error, 'não foi possivel pegar os dados da tabela')
    }
  }
  const handleClickPagamento = (row) => {
    if (row && row.IDVENDA) {
      handleEditPagamento(row.IDVENDA)
    }
  }

  const clickDetalharVendaXML = (row) => {
    if (row && row.IDVENDA) {
      handleDetalharVendaXML(row.IDVENDA);
    }
  };

  const handleDetalharVendaXML = async (IDVENDA) => {
    try {
      const response = await get(`/venda-xml?idVenda=${IDVENDA}`);
      if(response.data && response.data.length > 0) {
        setModalXmlVisivel(true);
        setDadosDetalheVendasXML(response.data)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sem XML',
          html: `A venda selecionada não possui XML vinculado ou disponível para visualização.`,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          },        
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Vendas Cancelada " colSpan={6} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularValorTotaPago())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={""} colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>


      <div className="panel" style={{ marginTop: '2rem' }}>
        <header className="panel-hdr " >
          <h2 >
            Lista de Vendas Canceladas
          </h2>
        </header>

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
            title="Vendas por Loja"
            size="small"
            value={dadosVendasAtivas}
            globalFilter={globalFilterValue}
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosVendasAtivas.length]}
            showGridlines
            cellMemo={false}
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunaVendasCanceladas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                // footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>

      </div>


      {modalVendaVisivel && (
        <ActionDetalheVendaModal
          show={modalVendaVisivel}
          handleClose={() => setModalVendaVisivel(false)}
          dadosVendas={dadosVendas}
        />
      )}

      {modalProdutoVisivel && (

        <ActionDetalheVendaProdutosModal
          show={modalProdutoVisivel}
          handleClose={() => setModalProdutoVisivel(false)}
          dadosProdutoModal={dadosProdutoModal}
        />
      )}

      {modalPagamentoVisivel && (
        <ActionRelacaoRecebimentosModal
          show={modalPagamentoVisivel}
          handleClose={() => setModalPagamentoVisivel(false)}
          dadosDetalheRecebimentos={dadosDetalheRecebimentos}
          usuarioLogado={usuarioLogado}
          dadosAtivasVendas={dadosVendasAtivas}
          optionsModulos={optionsModulos}
        />
      )}

      <ActionVendaXMLModal
        show={modalXmlVisivel}
        handleClose={() => setModalXmlVisivel(false)}
        dadosDetalheVendasXML={dadosDetalheVendasXML}
      />
    </Fragment>
  )
}