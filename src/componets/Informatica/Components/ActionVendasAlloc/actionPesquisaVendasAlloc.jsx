import React, { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { get } from "../../../../api/funcRequest";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionListaVendasAlloc } from "./actionListaVendasAlloc";
import { getDataAtual } from "../../../../utils/dataAtual";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaVendasAlloc = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [venda, setVenda] = useState('');
  const [situacaoVenda, setSituacaoVenda] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInicio = getDataAtual();
    const dataFim = getDataAtual();
    setDataPesquisaInicio(dataInicio);
    setDataPesquisaFim(dataFim);

  }, []);


  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);

      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
    }
  );

  const fetchListaVendasAlloc = async () => {
    const urlBase = `/vendas-alloc?idVenda=${venda}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&status=${situacaoVenda}`;
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

  const { data: dadosVendasAlloc = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refecthVendasAlloc } = useQuery(
    ['vendas-alloc', venda, empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, situacaoVenda, currentPage, pageSize],
    () => fetchListaVendasAlloc(venda, empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, situacaoVenda, currentPage, pageSize),
    { enabled: false }
  );


  const handleChangeEmpresa = (e) => {
    const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }

  const handleChangeSituacao = (e) => {
    setSituacaoVenda(e.value);
  }

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      refecthVendasAlloc()
    }

  }

  const situacao = [

    { value: "Todas", label: "Todas" },
    { value: "NAO PROCESSADO", label: "Não Processado" },
    { value: "VENDA", label: "Venda" },
    { value: "PAGAMENTO", label: "Pagamento" },
    { value: "CONCLUIDO", label: "Concluído" },
    { value: "ERRO VENDA", label: "Erro Venda" },
    { value: "ERRO PAGAMENTO", label: "Erro Pagamento" },
    { value: "CANCELADO", label: "Cancelado" },
  ]

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Integração Vendas / Alloc"]}
        title="Integração Vendas / Alloc -"
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
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma empresa' },
          ...optionsEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA

          }))
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Situação"}
        optionsMarcas={[
          { value: "Todas", label: "Selecione uma Situação" },
          ...situacao.map((item) => ({
            value: item.value,
            label: item.label
          }))]}
        valueSelectMarcas={situacaoVenda}
        onChangeSelectMarcas={handleChangeSituacao}

        InputFieldComponent={InputField}
        labelInputField={"Venda"}
        valueInputField={venda}
        onChangeInputField={(e) => setVenda(e.target.value)}



        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel && (

        <div className="card">
          <ActionListaVendasAlloc dadosVendasAlloc={dadosVendasAlloc} />
        </div>
      )}
    </Fragment>
  )
}
