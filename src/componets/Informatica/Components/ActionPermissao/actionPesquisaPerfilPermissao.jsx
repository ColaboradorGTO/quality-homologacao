import React, { Fragment, useState } from "react"
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { ActionListaPerfilPermissao } from "./actionListaPerfilPermissao";
import Swal from "sweetalert2";
import { useEffect } from "react";


export const ActionPesquisaPerfilPermissao = ({ usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [usuarioClonado, setUsuarioClonado] = useState('');
  const [copiarPermissao, setCopiarPermissao] = useState('');
  const [funcionarioClonarId, setFuncionarioClonarId] = useState('');
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState([]);
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);

      return response.data;
    },
    {
      staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000
    }
  );

  const fetchListaFuncionarios = async () => {
    const urlBase = `/funcionarios-loja-ativos?idEmpresa=${empresaSelecionada}`;
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

      return allData;

    } catch (error) {
      console.error('Erro ao buscar dados da api', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosFuncionarios = [], error: errorFuncionario, isLoading: isLoadingFuncionario } = useQuery(
    ['funcionarios-loja-ativos', empresaSelecionada],
    () => fetchListaFuncionarios(),
    { enabled: Boolean(empresaSelecionada), staleTime: Infinity, cacheTime: Infinity, }
  );


  const fetchListaPermissoes = async () => {
    console.log(usuarioClonado, 'usuarioClonado');
    const urlBase = `/menus-usuario-excecao?idUsuario=${usuarioClonado}`;
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

      return allData;

    } catch (error) {
      console.error('Erro ao buscar dados da api', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosPermissoes = [], error: errorPermissoes, isLoading: isLoadingPermissoes, refetch } = useQuery(
    ['menus-usuario-excecao', ],
    () => fetchListaPermissoes(),
    { enabled: true, staleTime: 5 * 60 * 1000, }
  );


  const handleClick = () => {
    if (usuarioSelecionado && usuarioClonado) {
      setCurrentPage(prevPage => prevPage + 1);
      setTabelaVisivel(true);
      refetch();

    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Selecione um funcionário para copiar as permissões!',
        timer: 3000,
      })
    }
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Funcionários das Lojas"]}
        title="  Lista dos funcionários das Lojas"

        InputSelectMarcasComponent={InputSelectAction}
        optionsMarcas={[
          { value: '', label: 'Selecione a Empresa' },
          ...optionsEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          }))
        ]}
        labelSelectMarcas={"Empresa"}
        valueSelectMarca={empresaSelecionada}
        onChangeSelectMarcas={(e) => setEmpresaSelecionada(e.value)}


        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          ...dadosFuncionarios.map((item) => ({
            value: item.ID,
            label: `${item.NOLOGIN} -  ${item.NOFUNCIONARIO}`
          }))
        ]}

        labelSelectEmpresa={"Origem da Permissão"}
        valueSelectEmpresa={usuarioClonado}
        onChangeSelectEmpresa={(e) => setUsuarioClonado(String(e.value ?? ""))}

        InputSelectGrupoComponent={InputSelectAction}
        optionsGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosFuncionarios.map((item) => ({
            value: item.ID,
            label: `${item.NOLOGIN} -  ${item.NOFUNCIONARIO}`
          }))
        ]}
        labelSelectGrupo={"Destino da Permissão"}
        valueSelectGrupo={usuarioSelecionado}
        onChangeSelectGrupo={(e) => setUsuarioSelecionado(String(e.value ?? ""))}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel && (

        <ActionListaPerfilPermissao
          dadosPermissoes={dadosPermissoes}
          usuarioSelecionado={usuarioSelecionado}
          funcionarioClonarId={funcionarioClonarId}
          permissoesSelecionadas={permissoesSelecionadas}
          setPermissoesSelecionadas={setPermissoesSelecionadas}
          handleClick={handleClick}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          usuarioClonado={usuarioClonado}
          setusUarioClonado={setUsuarioClonado}
        />

      )}

    </Fragment>
  )
}