import React, { Fragment, useEffect, useState } from "react"
import { ActionListaProductoPreco } from "./actionListaProdutosPreco";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { InputField } from "../../../Buttons/Input";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";

export const ActionPesquisaProductoPreco = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [produto, setProduto] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const fetchListaProdutos = async () => {
    const urlBase = `/buscar-produtos?descProd=${produto}`;
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
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
    ['buscar-produtos', produto, currentPage, pageSize],
    fetchListaProdutos,
    { enabled: false, staleTime: 60 * 60 * 1000 },
  );


  const handleClick = () => {
    if (produto.length > 4) {
      
      refetchListaProdutos()
      setTabelaVisivel(true);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Atenção',
        text: 'Descrição ou código de barras muito curto, verifique e tente novamente!',
        timer: 5000
      })
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
        linkComponent={["Produtos - Preços"]}
        title="Produtos - Preços"
        subTitle

        InputFieldComponent={InputField}
        labelInputField={'Código de Barras / Nome Produto'}
        placeHolderInputFieldComponent={'Código de Barras / Nome Produto'}
        valueInputField={produto}
        onChangeInputField={(e) => setProduto(e.target.value)}
        onKeyDownInputField={handleKeyPress}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />


      {tabelaVisivel && (
        <ActionListaProductoPreco
          dadosProdutos={dadosProdutos}
        />
      )}

    </Fragment>
  )
}