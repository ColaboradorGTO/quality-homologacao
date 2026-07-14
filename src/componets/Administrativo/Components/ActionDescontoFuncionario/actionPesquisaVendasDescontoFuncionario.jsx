import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaVendasDescontoFuncionario } from "./actionListaVendasDescontoFuncionario";
import { AiOutlineSearch } from "react-icons/ai";
import {InputSelectAction} from "../../../Inputs/InputSelectAction"
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento";

export const ActionPesquisaVendasDescontoFuncionario = ({ usuarioLogado }) => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('0')
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('')
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);             

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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, }
  );
  
  const { data: dadosFuncionarios = [], error: errorFuncionarios, isLoading: isLoadingFuncionarios, refetch: refetchFuncionarios } = useQuery(
    ['listaFuncionarioVendasDesconto', empresaSelecionada],
    async () => {
      const response = await get(`/funcionarios?idEmpresa=${empresaSelecionada}`);
      
      return response.data;
    },
    { enabled: Boolean(empresaSelecionada), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );

const fetchListaVendasConvenio = async () => {
    const urlBase = `/resumo-venda-convenio-desconto?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFuncionario=${funcionarioSelecionado}&statusCancelado=False`;
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
   
  const { data: dadosVendasConvenio = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchListaVendasConvenio } = useQuery(
    ['listaVendasMarca',],
    () => fetchListaVendasConvenio(),
    {
      enabled: false, 
    }
  );

  const handleSelectEmpresa = (e) => {
    const empresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value)
    setEmpresaSelecionada(e.value);
    setEmpresaSelecionadaNome(empresa.NOFANTASIA)
  };

  const handleChangeFuncionario = (e) => {
    setFuncionarioSelecionado(e.value);
  }
 
  const handleClick = () => {
    setTabelaVisivel(true);
    refetchListaVendasConvenio()
  };

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
        linkComponent={["Vendas por Desconto e Período"]}
        title="Vendas por Desconto e Período"
        subTitle={empresaSelecionadaNome}
        
        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicio={handleKeyPress}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFim={handleKeyPress}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={[
          { value: '0', label: 'Todas' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
        }))]}
        
        onChangeSelectEmpresa={(e) => handleSelectEmpresa(e)}
        valueSelectEmpresa={empresaSelecionada}

        InputSelectFuncionarioComponent={InputSelectAction}
        labelSelectFuncionario={"Por Funcionário"}
        optionsFuncionarios={dadosFuncionarios.map((funcionario) => ({
          value: funcionario.IDFUNCIONARIO,
          label: funcionario.NOFUNCIONARIO,
        }))}      
        valueSelectFuncionario={funcionarioSelecionado}
        onChangeSelectFuncionario={handleChangeFuncionario}
  
        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel &&
        
        <ActionListaVendasDescontoFuncionario 
          dadosVendasConvenio={dadosVendasConvenio} 
          usuarioLogado={usuarioLogado}  
          optionsModulos={optionsModulos}
        />
      }
    </Fragment>
  )
}