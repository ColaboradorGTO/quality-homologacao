import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { GrView } from "react-icons/gr";
import { MdOutlineLocalPrintshop, MdOutlineSend } from "react-icons/md";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { CiEdit } from "react-icons/ci";
import { SiSap } from "react-icons/si";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { ActionPDFPedido } from "./ActionPDF/actionPDFPedido";
import { get } from "../../../../api/funcRequest";
import { ActionNotaPDFSemPreco } from "./ActionPDFSemPreco/actionNotaPDFSemPreco";
import { ActionPDFPedidoSemPreco } from "./ActionPDFSemPreco/actionPDFPedidoSemPreco";
import { ActionNovoPedido } from "../ActionNovoPedido/actionNovoPedido";
import Swal from "sweetalert2";
import { useEnviarPedidoComprasADM } from "./hooks/useEnviarPedidoComprasADM";
import { useEnviarPedidoCompras } from "./hooks/useEnviarPedidoCompras";
import { useMigrarPedidoSap } from "./hooks/useMigrarPedidoSap";
import { ActionEditarNovoPedido } from "../ActionNovoPedido/actionEditarNovoPedido";

export const ActionListaPedidosPeriodo = ({ dadosListaPedidos, tabelaPedidoPeriodo, setTabelaPedidoPeriodo }) => {
  const [modalPedidoNota, setModalPedidoNota] = useState(false);
  const [modalPedidoNotaSemPreco, setModalPedidoNotaSemPreco] = useState(false);
  const [dadosPedido, setDadosPedido] = useState([]);
  const [dadosPedidoSemPreco, setDadosPedidoSemPreco] = useState([]);
  const [dadosDetalhePedido, setDadosDetalhePedido] = useState([]);
  const [dadosDetalheProdutoPedido, setDadosDetalheProdutoPedido] = useState([]);
  const [dadosVisualizarPedido, setDadosVisualizarPedido] = useState([]);
  const [dadosEditarPedido, setDadosEditarPedido] = useState([]);
  const [dadosReceberPedido, setDadosReceberPedido] = useState([]);
  const [dadosEnviarComprasADM, setDadosEnviarComprasADM] = useState([]);
  const [actionVsualizarPedido, setActionVisualizarPedido] = useState(false);
  const [actionEditarPedido, setActionEditarPedido] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const { enviarPedidoComprasADM } = useEnviarPedidoComprasADM();
  const { enviarPedidoCompras } = useEnviarPedidoCompras();
  const { migrarPedidoSap } = useMigrarPedidoSap();


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
      head: [['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Fabricante', 'Vr Pedido', 'Setor', 'Status', 'Situação']],
      body: dadosExcel.map(item => [
        item.contador,
        item.DTPEDIDO,
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
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Fabricante', 'Vr Pedido', 'Setor', 'Status', 'Situação'];
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
      { wpx: 70, caption: 'Situação' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Periodo');
    XLSX.writeFile(workbook, 'pedidos_periodo.xlsx');
  };

  const calcularTotalFabricante = () => {
    let total = 0;
    for (let dados of dadosListaPedidos) {
      total += parseFloat(dados.VRTOTALLIQUIDO);
    }
    return total;
  }

  const dadosPedidos = dadosListaPedidos.map((item, index) => {
    let contador = index + 1;
    const totalFabricante = calcularTotalFabricante();
    // console.log(item, 'item')
    return {
      IDPEDIDO: item.IDPEDIDO,
      DTPEDIDO: item.DTPEDIDO,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      STCANCELADO: item.STCANCELADO,
      NOMECOMPRADOR: item.NOMECOMPRADOR,
      NOFANTASIA: item.NOFANTASIA,
      NOFORNECEDOR: item.NOFORNECEDOR,
      FABRICANTE: item.FABRICANTE,
      DSANDAMENTO: item.DSANDAMENTO,
      DSSETOR: item.DSSETOR,
      MODPEDIDO: item.MODPEDIDO,
      STMIGRADOSAP: item.STMIGRADOSAP,

      totalFabricante: totalFabricante,
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
      field: 'DTPEDIDO',
      header: 'Data',
      body: row => <th>{row.DTPEDIDO}</th>,
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
      footer: 'Total ',
      sortable: true,
    },
    {
      field: 'FABRICANTE',
      header: 'Fabricante',
      body: row => <th>{row.FABRICANTE}</th>,

      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Vr Pedido',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      footer: formatMoeda(calcularTotalFabricante()),
      sortable: true,
    },
    {
      field: 'DSSETOR',
      header: 'Setor',
      body: row => {
        if(row.DSSETOR == 'COMPRAS') {
          return (
            <div>
              <th style={{ color: 'blue' }} > COMPRAS </th>
            </div>
          )
        } else if(row.DSSETOR == 'CADASTRO' || row.DSSETOR == 'COMPRASADM') {
          return (
            <div>
              <th style={{ color: 'green' }} > CADASTRO </th>
            </div>
          )
        }
      },
      sortable: true,
    },
    {
      field: 'DSANDAMENTO',
      header: 'Status',
      body: row => {
        return (
          <div>
            <th style={{
              color:
                row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO INICIADA' ? 'blue' :
                  row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA' ? 'black' :
                    row.DSANDAMENTO == 'PEDIDO EM ANÁLISE' ? 'green' : row.DSANDAMENTO == 'PEDIDO CANCELADO' ? 'red' : row.DSANDAMENTO == 'PEDIDO INICIADO' ? 'blue' : ''
            }}
            >
              {row.DSANDAMENTO}
            </th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'STMIGRADOSAP',
      header: 'Situação',
      body: (row) => {
        if (row.DSSETOR == 'CADASTRO') {
          if (row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO INICIADA') {
            return (
              <th >{row.STMIGRADOSAP = ''}</th>
            )

          } else if (row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA') {
            if (row.STMIGRADOSAP == null) {
              return (
                <th style={{ color: row.STMIGRADOSAP = '#fd3995', fontWeight: 700 }}>{row.STMIGRADOSAP = 'NÃO MIGRADO SAP'}</th>
              )

            } else {
              return (
                <th style={{ color: row.STMIGRADOSAP = '#2196F3', fontWeight: 700 }}>{row.STMIGRADOSAP = 'MIGRADO SAP'}</th>
              )

            }
          }
        } else if (row.DSSETOR == 'COMPRAS') {
          return (
            <th style={{ color: row.STMIGRADOSAP = '#fd3995', fontWeight: 700 }}>{row.STMIGRADOSAP = ''}</th>
          )
        } else if (row.DSSETOR == 'COMPRASADM') {
          return (
            <th style={{ color: row.STMIGRADOSAP = '#fd3995', fontWeight: 700 }}>{row.STMIGRADOSAP = ''}</th>
          )
        }
      },
      sortable: true
    },
    {
      field: 'IDPEDIDO',
      header: 'Opções',
      body: (row) => {
        if (row.DSSETOR == 'CADASTRO') {
       
          if (row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO INICIADA') {
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
                    onClickButton={() => handleClickEditarPedido(row)}
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
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineSend}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEnviarCompras(row)}
                    titleButton={"Enviar Compras para Ajuste"}
                  />
                </div>
              </div>
            )
          } else if (row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA') {
            return (
              <div className="p-1 "
                style={{ justifyContent: "space-between", display: "flex" }}
              >
                <h2>testettsts</h2>
                <div className="p-1">
                  <ButtonTable
                    Icon={GrView}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickVisualizarPedido(row)}
                    titleButton={"Visualizar Pedido"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineSend}
                    cor={"danger"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEnviarComprasADM(row)}
                    titleButton={"Enviar Compras Adm para Cancelar"}
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
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"secondary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickReceberPedido(row)}
                    titleButton={"Recepção de Mercadoria do Pedido"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineSend}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEnviarCompras(row)}
                    titleButton={"Enviar Compras para Ajuste"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={SiSap}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickMigrarPedido(row)}
                    titleButton={"Migrar Pedido SAP"}
                  />
                </div>
              </div>
            )
          }
        } else if (row.DSSETOR == 'COMPRAS') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", display: "flex" }}
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

        } else if (row.DSSETOR == 'COMPRASADM') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", display: "flex" }}
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

  const handleClickEnviarComprasADM = async (row) => {
    if (row.IDPEDIDO) {
      enviarPedidoComprasADM(row.IDPEDIDO)
    }
  }

  const handleClickEnviarCompras = async (row) => {
    if (row.IDPEDIDO) {
      enviarPedidoCompras(row.IDPEDIDO)
    }
  }

  const handleImprimir = async (IDPEDIDO) => {
    let stOutlet = false;
    try {
       const result = await Swal.fire({
         icon: "question",
         text: 'Este pedido é para o Outlet Família?',
         showDenyButton: true,
         confirmButtonText: 'Sim',
         denyButtonText: 'Não',
         customClass: {
           container: 'custom-swal', 
         }
       });
 
       if (result.isConfirmed) {
         stOutlet = true;
       } else if (result.isDenied) {
         stOutlet = false;
       } else {
         return; 
       }
 
       const response = await get(`/lista-pedidos?idPedido=${IDPEDIDO}`);
       const responseDetlhe = await get(`/lista-detalhe-pedidos-grade?idPedido=${IDPEDIDO}`);
 
       if (response.data && responseDetlhe.data) {
         setDadosPedido([{ ...response.data, stOutlet }]);
         setDadosDetalhePedido(responseDetlhe.data);
         setModalPedidoNota(true); 
       }
    } catch (error) {
       console.log(error, "Não foi possível pegar os dados da tabela");
    }
  };
  
  const handleClickImprimir = async (row) => {
    if (row.IDPEDIDO) {
      await handleImprimir(row.IDPEDIDO); 
    }
  };
 
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

  const handleVisualizarPedido = async (IDPEDIDO) => {
    try {
      const response = await get(`/lista-pedidos?idPedido=${IDPEDIDO}`)
      const responseDetlhe = await get(`/lista-detalhe-pedidos?idPedido=${IDPEDIDO}`)
      if (response.data && responseDetlhe.data) {
        setDadosVisualizarPedido(response.data)
        setDadosDetalhePedido(responseDetlhe.data)
        setActionVisualizarPedido(true)
        setTabelaPedidoPeriodo(false)
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

  const handleEditarPedido = async (IDPEDIDO) => {
    try {
      // const response = await get(`/lista-pedidos?idPedido=${IDPEDIDO}`)
      const responseDetlhe = await get(`/lista-detalhe-pedidos?idPedido=${IDPEDIDO}`)
      if (responseDetlhe.data) {
        // setDadosEditarPedido(response.data)
        setDadosDetalhePedido(responseDetlhe.data)
        setActionEditarPedido(true)
        setTabelaPedidoPeriodo(false)
        console.log(response.data, "responseDetalhe.data")

      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickEditarPedido = async (row) => {
    if (row && row.IDPEDIDO) {
      handleEditarPedido(row.IDPEDIDO)
      setActionEditarPedido(true)
    }
  }

  const handleReceberPedido = async (IDPEDIDO) => {
    try {
      const response = await get(`/vincula-nfPedido?idResumoPedido=${IDPEDIDO}`);
     if(response.data) {

       setDadosReceberPedido(response.data)
      }
      verificarExistenciaNF(response.data, IDPEDIDO)
    } catch (error) {
      console.error("Não foi possível pegar os dados da tabela", error);
    }
  };

  const handleClickReceberPedido = async (row) => {
    if (row.IDPEDIDO) {
      handleReceberPedido(row.IDPEDIDO)
    }
  }

  const handleMigrarPedidio = async (IDPEDIDO) => {
    try {
      const response = await get(`/lista-detalhe-produto-pedidos?idPedido=${IDPEDIDO}&stMigradoSap=False`);
      if(response.data) {
        setDadosDetalheProdutoPedido(response.data);
      }
      migrarPedidoSap(dadosDetalheProdutoPedido);
    } catch (error) {
      console.error("Não foi possível pegar os dados da tabela", error);
    }
  };

  const handleClickMigrarPedido = async (row) => {
    if (row && row.IDPEDIDO) {
      handleMigrarPedidio(row.IDPEDIDO)
    }
  }

  const verificarExistenciaNF = async (respostaSeExisteNF, IDPEDIDO) => {
    try {
      const response = await get(`/lista-detalhe-produto-pedidos?idPedido=${IDPEDIDO}`);
      carregarPedidoParaConciliar(response.data);
    } catch (error) {
      console.error("Erro ao carregar detalhes do pedido", error);
    }

    exibirBarraCarregamento(IDPEDIDO);
  };

  const exibirBarraCarregamento = async (IDPEDIDO) => {
   
    Swal.fire({
      icon: 'info',
      title: 'Carregando Dados...Aguarde!',
      timer: 180000,
      backdrop: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();

        try {
          const response = await get(`/lista-detalhe-produto-pedidos?idPedido=${IDPEDIDO}`);
          setDadosDetalheProdutoPedido(response.data);
          modalCadastroNfePedido(response.data);
        } catch (error) {
          console.error("Erro ao carregar detalhes do pedido", error);
          // clearInterval(animacaoBarra);
        }
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar os dados, recarregue a página e tente novamente',
          timer: 15000,
        });
      }
    });
  };

  return (
    <Fragment>
      {tabelaPedidoPeriodo && (

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
            title="Vendas por Loja"
            value={dadosPedidos}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
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
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
          </div>
        </div>

      )}
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

      {actionVsualizarPedido && (
        
        <ActionNovoPedido dadosVisualizarPedido={dadosVisualizarPedido} dadosDetalhePedido={dadosDetalhePedido} />
      )}

      {actionEditarPedido && (

        <ActionEditarNovoPedido
          dadosEditarPedido={dadosEditarPedido}
          dadosDetalhePedido={dadosDetalhePedido}
        />
      )}
    
    </Fragment >
  )
}