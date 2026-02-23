import { Fragment, useEffect, useState } from "react"
import { InputField } from "../../../Buttons/Input"
import { ActionMain } from "../../../Actions/actionMain"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSearch } from "react-icons/ai"
import { getDataAtual } from "../../../../utils/dataAtual"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionListaVendasDigital } from "./actionListaVendasDigital"
import { ActionListaVendasResumidaDigital } from "./actionListaVendasResumidaDigital"
import { useQuery } from 'react-query';
import { useFetchData } from "../../../../hooks/useFetchData"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"


export const ActionPesquisaVendasDigital = () => {
  const [tabelaResumidoVisivel, setTabelaResumidoVisivel] = useState(false);
  const [tabelaDetalhadoVisivel, setTabelaDetalhadoVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  
  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);

  }, [])

  const { data: optionsEmpresas = [] } = useFetchData('listaEmpresasIformatica', '/listaEmpresasIformatica');

  const refetchVendasDetalhadas = async () => {
    const urlBase = `/venda-digital?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
     fecharAnimacaoCarregamento();
    }
  };
  
  const { data: dadosVendasDetalhadas = [], error: errorVendasDetalhada, isLoading: isLoadingVendasDetalhada, refetch: refetchVendaDetalhada } = useQuery(
    ['venda-digital'],
    () => refetchVendasDetalhadas(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );
 
  const handleChangeEmpresa = (e) => {
    if( e.value === '') {
      setEmpresaSelecionada('');
    } else {
      const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
      setEmpresaSelecionada(e.value);
      setEmpresaSelecionadaNome(empresa.NOFANTASIA);
    }
  }

  const handleClickResumido = () => {
    setTabelaResumidoVisivel(true)
    setTabelaDetalhadoVisivel(false)    
    refetchVendaDetalhada()
  }

  const handleClickDetalhado = () => {
    setTabelaDetalhadoVisivel(true)
    setTabelaResumidoVisivel(false)
    refetchVendaDetalhada()
  }


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas Digital"]}
        title="Vendas Digitais e Período"
        subTitle={empresaSelecionadaNome}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[

          { value: '', label: 'Selecione uma Loja' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Loja"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Detalhado"}
        onButtonClickSearch={handleClickDetalhado}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Resumido"}
        onButtonClickCadastro={handleClickResumido}
        corCadastro={"info"}
        IconCadastro={AiOutlineSearch}
      />


      {tabelaDetalhadoVisivel && (
        
        <div className="card" >
          <ActionListaVendasDigital dadosVendasDetalhadas={dadosVendasDetalhadas} />
        </div>
        
      )}

      {tabelaResumidoVisivel && (

        <div className="card" >
          <ActionListaVendasResumidaDigital dadosVendasDetalhadas={dadosVendasDetalhadas} />
        </div>

      )}

    </Fragment>
  )
}
