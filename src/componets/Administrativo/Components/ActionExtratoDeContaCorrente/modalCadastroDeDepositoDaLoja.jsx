import React, { Fragment, useEffect, useState } from "react"
import { AiOutlineCloseCircle } from "react-icons/ai"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import Select from 'react-select';
import { get, post, put } from "../../../../api/funcRequest";
import { useQuery } from 'react-query';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getDataAtual } from "../../../../utils/dataAtual";
import { getDataHoraAtual, getHoraAtual } from "../../../../utils/horaAtual";
import Swal from "sweetalert2";

export const ModalCadastroDeDepositoDaLoja = ({ show, handleClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [empresa, setEmpresa] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [contaSelecionada, setContaSelecionada] = useState('')
  const [historico, setHistorico] = useState('')
  const [documento, setDocumento] = useState('')
  const [vrDeposito, setVrDeposito] = useState('')
  const [dataMovimento, setDataMovimento] = useState('')
  const [horaMovimento, setHoraMovimento] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();





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

  useEffect(() => {
    const dataAtual = getDataAtual()
    const horaAtual = getDataHoraAtual()
    setData(dataAtual)
    setHora(horaAtual)
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

  }, [usuarioLogado]);

  const { data: dadosContaBanco = [], error: errorContaBanco, isLoading: isLoadingContaBanco } = useQuery(
    'contaBanco',
    async () => {
      const response = await get(`/contaBanco`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const onSubmit = async () => {



    const putData = {
      IDEMPRESA: usuarioLogado.IDEMPRESA,
      IDUSR: usuarioLogado.id,
      IDCONTABANCO: contaSelecionada,
      DTDEPOSITO: data,
      DTMOVIMENTOCAIXA: hora,
      DSHISTORIO: historico,
      NUDOCDEPOSITO: documento,
      VRDEPOSITO: vrDeposito,
      STATIVO: 'True',
      STCANCELADO: 'False',
    }
    const response = await post('/cadastrar-deposito-loja', putData)
      .then(response => {
        setData('')
        setDataMovimento('')
        setHistorico('')
        setDocumento('')
        setVrDeposito('')
      })
    console.log('response', response)
    console.log('response', putData)
    const textDados = JSON.stringify(putData)
    let textoFuncao = 'FINANCEIRO/CADASTRO DEPOSITO PELO EXTRATO DE CONTAS';


    const postData = {
      IDFUNCIONARIO: usuarioLogado.id,
      PATHFUNCAO: textoFuncao,
      DADOS: textDados,
      IP: ipUsuario
    }

    const responsePost = await post('/log-web', postData)

      .catch(error => {
        Swal.fire({
          title: 'Cadastro',
          text: 'Depósito cadastrado com Sucesso',
          icon: 'success'
        })
        console.error('Erro ao Tentar Cadastrar Depósito: ', error);
      })
      handleClose();
      return responsePost.data;
  }



  const handleChangeConta = (e) => {
    setContaSelecionada(e.value)
  }

  const options = [
    { value: "Funcionario 1", label: "Funcionario 1" },
    { value: "Funcionario 2", label: "Funcionario 2" },
  ]
  return (

    <Fragment>
      <Modal show={show} onHide={handleClose} size="lg" className="modal fade" id="cadDeposito" tabIndex={-1} role="dialog" aria-hidden="true">
        <div className="" role="document">
          <div className="modal-content">

            <HeaderModal
              title={"Dados do Depósito da Loja"}
              subTitle={"Cadastrar Depósitos da Loja"}
              handleClose={handleClose}
            />

            {/* <form id="formDepositoLoja" name="formDepositoLoja" method="post" encType="multipart/form-data" onsubmit="return false;"> */}
            <Modal.Body>
              <form onSubmit={handleSubmit(onSubmit)}>

                <div id="resultadodeposito"></div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-6 col-xl-10">

                      <InputFieldModal
                        label={"Empresa"}
                        type="text"
                        value={usuarioLogado?.NOFANTASIA ?? empresa}
                        onChangeModal={(e) => setEmpresa(e.target.value)}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-6 col-xl-3">

                      <InputFieldModal
                        label={"Data Depósito"}
                        type="date"
                        id="dtdeposito"
                        value={data}
                        onChangeModal={(e) => setData(e.target.value)}
                        readOnly={true}
                      />
                    </div>
                    <div className="col-sm-6 col-xl-3">

                     <InputFieldModal
                        label={"Hora Depósito"}
                        type="datetime-local"
                        id="hrdeposito"
                        value={hora}
                        onChangeModal={(e) => setHora(e.target.value)}
                        readOnly={true}
                      /> 
                    </div>
                    <div className="col-sm-6 col-xl-6">

                      <label htmlFor="">Conta *</label>
                      <Select
                        defaultValue={contaSelecionada}
                        options={[
                          { value: '', label: 'Selecione...' },
                          ...dadosContaBanco.map((item) => {
                            return {
                              value: item.IDCONTABANCO,
                              label: `${item.DSCONTABANCO} `
                            }
                          })]}
                        onChange={handleChangeConta}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-6 col-xl-8">

                      <InputFieldModal
                        label={"Histórico"}
                        type="text"
                        id="historico"
                        value={historico}
                        onChangeModal={(e) => setHistorico(e.target.value)}
                        {...register("historico", { required: "Campo obrigatório Informe o Histórico", })}
                      />
                    </div>
                    <div className="col-sm-6 col-xl-4">

                      <InputFieldModal
                        label={"Nº Doc Depósito"}
                        type="text"
                        id="docDeposito"
                        readOnly={false}
                        value={documento}
                        onChangeModal={(e) => setDocumento(e.target.value)}
                        {...register("docDeposito", { required: "Campo obrigatório Informe o Nº Doc Depósito", })}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-6 col-xl-4">

                      <InputFieldModal
                        label={"Valor Depósito"}
                        type="number"
                        id="vrDeposito"
                        value={vrDeposito}
                        onChangeModal={(e) => {
                          const valor = e.target.value.replace(".", "").replace(",", ".");
                          setVrDeposito(valor);
                        }}
                        {...register("vrDeposito", { required: "Campo obrigatório Informe o Valor do Depósito" })}
                        readOnly={false}
                      />
                    </div>
                    <div className="col-sm-6 col-xl-4">

                      <InputFieldModal
                        label={"Data Movimento de Caixa"}
                        type="date"
                        id="dtMovimentoCaixa"
                        value={dataMovimento}
                        onChangeModal={(e) => setDataMovimento(e.target.value)}
                        {...register("dtMovimentoCaixa", { required: "Campo obrigatório Informe a Data Movimento", })}
                        readOnly={false}
                      />
                    </div>
                    <div className="col-sm-6 col-xl-4">

                      <InputFieldModal
                        label={"Hora Movimento de Caixa"}
                        type="datetime-local"
                        id="hrMovimentoCaixa"
                        value={horaMovimento}
                        onChangeModal={(e) => setHoraMovimento(e.target.value)}
                        {...register("hrMovimentoCaixa", { required: "Campo obrigatório Informe a Hora Movimento", })}
                        readOnly={false}
                      />


                    </div>
                  </div>
                </div>

                <FooterModal
                  ButtonTypeCadastrar={ButtonTypeModal}
                  onClickButtonCadastrar={onSubmit}
                  textButtonCadastrar={"Cadastrar Depósito"}
                  corCadastrar={"success"}

                  ButtonTypeFechar={ButtonTypeModal}
                  onClickButtonFechar={handleClose}
                  textButtonFechar={"Fechar"}
                  corFechar={"secondary"}
                />
              </form>
            </Modal.Body>
          </div>
        </div>
      </Modal>
    </Fragment>
  )

}
