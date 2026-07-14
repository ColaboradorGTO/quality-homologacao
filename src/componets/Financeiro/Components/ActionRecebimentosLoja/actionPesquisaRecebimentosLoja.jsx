import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { get } from "../../../../api/funcRequest"
import { getDataAtual } from "../../../../utils/dataAtual"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionListaRecebimentosLoja } from "./actionListaRecebimentosLoja"
import { AiOutlineSearch } from "react-icons/ai"
import { useQuery } from 'react-query';
import Swal from 'sweetalert2';
import { ActionListaDetalhamentoCopia } from "./actionListaDetalhamentoCopia"
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento"
import { ButtonType } from "../../../Buttons/ButtonType"
import { useFetchData } from "../../../../hooks/useFetchData"
import { ActionListaDetalhamento } from "./actionListaDetalhamento2"


export const ActionPesquisaRecebimentosLoja = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresaComercial',
    async () => {
      const response = await get(`/listaEmpresaComercial`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const fetchListaRecebimentosLoja = async () => {
    const urlBase = `/venda-total-recebido-periodo?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
  }

  const { data: dadosListaRecebimentosLoja = [], error: errorListaRecebimentosLoja, isLoading: isLoadingListaRecebimentosLoja, refetch: refetchListaRecebimentosLoja } = useQuery(
    ['venda-total-recebido-periodo'],
    () => fetchListaRecebimentosLoja(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );


  // const fetchListaRecebimentosEletronicos = async () => {
  //   const urlBase = `/venda-recebido-eletronico?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

  //     if (totalPages > 1) {
  //       for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
  //         animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
  //         const responsePage = await get(`${urlApi}&page=${currentPage}`);
  //         allData.push(...(responsePage.data || []));
  //       }
  //     }

  //     return allData;
  //   } catch (error) {
  //     console.error('Erro ao buscar dados:', error);
  //     throw error;
  //   } finally {
  //     fecharAnimacaoCarregamento();
  //   }
  // }

  // const { data: dadosRecebimentosEletronico = [], error: errorListaRecebimentosEletronicos, isLoading: isLoadingListaRecebimentosEletronicos, refetch: refetchRecebimentosEletronicos } = useQuery(
  //   ['venda-recebido-eletronico'],
  //   () => fetchListaRecebimentosEletronicos(),
  //   { enabled: false, staleTime: 5 * 60 * 1000 }
  // );

  const { data: dadosRecebimentosEletronico = [], error: errorListaRecebimentosEletronicos, isLoading: isLoadingListaRecebimentosEletronicos, refetch: refetchRecebimentosEletronicos } = useQuery(
    ['venda-recebido-eletronico'],
    async () => {
      const response = await get(`/venda-recebido-eletronico?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&page=1&pageSize=500`);
      return response.data;
    },
    { enabled: false, staleTime: 60 * 60 * 1000,}
  );


  const handleChangeEmpresa = (e) => {
    if (e.value === '') {
      setEmpresaSelecionada('');
    } else {
      const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
      setEmpresaSelecionada(e.value);
      setEmpresaSelecionadaNome(empresa.NOFANTASIA);
    }
  }
  const handleClick = () => {
    setTabelaVisivel(true)
    refetchListaRecebimentosLoja()
    refetchRecebimentosEletronicos()
  }



  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Recebimentos"]}
        title="Recebimentos por Lojas e Período"
        subTitle={empresaSelecionadaNome}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma loja' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        
      />

      <ActionListaDetalhamento dadosListaRecebimentosLoja={dadosListaRecebimentosLoja} />
      <div className="card " >

        <ActionListaRecebimentosLoja
          dadosRecebimentosEletronico={dadosRecebimentosEletronico}
          dadosListaRecebimentosLoja={dadosListaRecebimentosLoja}
          empresaSelecionada={empresaSelecionada}
          dataPesquisaInicio={dataPesquisaInicio}
          dataPesquisaFim={dataPesquisaFim}
        />

        {/* <ActionListaDetalhamento dadosListaRecebimentosLoja={dadosListaRecebimentosLoja} /> */}
      </div>

    </Fragment>
  )
}
