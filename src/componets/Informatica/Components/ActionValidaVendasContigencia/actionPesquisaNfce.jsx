import React, { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { get, put } from "../../../../api/funcRequest"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { ActionListaVendas } from "./actionListaVendas"
import { FiSend } from "react-icons/fi"
import { useAtualizarVendasContigencia } from "./hooks/useAtualizarVendasContigencia"
import axios from "axios"
import { useEffect } from "react"
import { getDataAtual } from "../../../../utils/dataAtual"


export const ActionPesquisaNfce = ({usuarioLogado, ID}) => {
  const [numeroVenda, setNumeroVenda] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataInicio(dataAtual);
    setDataFim(dataAtual);
  } , []);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  // const fetchListaVendas = async () => {
  //   const urlBase = axios.get(`https://gto.api.br/validarConsulta?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  //   let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
  //   urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
  //   try {
  //     animacaoCarregamento('Carregando dados...', true);
                                                                      
  //     const primeiraPagina = 1;
  //     const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
  //     const page = primeiraResposta.page || primeiraPagina;
  //     const pageSize = primeiraResposta.pageSize || 1000;
  //     const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
  //     const totalPages = Math.ceil(totalRows / pageSize);

  //     let allData = [...(primeiraResposta.data || [])];
  //     console.log('allData:', primeiraResposta.data);

  //     if (totalPages > 1) {
  //       for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
  //         animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
  //         const responsePage = await get(`${urlApi}&page=${currentPage}`);
  //         allData.push(...(responsePage.data || []));
  //       }
  //     }
  //     return allData;
  //   } catch (error) {
  //     console.error('Erro ao buscar dados da api:', error);
  //     throw error;
  //   } finally {
  //     fecharAnimacaoCarregamento();
  //   }
  // };
  
  // const { data: dadosVendas = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refetchListaVendas } = useQuery(
  //   'validarConsulta',
  //   () => fetchListaVendas(),
  //   { enabled: false }
  // );


  const { data: dadosVendas = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refetchListaVendas } = useQuery(
    'https://gto.api.br/validarConsulta',
    async () => {
      const response = await axios.get(`https://gto.api.br/validarConsulta?dataInicio=${dataInicio}&dataFim=${dataFim}&page=${page}&pageSize=${pageSize}`, 
    
      )
      console.log('Response da consulta:', response.data);
      return response.data.data;
    },
    { enabled: false }
  );

  const handleClick= () => {
    refetchListaVendas();
  };

  const {
    onSubmit
  } = useAtualizarVendasContigencia({dadosVendas, usuarioLogado, optionsModulos}); 
  
  const handleAtualizarVendas = async () => {
    get(`/validarConsulta`).then((response) => {
      console.log('Resposta da validação:', response.data);
      // Aqui você pode adicionar lógica adicional com base na resposta
    }).catch((error) => {
      console.error('Erro ao validar consulta:', error);
    });
  }


  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas"]}
        title="Lista de Vendas por Loja"
        
        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataInicio}
        onChangeInputFieldDTInicio={(e) => setDataInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataFim}
        onChangeInputFieldDTFim={(e) => setDataFim(e.target.value)}

        InputFieldComponent={InputField}
        labelInputField={'Nº da Venda'}
        placeHolderInputFieldComponent={'Digite o Nº da Venda'}
        valueInputField={numeroVenda}
        onChangeInputField={(e) => setNumeroVenda(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={'Atualizar Vendas'}
        corCadastro={"success"}
        onButtonClickCadastro={onSubmit}
        IconCadastro={FiSend}
      />

      <ActionListaVendas 
        dadosVendas={dadosVendas} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}  
      />
      

    </Fragment>
  )
}