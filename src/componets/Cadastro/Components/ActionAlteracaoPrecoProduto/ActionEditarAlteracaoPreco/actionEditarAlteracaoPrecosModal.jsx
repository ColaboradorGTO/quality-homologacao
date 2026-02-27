import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { get, put } from "../../../../../api/funcRequest"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import Swal from 'sweetalert2'
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../../utils/toFloat";


export const ActionEditarAlteracaoPrecosModal = ({ show, handleClose, dadosDetalheAlteracao }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [descricao, setDescricao] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState([])
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
  const [listaGrupoEstrutura, setListaGrupoEstrutura] = useState([])
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const [dadosEmpresas, setDadosEmpresas] = useState([])
  const [rowClick, setRowClick] = useState(true);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getListaGrupoEstrutura()
    getListaEmpresas()
  }, [])

  const getListaEmpresas = async () => {
    try {
      const response = await get(`/empresas`)
      if (response.data) {
        setDadosEmpresas(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const getListaGrupoEstrutura = async () => {
    try {
      const response = await get(`/grupoEstrutura`)
      if (response.data) {
        setListaGrupoEstrutura(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
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
    const response = await fetch('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data);
    }
    return response.data;
  }

  const onSubmit = async () => {
    const postData = {

      STATIVO: statusSelecionado,
    }

    const response = await put('/sub-grupo-estrutura/:id', postData)
      .then(response => {

        // Limpar os campos do formulário


        console.log(response, 'despesa cadastrada com sucesso front end!')
      })


    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cadastrado com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {

        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(error)
      })
  }

  const handleChangeStatus = (e) => {
    setStatusSelecionado(e.value)
  }

  const dados = dadosDetalheAlteracao.map((item, index) => {
    let contador = index + 1;
    return {

      contador,
      IDRESUMOALTERACAOPRECOPRODUTO: item.produto.IDRESUMOALTERACAOPRECOPRODUTO,
      IDPRODUTO: item.produto.IDPRODUTO,
      DTCADASTRO: item.produto.DTCADASTRO,
      DSNOME: item.produto.DSNOME,
      NUCODBARRAS: item.produto.NUCODBARRAS,
      STATIVO: item.STATIVO == 'True' ? true : false,
      PRECOVENDAANTERIOR: item.produto.PRECOVENDAANTERIOR,
      PRECOVENDANOVO: item.produto.PRECOVENDANOVO,
      QTDESTOQUEAOCADASTRAR: item.produto.QTDESTOQUEAOCADASTRAR,
      QTDESTOQUEATUAL: item.produto.QTDESTOQUEATUAL,
      quantidadeEstoque: item.STEXECUTADO != 'False' ? true : false ? item.produto.QTDESTOQUEAOCADASTRAR : item.produto.QTDESTOQUEATUAL,
    }
  })

  const colunasDetalhes = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DTCADASTRO',
      header: 'Dt. Cadastro',
      body: row => <th>{row.DTCADASTRO}</th>,
      sortable: true,
    },
    {
      field: 'IDPRODUTO',
      header: 'ID Produto',
      body: row => {
        return (
          <th>{row.IDPRODUTO}</th>
        )

      },
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descriçao Produto',
      body: row => {
        return (
          <th>{row.DSNOME}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cod. Barras',
      body: row => {
        return (
          <th>{row.NUCODBARRAS}</th>
        )

      },
      sortable: true,
    },
    {
      field: 'PRECOVENDAANTERIOR',
      header: 'Preço Antigo',
      body: row => {
        return (
          <p>{row.PRECOVENDAANTERIOR}</p>
        )

      },
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Preço Novo',
      body: row => {
        return (
          <p>{row.NOFANTASIA}</p>
        )

      },
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Estoque',
      body: row => {
        return (
          <p>{row.NOFANTASIA}</p>
        )

      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Status',
      body: row => {
        return (
          <p style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }} >{row.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'}</p>
        )
      },
      sortable: true,
    },


  ]

  const optionsStatus = [
    { value: 'True', label: 'CANCELADA' },
    { value: 'False', label: 'EM ESPERA' },
    { value: 'FINALIZADA', label: 'FINALIZADA' }
  ]

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="xl"
        centered
      >

        <HeaderModal
            title={"Edição de Alteração de Preços"}
            subTitle={`Alteração de Preço Nº: ${dadosDetalheAlteracao[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}`}
          handleClose={handleClose}
        />


        <Modal.Body>
          <form action="">
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Data Criação *"}
                    type={"date"}

                    id={"dtCreateListaPreco"}
                    value={""}
                    onChangeModal={""}
                    readOnly={true}
                    {...register("dtCreateListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Data Alteração *"}
                    type={"date"}

                    id={"dtAlterListaPreco"}
                    value={""}
                    onChangeModal={""}

                    {...register("dtAlterListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>

              <div className="row mt-4">
                <div className="col-sm-6 col-xl-3">

                  <label htmlFor="">Status Alteração *</label>
                  <Select

                    defaultValue={statusSelecionado}
                    options={optionsStatus.map((item) => {
                      return {
                        value: item.value,
                        label: item.label
                      }
                    })}
                    onChange={handleChangeStatus}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Alteração "}
                    type={"text"}

                    id={"idListaPreco"}
                    value={dadosDetalheAlteracao[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}
                    onChangeModal={""}

                    {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Lista Alvo de Alteração *"}
                    type={"text"}

                    id={"nomeListaPreco"}
                    value={dadosDetalheAlteracao[0]?.listaPreco.NOMELISTA}
                    onChangeModal={""}

                    {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>

              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Qtd. Produtos"}
                    type={"text"}

                    id={"idListaPreco"}
                    value={toFloat(dadosDetalheAlteracao[0]?.alteracaoPreco.QTDITENS)}
                    onChangeModal={''}

                    {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Responsável "}
                    type={"text"}

                    id={"nomeListaPreco"}
                    value={""}
                    onChangeModal={""}

                    {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>

            </div>

            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              onClickButtonFechar={handleClose}
              textButtonFechar={"Fechar"}
              corFechar={"secondary"}

              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar
              textButtonCadastrar={"Salvar"}
              corCadastrar={"success"}
              loadingTextCadastrar={"Cadastrando..."}
              autoLoadingCadastrar={true}
            />

          </form>
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}