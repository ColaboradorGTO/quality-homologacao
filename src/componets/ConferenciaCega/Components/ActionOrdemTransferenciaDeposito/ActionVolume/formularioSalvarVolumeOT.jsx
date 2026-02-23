import { Fragment } from "react"
import { useForm } from "react-hook-form";
import { useSalvarVolumeOT } from "../../../hooks/useSalvarVolumeOT";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";


export const FormularioSalvarVolumeOT = ({dadosSalvarVolume, handleClose}) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    descricao,
    setDescricao,
    qtdVolume,
    setQtdVolume,
    conferirItens,
    setConferirItens,
    onSalvarVolume,
  } = useSalvarVolumeOT(dadosSalvarVolume)

  const handleRadioChange = (event) => {
    const { id } = event.target;
    if (id === 'Sim') {
      setConferirItens('True');
    } else if (id === 'Nao') {
      setConferirItens('False');
    }
  };

  return (
    <Fragment>
      <form onSubmit={''}>
        <div className="row">
          <div className="col-sm-2 col-xl-2">
            <label className="form-label">Confere Itens</label>
            <div className="form-check">
              <label className="form-check-label" htmlFor="sim">
                <input
                  id="Sim"
                  type="radio"
                  className="form-check-input"
                  name="Sim"
                  onChange={handleRadioChange}
                /> Sim
              </label>
              <label className="form-check-label" htmlFor="nao">
                <input
                  id="Nao"
                  type="radio"
                  className="form-check-input"
                  name="nao"
                  onChange={handleRadioChange}
                /> Não
              </label>
            </div>

          </div>

          <div className="col-sm-2 col-xl-2">
            <InputFieldModal
              label={"Quantidade"}
              type="number"
              value={qtdVolume}
              onChangeModal={(e) => setQtdVolume(e.target.value)}
            />
          </div>
          <div className="col-sm-8 col-xl-8">
            <label className="form-label" htmlFor="textarea">Descrição</label>
            <textarea
              className="form-control"
              id="textarea"
              rows="3"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite aqui a descrição do volume"
            >
            </textarea>
          </div>
        </div>
        <div className="row mt-4">

        </div>

        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar={"secondary"}

          ButtonTypeCadastrar={ButtonTypeModal}
          textButtonCadastrar={"Salvar"}
          onClickButtonCadastrar={handleSubmit(onSalvarVolume)}
          corCadastrar={"success"}
        />
      </form>
    </Fragment>
  )
}