import React, { Fragment } from "react"
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaFuncionarios } from "./actionListaFuncionarios";
import { ActionCadastrarFuncionarioModal } from "./ActionCadastrar/actionCadastrarFuncionario";
import { IoIosAdd } from "react-icons/io";
import { situacao } from "../../../../../parceiro.json";
import { usePesquisaFuncionarios } from "./hooks/usePesquisaFuncionarios";

export const ActionPesquisaFuncionarios = ({ usuarioLogado, ID }) => {
  const {
    empresaSelecionada,
    empresaSelecionadaNome,
    cpfInput,
    setCpfInput,
    situacaoSelecionada,
    setSituacaoSelecionada,
    modalCadastro,
    setModalCadastro,
    optionsModulos,
    optionsEmpresas,
    dadosFuncionarios,
    handleChangeEmpresa,
    handleCadastro,
    handleClick,
    refetch,
  } = usePesquisaFuncionarios({ usuarioLogado, ID });

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Funcionários das Lojas"]}
        title="  Lista dos funcionários das Lojas"
        subTitle={empresaSelecionadaNome}

        InputFieldVendaCPFCNPJComponent={InputField}
        labelInputFieldVendaCPFCNPJ={"Nome / CPF"}
        valueInputFieldVendaCPFCNPJ={cpfInput}
        onChangeInputFieldVendaCPFCNPJ={(e) => setCpfInput(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione a Empresa' },
          ...optionsEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          }))
        ]}
        labelSelectEmpresa={"Empresas"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}

        InputSelectGrupoComponent={InputSelectAction}
        optionsGrupos={situacao?.map((item) => ({
          value: item.value,
          label: item.label
        }))
        }
        labelSelectGrupo={"Situação"}
        valueSelectGrupo={situacaoSelecionada}
        onChangeSelectGrupo={(e) => setSituacaoSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar "}
        onButtonClickCadastro={handleCadastro}
        corCadastro={"success"}
        IconCadastro={IoIosAdd}

      />

      <ActionListaFuncionarios
        dadosFuncionarios={dadosFuncionarios}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}
        refetch={refetch}
      />

      <ActionCadastrarFuncionarioModal
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        refetch={refetch}
      />
    </Fragment>
  )
}
