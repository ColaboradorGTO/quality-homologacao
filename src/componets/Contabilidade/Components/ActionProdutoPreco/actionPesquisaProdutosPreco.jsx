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
    try {

      const urlApi = `/buscar-produtos?descProd=${produto}`;
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
  };

  const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
    ['buscar-produtos', produto, currentPage, pageSize],
    fetchListaProdutos,
    { enabled: Boolean(produto.length > 4), staleTime: 60 * 60 * 1000 },
  );


  const handleClick = () => {
    if (produto.length > 4) {
      setCurrentPage(prevPage => prevPage + 1)
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


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

