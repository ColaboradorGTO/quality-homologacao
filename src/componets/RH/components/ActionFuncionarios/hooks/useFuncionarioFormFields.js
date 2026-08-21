import { useState } from "react";

export const useFuncionarioFormFields = ({ valorSalarioInicial = '' } = {}) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [subGrupoEmpresarialSelecionado, setSubGrupoEmpresarialSelecionado] = useState('');
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('');
  const [cpfFuncionario, setCPFFuncionario] = useState('');
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [localizacaoSelcionada, setLocalizacaoSelecionada] = useState('');
  const [categoriaContratacao, setCategoriaContratacao] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [valorSalario, setValorSalario] = useState(valorSalarioInicial);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [cpf, setCPF] = useState('');
  const [excecao, setExcecao] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formularioVisivelLogin, setFormularioVisivelLogin] = useState(false);
  const [formularioVisivel, setFormularioVisivel] = useState(true);
  const [usuario, setUsuario] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [repitaSenha, setRepitaSenha] = useState('');
  const [noLogin, setNoLogin] = useState('');
  const [telefone, setTelefone] = useState('');
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('');

  return {
    empresaSelecionada, setEmpresaSelecionada,
    subGrupoEmpresarialSelecionado, setSubGrupoEmpresarialSelecionado,
    funcaoSelecionada, setFuncaoSelecionada,
    cpfFuncionario, setCPFFuncionario,
    nomeFuncionario, setNomeFuncionario,
    localizacaoSelcionada, setLocalizacaoSelecionada,
    categoriaContratacao, setCategoriaContratacao,
    dataAdmissao, setDataAdmissao,
    valorSalario, setValorSalario,
    valorDesconto, setValorDesconto,
    situacaoSelecionada, setSituacaoSelecionada,
    tipoSelecionado, setTipoSelecionado,
    isChecked, setIsChecked,
    cpf, setCPF,
    excecao, setExcecao,
    isLoggedIn, setIsLoggedIn,
    formularioVisivelLogin, setFormularioVisivelLogin,
    formularioVisivel, setFormularioVisivel,
    usuario, setUsuario,
    senhaLogin, setSenhaLogin,
    senha, setSenha,
    repitaSenha, setRepitaSenha,
    noLogin, setNoLogin,
    telefone, setTelefone,
    departamentoSelecionado, setDepartamentoSelecionado,
  };
};
