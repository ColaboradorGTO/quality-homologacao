import React, { Fragment, useState, useRef } from "react"
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { ActionListaPerfilPermissao } from "./actionListaPerfilPermissao";
import { FaRegClone } from "react-icons/fa";
import Swal from "sweetalert2";


export const ActionPesquisaPerfilPermissao = ({ usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [modalCadastro, setModalCadastro] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [copiarPermissao, setCopiarPermissao] = useState('');
  const [usuarioClonado, setUsuarioClonado] = useState('');
  const [funcionarioClonarId, setFuncionarioClonarId] = useState('');
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState([]);


  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);

      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
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

  /*  const fetchListaFuncionarios = async () => {
     try {
       const urlApi = `/funcionarios-loja-ativos?idEmpresa=${empresaSelecionada}`;
       const response = await get(urlApi);
 
       if (response.data.length && response.data.length === pageSize) {
 
         let allData = [...response.data];
         animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
 
         async function fetchNextPage(currentPage) {
           try {
             currentPage++;
             const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
             if (responseNextPage.data.length) {
               allData.push(...responseNextPage.data);
               return fetchNextPage(currentPage);
             } else {
               return allData;
             }
           } catch (error) {
             console.error('Erro ao buscar próxima página:', error);
             throw error;
           }
         }
 
         await fetchNextPage(currentPage);
         return allData;
       } else {
 
         return response.data;
       }
     } catch (error) {
       console.error('Erro ao buscar dados:', error);
       throw error;
     } finally {
       fecharAnimacaoCarregamento();
     }
   };
  */
  const { data: dadosFuncionarios = [], error: errorFuncionario, isLoading: isLoadingFuncionario } = useQuery(
    ['funcionarios-loja-ativos'],
    () => fetchListaFuncionarios(),
    { enabled: true, staleTime: Infinity, cacheTime: Infinity, }
  );


  const fetchListaFuncionariosCopiado = async (idEmpresa) => {
    const urlBase = `/funcionarios-loja?idEmpresa=${idEmpresa}`;
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

  /* const fetchListaFuncionariosCopiado = async (idEmpresa) => {
    try {
      const urlApi = `/funcionarios-loja?idEmpresa=${idEmpresa}`;
      const response = await get(urlApi);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
 */

  const { data: dadosFuncionariosCopiado = [], error: errorFuncionarioCopiado, isLoading: isLoadingFuncionarioCopiado } = useQuery(
    ['funcionarios-loja', empresaSelecionada],
    () => fetchListaFuncionariosCopiado(empresaSelecionada),
    { enabled: true, staleTime: Infinity, cacheTime: Infinity }
  );

  const fetchListaPermissoes = async () => {
    const urlBase = `/menus-usuario-excecao?idUsuario=${usuarioSelecionado}`;
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

  /* const fetchListaPermissoes = async () => {
    try {
      const urlApi = `/menus-usuario-excecao?idUsuario=${usuarioSelecionado}`;
      const response = await get(urlApi);

      if (response.data.length && response.data.length === pageSize) {

        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);

        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }

        await fetchNextPage(currentPage);
        return allData;
      } else {

        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  }; */

  const { data: dadosPermissoes = [], error: errorPermissoes, isLoading: isLoadingPermissoes, refetch } = useQuery(
    ['menus-usuario-excecao', usuarioSelecionado, currentPage, pageSize],
    () => fetchListaPermissoes(usuarioSelecionado, currentPage, pageSize),
    { enabled: Boolean(usuarioSelecionado), staleTime: 5 * 60 * 1000, }
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

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione a Empresa' },
          ...optionsEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          }))
        ]}

        labelSelectEmpresa={"Empresa"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={(e) => setEmpresaSelecionada(String(e.value ?? ""))}

        InputSelectGrupoComponent={InputSelectAction}
        optionsGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosFuncionariosCopiado.map((item) => ({
            value: item.ID,
            label: `${item.NOLOGIN} -  ${item.NOFUNCIONARIO}`
          }))
        ]}
        labelSelectGrupo={"Copiar de Permissão"}
        valueSelectGrupo={usuarioSelecionado}
        onChangeSelectGrupo={(e) => setUsuarioSelecionado(String(e.value ?? ""))}

        InputSelectMarcasComponent={InputSelectAction}
        optionsMarcas={[
          ...dadosFuncionarios.map((item) => ({
            value: item.ID,
            label: `${item.NOLOGIN} -  ${item.NOFUNCIONARIO}`
          }))
        ]}
        labelSelectMarcas={"Clonar Para"}
        valueSelectMarca={usuarioClonado}
        onChangeSelectMarcas={(e) => setUsuarioClonado(String(e.value ?? ""))}

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