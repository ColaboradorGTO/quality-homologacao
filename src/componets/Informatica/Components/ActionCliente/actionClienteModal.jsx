import { Fragment } from "react";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';

export const ActionClienteModal = ({show, handleClose, dadosClienteSelecionado}) => {
  return (
    <Fragment>
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      tabIndex={-1}
      aria-labelledby="example-custom-modal-styling-title"

    >

      <HeaderModal
        title={"Dados de Empresa"}
        subTitle={"Atualização Diária dos PDVs da Empresa"}
        handleClose={handleClose}
      />


      <Modal.Body>


        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-md-6 col-xl-2">
            
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NOFANTASIA}
                onChangeModal
                label="Empresa"
              />
            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
  
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.IDCLIENTE}
                onChangeModal
                label="Nº Cliente"
              />
            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.STATIVO}
                onChangeModal
                label="Status"
              />
            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.DTULTALTERACAOFORMATADA}
                onChangeModal
                label="Data  Alteração"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-xl-6">
        
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.DSNOMERAZAOSOCIAL}
                onChangeModal
                label="Nome Cliente"
              />
            </div>
            <div className="col-sm-6 col-xl-6">
  
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.DSAPELIDONOMEFANTASIA}
                onChangeModal
                label="Nome Fantasia"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xl-3">
            
              <InputFieldModal 
                type="date"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.DTNASCFUNDACAOFORMATADA}
                onChangeModal
                label="Data de Nascimento"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.TPCLIENTE}
                onChangeModal
                label="Tipo Cliente"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NUCPFCNPJ}
                onChangeModal
                label="CPF / CNPJ"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NURGINSCESTADUAL}
                onChangeModal
                label="Nº RG / Inscrição Estadual"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NUTELCELULAR}
                onChangeModal
                label="Telefone Celular"
              />
            </div>
            <div className="col-sm-6 col-xl-8">
              <InputFieldModal 
                type="email"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.EEMAIL}
                onChangeModal
                label="E-mail"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NUCEP}
                onChangeModal
                label="CEP"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.EENDERECO}
                onChangeModal
                label="Endereço"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NUENDERECO}
                onChangeModal
                label="Nº Endereço"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.ECOMPLEMENTO}
                onChangeModal
                label="Complemento"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-4 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.EBAIRRO}
                onChangeModal
                label="Bairro"
              />
            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NUIBGE}
                onChangeModal
                label="Nº IBGE"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.ECIDADE}
                onChangeModal
                label="Cidade"
              />
            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.SGUF}
                onChangeModal
                label="Estado"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NUTELCOMERCIAL}
                onChangeModal
                label="Telefone Comercial"
              />
            </div>
            <div className="col-sm-6 col-xl-8">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.DSOBSERVACAO}
                onChangeModal
                label="Observação"
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
                value={dadosClienteSelecionado[0]?.NUINSCMUNICIPAL}
                onChangeModal
                label="Inscrição Municipal"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NUINSCRICAOSUFRAMA}
                onChangeModal
                label="Inscrição SUFRAMA"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.TPINDICADORINSCESTADUAL}
                onChangeModal
                label="Tipo Inscrição Estadual"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
  
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.STOPTANTESIMPLE ? 'SIM' : 'NÃO'}
                onChangeModal
                label="Optante Simples"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NOCONTATOCLIENTE01}
                onChangeModal
                label="Contato 01"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.FONECONTATOCLIENTE01}
                onChangeModal
                label="Telefone Contato 01"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.EEMAILCONTATOCLIENTE01}
                onChangeModal
                label="E-mail Contato 01"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.DSCARGOCONTATOCLIENTE01}
                onChangeModal
                label="Cargo Contato 01"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.NOCONTATOCLIENTE02}
                onChangeModal
                label="Contato 02"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.FONECONTATOCLIENTE02}
                onChangeModal
                label="Telefone Contato 02"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-4">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.EEMAILCONTATOCLIENTE02}
                onChangeModal
                label="E-mail Contato 02"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-xl-2">
              <InputFieldModal 
                type="text"
                className="form-control input"
                readOnly={true}
                value={dadosClienteSelecionado[0]?.DSCARGOCONTATOCLIENTE02}
                onChangeModal
                label="Cargo Contato 02"
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