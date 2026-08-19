import React, { Fragment, useState, useEffect } from "react"
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaAlteracaoPreco } from "./actionListaAlteracaoPreco";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../utils/dataAtual";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento";
import { useFetchData } from "../../../../hooks/useFetchData";
import { ActionManualAlteracaoPreco } from "./ManualAlteracaoPreco/actionManualAlteracaoPreco";


export const ActionPesquisaAlteracaoPreco = ({ usuarioLogado }) => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('');
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState(null);
  const [listaPrecoSelecionada, setListaPrecoSelecionada] = useState('');
  const [responsavelSelcionado, setResponsavelSelecionado] = useState('');
  const [codBarra, setCodBarra] = useState('');
  const [numeroAlteracao, setNumeroAlteracao] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [idProduto, setIdProduto] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [actionMainVisivel, setActionMainVisivel] = useState(true);
  const [actionSecundariaVisivel, setActionSecundariaVisivel] = useState(false);


  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFim)
  }, []);

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id) }
  );
  
  const { data: dadosResponsaveisAlteracao = [], error: errorResponsaveis, isLoading: isLoadingResponsaveis, refetch: refetchResponsaveis } = useQuery(
    ['responsaveisAlteracaoPrecos'],
    async () => {
      const response = await get(`/responsaveisAlteracaoPrecos`);

      return response.data;
    },
    { enabled: true }
  );

  const { data: dadosListaPreco = [], error: errorListaPreco, isLoading: isLoadingListaPreco, refetch: refetchListaPreco } = useQuery(
    ['lista-de-preco'],
    async () => {
      const response = await get(`/lista-de-preco`);

      return response.data;
    },
    { enabled: true }
  );


  const fetchListaPreco = async () => {
    const urlBase = `/alteracoes-de-precos-resumo?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLista=${listaPrecoSelecionada}&idUsuario=${responsavelSelcionado}&descproduto${descricaoProduto}`;
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

  const { data: dadosAlteracaoPreco = [], error: errorEstilos, isLoading: isLoadingEstilos, refetch: refetchListaAlteracaoPreco } = useQuery(
    ['alteracoes-de-precos-resumo',],
    () => fetchListaPreco(),
    {
      enabled: false,
    }
  );

  const handleTabelaVisivel = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaAlteracaoPreco();
    setTabelaVisivel(true);
  };

  const handleActionVisivel = () => {
    setActionMainVisivel(false);
    setTabelaVisivel(false);
    setActionSecundariaVisivel(true);

  };

  const optionsEmpresas = dadosListaPreco.map((item) => ({
    value: item.IDRESUMOLISTAPRECO,
    label: item.NOMELISTA,
    title: item.TITLE,
  }));

  return (

    <Fragment>

      {actionMainVisivel && (

        <ActionMain
          linkComponentAnterior={["Home"]}
          linkComponent={["Alteração de Preços"]}
          title="Alteração de Preços"
          subTitle="Nome da Loja"

          InputFieldDTInicioComponent={InputField}
          labelInputFieldDTInicio={"Data Início"}
          valueInputFieldDTInicio={dataPesquisaInicio}
          onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

          InputFieldDTFimComponent={InputField}
          labelInputFieldDTFim={"Data Fim"}
          valueInputFieldDTFim={dataPesquisaFim}
          onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}


          InputFieldCodBarraComponent={InputField}
          labelInputFieldCodBarra={"Cód.Barras "}
          valueInputFieldCodBarra={codBarra}
          onChangeInputFieldCodBarra={e => setCodBarra(e.target.value)}
          placeHolderInputFieldCodBarra={"Digite o Código de Barras"}

          InputFieldComponent={InputField}
          labelInputField={"N° Alteração"}
          valueInputField={numeroAlteracao}
          onChangeInputField={(e) => setNumeroAlteracao(e.target.value)}
          placeHolderInputFieldComponent={"Digite o Número da Alteração"}

          InputFieldNumeroNFComponent={InputField}
          labelInputFieldNumeroNF={"Id. Produto"}
          valueInputFieldNumeroNF={idProduto}
          onChangeInputFieldNumeroNF={(e) => setIdProduto(e.target.value)}
          placeHolderInputFieldNumeroNF={"Digite o Id. do Produto"}

          InputFieldDescricaoComponent={InputField}
          labelInputFieldDescricao={"Descrição do Produto"}
          placeHolderInputFieldDescricao={"Digite a descrição do produto"}
          valueInputFieldDescricao={descricaoProduto}
          onChangeInputFieldDescricao={(e) => setDescricaoProduto(e.target.value)}

          InputSelectEmpresaComponent={InputSelectAction}
          labelSelectEmpresa={"Lista de Preço"}
          optionsEmpresas={dadosListaPreco.map((item) => ({
            value: item.listaPreco.IDRESUMOLISTAPRECO,
            label: item.listaPreco.NOMELISTA,
          }))}
          valueSelectEmpresa={listaPrecoSelecionada}
          onChangeSelectEmpresa={(e) => setListaPrecoSelecionada(e.value)}

          InputSelectGrupoComponent={InputSelectAction}
          labelSelectGrupo={"Responsável Alt."}
          optionsGrupos={dadosResponsaveisAlteracao.map((item) => ({
            value: item.IDFUNCIONARIO,
            label: item.NOFUNCIONARIO,
          }))}
          valueSelectGrupo={responsavelSelcionado}
          onChangeSelectGrupo={(e) => setResponsavelSelecionado(e.value)}


          ButtonSearchComponent={ButtonType}
          onButtonClickSearch={handleTabelaVisivel}
          linkNomeSearch={"Pesquisar"}
          IconSearch={AiOutlineSearch}
          corSearch={"primary"}

          ButtonTypeCadastro={ButtonType}
          linkNome={"Inserir Alteração"}
          onButtonClickCadastro={handleActionVisivel}
          corCadastro={"success"}
          IconCadastro={MdAdd}

        />
      )}

      {tabelaVisivel && (

        <ActionListaAlteracaoPreco
          dadosAlteracaoPreco={dadosAlteracaoPreco}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      )}

      {actionSecundariaVisivel && (

        <ActionManualAlteracaoPreco
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
        />
      )}
    </Fragment>
  )
}