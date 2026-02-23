import React, { Fragment, useEffect, useState } from "react"
import { AiOutlineCloseCircle } from "react-icons/ai"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import Select from 'react-select';
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from 'react-query';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { getDataHoraAtual, getHoraAtual } from "../../../../../utils/horaAtual";
import Swal from "sweetalert2";
import { FormularioCadastroDeposito } from "./formulario";

export const ModalCadastroDeDepositoDaLoja = ({
  show,
  handleClose,
  optionsModulos,
  usuarioLogado,
  empresaSelecionada
}) => {
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
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();



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
      <Modal 
        show={show} 
        onHide={handleClose} 
        size="lg" 
        className="modal fade" 
        id="cadDeposito" 
        tabIndex={-1} 
        role="dialog" 
        aria-hidden="true"
      >


        <HeaderModal
          title={"Dados do Depósito da Loja"}
          subTitle={"Cadastrar Depósitos da Loja"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioCadastroDeposito 
            handleClose={handleClose}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            empresaSelecionada={empresaSelecionada}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )

}
