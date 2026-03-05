import React, { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { ActionListaVoucher } from "./actionListaVoucher";
import Swal from 'sweetalert2'
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useEffect } from "react";

export const ActionPesquisaVoucherEmitido = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [numeroVoucherSelecionado, setNumeroVoucherSelecionado] = useState('');
  const [currentPage] = useState(1);
  const [pageSize] = useState(1000);
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

  const fetchResumoVoucher = async () => {
    try {

      const urlApi = `/detalhe-voucher?idVoucher=${numeroVoucherSelecionado}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVoucher = [], error: erroQuality, isLoading: isLoadingQuality, refetch: refetchResumoVoucher } = useQuery(
    'detalhe-voucher',
    () => fetchResumoVoucher(numeroVoucherSelecionado, currentPage, pageSize),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const handleClick = () => {
    if (numeroVoucherSelecionado == '') {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Informe o Número do Voucher.',
        timer: 3000
      })

      return;
    } else {
      refetchResumoVoucher()
      setTabelaVisivel(true);
    }
  }

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vouchers "]}
        title="Vouchers Emitidos"
        subTitle={usuarioLogado?.NOFANTASIA}

        InputFieldComponent={InputField}
        labelInputField={"Nº do Voucher"}
        valueInputField={numeroVoucherSelecionado}
        onChangeInputField={(e) => setNumeroVoucherSelecionado(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel && (
        <ActionListaVoucher
          dadosVoucher={dadosVoucher}
        />
      )}

    </Fragment>
  )
}