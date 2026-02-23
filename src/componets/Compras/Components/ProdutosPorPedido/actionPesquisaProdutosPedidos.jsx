import { Fragment, useState } from "react"
import { InputField } from "../../../Buttons/Input"
import { ActionMain } from "../../../Actions/actionMain"
import { AiOutlineSearch } from "react-icons/ai"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionListaProdutos } from "./actionListaProdutos"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import Swal from "sweetalert2"
import { useEffect } from "react"
import { getDataAtual } from "../../../../utils/dataAtual"


export const ActionPesquisaProdutosPorPedido = () => {
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [descricaoProduto, setDescricaoProduto] = useState('')
  const [codBarrasProduto, setCodBarrasProduto] = useState('')
  const [idProduto, setIDProduto] = useState('')
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')

  useEffect(() => {
    const dataInicio = getDataAtual()
    const dataFinal = getDataAtual()
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFinal)

  }, [])

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000 }
  );

  const fetchProdutos = async () => {
    const urlBase = `/produtos-por-pedido?idFilial=${empresaOrigem}&idProduto=${idProduto}&descricaoProduto=${descricaoProduto}&codBarras=${codBarrasProduto}&idResumoPedido=${numeroPedido}&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}`;
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

  const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchProdutos } = useQuery(
    ['produtos-entre-filiais',],
    () => fetchProdutos(),
    { enabled: false, }
  );


  const handleClick = () => {
    refetchProdutos()    
  }


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={[""]}
        title="Produtos por Pedido"
        subTitle="Nome da Loja"

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Filial Origem"}
        optionsEmpresas={[
          { value: '', label: 'Selecionar Empresa' },
          ...optionsEmpresas.map((item) => {
            return {
              value: item.IDEMPRESA,
              label: item.NOFANTASIA
            }
          })
        ]}
        valueSelectEmpresa={empresaOrigem}
        onChangeSelectEmpresa={(e) => setEmpresaOrigem(e.value)}

        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Nº Pedido"}
        placeHolderInputFieldCodBarra={"Nº Pedido"}
        valueInputFieldCodBarra={numeroPedido}
        onChangeInputFieldCodBarra={(e) => setNumeroPedido(e.target.value)}

        InputFieldComponent={InputField}
        labelInputField={"Cód.Barras "}
        valueInputField={codBarrasProduto}
        onChangeInputField={(e) => setCodBarrasProduto(e.target.value)}
        placeHolderInputFieldComponent={"Cód.Barras / Nome Produto"}

        InputFieldNumeroNFComponent={InputField}
        labelInputFieldNumeroNF={"Id. Produto"}
        valueInputFieldNumeroNF={idProduto}
        onChangeInputFieldNumeroNF={(e) => setIDProduto(e.target.value)}
        placeHolderInputFieldNumeroNF={"Id. Produto"}

        InputFieldDescricaoComponent={InputField}
        labelInputFieldDescricao={"Descrição"}
        valueInputFieldDescricao={descricaoProduto}
        onChangeInputFieldDescricao={(e) => setDescricaoProduto(e.target.value)}
        placeHolderInputFieldDescricao={"Descrição do Produto"}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      <ActionListaProdutos dadosProdutos={dadosProdutos} />
    </Fragment>
  )
}