import React, { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionMain } from "../../../Actions/actionMain";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { ActionListaLinkRelatorioBi } from "./actionListaLinkRelatorioBI";
import { ActionCadastrarRelatorioBIModal } from "./actionCadastrar/actionCadastrarRelatorioBIModal";
import { ActionImportarRelatorioBIModal } from "./actionImportarRelatorioBIModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";


export const ActionPesquisaLinkRelatorioBi = ({ usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalImportarRelatorio, setModalImportarRelatorio] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
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
    { enabled: Boolean(usuarioLogado?.id) }
  );

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresa } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    {
      staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000
    }
  );

  const fetchListaRelatorio = async () => {
    const urlBase = `/linkRelatorioBI?idRelatorio=${relatorioSelecionado}&idEmpresa=${empresaSelecionada}`;
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


  const { data: dadosBI = [], error: erroLink, isLoading: isLoadingLink, refetch: refetchListaRelatorio } = useQuery(
    ['linkRelatorioBI', ],
    () => fetchListaRelatorio(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const { data: dadosRelatorios = [], error: errorrRelatorio, isLoading: isLoadingRelatorio, refetch } = useQuery(
    'relatorioInformaticaBI',
    async () => {
      const response = await get(`/relatorioInformaticaBI`);
      return response.data;
    },
    {
      staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000
    }
  );



  const handlChangeEmpresa = (e) => {
    const selectedEmpresa = dadosEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }


  const handleChangeRelatorio = (e) => {
    setRelatorioSelecionado(e.value);
  }

  const handleCadastrarRelatorio = () => {
    if (optionsModulos[0]?.CRIAR === 'True') {
      setModalCadastro(true)
    } else {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar Relatório BI.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  const handleImportarRelatorio = () => {
    setModalImportarRelatorio(true)
  }

  const handleTabelaVisivel = () => {
    refetchListaRelatorio()
    setTabelaVisivel(true)
  }

  return (
    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatório BI"]}
        title="Listagem dos Relatórios do BI"
        subTitle={empresaSelecionadaNome}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Filial"}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma Empresa' },
          ...dadosEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          })
          )]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handlChangeEmpresa}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Relatório"}
        optionsGrupos={[
          { value: '', label: 'Selecione um Relatório' },
          ...dadosRelatorios.map((item) => ({
            value: item.IDRELATORIOBI,
            label: item.DSRELATORIOBI
          })
          )]}
        valueSelectGrupo={relatorioSelecionado}
        onChangeSelectGrupo={handleChangeRelatorio}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleTabelaVisivel}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Link Relatório "}
        onButtonClickCadastro={handleCadastrarRelatorio}
        corCadastro={"success"}
        IconCadastro={MdAdd}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Importar Arquivo CSV"}
        onButtonClickCancelar={handleImportarRelatorio}
        corCancelar={"danger"}
        IconCancelar={GoUpload}

      />

      <ActionListaLinkRelatorioBi
        dadosBI={dadosBI}
        handleTabelaVisivel={handleTabelaVisivel}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />

      <ActionCadastrarRelatorioBIModal
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
        refetchListaRelatorio={refetchListaRelatorio}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        dadosEmpresas={dadosEmpresas}
      />

      <ActionImportarRelatorioBIModal
        show={modalImportarRelatorio}
        handleClose={() => setModalImportarRelatorio(false)}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        relatorioSelecionado={relatorioSelecionado}
      />

    </Fragment>
  )
}
