import { Fragment, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { get, post, put } from "../../../../../api/funcRequest";
import Select from 'react-select';
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { mascaraCPF, removerMascaraCPF } from "../../../../../utils/formatCPF";
import { mascaraValor } from "../../../../../utils/mascaraValor";


export const ActionCadastrarFuncionarioModal = ({ show, handleClose, }) => {
  const { register, handleSubmit, errors } = useForm();
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [subGrupoEmpresarialSelecionado, setSubGrupoEmpresarialSelecionado] = useState('');
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('');
  const [cpfFuncionario, setCPFFuncionario] = useState('');
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [localizacaoSelcionada, setLocalizacaoSelecionada] = useState('');
  const [categoriaContratacao, setCategoriaContratacao] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [valorSalario, setValorSalario] = useState('');
  const [valorDesconto, setValorDesconto] = useState(0);
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [senha, setSenha] = useState('');
  const [cpf, setCPF] = useState('');
  const [ipUsuario, setIpUsuario] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataAdmissao(dataAtual)
  }, [])

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/');
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  };


  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const { data: optionsCPF = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
    ['funcionarios-loja', cpfFuncionario],
    async () => {
      const response = await get(`/funcionarios-loja?cpf=${cpfFuncionario}`);
      return response.data;
    },
    { enabled: cpfFuncionario.length === 11, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );


  useEffect(() => {
    if (optionsCPF && optionsCPF.length > 0) {
      Swal.fire({
        title: 'Cliente já cadastrado!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'custom-swal',
        }
      });
    }
  }, [optionsCPF]);


  const handleRadioChange = (event) => {
    const { id } = event.target;
    if (id === 'radioCLT') {
      setCategoriaContratacao('CLT');
    } else if (id === 'radioPJ') {
      setCategoriaContratacao('PJ');
    }
  };



  const onSubmit = async (e) => {
    const cpfSemMascara = removerMascaraCPF(cpfFuncionario);

    const funcao = usuarioLogado?.DSFUNCAO;
    if (funcao !== 'TI') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Usuário não tem permissão para desconto maior ou igual há 20%',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (parseFloat(valorDesconto) > 50) {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Valor Desconto maior que permitido',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (cpfSemMascara.length !== 11) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'CPF Inválido ou Incompleto',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const putData = {
      IDSUBGRUPOEMPRESARIAL: subGrupoEmpresarialSelecionado,
      IDEMPRESA: empresaSelecionada,
      NOFUNCIONARIO: nomeFuncionario,
      NUCPF: cpfSemMascara,
      PWSENHA: cpfSemMascara.substring(0, 5),
      DSFUNCAO: funcaoSelecionada,
      VALORSALARIO: valorSalario,
      PERC: valorDesconto,
      STATIVO: 'True',
      DSTIPO: tipoSelecionado,
      VALORDISPONIVEL: 0,
      STCONVENIO: isChecked,
      STDESCONTOFOLHA: isChecked,
      STLOJA: localizacaoSelcionada,
      DATA_ADMISSAO: dataAdmissao,
    }

    try {
      const response = await post('/criar-funcionarios-loja', putData)

      setEmpresaSelecionada('');
      setNomeFuncionario('');
      setCPFFuncionario('');
      setValorSalario('');
      setValorDesconto(0);
      setTipoSelecionado('');
      setLocalizacaoSelecionada('');

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      const textoFuncao = 'RH/UPDATE DE FUNCIONARIOS';


      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)


      return responsePost.data;
    } catch (error) {
      Swal.fire({
        title: 'Erro ao Atualizar',
        text: 'Erro ao Tentar Atualizar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      console.error('Erro ao parsear o usuário do localStorage:', error);
    }
  }

  const handleChangeEmpresa = (e) => {
    setEmpresaSelecionada(e.value);
    const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
    setSubGrupoEmpresarialSelecionado(empresa.IDSUBGRUPOEMPRESARIAL);
  }

  const funcoes = [
    {
      id: 0,
      label: "Selecione...",
      value: "Selecione..."
    },
    {
      id: 1,
      label: "Advogado",
      value: "Advogado"
    },
    {
      id: 2,
      label: "Analista De Rh",
      value: "Analista De Rh"
    },
    {
      id: 3,
      label: "Analista De Rh Pleno",
      value: "Analista De Rh Pleno"
    },
    {
      id: 4,
      label: "Analista De Suporte",
      value: "Analista De Suporte"
    },
    {
      id: 5,
      label: "Ass Controle De Qualidade Trainee",
      value: "Ass Controle De Qualidade Trainee"
    },
    {
      id: 6,
      label: "Assistente",
      value: "Assistente"
    },
    {
      id: 7,
      label: "Assistente De Atendimento (PCD)",
      value: "Assistente De Atendimento (PCD)"
    },
    {
      id: 8,
      label: "Assistente De Compras Trainee",
      value: "Assistente De Compras Trainee"
    },
    {
      id: 9,
      label: "Assistente De Loja",
      value: "Assistente De Loja"
    },
    {
      id: 10,
      label: "Assistente De Loja Pleno",
      value: "Assistente De Loja Pleno"
    },
    {
      id: 11,
      label: "Assistente De Loja-PCD",
      value: "Assistente De Loja-PCD"
    },
    {
      id: 12,
      label: "Assistente De Rh",
      value: "Assistente De Rh"
    },
    {
      id: 13,
      label: "Assistente Dept Fiscal",
      value: "Assistente Dept Fiscal"
    },
    {
      id: 14,
      label: "Aux De Servicos Gerais",
      value: "Aux De Servicos Gerais"
    },
    {
      id: 15,
      label: "Aux Serv Gerais",
      value: "Aux Serv Gerais"
    },
    {
      id: 16,
      label: "Auxiliar Administrativo",
      value: "Auxiliar Administrativo"
    },
    {
      id: 17,
      label: "Auxiliar De Deposito",
      value: "Auxiliar De Deposito"
    },
    {
      id: 18,
      label: "Auxiliar De Loja-PCD",
      value: "Auxiliar De Loja-PCD"
    },
    {
      id: 19,
      label: "Auxiliar De Servicos Gerais",
      value: "Auxiliar De Servicos Gerais"
    },
    {
      id: 20,
      label: "Auxiliar Juridico",
      value: "Auxiliar Juridico"
    },
    {
      id: 21,
      label: "Balconista",
      value: "Balconista"
    },
    {
      id: 22,
      label: "CLIENTE",
      value: "CLIENTE"
    },
    {
      id: 23,
      label: "Carga E Descarga",
      value: "Carga E Descarga"
    },
    {
      id: 24,
      label: "Pedido Compras",
      value: "Pedido Compras"
    },
    {
      id: 25,
      label: "Comprador Jr",
      value: "Comprador Jr"
    },
    {
      id: 26,
      label: "Compradora",
      value: "Compradora"
    },
    {
      id: 27,
      label: "Compradora Junior",
      value: "Compradora Junior"
    },
    {
      id: 28,
      label: "Compradora Pleno II",
      value: "Compradora Pleno II"
    },
    {
      id: 29,
      label: "Compradora Trainee",
      value: "Compradora Trainee"
    },
    {
      id: 30,
      label: "Conferente",
      value: "Conferente"
    },
    {
      id: 31,
      label: "Coordenador De Logistica",
      value: "Coordenador De Logistica"
    },
    {
      id: 32,
      label: "Coordenador Dept Fiscal",
      value: "Coordenador Dept Fiscal"
    },
    {
      id: 33,
      label: "Coordenador(a) De Arquivo",
      value: "Coordenador(a) De Arquivo"
    },
    {
      id: 34,
      label: "Costureira",
      value: "Costureira"
    },
    {
      id: 35,
      label: "Cozinheira",
      value: "Cozinheira"
    },
    {
      id: 36,
      label: "DIRETORA",
      value: "DIRETORA"
    },
    {
      id: 37,
      label: "Encarregado Administrativo",
      value: "Encarregado Administrativo"
    },
    {
      id: 38,
      label: "Encarregado De Obras",
      value: "Encarregado De Obras"
    },
    {
      id: 39,
      label: "Encarregado De Transportes",
      value: "Encarregado De Transportes"
    },
    {
      id: 40,
      label: "Encarregado Setor",
      value: "Encarregado Setor"
    },
    {
      id: 41,
      label: "Estoquista",
      value: "Estoquista"
    },
    {
      id: 42,
      label: "Financeiro",
      value: "Financeiro"
    },
    {
      id: 43,
      label: "Fiscal De Loja",
      value: "Fiscal De Loja"
    },
    {
      id: 44,
      label: "Fiscal De Loja 0004",
      value: "Fiscal De Loja 0004"
    },
    {
      id: 45,
      label: "Gerente",
      value: "Gerente"
    },
    {
      id: 46,
      label: "Gestor De Secao",
      value: "Gestor De Secao"
    },
    {
      id: 47,
      label: "Gestor De Secao Pleno-Nivel 2",
      value: "Gestor De Secao Pleno-Nivel 2"
    },
    {
      id: 48,
      label: "Gestor(a) De Secao",
      value: "Gestor(a) De Secao"
    },
    {
      id: 49,
      label: "Marketing",
      value: "Marketing"
    },
    {
      id: 50,
      label: "Mecanico",
      value: "Mecanico"
    },
    {
      id: 51,
      label: "Menor Aprendiz",
      value: "Menor Aprendiz"
    },
    {
      id: 52,
      label: "Motorista",
      value: "Motorista"
    },
    {
      id: 53,
      label: "Operador De Caixa",
      value: "Operador De Caixa"
    },
    {
      id: 54,
      label: "Operador(a) De Caixa",
      value: "Operador(a) De Caixa"
    },
    {
      id: 55,
      label: "Operadora De Caixa",
      value: "Operadora De Caixa"
    },
    {
      id: 56,
      label: "Prevencao e Perda",
      value: "Prevencao e Perda"
    },
    {
      id: 57,
      label: "Recepcionista",
      value: "Recepcionista"
    },
    {
      id: 58,
      label: "Socio Administrador",
      value: "Socio Administrador"
    },
    {
      id: 59,
      label: "Sub Gerente",
      value: "Sub Gerente"
    },
    {
      id: 60,
      label: "Supervisor",
      value: "Supervisor"
    },
    {
      id: 61,
      label: "Supervisor De Compras",
      value: "Supervisor De Compras"
    },
    {
      id: 62,
      label: "TI",
      value: "TI"
    },
    {
      id: 63,
      label: "Tecnico De Informatica",
      value: "Tecnico De Informatica"
    },
    {
      id: 64,
      label: "Tecnico(a) De Arquivo",
      value: "Tecnico(a) De Arquivo"
    },
    {
      id: 65,
      label: "Vendedor",
      value: "Vendedor"
    },
    {
      id: 66,
      label: "Vendedora",
      value: "Vendedora"
    }
  ]

  const localizacao = [
    {
      label: "Loja",
      value: "True"
    },
    {
      label: "Escritório",
      value: "False"
    }
  ]

  const situacao = [
    {
      label: "Ativo",
      value: "True"
    },
    {
      label: "Inativo",
      value: "False"
    }
  ]

  const tipo = [
    {
      id: 1,
      label: "Selecione...",
      value: "0"
    },
    {
      id: 2,
      label: "Funcionário",
      value: "FUNCIONARIO"
    },
    {
      id: 3,
      label: "Parceiro de Negócios Apoio",
      value: "PN"
    },
    {
      id: 4,
      label: "Parceiro de Negócios PJ",
      value: "PN"
    }
  ]

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >


        <HeaderModal
          title={"Dados do Funcionário"}
          subTitle={"Cadastrar ou Atualizar Informações do Funcionário"}
          handleClose={handleClose}
        />


        <Modal.Body>



          <div className="row">
            <div className="col-sm-6 col-md-6 col-xl-6">
              <label className="form-label" htmlFor="empresaFuncionario">Empresa</label>

              <Select
                className="basic-single"
                classNamePrefix={"select"}
                options={optionsEmpresas.map((item) => ({
                  value: item.IDEMPRESA,
                  label: item.NOFANTASIA

                }))}
                defaultValue={empresaSelecionada}
                onChange={handleChangeEmpresa}
              />
            </div>
            <div className="col-sm-6 col-md-6 col-xl-6">
              <label className="form-label" htmlFor="funcaoFuncionario">Função</label>
              <Select
                className="basic-single"
                classNamePrefix={"select"}
                options={funcoes.map((item) => ({
                  value: item.value,
                  label: item.label

                }))}
                defaultValue={funcaoSelecionada}
                onChange={(e) => setFuncaoSelecionada(e.value)}
              />
            </div>

          </div>
          <div className="row mt-4">
            <div className="col-sm-6 col-md-6 col-xl-6">
              <label className="form-label">Tipo</label>
              <Select
                className="basic-single"
                classNamePrefix={"select"}
                options={tipo.map((item) => ({
                  value: item.value,
                  label: item.label

                }))}
                defaultValue={'Selecione...'}
                onChange={(e) => setTipoSelecionado(e.value)}
              />
            </div>
            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                type="date"
                className="form-control input"
                label="Data Admissão"
                value={dataAdmissao}
                onChangeModal={e => setDataAdmissao(e.target.value)}

              />
            </div>
          </div>


          <div className="row mt-4">
            <div className="col-sm-4 col-xl-4">
              <InputFieldModal
                type="text"
                className="form-control input"
                label="CPF"
                value={mascaraCPF(cpfFuncionario)}
                onChangeModal={e => setCPFFuncionario(e.target.value)}

              />
            </div>
            <div className="col-sm-8 col-xl-8">
              <InputFieldModal
                type="text"
                className="form-control input"

                label="Funcionário"
                value={nomeFuncionario}
                onChangeModal={e => setNomeFuncionario(e.target.value)}

              />
            </div>
          </div>



          <div className="row mt-4">
            <div className="col-sm-6 col-xl-16">
              <label htmlFor="">Localização</label>
              <Select
                className="basic-single"
                classNamePrefix={"select"}
                options={localizacao.map((item) => ({
                  value: item.value,
                  label: item.label

                }))}
                defaultValue={localizacaoSelcionada}
                onChange={(e) => setLocalizacaoSelecionada(e.value)}
              />
            </div>
            <div className="col-sm-16 col-xl-16">
              <label className="form-label">Categoria de Contratação</label>
              <div className="form-check">
                <label className="form-check-label" htmlFor="radioCLT">
                  <input
                    id="radioCLT"
                    type="radio"
                    className="form-check-input"
                    name="radioCategoria"
                    onChange={handleRadioChange}
                  /> CLT
                </label>
                <label className="form-check-label" htmlFor="radioPJ">
                  <input
                    id="radioPJ"
                    type="radio"
                    className="form-check-input"
                    name="radioCategoria"
                    onChange={handleRadioChange}
                  /> PJ
                </label>
              </div>

            </div>
          </div>




          <div className="row mt-4">
            <div className="col-sm-4 col-xl-4">
              <InputFieldModal
                type="text"
                className="form-control input"
                label="Valor Salário"
                value={valorSalario}
                onChangeModal={e => setValorSalario(e.target.value)}

              />
            </div>
            <div className="col-sm-4 col-xl-4">

              <InputFieldModal
                type="text"
                className="form-control input"
                placeholder={"0,00"}
                label="% Desc. Conv."
                value={valorDesconto}
                onChangeModal={e => setValorDesconto(e.target.value)}

              />
            </div>
            <div className="col-sm-4 col-xl-4">
              <InputFieldModal
                type="text"
                className="form-control input"
                readOnly={true}
                label="Valor Desc."
                value={valorDesconto}
                onChangeModal={e => setValorDesconto(e.target.value)}

              />
            </div>
          </div>


          <div className="row mt-4">

            <div className="col-sm-6 col-xl-6">
              <label className="form-label" htmlFor="stativofuncionario">Situação</label>

              <Select
                className="basic-single"
                classNamePrefix={"select"}
                options={situacao.map((item) => ({
                  value: item.value,
                  label: item.label
                }))}
                defaultValue={[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo'}
                onChange={(e) => setSituacaoSelecionada(e.value)}
              />
            </div>
          </div>


          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"

            ButtonTypeConfirmar={ButtonTypeModal}
            textButtonConfirmar={"Atualizar"}
            onClickButtonConfirmar={handleSubmit(onSubmit)}
            corConfirmar="success"

          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
