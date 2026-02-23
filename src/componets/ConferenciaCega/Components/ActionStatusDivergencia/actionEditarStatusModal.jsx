import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../Buttons/InputFieldModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Select from 'react-select'
import { useInserirDivergencia } from "../../hooks/useInserirDivergencia"

export const ActionEditarStatusModal = ({ show, handleClose, dadosStatusDivergencia }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {
    descricaoSelecionada,
    setDescricaoSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    onSubmitAlterar
  } = useInserirDivergencia(dadosStatusDivergencia, handleClose)


  const options = [
    { value: 'True', label: 'Ativo' },
    { value: 'False', label: 'Inativo' }
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
                  value={descricaoSelecionada}
                  onChangeModal={(e) => setDescricaoSelecionada(e.target.value)}
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
                  value={options.find(option => option.value === statusSelecionado)}
                  onChange={(e) => setStatusSelecionado(e.value)}
                  />
                  {console.log(statusSelecionado, 'statusSelecionado')}
              </div>
            </div>

          </form>

        </Modal.Body>

        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={handleSubmit(onSubmitAlterar)}
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
