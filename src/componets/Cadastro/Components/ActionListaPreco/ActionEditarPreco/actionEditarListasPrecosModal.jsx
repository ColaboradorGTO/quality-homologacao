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
import { useEditarListaPrecos } from "../../../hooks/useEditarListaPrecos";
import { ActionEditarListasPrecos } from "./actionEditarListasPreco";


export const ActionEditarListasPrecosModal = ({ show, handleClose, dadosListaLoja}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {
    statusSelecionado,
    setStatusSelecionado,
    handleChangeStatus,
  } = useEditarListaPrecos()

  const optionsStatus = [
    { value: 'True', label: 'ATIVO' },
    { value: 'False', label: 'INATIVO' }
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
          title={"Edição de Lista de Preços"}
          // subTitle={`Lista de Lojas: ${dadosListaLoja[0]?.listaPreco.NOMELISTA}`}
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
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Nº *"}
                    type={"text"}

                    id={"idListaPreco"}
                    // value={dadosListaLoja[0]?.listaPreco.IDRESUMOLISTAPRECO}
                    onChangeModal={""}

                    {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Nome Lista Preço *"}
                    type={"text"}

                    id={"nomeListaPreco"}
                    // value={dadosListaLoja[0]?.listaPreco.NOMELISTA}
                    onChangeModal={""}

                    {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>
              <div className="row mt-4">
                <div className="col-sm-6 col-xl-3">

                  <label htmlFor="">Situação *</label>
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
            </div>

            <ActionEditarListasPrecos  />
            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              onClickButtonFechar={handleClose}
              textButtonFechar={"Fechar"}
              corFechar={"secondary"}

              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar
              textButtonCadastrar={"Salvar"}
              corCadastrar={"success"}
            />

          </form>
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}