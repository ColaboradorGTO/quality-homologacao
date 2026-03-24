import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from '../../../../ButtonsTabela/ButtonTable';
import { MdOutlineLockOpen } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { formatMoeda } from '../../../../../utils/formatMoeda';
import { Fragment, useRef, useState } from 'react';
import HeaderTable from '../../../../Tables/headerTable';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toFloat } from '../../../../../utils/toFloat';
import { ActionIncluirProdutoPedidoModal } from './IncluirProdutoPedido/actionIncluirProdutoPedidoModal';
import { get } from '../../../../../api/funcRequest';
import { useAtivarCancelar } from '../hook/useAtivaCancelar';


export const ActionListaPedidos = ({ 
  dadosDetalhePedido,
  dadosVisualizarPedido,
  setModalIncluirProdutoPedido,
  usuarioLogado,
  optionsModulos
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheGradePedido, setDadosDetalheGradePedido] = useState();
  const dataTableRef = useRef();
  const {handleAtivarCancelarPedido} = useAtivarCancelar({ usuarioLogado, handleClick, status })

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Detalhes Pedidos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Categoria', 'Qtd', 'Unid', 'Ref', 'Descrição', 'Estrutura', 'Cor', 'Desc I', 'Desc II', 'Desc III', 'Vr Unit', 'Vr Venda', 'Total']],
      body: dados.map(item => [
        item.contador,
        item.DSCATEGORIAPEDIDO,
        item.QTDTOTAL,
        item.DSSIGLA,
        item.NUREF,
        item.DSPRODUTO,
        item.DSSUBGRUPOESTRUTURA,
        item.DSCOR,
        formatMoeda(item.DESC01),
        formatMoeda(item.DESC02),
        formatMoeda(item.DESC03),
        formatMoeda(item.VRUNITLIQDETALHEPEDIDO),
        formatMoeda(item.VRVENDADETALHEPEDIDO),
        formatMoeda(item.VRTOTALDETALHEPEDIDO),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('detalhes_pedidos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Categoria', 'Qtd', 'Unid', 'Ref', 'Descrição', 'Estrutura', 'Cor', 'Desc I', 'Desc II', 'Desc III', 'Vr Unit', 'Vr Venda', 'Total'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 150, caption: 'Categoria' },
      { wpx: 70, caption: 'Qtd' },
      { wpx: 70, caption: 'Unid' },
      { wpx: 100, caption: 'Ref' },
      { wpx: 250, caption: 'Descrição' },
      { wpx: 150, caption: 'Estrutura' },
      { wpx: 100, caption: 'Cor' },
      { wpx: 100, caption: 'Desc I' },
      { wpx: 100, caption: 'Desc II' },
      { wpx: 100, caption: 'Desc III' },
      { wpx: 100, caption: 'Vr Unit' },
      { wpx: 100, caption: 'Vr Venda' },
      { wpx: 100, caption: 'Total' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhes Pedidos');
    XLSX.writeFile(workbook, 'detalhes_pedidos.xlsx');
  };

  const calcularTotalPedido = () => {
    let total = 0;
    for (let dados of dadosDetalhePedido) {
      total += parseFloat(dados.VRTOTALLIQUIDO);
    }
    return total;
  }

  const dadosListaPedidos = dadosDetalhePedido?.map((item, index) => {
    let contador = index + 1;
    let setorAndamento = 'COMPRAS';

    return {
      contador,
      IDDETPEDIDO: item.IDDETPEDIDO,
      DSCATEGORIAPEDIDO: item.DSCATEGORIAPEDIDO,
      QTDTOTAL: toFloat(item.QTDTOTAL),
      DSSIGLA: item.DSSIGLA,
      NUREF: item.NUREF,
      DSPRODUTO: item.DSPRODUTO,
      DESC01: toFloat(item.DESC01),
      DESC02: toFloat(item.DESC02),
      DESC03: toFloat(item.DESC03),
      VRUNITLIQDETALHEPEDIDO: toFloat(item.VRUNITLIQDETALHEPEDIDO),
      VRVENDADETALHEPEDIDO: toFloat(item.VRVENDADETALHEPEDIDO),
      STTRANSFORMADO: item.STTRANSFORMADO,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
      DSCOR: item.DSCOR,
      IDANDAMENTO: item.IDANDAMENTO,
      VRTOTALDETALHEPEDIDO: toFloat(item.VRTOTALDETALHEPEDIDO),
      IDPEDIDO: item.IDPEDIDO,
      setorAndamento
    }
  });

  
  const colunasPedidos = [
    {
      field: 'contador',
      header: '#',
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
      header: 'Qtd',
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
      header: 'Ref',
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
      field: 'DESC01',
      header: 'Desc I',
      body: row => <th>{formatMoeda(row.DESC01)}</th>,
      sortable: true,
    },
    {
      field: 'DESC02',
      header: 'Desc II',
      body: row => <th>{formatMoeda(row.DESC02)}</th>,
      sortable: true,
    },
    {
      field: 'DESC03',
      header: 'Desc III',
      body: row => <th>{formatMoeda(row.DESC03)}</th>,
      sortable: true,
    },
    {
      field: 'VRUNITLIQDETALHEPEDIDO',
      header: 'Vr Unit',
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
      header: 'Opções',
      body: (row) => {
        if (row.setorAndamento == 'COMPRAS' && row.STTRANSFORMADO == 'False') {
          return (
            <div className="p-1 "
            style={{ justifyContent: "space-between", width: "100%", display: "flex" }}
            >
             
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  width="30px"
                  height="30px"
                  onClickButton={() => handleClickEditarPedido(row)}
                  titleButton={"Editar Item do Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={AiOutlineDelete}
                  cor={"danger"}
                  iconColor={"white"}
                  iconSize={20}
                  width="30px"
                  height="30px"
                  onClickButton
                  titleButton={"Cancelar Item do Pedido"}
                />
              </div>
            </div>
          )
        } else if (row.setorAndamento == 'COMPRAS' && row.STTRANSFORMADO == 'True') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  width="30px"
                  height="30px"
                  onClickButton={() => handleClickEditarPedido(row)}
                  titleButton={"Editar Item do Pedido 11"}
                />
              </div>
            </div>
          )
        } else {
          if(row.STTRANSFORMADO == 'True' && row.setorAndamento == 'CADASTRO') { 
            return (
              <div className="p-1 "
                style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
              >
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLockOpen}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    width="30px"
                    height="30px"
                    onClickButton
                    titleButton={"Item Não Pode Ser Alterado ou Cancelado, Produtos Criados!"}
                  />
                </div>
              </div>
            )
          } else {
            return (
              <div className="p-1 "
                style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
              >
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLockOpen}
                    cor={"danger"}
                    iconColor={"white"}
                    iconSize={20}
                    width="30px"
                    height="30px"
                    onClickButton
                    titleButton={"Item Não Pode Ser Alterado ou Cancelado"}
                    disabledBTN={true}
                  />
                </div>
              </div>
            )
          }
        } 
      },
    },
  ]
   
  const handleEditarPedido = async (IDDETPEDIDO) => {
    try {
      
      const response = await get(`/lista-detalhe-pedidos-grade?idDetalhePedido=${IDDETPEDIDO}`)
      if (response.data ) {
        setDadosDetalheGradePedido(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickEditarPedido = async (row) => {
    if (row.IDDETPEDIDO) {
      handleEditarPedido(row.IDDETPEDIDO)
      setModalEditar(true)
      // setModalIncluirProdutoPedido(true)
    }
  }


  return (
    <Fragment>
      <div className="">
        
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
            title="Pedidos"
            value={dadosListaPedidos}
            globalFilterValue={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100]}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
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
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionIncluirProdutoPedidoModal 
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        dadosDetalheGradePedido={dadosDetalheGradePedido}
        dadosDetalhePedido={dadosDetalhePedido}
        dadosVisualizarPedido={dadosVisualizarPedido}
      />
    </Fragment>
  )
}