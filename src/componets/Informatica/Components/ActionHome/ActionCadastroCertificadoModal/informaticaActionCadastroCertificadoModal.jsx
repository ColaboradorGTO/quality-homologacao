import React, { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { getDataAtual } from "../../../../../utils/dataAtual";

export const InformaticaActionCertificadoModal = ({ show, handleClose, dadosDetalheEmpresas }) => {
  const { register, handleSubmit, errors } = useForm();
  const [senha, setSenha] = useState('');
  const [dataAlteracao, setDataAlteracao] = useState('');
  const [validadeCertificadoNovo, setValidadeCertificadoNovo] = useState('');
  const [novoCertificado, setNovoCertificado] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataAlteracao(dataAtual);
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

  const onSubmit = async (data) => {
    const putData = {
      IDEMPRESA: dadosDetalheEmpresas[0]?.IDEMPRESA,
      UF: dadosDetalheEmpresas[0]?.SGUF,
      TPFORMAEMISSAO: "teNormal",
      TPMODELODOCFISCAL: "moNFCe",
      TPVERSAOMODFISCAL: "ve400",
      TPEMISSAO: "libCapicom",
      TPAMBIENTE: "Homologação",
      PATHCERTIFICADO: "../spednfe/certs/GTO COMERCIO 2022-2023.pfx",
      NUCERTIFICADO: "TESTE",
      PWSENHA: senha,
      TXTDADOSPFX: 'certificadoBase64',
      NULOTEPROD: 0,
      NUULTNFPROD: 0,
      NULOTHOM: 0,
      NUULTNFHOM: 0,
      DSCRT: "crtRegimeNormal",
      STATUALIZA_XML: "False",
      STEXIBIRERROSCHEMA: "False",
      ST_CRIARPASTAMENSALMENTE: "True",
      ST_SEPARARARQ_CNPJCERTIFICADO: "True",
      DSFORMATOALERTA: "[ %TAGNIVEL%%TAG% ]   %DESCRICAO% - %MSG%",
      IDTOKEN: "1",
      TOKENCSC: "380C6C5FE43544E3B6EA75012C02809A",
      STRETIRARACENTOSXML: "False",
      STSALVARARQUIVOENVIORESPOSTA: "True",
      PATHSALVARARQUIVOSENVIORESP: "C:\\\\QUALITY\\\\FISCAL\\\\ARQRESP",
      PATHARQXDS_SCHEMA: "C:\\\\QUALITY\\\\FISCAL\\\\SCHEMAS\\\\NFE",
      PATH_ARQNFE: "C:\\\\QUALITY\\\\FISCAL\\\\NFE",
      PATH_ARQCANCELADO: "C:\\\\QUALITY\\\\FISCAL\\\\CANCELADOS",
      PATH_ARQ_CARTACORRECAO: "C:\\\\QUALITY\\\\FISCAL\\\\CCORRECAO",
      PATH_ARQINUTILIZACAO: "C:\\\\QUALITY\\\\FISCAL\\\\Inutilizados",
      PATH_ARQ_DPEC: "C:\\\\QUALITY\\\\FISCAL\\\\DPEC",
      PATH_ARQ_EVENTO: "C:\\\\QUALITY\\\\FISCAL\\\\EVENTOS",
      PATH_LOGO: "img/imagens/empresa/87/",
      DTULTALTERACAO: dataAlteracao,
      DSNOMEPFX: novoCertificado,
      STCERTIFICADO: "True",
      DTVALIDADECERTIFICADO: validadeCertificadoNovo,
      CNPJ_AUTXML: "11098707000107",
      DSPATHNFCE: "",
      ST_SAP_ONLINE: "True"
    };

    try {
      const response = await put('/linkRelatorioBI/:id', putData);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Relatório atualizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'INFORMATICA/ATUALIZAR LINK RELATORIO BI';

      const postData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };

      const responsePost = await post('/log-web', postData);

      return responsePost.data;
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao atualizar Relatório!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  };

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
          title={"Dados de Empresa"}
          subTitle={"Cadastrar ou Atualizar informações da Empresa"}
          handleClose={handleClose}
        />


        <Modal.Body>

          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-md-12 col-xl-12">
                <div className="alert alert-success" style={{ textAlign: "center" }} role="alert">
                  <strong>CERTIFICADO DIGITAL</strong>
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-sm-6 col-md-4 col-xl-4">
              
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.NOFANTASIA}
                  onChangeModal
                  label="Empresa"
                />
              </div>
              <div className="col-sm-6 col-md-2 col-xl-2">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.IDCONFIGURACAO}
                  onChangeModal
                  label="ID Configuração"
                />
              </div>
              <div className="col-sm-6 col-md-4 col-xl-4">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.DSNOMEPFX}
                  onChangeModal
                  label="Certificado"
                />
              </div>
              <div className="col-sm-2 col-md-2 col-xl-2" style={{ padding: "0" }}>
                <InputFieldModal 
                  type="date"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.DTVALIDADECERTIFICADO}
                  onChangeModal
                  label="Validade"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.TPFORMAEMISSAO}
                  onChangeModal
                  label="Forma de Emissão"
                />
              </div>
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.TPMODELODOCFISCAL}
                  onChangeModal
                  label="Modelo Doc Fiscal"
                />
              </div>
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.TPEMISSAO}
                  onChangeModal
                  label="Tipo de Emissão"
                />
              </div>
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.TPAMBIENTE}
                  onChangeModal
                  label="Ambiente"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.NUCERTIFICADO}
                  onChangeModal
                  label="Número do Certificado"
                />
              </div>
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.DSCRT}
                  onChangeModal
                  label="Descrição CRT" 
                />
              </div>
              <div className="col-sm-6 col-md-1 col-xl-1">

                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={false}
                  value={dadosDetalheEmpresas[0]?.IDTOKEN}
                  onChangeModal
                  label="ID CSC"
                />
              </div>
              <div className="col-sm-6 col-md-5 col-xl-5">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  value={dadosDetalheEmpresas[0]?.TOKENCSC}
                  onChangeModal
                  label="Token CSC"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6col-md-12 col-xl-12">
                <div className="alert alert-info" style={{ textAlign: "center" }} role="alert">
                  <strong>ATUALIZAR CERTIFICADO DIGITAL</strong>
                </div>
                <div id="AvisoDadosIncompletos"></div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-md-6 col-xl-6">
       
                <InputFieldModal 
                  type="file"
                  className="form-control input"
                  label="Certificado"
                  readOnly={false}
                  value={novoCertificado}
                  onChangeModal={(e) => setNovoCertificado(e.target.value)}
                  {...register("novoCertificado", { required: "Campo obrigatório Informe o Certificado Digital", })}
                />
                  {/* {errors.novoCertificado && <span className="text-danger">{errors.novoCertificado.message}</span>} */}
              </div>
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="date"
                  label="Validade"
                  className="form-control input"
                  readOnly={false}
                  value={validadeCertificadoNovo}
                  onChangeModal={(e) => setValidadeCertificadoNovo(e.target.value)}
                  {...register("validadeCertificadoNovo", { required: "Campo obrigatório Informe a validade do Certificado Digital", })}
                />
                  {/* {errors.validadeCertificadoNovo && <span className="text-danger">{errors.validadeCertificadoNovo.message}</span>} */}
              </div>
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={false}
                  value={senha}
                  onChangeModal={(e) => setSenha(e.target.value)}
                  label="Senha"
                  {...register("senha", { required: "Campo obrigatório Informe a senha do Certificado Digital", })}
                />
                  {/* {errors.senha && <span className="text-danger">{errors.senha.message}</span>} */}
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-md-6 col-xl-6">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={false}
                  value={""}
                  onChangeModal
                  label="Novo ID CSC"
                />
              </div>
              <div className="col-sm-6 col-md-3 col-xl-3">
                <InputFieldModal 
                  type="text"
                  className="form-control input"
                  readOnly={false}
                  value={""}
                  onChangeModal
                  label="Novo Token CSC"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"

        />
      </Modal>
    </Fragment>
  )
}
