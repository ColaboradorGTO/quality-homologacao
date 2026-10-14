import { Fragment, useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaMetas } from "./actionListaMetas";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../utils/dataAtual";
import { useQuery } from "react-query";
import { ActionListaMetasVendasResumidas } from "./actionListaMetasVendasResumidas";
import { ActionListaMetasDetalhadas } from "./actionListaMetasDetalhada";
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento";
import { ActionListaCriarMetasDetalhadas } from "./actionListaCriarMetasDetalhada";
import Swal from "sweetalert2";
import { useCadastrarMeta } from "./hooks/useCadastrarMeta";
import { FaRegSave } from "react-icons/fa";
import { ActionListaMetasCalcados } from "./actionListaMetasCalcados";


export const ActionPesquisaMetas = ({
  usuarioLogado,
  optionsEmpresas
}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [marcaNome, setMarcaNome] = useState('');
  const [tabelaVendaResumidaVisivel, setTabelaVendaResumidaVisivel] = useState(false);
  const [tabelaMetasVendasVisivel, setTabelaMetasVendasVisivel] = useState(false);
  const [tabelaCriarMetasVendasVisivel, setTabelaCriarMetasVendasVisivel] = useState(false);
  const [dadosVendasResumida, setDadosVendasResumida] = useState([]);
  const [dadosMetasDetalhadas, setDadosMetasDetalhadas] = useState([]);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [empresa, setEmpresa] = useState('')


  const [dadosCalcados, setDadosCalcados] = useState([])
  const [dadosFeminino, setDadosFeminino] = useState([])
  const [dadosMasculino, setDadosMasculino] = useState([])
  const [dadosInfantil, setDadosInfantil] = useState([])
  const [dadosCMB, setDadosCMB] = useState([])
  const [dadosDetalheMeta, setDadosDetalheMeta] = useState([])

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])

  const fetchListaMetasEstrutura = async () => {
    const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
    setEmpresa(idEmpresa)
    const urlBase = `/meta-vendas-lojas?idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');

    const controller = new AbortController();
    let allData = [];

    try {
      animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (foiCancelado()) break;
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData;
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasMarca = [], error: errorMetas, isLoading: isLoadingMetas, refetch: refetchMetas } = useQuery(
    ['meta-vendas-estrutura',],
    () => fetchListaMetasEstrutura(),
    { enabled: false, }
  );
  

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);
    
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchGrupo } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, }
  );





  
  
  const handleClick = () => {
    refetchMetas()
    setTabelaVisivel(true)
    setTabelaVendaResumidaVisivel(false);
    setTabelaMetasVendasVisivel(false);
    setTabelaCriarMetasVendasVisivel(false)
  }
  


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas"]}
        title="Vendas por Marcas e Período"
        subTitle={marcaNome}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={[
          { value: '', label: 'Selecionar Marca' },
            ...optionsEmpresas.map((marca) => {
            return {
              
              value: marca.IDEMPRESA,
              label: marca.NOFANTASIA,
            }
          })
        ]}
        valueSelectMarca={empresaSelecionada}
        onChangeSelectMarcas={(e) => setEmpresaSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Criar Metas"}
        onButtonClickCadastro={handleClick}
        corCadastro={"danger"}
        // IconCadastro
 
        // ButtonTypeCancelar={ButtonType}
        // linkCancelar={"Salvar Metas"}
        // onButtonClickCancelar={handleSalvarMetas}
        // corCancelar={"success"}
        // IconCancelar={FaRegSave}
        // styleCancelar
      />
      

      {tabelaVisivel && (
        <ActionListaMetas 
          dadosVendasMarca={dadosVendasMarca} 
          empresa={empresa}
          setTabelaVisivel={setTabelaVisivel}
          setTabelaVendaResumidaVisivel={setTabelaVendaResumidaVisivel}
          setTabelaMetasVendasVisivel={setTabelaMetasVendasVisivel}
            
          setDadosCalcados={setDadosCalcados}
          setDadosFeminino={setDadosFeminino}
          setDadosMasculino={setDadosMasculino}
          setDadosInfantil={setDadosInfantil}
          setDadosCMB={setDadosCMB}
          setDadosDetalheMeta={setDadosDetalheMeta}
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          handleClick={handleClick}
        />
      )}

      <ActionListaMetasCalcados dadosCalcados={dadosCalcados}/>
      {
        tabelaVendaResumidaVisivel && (

          <ActionListaMetasVendasResumidas 
            dadosVendasResumida={dadosVendasResumida}
          /> 
        )
      }
      {tabelaMetasVendasVisivel && (
        <ActionListaMetasDetalhadas
          dadosCalcados={dadosCalcados}
          dadosFeminino={dadosFeminino}
          dadosMasculino={dadosMasculino}
          dadosInfantil={dadosInfantil}
          dadosCMB={dadosCMB}
          dadosDetalheMeta={dadosDetalheMeta}
          dadosMetasDetalhadas={dadosMetasDetalhadas}
        />
      )}

    {/* {tabelaCriarMetasVendasVisivel && (

      <ActionListaCriarMetasDetalhadas
        dadosMetasEstrutura={dadosMetasEstrutura}
        marcaSelecionada={marcaSelecionada}
        dataPesquisaInicio={dataPesquisaInicio}
        dataPesquisaFim={dataPesquisaFim}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    )} */}
    </Fragment>
  )
}