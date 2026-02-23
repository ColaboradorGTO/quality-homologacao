import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { ListaDeVendasDosCaixas } from "../ActionsMovCaixasLojas/ListaDeVendasDosCaixas";
import { ListaDeExtratoDoDia } from "../ActionsMovCaixasLojas/ListaDeExtratoDoDia";
import { ListaDeVendasVendedor } from "../ActionsMovCaixasLojas/ListaDeVendasVendedor";
import { ListaDeVendasAtivas } from "../ActionsMovCaixasLojas/ListaDeVendasAtivas";
import { ListaDeFechamentoDosCaixas } from "../ActionsMovCaixasLojas/ListaDeFechamentoDosCaixas";
import { ListaDeDespesasLancadas } from "../ActionsMovCaixasLojas/ListaDeDespesasLancadas";
import { ListaDeFaturasLançadas } from "../ActionsMovCaixasLojas/ListaDeFaturasLançadas";
import { ListaDeVoucherLancados } from "../ActionsMovCaixasLojas/ListaDeVoucherLancados";
import { ResultadoResumo } from "../ResultadoResumo/ResultadoResumo";
import { ListaDeVendasCanceladas } from "../ActionsMovCaixasLojas/ListaDeVendasCanceladas";
import { ActionMain } from "../Actions/actionMain";
import { InputSelectAction } from "../Inputs/InputSelectAction";
import { InputField } from "../Buttons/Input";
import { ButtonSearch } from "../Buttons/ButtonSearch";
import { get } from "../../api/funcRequest";
import { formatMoeda } from "../../utils/formatMoeda";
import TabelaPrincipal from "../Tables/TabelaMain";
import Accordion from 'react-bootstrap/Accordion';
import { dataFormatada } from "../../utils/dataFormatada";



