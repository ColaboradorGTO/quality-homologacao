import { Fragment, useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { ActionListaPremiacoes } from "./ActionListaPremiacao";


export const ActionPesquisaPremiacoes = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [dadosListaPremiacoes, setDadosListaPremiacoes] = useState([]);

  useEffect(() => {
    getGrupoEmpresas()
  }, [])


  const getGrupoEmpresas = async () => {
    try {
      const response = await get(`/listaGrupoEmpresas`)
      if (response.data) {
        setMarcas(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const getListaPremiacoes = async () => {
    try {
      const response = await get(`/listaPremiacoes?page=`)
      if (response.data) {
        setDadosListaPremiacoes(response.data)
      }
      return response.data
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }


  }


  const handleSelectMarca = (e) => {
    const selectId = e.target.value;

    if (!isNaN(selectId)) {
      setMarcaSelecionada(selectId)
    }
  }

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      getListaPremiacoes(marcaSelecionada)
    }

  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Premiações"]}
        title="Premiações por Marcas e Período"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}


        InputSelectEmpresaComponent={InputSelectAction}
        onChangeSelectEmpresa={handleSelectMarca}
        valueSelectEmpresa={marcaSelecionada}
        optionsEmpresas={[

          { value: '', label: 'Selecione a Marca' },
          ...marcas.map((empresa) => ({
            value: empresa.IDGRUPOEMPRESARIAL,
            label: empresa.GRUPOEMPRESARIAL,
          }))
        ]}

        labelSelectEmpresa={"Marca"}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Listar Premiações Cadastradas"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Criar Premiações"}
        onButtonClickCadastro
        corCadastro={"danger"}
        IconCadastro={IoIosAdd}

      />

      {tabelaVisivel && (
        <ActionListaPremiacoes dadosListaPremiacoes={dadosListaPremiacoes} />

      )}
    </Fragment>
  )
}