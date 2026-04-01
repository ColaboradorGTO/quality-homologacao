import { Fragment, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { GrView } from 'react-icons/gr';
import { FiSend } from 'react-icons/fi';
import { get } from '../../../../api/funcRequest';
import { ActionDetalhePedidoModal } from './actionDetalhePedidoModal';
import { ActionListaDistribuicaoSugestoesHistorico } from './actionListaDistribuicaoSugestoesHistorico';
import { ButtonType } from '../../../Buttons/ButtonType';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from '../../../Tables/headerTable';
import Swal from 'sweetalert2';
import { ActionListaDistribuicaoSugestoesHistoricoVisualizar } from './actionListaDistribuicaoSugestoesHistoricoVisualizar';
import axios from 'axios';

export const ActionListaPedidoCompra = ({
  show,
  usuarioLogado,
  optionsModulos,
  dadosPedidosCompra,
  dadosSugestoesHistorico,
  setDadosSugestoesHistorico,
  setTabelaVisivel,
  setTabelaVisualizar,
  setTabelaSugestao,
  handleVisualizar,
  setSelectedItens 
}) => {
  const [actionListaPedidos, setActionListaPedidos] = useState(true);
  const [actionPedidoResumido, setActionPedidoResumido] = useState(true);
  const [rowClick, setRowClick] = useState(true);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [modalDetalhePedido, setModalDetalhePedido] = useState(false);
  const [dadosDetalhePedido, setDadosDetalhePedido] = useState([]);
  // const [dadosSugestoesHistorico, setDadosSugestoesHistorico] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const dataTableRef = useRef();
  const [ipUsuario, setIpUsuario] = useState('');

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ifconfig.me:", error);
    }

    if (!usuarioIP) {
      try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
      }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Histórico da Distribuição',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº Pedido', 'Empresa']],
      body: dados.map(item => [
        item.IDPEDIDOCOMPRA,
        item.EMPRESA
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('historico_distribuicao_compras.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº Pedido', 'Empresa'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº Pedido' },
      { wpx: 150, caption: 'Empresa' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico da Distribuição');
    XLSX.writeFile(workbook, 'historico_distribuicao_compras.xlsx');
  };

  const dados = dadosPedidosCompra.map((item, index) => {
    return {
      IDPEDIDOCOMPRA: item.IDPEDIDOCOMPRA,
      EMPRESA: item.EMPRESA
    }
  });

  const colunasPedidos = [
    {
      field: 'IDPEDIDOCOMPRA',
      header: 'Nº Pedido',
      body: row => <th>{row.IDPEDIDOCOMPRA}</th>,
      sortable: true,
    },
    {
      field: 'EMPRESA',
      header: 'Empresa',
      body: row => <th>{row.EMPRESA}</th>,
      sortable: true,
    },
    {
      field: 'IDPEDIDOCOMPRA',
      header: 'Opções',
      body: (row) => {
        return (
          <div className="p-1 " style={{ display: "flex" }}>
            <div className="p-1">
              <ButtonTable
                Icon={GrView}
                cor={"primary"}
                iconColor={"white"}
                iconSize={20}
                onClickButton={() => handleClickDetalhar(row)}
                titleButton={"Visualizar Detalhes do Pedido"}
                width="30px"
                height="30px"
              />
            </div>
            <div className="custom-control custom-checkbox p-1">
              <input
                type="checkbox"
                checked={selectedId === row.IDPEDIDOCOMPRA}
                onChange={(e) => {
                  setSelectedId(e.target.checked ? row.IDPEDIDOCOMPRA : null);
                  setSelectedItens(row.IDPEDIDOCOMPRA);
                }}
                selectionMode="single"
              />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!show) {
      setSelectedId(null);
    }
  }, [show]);

  const handleClickDetalhar = (row) => {
    if (row && row.IDPEDIDOCOMPRA) {
      handleDetalhar(row.IDPEDIDOCOMPRA);
    }
  };

  const handleDetalhar = async (IDPEDIDOCOMPRA) => {
    try {
      const response = await get(`/detalhe-distribuicao-compras?idPedido=${IDPEDIDOCOMPRA}`);
      if (response.data && response.data.length > 0) {
        setDadosDetalhePedido(response.data);
        setModalDetalhePedido(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sem detalhes',
          text: 'Não foram encontrados detalhes para este pedido.',
        })
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickCheck = async (IDPEDIDOCOMPRA) => {
    try {
      const response = await get(`/distribuicao-compras-sugestoes-historico?idPedido=${IDPEDIDOCOMPRA}`);
      setDadosSugestoesHistorico(response);
      setTabelaSugestao(true)
      setTabelaVisualizar(false);
      setTabelaVisivel(false);
      return response.data;
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ");
    }
  };

  const handleClickCheckVisualizar = async (IDPEDIDOCOMPRA) => {
    try {
      const response = await get(`/distribuicao-compras-sugestoes-historico?idPedido=${IDPEDIDOCOMPRA}`);
      setDadosSugestoesHistorico(response);
      setTabelaVisualizar(true);
      setTabelaVisivel(false);
      setTabelaSugestao(false);
      handleVisualizar();
      return response.data;
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ");
    }
  };

  const handleFinalizar = async (IDPEDIDOCOMPRA) => {
    Swal.fire({
      position: 'center',
      title: `Deseja realmente Finalizar essa Distribuição?`,
      text: 'Você não poderá reverter a ação!',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim, quero Finalizar!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
        loader: 'custom-loader'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const putData = {
            IDPEDIDOCOMPRA: parseInt(IDPEDIDOCOMPRA),
            IDUSUARIO: parseInt(usuarioLogado.id),
            FINALIZAR: 2
          }
          const response = await put(`/atualiza-imagem/:id`, putData)
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'COMPRASADM/ATUALIZA IMAGEM PRODUTO'
          const ipUsuario = await getIPUsuario()
          const postData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario || 'Indisponível'
          }

          await post('/log-web', postData)

          return response.data;
        } catch (error) {
          Swal.fire({
            title: 'Erro!',
            text: `Erro ao atualizar a Imagem do Produto: ${error}`,
            icon: 'error'
          });
        }
      }
    })
  }

  return (
    <Fragment>
      <div className="panel" >
        <div className="row">
          <div>

            <ButtonType
              textButton={"Pesquisar"}
              Icon={FiSend}
              cor={"primary"}
              iconColor={"white"}
              iconSize={20}
              onClickButtonType={() => {
                if (selectedId) {
                  handleClickCheck(selectedId);
                } else {
                  alert("Selecione um pedido para pesquisar.");
                }
              }}
            />
          </div>
          <div>

            <ButtonType
              textButton={"Visualizar"}
              Icon={FiSend}
              cor={"secondary"}
              iconColor={"white"}
              iconSize={20}
              onClickButtonType={() => {
                if (selectedId) {
                  handleClickCheck(selectedId);
                } else {
                  alert("Selecione um pedido para pesquisar.");
                }
              }}
            />
          </div>
          <div>

            <ButtonType
              textButton={"Finalizar"}
              Icon={FiSend}
              cor={"success"}
              iconColor={"white"}
              iconSize={20}
              onClickButtonType={() => {
                if (selectedId) {
                  handleClickCheck(selectedId);
                } else {
                  alert("Selecione um pedido para pesquisar.");
                }
              }}
            />
          </div>
        </div>
        <div className="panel-hdr">
          <h2>Histórico da Distribuição de Compras </h2>
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
        <div className="card mb-4" ref={dataTableRef}>
          <DataTable
            title="Histórico da Distribuição de Compras"
            value={dados}
            size="small"
            selectionMode={rowClick ? null : 'checkbox'}
            selection={empresaSelecionada}
            onSelectionChange={e => setEmpresaSelecionada(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasPedidos.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                selectionMode={coluna.selectionMode}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}
              />
            ))}
          </DataTable>

      
        </div>
      </div>

      <ActionDetalhePedidoModal
        show={modalDetalhePedido}
        handleClose={() => setModalDetalhePedido(false)}
        dadosDetalhePedido={dadosDetalhePedido}
      />

      {/* <ActionListaDistribuicaoSugestoesHistorico
        dadosSugestoesHistorico={dadosSugestoesHistorico}
      /> */}


    </Fragment>
  );
};