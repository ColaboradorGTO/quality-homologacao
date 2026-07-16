import React, { Fragment, useRef, useState } from "react"
import Swal from 'sweetalert2'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { GrFormView } from "react-icons/gr";
import { ActionDetalharModal } from "./ActionDetalhar/actionDetalharModal";
import { ActionEditarStatusVoucherModal } from "./ActionEditarVoucher/actionEditarStatusVoucherModal";
import { get} from "../../../../api/funcRequest";
import { ActionImprimirVoucherModal } from "./actionImprimirVoucherModal";
import { dataHoraFormatada } from "../../../../utils/dataFormatada";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { useAuthFuncionarioUpdate } from "./hooks/useAuthFuncionarioUpdate";
import { useAuthFuncionarioPrint } from "./hooks/useAuthFuncionarioPrint";


export const ActionListaConsultaVouchers = ({dadosVoucher, usuarioLogado, optionsModulos, handleClick}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dadosEditarVoucher, setDadosEditarVoucher] = useState([])
  const [modalEditarVoucher, setModalEditarVoucher] = useState(false);
  const [dadosDetalheVoucher, setDadosDetalheVoucher] = useState([])
  const [modalDetalhe, setModalDetalhe] = useState(false);
  const [modalImprimirVoucher, setModalImprimirVoucher] = useState(false);
  const [dadosImprimirVoucher, setDadosImprimirVoucher] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
  const {
    openSwal
  } = useAuthFuncionarioUpdate({usuarioLogado, optionsModulos});

  const {
    openSwalImprimir
  } = useAuthFuncionarioPrint({usuarioLogado});

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Estoque Atual',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Loja', 'Loja','ID Produto', 'Cod. Barra', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Total Custo', 'Total Venda', 'Markup %']],
      body: dados.map(item => [
        item.contador,
        item.IDEMPRESA,
        item.NOFANTASIA,
        item.IDPRODUTO,
        item.SKUVTEX,
        item.NUCODBARRAS,
        item.DSPRODUTO,
        item.IDRAZAO_SOCIAL_FORNECEDOR,
        item.RAZAO_SOCIAL_FORNECEDOR,
        item.QTDFINAL,
        item.PRECOCUSTO,
        item.PRECOVENDA,
        item.totalCusto,
        item.totalVenda,
        formatarPorcentagem(item.markup),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('estoque_atual.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Loja', 'Loja', 'ID Produto', 'SKU Vtex', 'Cod. Barra', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Total Custo', 'Total Venda', 'Markup %'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' }, 
      { wpx: 50, caption: 'ID Loja' },
      { wpx: 150, caption: 'Loja' },
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 100, caption: 'SKU Vtex' },
      { wpx: 100, caption: 'Cod. Barra' },
      { wpx: 200, caption: 'Produto' },
      { wpx: 150, caption: 'Fornecedor' },
      { wpx: 50, caption: 'Estoque' },
      { wpx: 100, caption: 'Custo' },
      { wpx: 100, caption: 'Venda' },
      { wpx: 100, caption: 'Total Custo' },
      { wpx: 100, caption: 'Total Venda' },
      { wpx: 50, caption: 'Markup %' },
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estoque Atual');
    XLSX.writeFile(workbook, 'estoque_atual.xlsx');
  };


  const dados = dadosVoucher.map((item, index) => {
    let contador = index + 1;
    let indexMsg = 0;
    let msgLogRetornoSap = '';
    let logSefaz = '';

    let logIntegracao = item.LOGERRORVENDA || item.LOGERRORCLIENTE || item.LOGERRORVOUCHER || "";
    let stErrorLogIntegracao = logIntegracao !== 'VENDA NÃO MIGRADA' && logIntegracao?.length > 0;
    let stErrorSefaz = item.NUMSTATESEFAZNOTADEVOLUCAO > 108 ? item.MSGRETORNOSEFAZNOTADEVOLUCAO : item.NUMSTATESEFAZNOTASAIDATRANSFERENCIA > 108 ? item.MSGRETORNOSEFAZNOTASAIDATRANSFERENCIA : "";

    let statusDevolucaoTransferenciaVoucher = [
      'ERRO AO INTEGRAR A VENDA!', //0
      'ERRO AO INTEGRAR O CLIENTE!',//1
      'ERRO AO GERAR A DEVOLUÇÃO!',//2
      'ERRO AO GERAR A NOTA DE SAÍDA DA TRANSFERÊNCIA!',//3
      'ERRO AO GERAR A NOTA DE ENTRADA DA TRANSFERÊNCIA!',//4
      'AGUARDANDO NOTA DE DEVOLUÇÃO', //5
      'AGUARDANDO NOTA DE SAIDA DA TRANSFERÊNCIA',//6
      'AGUARDANDO NOTA DE ENTRADA DA TRANSFERÊNCIA',//7
      'NOTA DE DEVOLUÇÃO INTEGRADA',//8
      'NOTA DE SAIDA DA TRANSFERÊNCIA INTEGRADA',//9
      'NOTA DE ENTRADA DA TRANSFERÊNCIA INTEGRADA',//10
      'PROCESSO DE DEVOLUÇÃO REALIZADO COM SUCESSO!',//11
      'PROCESSO DE DEVOLUÇÃO E TRANSFERÊNCIA REALIZADO COM SUCESSO!',//12
    ];

    let arrayMsgSAP = [
      'VENDA EM CONTINGÊNCIA',
      'VENDA NÃO INTEGRADA',
      'VENDA NÃO MIGRADA',
      'AGUARDANDO GERAÇÃO MANUAL DA DEVOLUÇÃO(VENDA NFCE(65) PARA NFE(55))',
      'AGUARDANDO GERAÇÃO MANUAL DA DEVOLUÇÃO(PESSOA JURÍDICA)',
      'Invalid session or session already timeout.',
      'Nota Fiscal number was already used for a BP; ',
      '(167) rsd sap - não é permitido realizar movimentação nesta loja. a mesma econtra-se em processo de (balanço).'
    ];

    var classStDevolucao = 'text-info';
    if (stErrorLogIntegracao) {
      classStDevolucao = '#fd3995';

      if (!item.IDSAP_CLIENTE || item.LOGERRORCLIENTE?.length > 0) {
        indexMsg = 1;
      }

      if (!item.IDSAP_VENDA && item.LOGERRORVENDA?.length > 0) {
        indexMsg = 0;
      }

      if (!item.IDSAP_DEVOLUCAO && item.LOGERRORVOUCHER?.length > 0) {
        indexMsg = 2;
      }

      if (item.IDSAP_DEVOLUCAO && item.STTRANSFERIRPRODUTO === 'True') {
        if (!item.IDSAPNOTAENTRADATRANSFERENCIA) {
          indexMsg = 4;
        }

        if (!item.IDSAPNOTASAIDATRANSFERENCIA) {
          indexMsg = 3;
        }
      }

      msgLogRetornoSap = !arrayMsgSAP.includes(logIntegracao) ? logIntegracao : logIntegracao;
      msgLogRetornoSap = msgLogRetornoSap === 'Invalid session or session already timeout.' ? 'Sessão inválida ou sessão já expirou' : msgLogRetornoSap;
      msgLogRetornoSap = msgLogRetornoSap === 'Nota Fiscal number was already used for a BP; ' ? 'O número da Nota Fiscal já foi utilizado para um PN' : msgLogRetornoSap;

    } else {
      if (!item.IDSAP_DEVOLUCAO) {
        indexMsg = 5;
      }

      if (item.IDSAP_DEVOLUCAO && item.STTRANSFERIRPRODUTO === 'True') {
        if (!item.IDSAPNOTAENTRADATRANSFERENCIA) {
          indexMsg = 7;
        }

        if (!item.IDSAPNOTASAIDATRANSFERENCIA) {
          indexMsg = 6;
        }
      }

      if (stErrorSefaz) {
        if (item.NUMSTATESEFAZNOTADEVOLUCAO > 108) {
          indexMsg = item.NUMSTATESEFAZNOTADEVOLUCAO > 108 ? 2 : 5;
        } else {
          indexMsg = item.NUMSTATESEFAZNOTASAIDATRANSFERENCIA > 108 ? 3 : 6;
        }

        msgLogRetornoSap = logSefaz;
        classStDevolucao = '#fd3995';

      } else {
        indexMsg = 5; // aguardando nfe devolucao

        if (item.IDSAP_DEVOLUCAO > 0) {
          indexMsg = 11; // devolucao integrada

          if (item.NUMSTATESEFAZNOTADEVOLUCAO !== 100) {
            msgLogRetornoSap = (logSefaz || 'AGUARDANDO RETORNO DA SEFAZ');
          } else {
            if (item.STTRANSFERIRPRODUTO === 'True') {
              indexMsg = 6; // aguardando nfe saida transferencia

              if (item.IDSAPNOTASAIDATRANSFERENCIA > 0) {
                indexMsg = 9; // nfe saida transferencia integrada

                if (item.NUMSTATESEFAZNOTASAIDATRANSFERENCIA !== 100) {
                  msgLogRetornoSap = (logSefaz || 'AGUARDANDO RETORNO DA SEFAZ');
                } else {
                  indexMsg = 7; // aguardando nfe entrada transferencia

                  if (item.IDSAPNOTAENTRADATRANSFERENCIA) {
                    indexMsg = 12; // nfe entrada transferencia integrada
                  }
                }
              }
            }
          }

          if (item.NUMSTATESEFAZNOTADEVOLUCAO !== 100 || item.NUMSTATESEFAZNOTASAIDATRANSFERENCIA !== 100) {
            classStDevolucao = item.TPCLIENTE === 'JURIDICA' ? '#fd3995' : '#7453A6';
          }

          msgLogRetornoSap = indexMsg > 10 ? `PROCESSO FINALIZADO${item.TPCLIENTE === 'JURIDICA' ? ' (PESSOA JURÍDICA)' : ''}!` : msgLogRetornoSap;
        }
      }
    }

    classStDevolucao = indexMsg > 7 ? '#1dc9b7' : classStDevolucao;

    const statusDevolucao = statusDevolucaoTransferenciaVoucher[indexMsg];
    return {
      IDVOUCHER: item.IDVOUCHER,
      IDEMPRESAORIGEM: item.IDEMPRESAORIGEM,
      DTINVOUCHER: item.DTINVOUCHER,
      DTOUTVOUCHER: item.DTOUTVOUCHER,
      DSCAIXAORIGEM: item.IDCAIXAORIGEM !== 99999 ? item.DSCAIXAORIGEM : 'CAIXA WEB',
      DSCAIXADESTINO: item.DSCAIXADESTINO,
      IDUSRLIBERACAOCRIACAO: item.IDUSRLIBERACAOCRIACAO,
      NOFUNCIONARIOLIBERACAOCRIACAO: item.NOFUNCIONARIOLIBERACAOCRIACAO,
      IDUSRLIBERACAOCONSUMO: item.IDUSRLIBERACAOCONSUMO,
      NOFUNCIONARIOLIBERACAOCONSUMO: item.NOFUNCIONARIOLIBERACAOCONSUMO,
      NUVOUCHER: item.NUVOUCHER,
      VRVOUCHER: item.VRVOUCHER,
      STATIVO: item.STATIVO,
      STCANCELADO: item.STCANCELADO,
      STSTATUS: item.STSTATUS,
      NOMEFANTASIAEMPRESAORIGEM: item.NOMEFANTASIAEMPRESAORIGEM,
      NOMEFANTASIAEMPRESADESTINO: item.NOMEFANTASIAEMPRESADESTINO,
      STTIPOTROCA: item.STTIPOTROCA || 'CORTESIA',
      statusDevolucaoTransferenciaVoucher:statusDevolucao,
      arrayMsgSAP: arrayMsgSAP,
      msgLogRetornoSap: msgLogRetornoSap,
      DSMOTIVOCANCELAMENTO: item.DSMOTIVOCANCELAMENTO,
      MOTIVOTROCA: item.MOTIVOTROCA, 
      IDRESUMOVENDAWEBDESTINO: item.IDRESUMOVENDAWEBDESTINO,
      IDRESUMOVENDAWEB: item.IDRESUMOVENDAWEB,
      NUCPFCNPJ: item.NUCPFCNPJ,
      LOGERRORVENDA: item.LOGERRORVENDA,
      LOGERRORCLIENTE: item.LOGERRORCLIENTE,
      LOGERRORVOUCHER: item.LOGERRORVOUCHER,

      NUMSTATESEFAZNOTADEVOLUCAO: item.NUMSTATESEFAZNOTADEVOLUCAO,
      NUMSTATESEFAZNOTASAIDATRANSFERENCIA: item.NUMSTATESEFAZNOTASAIDATRANSFERENCIA,
      MSGRETORNOSEFAZNOTADEVOLUCAO: item.MSGRETORNOSEFAZNOTADEVOLUCAO || '',
      MSGRETORNOSEFAZNOTASAIDATRANSFERENCIA: item.MSGRETORNOSEFAZNOTASAIDATRANSFERENCIA || '',
      logSefaz: item.MSGRETORNOSEFAZNOTADEVOLUCAO || item.MSGRETORNOSEFAZNOTASAIDATRANSFERENCIA || '',
      stErrorSefaz: item.NUMSTATESEFAZNOTADEVOLUCAO > 108 ? item.MSGRETORNOSEFAZNOTADEVOLUCAO : item.NUMSTATESEFAZNOTASAIDATRANSFERENCIA > 108 ? item.MSGRETORNOSEFAZNOTASAIDATRANSFERENCIA : '',
      logIntegracao: item.LOGERRORVENDA || item.LOGERRORCLIENTE || item.LOGERRORVOUCHER || '',
      stErrorLogIntegracao: logIntegracao != 'VENDA NÃO MIGRADA' && logIntegracao?.length > 0,
      indexMsg: indexMsg,
 
      contador
    }
  });

  const colunasVouchers = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{color: 'blue'}}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NUVOUCHER',
      header: 'Nº Voucher',
      // body: row => <th style={{color: 'blue'}}>{ocultaParteDosDadosVoucher(row.NUVOUCHER)}</th>,
      body: row => <th style={{color: 'blue'}}>{row.NUVOUCHER}</th>,
      sortable: true,
    },
    {
      field: 'EMPORIGEM',
      header: 'Loja Emissor',
      body: row => <p style={{color: 'blue', fontWeight: 600, width: 200, margin: 0}}>{row.NOMEFANTASIAEMPRESAORIGEM}</p>,
      sortable: true,
    },
    {
      field: 'DSCAIXAORIGEM',
      header: 'Caixa Emissor',
      body: row => <p style={{color: 'blue', fontWeight: 600, margin: 0}}>{row.DSCAIXAORIGEM }</p>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIOLIBERACAOCRIACAO',
      header: 'Aut. Criação',
      body: row => <p style={{color: 'blue',fontWeight: 600, width: 300, margin: 0}}>{row.NOFUNCIONARIOLIBERACAOCRIACAO}</p>,
      sortable: true,
    },
    {
      field: 'DTINVOUCHER',
      header: 'Data Emissão',
      body: row => <th style={{color: 'blue', fontWeight: 600}}>{dataHoraFormatada(row.DTINVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'VRVOUCHER',
      header: 'Valor',
      body: row => <th style={{color: 'green', fontWeight: 600}}>{formatMoeda(row.VRVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'EMPDESTINO',
      header: 'Loja Recebido',
      body: row => <p style={{color: 'blue', fontWeight: 600, width: 200, margin: 0}}>{row.NOMEFANTASIAEMPRESADESTINO}</p>,
      sortable: true,
    },
    {
      field: 'DSCAIXADESTINO',
      header: 'Caixa Recebido',
      body: row => <th style={{color: 'blue',fontWeight: 600}}>{row.DSCAIXADESTINO}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIOLIBERACAOCONSUMO',
      header: 'Aut. Consumo',
      body: row => <p style={{color: 'blue', fontWeight: 600, width: 300, margin: 0}}>{row.NOFUNCIONARIOLIBERACAOCONSUMO}</p>,
      sortable: true,
    },
    {
      field: 'DTOUTVOUCHER',
      header: 'Data Recebida',
      body: row => <th style={{color: 'blue', fontWeight: 600}}>{dataHoraFormatada(row.DTOUTVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'STTIPOTROCA',
      header: 'Tipo',
      body: row => <th style={{color: row.STTIPOTROCA == 'DEFEITO' ? '#fd3995' : row.STTIPOTROCA == 'TROCO' ? 'primary' : '#2196F3', fontWeight: 900}}>{row.STTIPOTROCA}</th>,
      sortable: true,
    },
    {
      field: 'STSTATUS',
      header: 'Situação',
      body: row => {
        if(row.STATIVO == 'True' && !row.STSTATUS) {
          return (
            <th style={{color: '#2196F3', fontWeight: 900}}>{row.STTIPOTROCA == 'TROCO' ? 'LIBERADO PARA O CLIENTE' : 'NOVO'}</th>
          )
        } else if(row.STATIVO == 'False' && !row.STSTATUS) {
          return (
            <th style={{color: '#fd3995', fontWeight: 900}} >FINALIZADO</th>
          )
        } else if(row.STATIVO == 'True' && (row.STSTATUS == 'LIBERADO PARA O CLIENTE' || row.STSTATUS == 'NOVO')) {
          return (
            // <th style={{color: 'green'}}>{row.STSTATUS == 'LIBERADO PARA O CLIENTE' || row.STSTATUS == 'NOVO'}</th>
            <th style={{color: 'green', fontWeight: 900}}>{row.STSTATUS}</th>
          )
        } else if(row.STATIVO == 'False' && (row.STSTATUS == 'NEGADO' || row.STSTATUS == 'CANCELADO' || row.STSTATUS == 'FINALIZADO')) {
          return (
            // <th style={{color: 'red'}}>{row.STSTATUS == 'NEGADO' || row.STSTATUS == 'CANCELADO' || row.STSTATUS == 'FINALIZADO'}</th>
            <th style={{color: '#fd3995', fontWeight: 900}}>{row.STSTATUS}</th>
          )

        } else if(row.STATIVO == 'True' && row.STCANCELADO == 'False' && row.STSTATUS == 'EM ANALISE') {
          return (
            // <th style={{color: 'blue'}}> EM ANALISE </th>
            <th style={{color: '#2196F3', fontWeight: 900}}> {row.STSTATUS} </th>
          )
        } else if(row.STATIVO == 'False' && row.STCANCELADO == 'True' && !row.STSTATUS) {
          return (
            // <th style={{color: 'red'}}>CANCELADO</th>
            <th style={{color: '#fd3995', fontWeight: 900}}> {row.STSTATUS}</th>
          )
        } else if(row.STCANCELADO == 'True') {
          return (
            <th style={{color: 'red', fontWeight: 900}}>CANCELADO</th>
          )
        } else {
          return (
            <th style={{color: '#fd3995', fontWeight: 900}}>FINALIZADO</th>
          )
        }
      }, 
      sortable: true,
    },
    {
      field: 'statusDevolucaoTransferenciaVoucher',
      header: 'St. Devolução',
      body: row => {
        let classStDevolucao = '#2196F3'; // Default class
  
        if (row.stErrorLogIntegracao) {
          classStDevolucao = '#fd3995'; // Error color
  
          if (!row.IDSAP_CLIENTE || row.LOGERRORCLIENTE?.length > 0) {
            classStDevolucao = '#fd3995';
          }
  
          if (!row.IDSAP_VENDA && row.LOGERRORVENDA?.length > 0) {
            classStDevolucao = '#fd3995';
          }
  
          if (!row.IDSAP_DEVOLUCAO && row.LOGERRORVOUCHER?.length > 0) {
            classStDevolucao = '#fd3995';
          }
  
          if (row.IDSAP_DEVOLUCAO && row.STTRANSFERIRPRODUTO === 'True') {
            if (!row.IDSAPNOTAENTRADATRANSFERENCIA) {
              classStDevolucao = '#fd3995';
            }
  
            if (!row.IDSAPNOTASAIDATRANSFERENCIA) {
              classStDevolucao = '#fd3995';
            }
          }
        } else {
          if (!row.IDSAP_DEVOLUCAO) {
            classStDevolucao = '#2196F3';
          }
  
          if (row.IDSAP_DEVOLUCAO && row.STTRANSFERIRPRODUTO === 'True') {
            if (!row.IDSAPNOTAENTRADATRANSFERENCIA) {
              classStDevolucao = '#2196F3';
            }
  
            if (!row.IDSAPNOTASAIDATRANSFERENCIA) {
              classStDevolucao = '#2196F3';
            }
          }
  
          if (row.stErrorSefaz) {
            classStDevolucao = '#fd3995';
          } else {
            classStDevolucao = '#2196F3';
  
            if (row.IDSAP_DEVOLUCAO > 0) {
              classStDevolucao = '#1dc9b7'; // Success color
  
              if (row.NUMSTATESEFAZNOTADEVOLUCAO !== 100 || row.NUMSTATESEFAZNOTASAIDATRANSFERENCIA !== 100) {
                classStDevolucao = row.TPCLIENTE === 'JURIDICA' ? '#fd3995' : '#7453A6';
              }
            }
          }
        }
  
        classStDevolucao = row.indexMsg > 7 ? '#1dc9b7' : classStDevolucao;
  
        return (
          <p style={{ color: classStDevolucao, fontWeight: 900, margin:'0px', width: '200px' }}>
            {row.statusDevolucaoTransferenciaVoucher}
          </p>
        );
      },
      sortable: true,
    },
    {
      field: 'msgLogRetornoSap',
      header: 'Log Devolução',
      body: row => <span style={{color: '#1dc9b7', fontWeight: 900}}>{row.msgLogRetornoSap}</span>,
      sortable: true,
    },
    {
      header: 'Opções',
      body: (row) => (
        <div style={{ display: "flex", justifyContent: "space-around", width: '7rem' }}>
        <ButtonTable
          titleButton={"Visualizar Detalhes"}
          onClickButton={() => hancleClickDetalhar(row)}
          Icon={GrFormView}
          iconColor={"#fff"}
          cor={"success"}
          iconSize={20}
          width="32px"
          height="32px"
        />
        <ButtonTable
          titleButton={"Editar Situação"}
          onClickButton={() => handleClickEditar(row)}
          Icon={CiEdit}
          iconColor={"#fff"}
          cor={"primary"}
          iconSize={20}
          width="32px"
          height="32px"
          disabledBTN={optionsModulos[0]?.ALTERAR == 'False' ? true : false}

        />
        <ButtonTable
          titleButton={"Imprimir"}
          onClickButton={() => handleClickImprimir(row)}
          Icon={MdOutlineLocalPrintshop}
          iconColor={"#fff"}
          cor={"secondary"}
          iconSize={18}
          width="32px"
          height="32px"
        />
      </div>
      ),
    }

  ]

  const handleButtonClick = async (action, row) => {
    if (!isLoggedIn) {
      const result = await openSwal();
      if (result) {
        setIsLoggedIn(true);
        performAction(action, row);
      }
    } else {
      performAction(action, row);
    }
  };

  const performAction = async (action, row) => {
    if (row.IDVOUCHER) {
      switch (action) {
        case 'detalhar':
          await handleDetalhar(row.IDVOUCHER);
          setModalDetalhe(true);
          break;
        case 'editar':
          await handleEdit(row.IDVOUCHER);
          setModalEditarVoucher(true);
          break;
        case 'imprimir':
          await handleImprimir(row.IDVOUCHER);
          setModalImprimirVoucher(true);
          break;
        default:
          break;
      }
    }
  };


  const handleDetalhar = async (IDVOUCHER) => {
    try {
      const response = await get(`/detalhesVouchersId?idVoucher=${IDVOUCHER}`);
      if (response.data && response.data.length > 0) {
        setDadosDetalheVoucher(response.data);
        setModalDetalhe(true)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível obter os detalhes do voucher.',
          timer: 3000,
        });
      }
      return;
    } catch (error) {
      console.log(error, "não foi possível pegar os dados da tabela");
    }
  };
  const hancleClickDetalhar = (row) => {
    if (row && row.IDVOUCHER) {
      handleDetalhar(row.IDVOUCHER)
    }
  }

  const handleEdit = async (IDVOUCHER) => {
    try {
      const response = await get(`/detalhesVouchersId?idVoucher=${IDVOUCHER}`);
      if (response.data && response.data.length > 0) {
        setDadosEditarVoucher(response.data);
        setModalEditarVoucher(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível obter os detalhes do voucher para edição.',
          timer: 3000,
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickEditar = async (row) => {
    if(optionsModulos[0]?.ALTERAR == 'True'){
      if (row.IDVOUCHER) {       
        openSwal(() =>  handleEdit(row.IDVOUCHER), row)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acesso Negado',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para editar o voucher.`,
        timer: 5000,
      });
    }  
  }

  const handleImprimir = async (IDVOUCHER) => {
    try {
      const response = await get(`/detalhesVouchersId?idVoucher=${IDVOUCHER}`);
      if (response.data && response.data.length > 0) {
        setDadosImprimirVoucher(response.data);
        setModalImprimirVoucher(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível obter os detalhes do voucher para impressão.',
          timer: 3000,
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };
  
  const handleClickImprimir = async (row) => {
    if(optionsModulos[0]?.ALTERAR == 'True'){
      if (row.IDVOUCHER) {
        openSwalImprimir(() => handleImprimir(row.IDVOUCHER), row)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acesso Negado',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para imprimir o voucher.`,
        timer: 3000,
      });
    }  
  }

  return (

    <Fragment> 
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vouchers Emitidos</h2>
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
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            size={'small'}
            sortOrder={-1}
            paginator={true}
            rows={10}
            cellMemo={false}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVouchers.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc',fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

       <ActionDetalharModal 
        show={modalDetalhe}
        handleClose={() => setModalDetalhe(false)}
        dadosDetalheVoucher={dadosDetalheVoucher}
       />
     
      <ActionEditarStatusVoucherModal
        show={modalEditarVoucher}
        handleClose={() => setModalEditarVoucher(false)}
        dadosEditarVoucher={dadosEditarVoucher}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />

      <ActionImprimirVoucherModal 
        show={modalImprimirVoucher}
        handleClose={() => setModalImprimirVoucher(false)}
        dadosImprimirVoucher={dadosImprimirVoucher}
      />
    </Fragment>
  )
}