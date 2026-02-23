import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { MdAdd } from "react-icons/md";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionListaVendaVoucher } from "./actionListaVendaVoucher";

export const ActionPesquisaVendaVoucher = ({usuarioLogado}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [numeroSerie, setNumeroSerie] = useState('');
  const [numeroNFCE, setNumeroNFCE] = useState('');
  const [numeroVoucherSelecionado, setNumeroVoucherSelecionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInicio = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFim)

  }, []);

  useEffect(() => {
  
  }, [usuarioLogado]);

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
   
      return response.data;
    },
    {enabled: true, staleTime: 5 * 60 * 1000 }
  );

  const fetchListaVouchers = async () => {
    try {
      
      const urlApi = `/lista-venda-cliente?idEmpresa=${usuarioLogado.IDEMPRESA}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
   
  const { data: dadosVoucher = [], error: errorVouchers, isLoading: isLoadingVouchers, refetch: refetchListaVouchers } = useQuery(
    ['lista-venda-cliente', usuarioLogado?.IDEMPRESA, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaVouchers(usuarioLogado?.IDEMPRESA,  dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: false, 
    }
  );

  const handleSelectEmpresa = (e) => {   
    setEmpresaSelecionada(e.value)
  }

  const handleClick = () => {
    
    setCurrentPage(+1);
    refetchListaVouchers()
    setTabelaVisivel(true);
   
  }


  return (

    <Fragment>
      
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vouchers"]}
        title="Vendas"
        subTitle="Relação de Vendas para Troca"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={dadosEmpresas.map((empresa) => ({
          value: empresa.IDEMPRESA,
          label: empresa.NOFANTASIA,
        }))}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        InputFieldNumeroVoucherComponent={InputField}
        valueInputFieldNumeroVoucher={numeroVoucherSelecionado}
        onChangeInputFieldNumeroVoucher={(e) => setNumeroVoucherSelecionado(e.target.value)}
        labelInputFieldNumeroVoucher={"CPF/CNPJ ou Nº Venda "}

        InputFieldComponent={InputField}
        labelInputField={"Série"}
        placeHolderInputFieldComponent={"Digite o número de série do voucher"}
        valueInputField={numeroSerie}
        onChangeInputField={(e) => setNumeroSerie(e.target.value)}

        InputFieldNumeroNFComponent={InputField}
        labelInputFieldNumeroNF={"Nº NFCE"}
        placeHolderInputFieldNumeroNF={"Digite o número da NFCE"}
        valueInputFieldNumeroNF={numeroNFCE}
        onChangeInputFieldNumeroNF={(e) => setNumeroNFCE(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={"Criar Voucher"}
        linkNome={"Cadastro Cliente"}
        onButtonClickCadastro={""}
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />


      {tabelaVisivel &&
        <ActionListaVendaVoucher dadosVoucher={dadosVoucher}/>
      }
     

    </Fragment>
  )
}