export const ResumoDashBoardAdministrativoCopia = () => {

  // console.log(usuario, "usuario")
  const storedModule = localStorage.getItem('selectedModule');
  const selectedModule = JSON.parse(storedModule);
  const [actionVisivel, setActionVisivel] = useState(true);
  const [resumoVisivel, setResumoVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [empresaUsuario, setEmpresaUsuario] = useState([]);
  const [selecionadoUsuario, setSelecionadoUsuario] = useState(usuario);

  const [dataConsulta, setDataConsulta] = useState('');
  const [datapesq, setDatapesq] = useState('')
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');

  const [resumoVendas, setResumoVendas] = useState([]);
  const [movimentacaoCaixaDoDia, setMovimentacaoCaixaDoDia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recDinheiro, setRecDinheiro] = useState('');
  const [recCartao, setRecCartao] = useState('');
  const [recConvenio, setRecConvenio] = useState('');
  const [recPos, setRecPos] = useState('');
  const [recCheque, setRecCheque] = useState('');
  const [qtdClientes, setQtdClientes] = useState('');
  const [totalTicketMedio, setTotalTicketMedio] = useState('');
  const [totalRecebido, setTotalRecebido] = useState('');
  const [idEmpresa, setIdEmpresa] = useState(0)
  const [idGrupo, setIdGrupo] = useState(0)
  const [dadosVendasAtivas, setDadosVendasAtivas] = useState([])
  const [dadosExtratoDoDia, setDadosExtratoDoDia] = useState([])
  const [dadosDetalheFatura, setDadosDetalheFatura] = useState([])
  const [dadosDetalheDespesas, setDadosDetalheDespesas] = useState([])
  const [dadosDetalheVoucher, setDadosDetalheVoucher] = useState([])

  useEffect(() => {
    if (idEmpresa && datapesq) {
      getTabelasFechamentoCaixa();
      // getVendasVendedor();
      retornoTabelaListaVoucherLoja();
    }
  }, [idEmpresa, datapesq]);

  const getTabelasFechamentoCaixa = async () => {
    if (empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      try {
        dataFormatada(datapesq)

        const response = await get(`/listaCaixasFechados?idEmpresa=${idEmpresa}&datapesq=${datapesq}`);
        // const response = await axios.get(`http://164.152.245.77:8000/quality/concentrador_homologacao/api/administrativo/lista-caixas-fechados.xsjs?idEmpresa=${idEmpresa}&dataFechamento=${datapesq}`);
        if (response.data && response.data.length > 0) {
          setDadosCaixaFechados(response.data)
          setDatapesq(response.data)
          // console.log(response.data, "listaCaixasFechados")
        }
        // console.log(response.data, "listaCaixasFechados")
        return response.data;
      } catch (error) {
        console.log(error, "não foi possível carregar os dados da tabela, listaCaixasFechados")
      }
    }
  }


  useEffect(() => {
    getExtatoDaLoja(idEmpresa, datapesq)
  },[idEmpresa, datapesq])


  const getExtatoDaLoja = async () => {
    if(empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      try {
         dataFormatada(datapesq)
        const response = await get(`/extratoDaLojaDia?idEmpresa=${idEmpresa}&datapesq=${datapesq}&${datapesq}=datapesq`) 
        if(response.data && response.data.length > 0) {
          setDadosExtratoDoDia(response.data)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }

  }

  const colunasExtradoDoDia = [
    'Dt. Lanç.',
    'Histórico',
    'Pago A',
    'Despesa',
    'Débito',
    'Crédito',
    'Saldo',
    'Situação',
    'Opções'
  ];

  useEffect(() => {
    if (idGrupo && idEmpresa && datapesq) {
      getVendasVendedor();
    
    }
  }, [idGrupo, idEmpresa, datapesq]);

  const getVendasVendedor = async () => {
    if (empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      const idGrupo = Number(empresaUsuario[0].IDGRUPOEMPRESARIAL)
      try {
        dataFormatada(datapesq)
        const response = await get(`/vendaVendedor?idGrupo=${idGrupo}&idEmpresa=${idEmpresa}&datapesq=${datapesq}`);
       
        if (response.data && response.data.length > 0) {
          setDadosVendasVendedor(response.data)
          setDatapesq(response.data)
          // console.log(response.data, "vendaVendedor")
          
        }
       
        return response.data;
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  }
  useEffect(() => {
    if (idEmpresa && datapesq) {
      getVendasAtivas();
    
    }
  }, [idEmpresa, datapesq]);

  const getVendasAtivas = async () => {
    if (empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      const pageSize = 100;
      try {
        dataFormatada(datapesq)
        const response = await get(`/vendaAtiva?pageSize=${pageSize}&status=False&idEmpresa=${idEmpresa}&datapesq=${datapesq}`);
   
       
        if (response.data && response.data.length > 0) {
          setDadosVendasAtivas(response.data)
          setDatapesq(response.data)
          
        }
       
        return response.data;
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  }


  useEffect(() => {
    if (idEmpresa && datapesq) {
      getDetalheFatura();
    
    }
  }, [idEmpresa, datapesq]);

  const getDetalheFatura = async () => {
    if (empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      const pageSize = 100;
      try {
        dataFormatada(datapesq)
        const response = await get(`/DetalheFatura?idEmpresa=${idEmpresa}&datapesq=${datapesq}`);
   
       
        if (response.data && response.data.length > 0) {
          setDadosDetalheFatura(response.data)
          // console.log(response.data, "DetalheFatura")
          
        }
       
        return response.data;
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  }

  const colunasDetalheFatura = [
    'IDCAIXAWEB',
    'DTPROCESSAMENTO',
    'IDMOVIMENTOCAIXAWEB',
    'DSCAIXA',
    'NUCODAUTORIZACAO',
    'VRRECEBIDO',
    'NOFUNCIONARIO',
    'STCANCELADO',
    'Opções'
  ]

  useEffect(() => {
    if (idEmpresa && datapesq) {
      getDetalheDespesas();
    
    }
  }, [idEmpresa, datapesq]);

  const getDetalheDespesas = async () => {
    if (empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      const pageSize = 100;
      try {
        dataFormatada(datapesq)
        const response = await get(`/DetalheDespesas?idEmpresa=${idEmpresa}&datapesq=${datapesq}`);
       
        if (response.data && response.data.length > 0) {
          setDadosDetalheDespesas(response.data)          
        }
       
        return response.data;
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  }

  const colunasDetalheDespesas = [

    'IDDESPESASLOJA',
    'DTDESPESA',
    'DSCATEGORIA',
    'VRDESPESA',
    'DSPAGOA',
    'DSHISTORIO',
    'NUNOTAFISCAL',
    'STATIVO',
    'Opções'
  ]

  useEffect(() => {
    if (idEmpresa && datapesq) {
      getDetalheVoucher();
    
    }
  }, [idEmpresa, datapesq]);

  const getDetalheVoucher = async () => {
    if (empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      const pageSize = 100;
      try {
        dataFormatada(datapesq)
        const response = await get(`/detalheVoucher?idEmpresa=${idEmpresa}&datapesq=${datapesq}`);
   
        if (response.data && response.data.length > 0) {
          setDadosDetalheVoucher(response.data)
          
        }
       
        return response.data;
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  }

  const colunasDetalheVoucher = [

    'IDVOUCHER',
    'DSCAIXAORIGEM',
    'NUVOUCHER',
    'DTINVOUCHER',
    'VRVOUCHER',
    'NOFANTASIA',
    'DSCAIXADESTINO',
    'DTOUTVOUCHER',
    'STATIVO',
    'STCANCELADO',
    'Opções'
  ]


  // const colunasSelecionadas = () => {
  //   setDadosVendasVendedor(dadosVendasVendedor);
  
  //   const dadosVendasVendedor2 = dadosVendasVendedor.map((item) => {
  //     console.log(item, "ITEM Vendedor2")
  //     return {
  //       VENDEDOR_MATRICULA: item.VENDEDOR_MATRICULA,
  //       NOFANTASIA: item.NOFANTASIA,
  //       totalVendido: {
  //         TOTALVENDIDOCARTAO: formatMoeda(item.totalVendido.TOTALVENDIDOCARTAO),
  //         TOTALVENDIDOVENDEDOR: formatMoeda(item.totalVendido.TOTALVENDIDOVENDEDOR),
  //       },
  //       Vouchers: item.Vouchers,
  //       'Valor Liquido': formatMoeda(item['Valor Liquido']),
  //       Opções: item.Opções,
  //     }
  //   });
  
  //   console.log(dadosVendasVendedor2, "dadosVendasVendedor2"); // Apenas para debug, pode ser removido
  
  //   return dadosVendasVendedor2; // Retorna os dados corretamente formatados
  // }

  const colunasSelecionadas = () => {
    setDadosVendasVendedor(dadosVendasVendedor)
    const dadosVendasVendedor2 = dadosVendasVendedor.map((item) => {
      // console.log(item, "ITEM Vendedor2")
      return {
        vendedor: {
          VENDEDOR_MATRICULA: item.VENDEDOR_MATRICULA,
          NOFANTASIA: item.NOFANTASIA,
          VENDEDOR_NOME: item.VENDEDOR_NOME,
        },
        totalVendido: {
          QTDVENDIDOVENDEDOR: formatMoeda(item.totalVendido.QTDVENDIDOVENDEDOR),
          TOTALVENDIDOVENDEDOR: formatMoeda(item.totalVendido.TOTALVENDIDOVENDEDOR),
        },
        Vouchers: item.Vouchers,
        'Valor Liquido': formatMoeda(item['Valor Liquido']),
        Opções: item.Opções,
      }
    })
    // console.log(dadosVendasVendedor2, "dadosVendasVendedor2")
    return dadosVendasVendedor2
  }

  useEffect(() => {
    if(getVendasVendedor){
      colunasSelecionadas()
    }
  }, [colunasSelecionadas])

  

  const colunasVendasVendedor = [
    'VENDEDOR_MATRICULA',
    // 'VENDEDOR_NOME',
    'NOFANTASIA',
    'totalVendido.TOTALVENDIDOCARTAO',
    'totalVendido.TOTALVENDIDOVENDEDOR',
    'Vouchers',
    'Valor Liquido',
    'Opções',
  ]

  useEffect(() => {
    if (empresaUsuario.length === 0 && loading) {
      getTodasEmpresas();
    }
  }, [empresaUsuario, loading]);


  const getTodasEmpresas = async () => {

    try {

      const response = await get("/empresas",)
      if (response.data) {
        setEmpresaUsuario(response.data)

        // console.log(response.data, "empresas")
      }

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  const getResumoVendas = async () => {

    if (empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA);
      try {

        const dtURL = dataFormatada(dataConsulta)
        const urlData = encodeURIComponent(dtURL)
        const response = await get(`/resumoVenda?idEmpresa=${idEmpresa}&datapesq=${urlData}`);
        // console.log(response, "resumoVendas")
        if (response.data) {
          setResumoVendas(response.data);
          setTotalRecebido(response.data[0].VRTOTALVENDA)
          setQtdClientes(parseFloat(response.data[0].QTDVENDAS))
          setTotalTicketMedio(response.data[0].VRTICKETWEB)
          setDatapesq(response.data)
        }
        return response.data;
      } catch (error) {
        console.log('Erro ao buscar resumo das vendas: ', error);
      }
    } else {
      console.log('Não há dados em empresaUsuario');
    }


  };
  

  const handleClick = () => {
    setResumoVisivel(true)
    getResumoVendas()
    getTabelasFechamentoCaixa()
    getExtatoDaLoja()
    getVendasVendedor()
    getVendasAtivas()
    getDetalheFatura()
    getDetalheDespesas()
    getDetalheVoucher()
    setDatapesq(datapesq)
    colunasSelecionadas()
  }

  useEffect(() => {
    if (idEmpresa && datapesq) {
      getResumoVendas();
    }
  }, [idEmpresa, datapesq]);


  const handleEdit = (item) => {
    // Lógica para manipular a edição do item

    if (item.editando) {
      return;
    }
    console.log(`Editando item: ${item.id}`);
  };

  const handleSave = (item) => {
    // Lógica para salvar o item editado
    console.log(`Salvando item: ${item.id}`);
  };

  const handleCancel = (item) => {
    // Lógica para excluir item


    console.log(`Cancelando edição do item: ${item.id}`);
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const handleProximaPagina = () => {
    const totalPaginas = Math.ceil(dadosExemplos.length / itensPorPagina);
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const handlePaginaClicada = (pagina) => {
    setPaginaAtual(pagina);
  };


  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [dadosVendasVendedor, setDadosVendasVendedor] = useState([]);
  const [dadosVendasVendedor2, setDadosVendasVendedor2] = useState([]);
  const [dadosCaixaFechados, setDadosCaixaFechados] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = paginaAtual * itensPorPagina;

  const dadosPaginados = dadosExemplos.slice(indiceInicial, indiceFinal);
  useEffect(() => {

  }, [dadosExemplos, dadosVendasVendedor, dadosCaixaFechados, dadosVendasAtivas, dadosDetalheFatura, dadosDetalheDespesas, dadosDetalheVoucher, itensPorPagina, paginaAtual]);

  useEffect(() => {
    if (resumoVisivel) {
      // console.log('Dados exibidos na tabela:', dadosPaginados);
    }
  }, [dadosPaginados, resumoVisivel]);

  const [novasColunas, setNovasColunas] = useState([]);
  const nomeColunas = [
    'IDCAIXAFECHAMENTO',
    'DSCAIXAFECHAMENTO',
    'DTHORAABERTURACAIXA',
    'DTHORAFECHAMENTOCAIXA',
    'IDMOVIMENTO',
    'OPERADORFECHAMENTO',
    'STCONFERIDO',
    'TOTALFECHAMENTOCARTAO',
    'TOTALFECHAMENTOCONVENIO',
    'TOTALFECHAMENTOCPL',
    'TOTALFECHAMENTODINHEIRO',
    'TOTALFECHAMENTODINHEIROAJUSTE',
    'TOTALFECHAMENTODINHEIROFISICO',
    'TOTALFECHAMENTOFATURA',
    'TOTALFECHAMENTOPIX',
    'TOTALFECHAMENTOVOUCHER',
    'TOTALFECHAMENTOPOS',
    'Opção',
  ];
  const criarNovasColunas = () => {
    // ... lógica para gerar as novas colunas com os nomes desejados
    const novas = colunas.map((colunaOriginal) => {
      // Utilize um mapeamento ou lógica para criar os novos nomes
      return nomesColunas[colunaOriginal] || colunaOriginal; // Use nomesColunas se houver um mapeamento, caso contrário, mantenha o nome original
    });
    return novas;
  };

  // UseEffect para chamar a função criarNovasColunas e atualizar o estado das novas colunas
  useEffect(() => {
    const novas = criarNovasColunas();
    setNovasColunas(novas);
  }, []);  

  
  const colunasVendasAtivas = [
    "IDCAIXAWEB",
    "DSCAIXA",
    "IDVENDA",
    "NFE_INFNFE_IDE_NNF",
    "DTHORAFECHAMENTO",
    "NOFUNCIONARIO",
    "VRTOTALPAGO",
    "STCONFERIDO",
    "VRTOTALDESCONTO",
    "VRTOTALVENDA",
    "STCONTINGENCIA",
    "Opção",
  ]

  return (
    <Fragment>
      {actionVisivel && (
        <ActionMain
          title="Dashboard Administrativo"
          subTitle="Movimento de Caixa"
          linkComponentAnterior={["Home"]}
          linkComponent={["Tela Principal"]}

          InputSelectEmpresaComponent={InputSelectAction}
          onChangeSelectEmpresa={(e) => setSelecionadoUsuario(e.target.value)}
          valueSelectEmpresa={selecionadoUsuario}
          optionsEmpresas={empresaUsuario.map((empresa) => (
            <Fragment key={empresa.id}>
              <option value={empresa.id}>

                {empresa.NOFANTASIA}
              </option>
            </Fragment>
          ))}
          labelSelectEmpresa={"Empresa"}

          InputFieldDTConsultaComponent={InputField}
          onChangeInputFieldDTConsulta={(e) => setDatapesq(e.target.value)}
          valueDTCosulta={datapesq}
          labelInputFieldDTConsulta="Data Consulta"

          ButtonSearchComponent={ButtonSearch}
          linkNomeSearch={"Pesquisar"}
          onButtonClickSearch={handleClick}
        />

      )}

      {resumoVisivel && (

        <Fragment>
          {/* Lista de Fechamento dos Caixas */}
          <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <Accordion.Header className="panel-hdr tituloListVendasCaixa" >
                  <h2 id="TituloLoja" >
                    Lista de Fechamento dos Caixas
                  </h2>
                </Accordion.Header>
                <Accordion.Body className="panel-container show">

                {/* {console.log("caixas fechados", dadosCaixaFechados)} */}
                  <div id="resultadododia">
                    <TabelaPrincipal
                      colunas={colunasAtualizada}
                      data={dadosCaixaFechados} // Substitua aqui
                      onEditar={handleEdit}
                      onSalvar={handleSave}
                      onCancelar={handleCancel}
                      itensPorPagina={itensPorPagina}
                      paginaAtual={paginaAtual}
                      handlePaginaAnterior={handlePaginaAnterior}
                      handleProximaPagina={handleProximaPagina}
                      handlePaginaClicada={handlePaginaClicada}

                    />

                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Fragment>
      )}

    </Fragment>
  )
}