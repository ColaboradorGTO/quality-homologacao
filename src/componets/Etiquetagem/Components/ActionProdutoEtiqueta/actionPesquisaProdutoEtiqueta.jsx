import { Fragment, useState } from "react"
import { InputField } from "../../../Buttons/Input"
import { ActionMain } from "../../../Actions/actionMain"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSearch } from "react-icons/ai"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionListaProdutoEtiqueta } from "./actionListaProdutoEtiqueta"
import { ButtonType } from "../../../Buttons/ButtonType"
import { useFetchData } from "../../../../hooks/useFetchData"


export const ActionPesquisaProdutoEtiqueta = () => {
  const [dadosListaPrecosSap, setDadosListaPrecosSap] = useState([])
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [descricaoProduto, setDescricaoProduto] = useState('')
  const [codBarrasProduto, setCodBarrasProduto] = useState('')
  const [idProduto, setIDProduto] = useState('')
  
 
  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEerrorEmpresas } = useFetchData('listaEmpresasComercial', `/listaEmpresaComercial`);
  const { data: dadosListaPrecos = [] } = useFetchData('listas-de-precos-sap', '/listas-de-precos-sap');

  const getListaProdutosSAP = async () => {
    try {
      const response = await get(`/lista-produtos-etiqueta-sap?idLista=${empresaSelecionada}&idProduto=${idProduto}&descricao=${descricaoProduto}&codeBars=${codBarrasProduto}`)
      if (response.data) {
       
        setDadosListaPrecosSap(response.data)
    
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }



  const handleClick = () => {
    getListaProdutosSAP();
  }



  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={[""]}
        title="Etiquetagem"
        subTitle="Nome da Loja"

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={[
          {value: '', label: 'Selecionar Empresa'},
          ...optionsEmpresas.map((item) => {
            return {
              value: item.IDEMPRESA,
              label: item.NOFANTASIA
            }
          })
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={(e) => setEmpresaSelecionada(e.value)}


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
   
      <ActionListaProdutoEtiqueta dadosListaPrecosSap={dadosListaPrecosSap} />
    </Fragment>
  )
}