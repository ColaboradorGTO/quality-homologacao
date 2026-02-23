import React, { Fragment } from "react"
import { FooterModal } from "../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../Buttons/ButtonTypeModal"
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../Buttons/InputFieldModal";
import { get } from "../../api/funcRequest";

export const InformaticaActionClienteModal = ({show, handleClose}) => {
  const [dadosClienteModal, setDadosClienteModal] = useState([]);

  const getListaClientesModal = async (   ) => {

    try {
                                                                                                
      const response = await get(`/listaClienteID?idCliente=${idCliente}`)
      if (response.data) {
        setDadosClienteModal(response.data)
        console.log(response.data, 'response.data')
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

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
          subTitle={"Atualização Diária dos PDVs da Empresa"}
          handleClose={handleClose}
        />


        <Modal.Body>


        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          cor="secondary"

        />
        </Modal.Body>


      </Modal>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-6 col-xl-6">
           
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Empresa"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
 
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Nº Cliente"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Status"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="date"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Data Última Alteração"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-xl-6">
       
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Nome Cliente"
            />
          </div>
          <div className="col-sm-6 col-xl-6">

            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Nome Fantasia"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-xl-3">
           
            <InputFieldModal 
              type="date"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Data de Nascimento"
            />
          </div>
          <div className="col-sm-6 col-xl-3">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Tipo Cliente"
            />
          </div>
          <div className="col-sm-6 col-xl-3">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="CPF / CNPJ"
            />
          </div>
          <div className="col-sm-6 col-xl-3">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
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
              readOnly={false}
              value={""}
              onChangeModal
              label="Telefone Celular"
            />
          </div>
          <div className="col-sm-6 col-xl-8">
            <InputFieldModal 
              type="email"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="E-mail"
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="CEP"
            />
          </div>
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Endereço"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Nº Endereço"
            />
          </div>
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Complemento"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Bairro"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Nº IBGE"
            />
          </div>
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Cidade"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
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
              readOnly={false}
              value={""}
              onChangeModal
              label="Telefone Comercial"
            />
          </div>
          <div className="col-sm-6 col-xl-8">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Observação"
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-6 col-xl-3">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Inscrição Municipal"
            />
          </div>
          <div className="col-sm-6 col-xl-3">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Inscrição SUFRAMA"
            />
          </div>
          <div className="col-sm-6 col-xl-3">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Tipo Inscrição Estadual"
            />
          </div>
          <div className="col-sm-6 col-xl-3">

            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Optante Simples"
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Contato 01"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Telefone Contato 01"
            />
          </div>
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="E-mail Contato 01"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Cargo Contato 01"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Contato 02"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Telefone Contato 02"
            />
          </div>
          <div className="col-sm-6 col-xl-4">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="E-mail Contato 02"
            />
          </div>
          <div className="col-sm-6 col-xl-2">
            <InputFieldModal 
              type="text"
              className="form-control input"
              readOnly={false}
              value={""}
              onChangeModal
              label="Cargo Contato 02"
            />
          </div>
        </div>
      </div>

    </Fragment>
  )
}
