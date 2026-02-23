import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../Buttons/InputFieldModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Select from 'react-select'
import { useInserirDivergencia } from "../../hooks/useInserirDivergencia"

export const ActionCadastrarStatusModal = ({ show, handleClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {
    descricao,
    setDescricao,
    statusDivergencia,
    setStatusDivergencia,
    onSubmitInserir
  } = useInserirDivergencia()


  const options = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' }
  ]
  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
      >
        <HeaderModal
          title="Status de Divergência"
          subTitle="Cadastrar ou Atualizar informações de Status de Divergência"
          handleClose={handleClose}
        />
        <Modal.Body>

          <form onSubmit >
            <div className="row" data-select2-id="736">
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"Descrição"}
                  type="text"
                  value={descricao}
                  onChangeModal={(e) => setDescricao(e.target.value)}
                  placeholder={"Descrição"}
                />
              </div>
              <div className="col-sm-6 col-xl-6" >
                <label htmlFor="">Status</label>
                <Select
                  closeMenuOnSelect={false}
                  options={options.map((item) => ({
                    value: item.value,
                    label: item.label
                  }
                  ))}
                  value={options.find(option => option.value === statusDivergencia)}
                  onChange={(e) => setStatusDivergencia(e.value)}
                />
              </div>
            </div>

          </form>

        </Modal.Body>

        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={handleSubmit(onSubmitInserir)}
          textButtonCadastrar={"Atualizar"}
          corCadastrar={"success"}

          ButtonTypeFechar={ButtonTypeModal}
          onClickButtonFechar={handleClose}
          textButtonFechar={"Fechar"}
          corFechar={"secondary"}

        />

      </Modal>
    </Fragment>
  )
}
