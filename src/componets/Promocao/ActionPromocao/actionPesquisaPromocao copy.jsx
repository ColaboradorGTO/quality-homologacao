import React, { Fragment, useEffect, useState } from "react"
import { ActionListaPromocao } from "./actionListaPromocao"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../utils/dataAtual";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaProduto } from "./actionListaProduto";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { ActionCadastrarPromocaoModal } from "./ActionCadastrarPromocao/actionCadastrarPromocaoModal";

export const ActionPesquisaPromocao = () => {
  const [tabelaCampanha, setTabelaCampanha] = useState(true);
  const [modalCadastrarPromocao, setModalCadastrarPromocao] = useState(false);
  const [tabelaProduto, setTabelaProduto] = useState(false);
  const [descricao, setDescricao] = useState('')
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
  const [qtdApartirDe, setQtdApartirDe] = useState('')
  const [qtdLimite, setQtdLimite] = useState('')
  const [vrDesconto, setVrDesconto] = useState('')
  const [percDesconto, setPercDesconto] = useState('')
  const [vrApartirDe, setVrApartirDe] = useState('')
  const [vrLimite, setVrLimite] = useState('')
  const [codBarras, setCodBarras] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFinal)
   
  }, [])

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );
  
  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        return response.data;
      } else {
        return [];
      }
    },
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );


  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas]);


  const { data: dadosListaPromocao = [], error: errorPromocao, isLoading: isLoadingPromocao, refetch: refetchPromocao } = useQuery(
    'listaPromocao',
    async () => {
      const response = await get(`/listaPromocao`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );


  const fetchListaProdutosPromocao = async () => {
    try {
      const urlApi = `/produto-promocao?codeBarsOuNome=${codBarras}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.page}`, true);
  
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

  const { data: dadosProdutos = [], error: errorFuncionario, isLoading: isLoadingFuncionario, refetch: refetchListaProdutos } = useQuery(
    ['produto-promocao', empresaSelecionada, currentPage, pageSize],
    () => fetchListaProdutosPromocao(empresaSelecionada, currentPage, pageSize),
    {
      enabled: false, staleTime: 5 * 60 * 1000, 
    }
  );
  
  
  const handleChangeEmpresa = (e) => {
    const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }


  const handleClickPromocao = () => {
    setCurrentPage(+1)
    refetchPromocao()
    setTabelaCampanha(true)
    setTabelaProduto(false)  
    
  }
  const handleClickProduto = () => {
    setCurrentPage(+1)
    refetchListaProdutos()
    setTabelaProduto(true)  
    setTabelaCampanha(false)
    
  }



  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Cadastro de Promoções"]}
        title="Cadsatro de Promoções"
        subTitle={empresaSelecionadaNome}
        // InputFieldDTInicioComponent={InputField}
        // labelInputFieldDTInicio={"Data Início"}
        // valueInputFieldDTInicio={dataPesquisaInicio}
        // onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        // InputFieldDTFimComponent={InputField}
        // labelInputFieldDTFim={"Data Fim"}
        // valueInputFieldDTFim={dataPesquisaFim}
        // onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        
        // InputSelectMarcasComponent={InputSelectAction}
        // labelSelectMarcas={"Por Marca"}
        // optionsMarcas={[
        //   { value: "", label: "Selecione uma Marca" },
        //   ...optionsMarcas.map((item) => {
        //     return {
        //       value: item.IDGRUPOEMPRESARIAL,
        //       label: item.GRUPOEMPRESARIAL
        //     }
        //   })
        // ]}
        // valueSelectMarca={marcaSelecionada}
        // onChangeSelectMarcas={(e) => setMarcaSelecionada(e.value)}
        
        // InputSelectEmpresaComponent={InputSelectAction}
        // labelSelectEmpresa={"Por Empresa"}
        // optionsEmpresas={[
        //   { value: "", label: "Selecione uma Empresa" },
        //   ...optionsEmpresas.map((item) => {
        //     return {
        //       value: item.IDEMPRESA,
        //       label: item.NOFANTASIA
        //     }
        //   })
          
        // ]}
        // valueSelectEmpresa={empresaSelecionada}
        // onChangeSelectEmpresa={handleChangeEmpresa}
        
        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras / Nome Produto"}
        placeHolderInputFieldCodBarra={"Cód.Barras / Nome Produto"}
        valueInputFieldCodBarra={codBarras}
        onChangeInputFieldCodBarra={(e) => setCodBarras(e.target.value)}

        // InputFieldComponent={InputField}
        // labelInputField={"Descrição da Promoção"}
        // placeHolderInputFieldComponent={"Descrição da Promoção"}
        // valueInputField={descricao}
        // onChangeInputField={(e) => setDescricao(e.target.value)}

        // InputFieldNumeroNFComponent={InputField}
        // labelInputFieldNumeroNF={"QTD A partir de"}
        // valueInputFieldNumeroNF={qtdApartirDe}
        // onChangeInputFieldNumeroNF={(e) => setQtdApartirDe(e.target.value)}
        // placeHolderInputFieldNumeroNF={"QTD A partir de"}

        // InputFieldDescricaoComponent={InputField}
        // labelInputFieldDescricao={"QTD A limite de"}
        // placeHolderInputFieldDescricao={"QTD A limite de"}
        // valueInputFieldDescricao={qtdLimite}
        // onChangeInputFieldDescricao={(e) => setQtdLimite(e.target.value)}

        // InputFieldQuantidadeComponent={InputField}
        // labelInputFieldQuantidade={"% Desconto"}
        // valueInputFieldQuantidade={percDesconto}
        // onChangeInputQuantidade={(e) => setPercDesconto(e.target.value)}
        // placeHolderInputFieldQuantidade={"% Desconto"}

        // InputFieldVendaCPFCNPJComponent={InputField}
        // labelInputFieldVendaCPFCNPJ={"Vr Desconto"}
        // placeHolderInputFieldVendaCPFCNPJ={"Vr Desconto"}
        // onChangeInputFieldVendaCPFCNPJ={(e) => setVrDesconto(e.target.value)}
        // valueInputFieldVendaCPFCNPJ={vrDesconto}


        // InputFieldTelefoneComponent={InputField}
        // labelInputFieldTelefone={"Vr A partir de"}
        // placeHolderInputFieldTelefone={"Vr A partir de"}
        // valueInputFieldTelefone={vrApartirDe}
        // onChangeInputFieldTelefone={(e) => setVrApartirDe(e.target.value)}

        // InputFieldSerieComponent={InputField}
        // labelInputFieldSerie={"Vr Limite de"}
        // placeHolderInputFieldSerie={"Vr Limite de"}
        // valueInputFieldSerie={vrLimite}
        // onChangeInputFieldSerie={(e) => setVrLimite(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Produtos"}
        onButtonClickSearch={handleClickProduto}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={(e) => setModalCadastrarPromocao(true)}
        linkNome={"Cadastrar Promoção"}
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />


      {tabelaCampanha && (   
        <div className="card">
          <ActionListaPromocao dadosListaPromocao={dadosListaPromocao}/>
        </div>
      )}

      {tabelaProduto && (
        <div className="card">
          <ActionListaProduto dadosProdutos={dadosProdutos} />
        </div>
      )}

      <ActionCadastrarPromocaoModal
        show={modalCadastrarPromocao}
        handleClose={(e) => setModalCadastrarPromocao(false)}

      />

    </Fragment >
  )
}