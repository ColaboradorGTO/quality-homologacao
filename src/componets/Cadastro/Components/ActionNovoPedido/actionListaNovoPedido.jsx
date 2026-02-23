import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { IoIosAdd } from "react-icons/io";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { ActionEditarItemPedidoModal } from "./ActionEditarItemDoPedidoModal/actionEditarItemPedidoModal";
import { get } from "../../../../api/funcRequest";

export const ActionListaNovoPedido = ({ dadosVisualizarPedido, dadosDetalhe }) => {
  const [modalEditarItemPedido, setModalEditarItemPedido] = useState(false);
  const [dadosItemPedido, setDadosItemPedido] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos Criados',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Categoria', 'QTD', 'Unid', 'Ref.', 'Descrição', 'Estrutura', 'Cor', 'Vr. Unit', 'Vr Venda', 'Total', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DSCATEGORIAPEDIDO,
        item.QTDTOTAL,
        item.DSSIGLA,
        item.NUREF,
        item.DSPRODUTO,
        item.DSSUBGRUPOESTRUTURA,
        item.DSCOR,
        formatMoeda(item.VRUNITLIQDETALHEPEDIDO),
        formatMoeda(item.VRVENDADETALHEPEDIDO),
        formatMoeda(item.VRTOTALDETALHEPEDIDO),
        item.STTRANSFORMADO === 'False' && item.IDANDAMENTO == 4 ? 'PRODUTOS NÃO CRIADOS' : item.STTRANSFORMADO === 'True' && (item.IDANDAMENTO == 5 || item.IDANDAMENTO == 4) ? 'PRODUTOS CRIADOS' : 'PRODUTOS NÃO LIBERADOS'
        
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_criados.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Categoria', 'QTD', 'Unid', 'Ref.', 'Descrição', 'Estrutura', 'Cor', 'Vr. Unit', 'Vr Venda', 'Total', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Categoria' }, 
      { wpx: 100, caption: 'QTD' }, 
      { wpx: 100, caption: 'Unid' }, 
      { wpx: 100, caption: 'Ref.' }, 
      { wpx: 200, caption: 'Descrição' }, 
      { wpx: 200, caption: 'Estrutura' }, 
      { wpx: 200, caption: 'Cor' }, 
      { wpx: 100, caption: 'Vr. Unit' }, 
      { wpx: 100, caption: 'Vr Venda' }, 
      { wpx: 100, caption: 'Total' }, 
      { wpx: 200, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Criados');
    XLSX.writeFile(workbook, 'produtos_criados.xlsx');
  };


  const dados = dadosDetalhe.map((item, index) => {
    let contador = index + 1;
    return {
      IDPEDIDO: item.IDPEDIDO,
      IDDETPEDIDO: item.IDDETPEDIDO,
      DSCATEGORIAPEDIDO: item.DSCATEGORIAPEDIDO,
      QTDTOTAL: toFloat(item.QTDTOTAL),
      DSSIGLA: item.DSSIGLA,
      NUREF: item.NUREF,
      DSPRODUTO: item.DSPRODUTO,
      DESC01: toFloat(item.DESC01).toFixed(2),
      DESC02: toFloat(item.DESC02).toFixed(2),
      DESC03: toFloat(item.DESC03).toFixed(2),
      VRUNITLIQDETALHEPEDIDO: toFloat(item.VRUNITLIQDETALHEPEDIDO),
      VRVENDADETALHEPEDIDO: toFloat(item.VRVENDADETALHEPEDIDO),
      VRTOTALDETALHEPEDIDO: toFloat(item.VRTOTALDETALHEPEDIDO),
      STTRANSFORMADO: item.STTRANSFORMADO,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
      DSCOR: item.DSCOR,

      IDANDAMENTO: item.IDANDAMENTO,
  
      contador
    }
  });
  
  const colunasPedidos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSCATEGORIAPEDIDO',
      header: 'Categoria',
      body: row => <th>{row.DSCATEGORIAPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'QTDTOTAL',
      header: 'QTD',
      body: row => <th>{row.QTDTOTAL}</th>,
      sortable: true,
    },
    {
      field: 'DSSIGLA',
      header: 'Unid',
      body: row => <th>{row.DSSIGLA}</th>,
      sortable: true,
    },
    {
      field: 'NUREF',
      header: 'Ref.',
      body: row => <th>{row.NUREF}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Descrição',
      body: row => <th>{row.DSPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'DSSUBGRUPOESTRUTURA',
      header: 'Estrutura',
      body: row => <th>{row.DSSUBGRUPOESTRUTURA}</th>,
      sortable: true,
    },
    {
      field: 'DSCOR',
      header: 'Cor',
      body: row => <th>{row.DSCOR}</th>,
      sortable: true,
    },
    {
      field: 'VRUNITLIQDETALHEPEDIDO',
      header: 'Vr. Unit',
      body: row => <th>{formatMoeda(row.VRUNITLIQDETALHEPEDIDO)}</th>,
      sortable: true,
    },
    {
      field: 'VRVENDADETALHEPEDIDO',
      header: 'Vr Venda',
      body: row => <th>{formatMoeda(row.VRVENDADETALHEPEDIDO)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALDETALHEPEDIDO',
      header: 'Total',
      body: row => <th>{formatMoeda(row.VRTOTALDETALHEPEDIDO)}</th>,
      sortable: true,
    },
    {
      field: 'STTRANSFORMADO',
      header: 'Situação',
      body: row => {
        if (row.STTRANSFORMADO === 'False' && row.IDANDAMENTO == 4) {
          return <th style={{ color: 'red' }}>PRODUTOS NÃO CRIADOS</th>
        } else if(row.STTRANSFORMADO === 'True' && (row.IDANDAMENTO == 5 || row.IDANDAMENTO == 4)){ 
          return <th style={{ color: 'green' }}>PRODUTOS CRIADOS</th>
        } else {
          return <th style={{ color: 'red' }}>PRODUTOS NÃO LIBERADOS</th>
        }
      },
      sortable: true,
    },
    {
      field: 'contador',
      header: 'Opções',
      body: row => {
        if (row.STTRANSFORMADO === 'False' && row.IDANDAMENTO == 4) {
          return (
            <div className="p-1 "
            style={{ justifyContent: "space-between", display: "flex" }}
          >
            <div className="p-1">
              <ButtonTable
                Icon={IoIosAdd}
                cor={"success"}
                iconColor={"white"}
                iconSize={20}
                onClickButton={() => handleClickEditar(row)}
                titleButton={"Criar Produto do Item do Pedido"}
              />
            </div>
            <div className="p-1">
              <ButtonTable
                Icon={BsTrash3}
                cor={"danger"}
                iconColor={"white"}
                iconSize={20}
                onClickButton={() => handleClickVisualizarPedido(row)}
                titleButton={"Cancelar Item do Pedido"}
              />
            </div>
          </div>
          )
        } else if(row.STTRANSFORMADO === 'True' && (row.IDANDAMENTO == 5 || row.IDANDAMENTO == 4)){ 
          return (
            <div className="p-1 "
            style={{ justifyContent: "space-between", display: "flex" }}
          >
            <div className="p-1">
              <ButtonTable
                Icon={CiEdit}
                cor={"primary"}
                iconColor={"white"}
                iconSize={20}
                onClickButton={() => handleClickEditar(row)}
                titleButton={"Editar Item do Pedido"}
              />
            </div>
            <div className="p-1">
              <ButtonTable
                Icon={BsTrash3}
                cor={"danger"}
                iconColor={"white"}
                iconSize={20}
                onClickButton={() => handleClickVisualizarPedido(row)}
                titleButton={"Cancelar Item do Pedido"}
              />
            </div>
          </div>
          )
        } else {
          return <th style={{ color: 'red' }}></th>
        }
      },
      sortable: true,
    },
  ]



  const handleClickEditar = (row) => {
    if (row && row.IDDETPEDIDO) {
      handleEditar(row.IDDETPEDIDO);
    }
  };

  const handleEditar = async (IDDETPEDIDO) => {
    try {
      const response = await get(`/editar-item-pedido?idDetalhePedido=${IDDETPEDIDO}`);
      setDadosItemPedido(response.data);
  
      setModalEditarItemPedido(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista dos Produtos do Pedido</h2>
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
            title="Produtos do Pedido"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 100, 500, 1000, dados.length]}
            sortOrder={-1}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
          {colunasPedidos.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.688rem' }}
            />
          ))}
          </DataTable>
        </div>

          <ActionEditarItemPedidoModal
            show={modalEditarItemPedido}
            handleClose={() => setModalEditarItemPedido(false)}
            dadosItemPedido={dadosItemPedido}
          />
      </div>
    </Fragment>
  )
}