import { Fragment } from "react"
import { ActionMain } from "../../../../Actions/actionMain"
import { InputField } from "../../../../Buttons/Input"
import { ButtonType } from "../../../../Buttons/ButtonType"
import { InputSelectAction } from "../../../../Inputs/InputSelectAction"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdAdd, IoMdCheckmark } from "react-icons/io"
import { ActionCadastrarModal } from "./CadastrarSolicitacao/actionCadastrarModal"
import { ActionListaAdiantamento } from "./actionListaSolicitarAdiantamento"
import { Departamentos } from "../../../../../../parceiro.json";
import { usePesquisa } from "../hooks/usePesquisa"

export const ActionPesquisaCriarAdiantamento = ({usuarioLogado, ID }) => {
  const {
    dataPesquisaInicio,
    setDataPesquisaInicio,
    dataPesquisaFim,
    setDataPesquisaFim,
    statusSelecionado,
    setStatusSelecionado,
    departamentoSelecionado,
    setDepartamentoSelecionado,
    modal,
    setModal,
    dadosAdiantamentos,
    optionsModulos,
    handleShowModal,
    options,
    handleKeyPress,
    handleClick
  } = usePesquisa({ usuarioLogado })

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Adiantamento Salarial"]}
        title="Adiantamentos Departamentos"
        
        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicio={handleKeyPress}
        
        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFim={handleKeyPress}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas="Departamentos"
        optionsMarcas={[
          {value: '', label: 'Selecione um Departamento'},
          ...Departamentos.map((item) => ({
            value: item.value,
            label: item.label
          }))
        ]}
        valueSelectMarca={departamentoSelecionado}
        onChangeSelectMarcas={(e) => setDepartamentoSelecionado(e.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        onChangeSelectEmpresa={(e) => setStatusSelecionado(e.value)}
        valueSelectEmpresa={statusSelecionado}
        optionsEmpresas={[
          { value: '', label: 'Selecione um status' },
          ...options.map((empresa) => ({
            value: empresa.value,
            label: empresa.label,
          }))
        ]}
        labelSelectEmpresa={"Status"}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar"}
        corCadastro={"success"}
        onButtonClickCadastro={handleShowModal}
        IconCadastro={IoMdAdd}


      />

      <ActionListaAdiantamento
        dadosAdiantamentos={dadosAdiantamentos}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}
      />
    
      <ActionCadastrarModal 
        show={modal}
        handleClose={() => setModal(false)}
        handleClick={handleClick}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
      
    </Fragment>
  )
}