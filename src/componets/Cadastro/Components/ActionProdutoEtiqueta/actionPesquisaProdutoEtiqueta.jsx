import { Fragment, useEffect, useState } from "react"
import { InputField } from "../../../Buttons/Input"
import { ButtonSearch } from "../../../Buttons/ButtonSearch"
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
  const [produtoPesquisado, setProdutoPesquisado] = useState('')
  const [descricaoProduto, setDescricaoProduto] = useState('')
  const [codBarrasProduto, setCodBarrasProduto] = useState('')
  const [dadosEmpresas, setDadosEmpresas] = useState([])
  const [idProduto, setIDProduto] = useState('')

  useEffect(() => {
    
    getListaEmpresas()
  }, [])

  const { data: dadosEmpresa = [] } = useFetchData('empresas', '/empresas');
  const { data: dadosListaPrecos = [] } = useFetchData('lista-de-preco', '/lista-de-preco');

  // const groupedCores = dadosListaPrecos.reduce((acc, item) => {
  //   const group = item.listaPreco.NOMELISTA || "Outras Marcas"; r
  //   const option = { value: item.detalheLista.loja.IDEMPRESA, label: item.detalheLista.loja.NOFANTASIA };

  //   const groupIndex = acc.findIndex((g) => g.label === group);
  //   if (groupIndex !== -1) {
  //     acc[groupIndex].options.push(option);
  //   } else {
  //     acc.push({ label: group, options: [option] });
  //   }
  //   return acc;
  // }, []);

  const getListaEmpresas = async () => {
    try {
        const response = await get(`/lista-de-preco`);
        if (response.data && response.data.length > 0) {
            const empresas = response.data.map(item => ({
                value: item.listaPreco && item.listaPreco.IDRESUMOLISTAPRECO,
                label: item.listaPreco && item.listaPreco.NOMELISTA
            })).filter(item => item.value && item.label); // Filtrar itens com valores válidos
            setDadosEmpresas(empresas);
           
        }
        return response.data;
    } catch (error) {
        console.log('Erro ao buscar empresas: ', error);
    }
};


  const getListaProdutosSAP = async () => {
    try {
      const response = await get(`/lista-produtos-etiqueta-sap?idLista=${empresaSelecionada}&idProduto=${idProduto}&descricao=${descricaoProduto}&codeBars=${codBarrasProduto}`)
      if (response.data) {
       
        setDadosListaPrecosSap(response.data)
        console.log(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }


  const handleChangeEmpresa = (e) => {
    setEmpresaSelecionada(e.value)
  }

  const handleClick = () => {
    getListaProdutosSAP()
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={[""]}
        title="Etiquetagem"
        subTitle="Nome da Loja"

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Lista de Preço"}
        optionsEmpresas={[
          {value: '', label: 'Selecione uma empresa'},
          ...dadosEmpresas
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}

        InputFieldComponent={InputField}
        labelInputField={"Id. Produto"}
        valueInputField={idProduto}
        onChangeInputField={(e) => setIDProduto(e.target.value)}
        placeHolderInputFieldComponent={"Id. Produto"}

        InputFieldDescricaoComponent={InputField}
        labelInputFieldDescricao={"Descrição"}
        valueInputFieldDescricao={descricaoProduto}
        onChangeInputFieldDescricao={(e) => setDescricaoProduto(e.target.value)}
        placeHolderInputFieldDescricao={"Descrição do Produto"}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras "}
        valueInputFieldCodBarra={codBarrasProduto}
        onChangeInputFieldCodBarra={(e) => setCodBarrasProduto(e.target.value)}
        placeHolderInputFieldCodBarra={"Cód.Barras / Nome Produto"}
        
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
