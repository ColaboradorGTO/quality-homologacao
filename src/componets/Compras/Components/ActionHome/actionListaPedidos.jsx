import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { MdOutlineLocalPrintshop } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import { FaCheck } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { Fragment, useRef, useState } from 'react';
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { get } from '../../../../api/funcRequest';
import { ActionPDFPedidoSemPreco } from './ActionPDFSemPreco/actionPDFPedidoSemPreco';
import { ActionPDFPedido } from './ActionPDF/actionPDFPedido';
import { toFloat } from '../../../../utils/toFloat';
import { ActionPesquisaNovoPedido } from '../ActionNovoPedido/actionPesquisaNovoPedido';


export const ActionListaPedidos = ({ 
  dadosPedidos, 
  dadosVisualizarPedido, 
  setDadosVisualizarPedido,
  setDadosDetalhePedido,
  dadosDetalhePedido,
  setActionVisualizarPedido,
  setActionPedidoResumido,
  actionHome,
  setActionHome,
  actionVisualizarPedido,
  actionPedidoResumido,
}) => {
  const [modalPedidoNota, setModalPedidoNota] = useState(false);
  const [modalPedidoNotaSemPreco, setModalPedidoNotaSemPreco] = useState(false);
  const [dadosPedido, setDadosPedido] = useState([]);
  const [dadosPedidoSemPreco, setDadosPedidoSemPreco] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Pedidos Periodo',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Fabricante', 'Vr Pedido', 'Setor', 'Status']],
      body: dados.map(item => [
        item.contador,
        item.DTPEDIDOFORMATADABR,
        item.IDPEDIDO,
        item.NOFANTASIA,
        item.NOMECOMPRADOR,
        item.NOFORNECEDOR,
        item.FABRICANTE,
        formatMoeda(item.VRTOTALLIQUIDO),
        item.DSSETOR == 'CADASTRO' ? 'CADASTRO' : item.DSSETOR == 'COMPRAS' ? 'COMPRAS' : item.DSSETOR == 'COMPRAS ADM' ? 'COMPRAS ADM' : '',
        item.DSANDAMENTO == 'PRODUTOS/INCLUSÃO INICIADA' ? 'PRODUTOS/INCLUSÃO INICIADA' : item.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA' ? 'PRODUTOS/INCLUSÃO FINALIZADA' : item.DSANDAMENTO == 'PEDIDO EM ANÁLISE' ? 'PEDIDO EM ANÁLISE' : item.DSANDAMENTO == 'PEDIDO CANCELADO' ? 'PEDIDO CANCELADO' : item.DSANDAMENTO == 'PEDIDO INICIADO' ? 'PEDIDO INICIADO' : '',
        item.STMIGRADOSAP == null ? 'NÃO MIGRADO SAP' : 'MIGRADO SAP'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('pedidos_periodos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Fabricante', 'Vr Pedido', 'Setor', 'Status'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 70, caption: 'Data' },
      { wpx: 70, caption: 'Nº Pedido' },
      { wpx: 70, caption: 'Marca' },
      { wpx: 70, caption: 'Comprador' },
      { wpx: 70, caption: 'Fornecedor' },
      { wpx: 70, caption: 'Fabricante' },
      { wpx: 70, caption: 'Vr Pedido' },
      { wpx: 70, caption: 'Setor' },
      { wpx: 70, caption: 'Status' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Periodo');
    XLSX.writeFile(workbook, 'pedidos_periodo.xlsx');
  };



  const calcularTotalPedido = () => {
    let total = 0;
    for (let dados of dadosPedidos) {
      total += parseFloat(dados.VRTOTALLIQUIDO);
    }
    return total;
  }
  const dadosListaPedidos = dadosPedidos.map((item, index) => {
    let contador = index + 1;

    return {
      IDPEDIDO: item.IDPEDIDO,
      DTPEDIDOFORMATADABR: item.DTPEDIDOFORMATADABR,
      VRTOTALLIQUIDO: toFloat(item.VRTOTALLIQUIDO),
      STCANCELADO: item.STCANCELADO,
      NOMECOMPRADOR: item.NOMECOMPRADOR,
      NOFANTASIA: item.NOFANTASIA,
      NOFORNECEDOR: item.NOFORNECEDOR,
      FABRICANTE: item.FABRICANTE,
      DSANDAMENTO: item.DSANDAMENTO,
      DSSETOR: item.DSSETOR,

      MODPEDIDO: item.MODPEDIDO,
      STMIGRADOSAP: item.STMIGRADOSAP,
      contador
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
      field: 'DTPEDIDOFORMATADABR',
      header: 'Data',
      body: row => <th>{row.DTPEDIDOFORMATADABR}</th>,
      sortable: true,
    },
    {
      field: 'IDPEDIDO',
      header: 'Nº Pedido',
      body: row => <th>{row.IDPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Marca',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'NOMECOMPRADOR',
      header: 'Comprador',
      body: row => <th>{row.NOMECOMPRADOR}</th>,
      sortable: true,
    },
    {
      field: 'NOFORNECEDOR',
      header: 'Fornecedor',
      body: row => <th>{row.NOFORNECEDOR}</th>,
      sortable: true,
    },
    {
      field: 'FABRICANTE',
      header: 'Fabricante',
      body: row => <th>{row.FABRICANTE}</th>, 
      footer: 'Total',
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Vr Pedido',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      footer: formatMoeda(calcularTotalPedido()),
      sortable: true,
    },
    {
      field: 'DSSETOR',
      header: 'Setor',
      body: row => {
        return (
          <div>
            <th style={{ color: row.DSSETOR == 'COMPRAS' ? 'blue' : row.DSSETOR == 'CADASTRO' ? 'green' : row.DSSETOR == 'COMPRAS ADM' ? 'gray' : '' }} >{row.DSSETOR}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'DSANDAMENTO',
      header: 'Situação',
      body: row => {
        return (
          <div>
            <th style={{ color: row.DSANDAMENTO == 'PEDIDO INICIADO' ? 'blue' : row.DSANDAMENTO == 'PEDIDO PARA SER AJUSTADO' ? 'blue' : row.DSANDAMENTO == 'PEDIDO FINALIZADO' ? 'tomato' : row.DSANDAMENTO == 'PEDIDO CANCELADO' ? 'red' : row.DSANDAMENTO == 'PEDIDO EM ANÁLISE' ? 'green' : row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA' ? 'black' : '' }}
            >
              {row.DSANDAMENTO}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'DSANDAMENTO',
      header: 'Opções',
      body: (row) => {
        if (row.DSANDAMENTO == 'PEDIDO INICIADO') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"primary"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickVisualizarPedido(row)}
                  titleButton={"Editar Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={AiOutlineDelete}
                  cor={"danger"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Cancelar Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimir(row)}
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimirSempreco(row)}
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
            </div>
          )
        } else if (row.DSANDAMENTO == 'PEDIDO PARA SER AJUSTADO') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"primary"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickVisualizarPedido(row)}
                  titleButton={"Editar Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimir(row)}
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimirSempreco(row)}
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
            </div>
          )
        } else if (row.DSANDAMENTO == 'PEDIDO FINALIZADO') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={GrView}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickVisualizarPedido(row)}
                  titleButton={"Visualizar o Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={AiOutlineDelete}
                  cor={"danger"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Cancelar Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimir(row)}
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimirSempreco(row)}
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
            </div>
          )
        } else if (row.DSANDAMENTO == 'PEDIDO CANCELADO') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={GrView}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickVisualizarPedido(row)}
                  titleButton={"Visualizar o Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={FaCheck}
                  cor={"danger"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Ativar Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimir(row)}
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimirSempreco(row)}
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
            </div>
          )

        } else if (row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={GrView}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickVisualizarPedido(row)}
                  titleButton={"Visualizar o Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimir(row)}
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimirSempreco(row)}
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
            </div>
          )
        } else if (row.DSANDAMENTO == 'PEDIDO EM ANÁLISE') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={GrView}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickVisualizarPedido(row)}
                  titleButton={"Visualizar o Pedido"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
               
                  onClickButton={() => handleClickImprimir(row)}
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleClickImprimirSempreco(row)}
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
            </div>
          )
        }
      },
    },

  ]

  const handleImprimir = async (IDPEDIDO) => {
      try {
        const response = await get(`/lista-pedidos?idPedido=${IDPEDIDO}`)
        const responseDetlhe = await get(`/lista-detalhe-pedidos-grade?idPedido=${IDPEDIDO}`)
        if (response.data && responseDetlhe.data) {
          setDadosPedido(response.data)
          setDadosDetalhePedido(responseDetlhe.data)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  
    const handleClickImprimir = async (row) => {
      if (row.IDPEDIDO) {
        handleImprimir(row.IDPEDIDO)
        setModalPedidoNota(true)
      }
    }
  
    const handleImprimirSemPreco = async (IDPEDIDO) => {
      try {
        const response = await get(`/lista-pedidos?idPedido=${IDPEDIDO}`)
        const responseDetlhe = await get(`/lista-detalhe-pedidos-grade?idPedido=${IDPEDIDO}`)
        if (response.data && responseDetlhe.data) {
          setDadosPedidoSemPreco(response.data)
          setDadosDetalhePedido(responseDetlhe.data)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  
    const handleClickImprimirSempreco = async (row) => {
      if (row.IDPEDIDO) {
        handleImprimirSemPreco(row.IDPEDIDO)
        setModalPedidoNotaSemPreco(true)
      }
    }
  
    const handleEditarPedido = async (IDPEDIDO) => {
      try {
        const response = await get(`/lista-pedidos?idPedido=${IDPEDIDO}`)
        const responseDetlhe = await get(`/lista-detalhe-pedidos?idPedido=${IDPEDIDO}`)
        if (response.data && responseDetlhe.data) {
          setDadosVisualizarPedido(response.data)
          setDadosDetalhePedido(responseDetlhe.data)
          setActionVisualizarPedido(true)
          setActionHome(false)
          setActionPedidoResumido(false)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  
    const handleClickEditarPedido = async (row) => {
      if (row.IDPEDIDO) {
        handleVisualizarPedido(row.IDPEDIDO)
        setActionVisualizarPedido(true)
      }
    }

    const handleVisualizarPedido = async (IDPEDIDO) => {
      try {
        const response = await get(`/lista-pedidos?idPedido=${IDPEDIDO}`)
        const responseDetlhe = await get(`/lista-detalhe-pedidos?idPedido=${IDPEDIDO}`)
        if (response.data && responseDetlhe.data) {
          setDadosVisualizarPedido(response.data)
          setDadosDetalhePedido(responseDetlhe.data)
          setActionVisualizarPedido(true)
          setActionHome(false)
          setActionPedidoResumido(false)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  
    const handleClickVisualizarPedido = async (row) => {
      if (row.IDPEDIDO) {
        handleVisualizarPedido(row.IDPEDIDO)
        setActionVisualizarPedido(true)
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

      <ActionPDFPedido 
        show={modalPedidoNota}
        handleClose={() => setModalPedidoNota(false)}
        dadosPedido={dadosPedido}
        dadosDetalhePedido={dadosDetalhePedido}
      />

      <ActionPDFPedidoSemPreco
        show={modalPedidoNotaSemPreco}
        handleClose={() => setModalPedidoNotaSemPreco(false)}
        dadosPedidoSemPreco={dadosPedidoSemPreco}
        dadosDetalhePedido={dadosDetalhePedido}
      />

      
    </Fragment>
  )
}
