import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from '../../../Modais/HeaderModal/HeaderModal';
import { InputFieldModal } from '../../../Buttons/InputFieldModal';
import { FooterModal } from '../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../Buttons/ButtonTypeModal';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { Fragment } from 'react';
import { useImportarCSVBI } from './hooks/useImportarCSVBI';

export const ActionImportarRelatorioBIModal = ({ show, handleClose, relatorioSelecionadoTabela, optionsModulos }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {
    linkRelatorioBI,
    setLinkRelatorioBI,
    dadosBI,
    file,
    setFile,
    onSubmitArquivo
  } = useImportarCSVBI({ optionsModulos, handleClose })


  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"

      >

        <HeaderModal
          title={"Link Relatório BI"}
          subTitle={"Cadastrar / Alterar"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmitArquivo)}>
            <div className="form-group">
              <div className="row">

                <div className="col-sm-6">
                  <label className="form-label" htmlFor={""}>Relatório</label>

                  <Select
                    closeMenuOnSelect={false}
                    defaultValue={
                      relatorioSelecionadoTabela
                        ? { value: relatorioSelecionadoTabela.IDRELATORIOBI, label: relatorioSelecionadoTabela.DSRELATORIOBI }
                        : null}
                    isMulti
                    options={dadosBI.map((item) => ({
                      value: item.IDRELATORIOBI,
                      label: item.DSRELATORIOBI
                    }))}
                  />
                </div>

                <div className="col-sm-6">
                  <InputFieldModal
                    label={"Arquivo CSV/XLSX"}
                    type="file"
                    id={"arquivoRelatorioBI"}
                    onChangeModal={e => setFile(e.target.files[0])}
                    accept=".csv, .xls, .xlsx"
                  />
                </div>

              </div>
            </div>

            {/* https://app.powerbi.com/view?r=eyJrIjoiZWRkOTVkNmYtNGM2MS00YjVlLTkxYzQtZTcwY2FmN2IxNjQ0IiwidCI6ImRmNDJhNzdjLWVlY2ItNDEyNC1iOTRiLWU4NjhlNmQ5MDkwYSJ9 */}
          </form>
        </Modal.Body>

        <FooterModal
          ButtonTypeConfirmar={ButtonTypeModal}
          textButtonConfirmar={"Importar"}
          onClickButtonConfirmar={handleSubmit(onSubmitArquivo)}
          corConfirmar="success"

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"

        />
      </Modal>
    </Fragment>
  )
}