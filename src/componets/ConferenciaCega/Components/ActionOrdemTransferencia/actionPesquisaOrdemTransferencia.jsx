import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionListaOrdemTransferencia } from "./actionListaOrdemTransferencia";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionIncluirOTModal } from "./ActionIncluirModalOT/actionIncluirOTModal";

export const ActionPesquisaOrdemTransferencia = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [empresaSelecionadaOrigem, setEmpresaSelecionadaOrigem] = useState('')
  const [empresaSelecionadaDestino, setEmpresaSelecionadaDestino] = useState('')
  const [modalVisivel, setModalVisivel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataPesquisaInicio(dataAtual);
    setDataPesquisaFim(dataAtual);

  }, []);

  const { data: dadosEmpresa = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const fetchListaConferencia = async () => {
    try {
      const urlApi = `/listaOrdemTransferenciaConferenciaCega?idEmpresaOrigem=${empresaSelecionadaOrigem}&idEmpresaDestino=${empresaSelecionadaDestino}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
   
  const { data: dadosConferencia = [], error: errorVouchers, isLoading: isLoadingVouchers, refetch: refetchListaConferencia } = useQuery(
    ['listaOrdemTransferenciaConferenciaCega',  empresaSelecionadaOrigem, empresaSelecionadaDestino, dataPesquisaInicio, dataPesquisaFim,  currentPage, pageSize],
    () => fetchListaConferencia(empresaSelecionadaOrigem, empresaSelecionadaDestino, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: Boolean(empresaSelecionadaOrigem && empresaSelecionadaDestino),
    }
  );
  

  const handleSelectEmpresaOrigem = (e) => {
    const selectedId = e.value;
    if (selectedId) {
      setEmpresaSelecionadaOrigem(selectedId);
    }
  }

  const handleSelectEmpresaDestino = (e) => {
    const selectedId = e.value;
    if (selectedId) {
      setEmpresaSelecionadaDestino(selectedId);
    }
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaConferencia()
    setTabelaVisivel(true);
    
  }

  return (
    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Ordem de Transferência"]}
        title="Controle de Transferência"
        subTitle="Nome da Loja"
        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Loja Origem"}
        optionsGrupos={[
          {value: '0', label:'Selecione a Loja Origem'},
          ...dadosEmpresa.map((empresa) => ({
          value: empresa.IDEMPRESA,
          label: empresa.NOFANTASIA,
        }))]}
        valueSelectGrupo={empresaSelecionadaOrigem}
        onChangeSelectGrupo={handleSelectEmpresaOrigem}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Loja Destino"}
        optionsEmpresas={[
          { value: '0', label: 'Selecione a Loja Destino'},
          ...dadosEmpresa.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
        }))]}
        valueSelectEmpresa={empresaSelecionadaOrigem}
        onChangeSelectEmpresa={handleSelectEmpresaDestino}

        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleClick}
        linkNomeSearch={"Pesquisar"}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={"Nova OT"}
        linkNome={"Nova OT"}
        onButtonClickCadastro={() => setModalVisivel(true)}
        corCadastro={"success"}
        IconCadastro={AiOutlineSearch}
      />


      {tabelaVisivel && (
        <ActionListaOrdemTransferencia dadosConferencia={dadosConferencia} />
      )}

      <ActionIncluirOTModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        
      />
    </Fragment>
  )
}