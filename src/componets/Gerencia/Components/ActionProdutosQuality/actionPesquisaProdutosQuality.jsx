import React, { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ActionListaProdutosQuality } from "./actionListaProdutosQuality"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";

export const ActionPesquisaProdutosQuality = ({ optionsEmpresas, usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [descricaoProduto, setDescricaoProduto] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const fetchProdutosQuality = async () => {
    const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
    const urlBase = `/produtoQuality?codBarrasOuNome=${descricaoProduto}&idEmpresa=${idEmpresa}&idListaLoja=${usuarioLogado.ID_LISTA_LOJA}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosProdutos = [], error: erroQuality, isLoading: isLoadingQuality, refetch: refetchProdutosQuality } = useQuery(
    'produtoQuality',
    () => fetchProdutosQuality(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );


  const handleClick = () => {

    if (usuarioLogado && usuarioLogado.IDEMPRESA && usuarioLogado.ID_LISTA_LOJA) {
      setCurrentPage(prevPage => prevPage + 1);
      refetchProdutosQuality();
      setTabelaVisivel(true);
    } else {
      console.log('Usuário não possui informações válidas.');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Produto Quality"]}
        title="Lista de Produtos Quality"
        subTitle={usuarioLogado?.NOFANTASIA}

        InputSelectPendenciaComponent={InputSelectAction}
        labelSelectPendencia="Selecione a Empresa"
        optionsPendencia={[
          { value: '', label: 'Todas' },
          ...optionsEmpresas?.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        onChangeSelectPendencia={(e) => setEmpresaSelecionada(e.value)}
        valueSelectPendencia={empresaSelecionada}
        stylePendencia={optionsModulos[0]?.ADMINISTRADOR == "True"}

        InputFieldSearch={InputField}
        labelInputFieldSearch={"Cód.Barras / Nome Produto"}
        valueInputFieldSearch={descricaoProduto}
        onChangeInputFieldSearch={(e) => setDescricaoProduto(e.target.value)}
        onKeyDownInputFieldSearch={handleKeyPress}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
      />

      {tabelaVisivel &&
        <ActionListaProdutosQuality
          dadosProdutos={dadosProdutos}
        />
      }
    </Fragment>
  )
}
