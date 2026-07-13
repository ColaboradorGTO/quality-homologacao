import React, { Fragment } from 'react';
import Select from 'react-select';
import { FooterModal } from '../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../Buttons/ButtonTypeModal';
import { useCancelarVenda } from './hook/useCancelarVenda';
import { useForm, Controller } from "react-hook-form";

export const FormularioCancelarVenda = ({
  handleClose,
  handleClick,
  optionsModulos,
  usuarioLogado,
  dadosCancelarVenda
}) => {
  const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
    mode: "onChange"
  });

  const {
    motivo,
    setMotivo,
    dadosMotivoDevolucao,
    onSubmit
  } = useCancelarVenda({ optionsModulos, usuarioLogado, handleClose, dadosCancelarVenda })
  
  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        motivo: motivo
      }

      // await schema.validate(dadosParaValidar, { abortEarly: false });

      await onSubmit();
      await handleClose();

    } catch (validationError) {
      clearErrors();

      if (validationError.inner && validationError.inner.length > 0) {
        validationError.inner.forEach(error => {
          if (error.path) {
            setError(error.path, {
              type: 'manual',
              message: error.message
            });
          }
        });
      }

      const errorMessages = validationError.errors || [validationError.message];

    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(handleValidatedSubmit)}>
        <div className='form-group'>
          <div className="col-sm-6 col-md-3 col-xl-6">

            <label htmlFor='Cancelar'>Motivo do Cancelamento:</label>
            <Select
              options={dadosMotivoDevolucao
                ?.filter((item) => item.STATIVO == 'True')
                .map((item) => ({
                  value: item.DSMOTIVO,
                  label: item.DSMOTIVO
                })) || []
              }
              value={motivo}
              onChange={(selectedOption) => { setMotivo(selectedOption) }}
            />
          </div>
        </div>

        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          textButtonCadastrar={"Finalizar"}
          onClickButtonCadastrar={handleValidatedSubmit}
          corCadastrar="success"
          loadingTextCadastrar={"Finalizando..."}
          autoLoadingCadastrar={true}

          ButtonTypeCancelar={ButtonTypeModal}
          textButtonCancelar={"Fechar"}
          onClickButtonCancelar={handleClose}
          corCancelar="secondary"
        />

      </form>

    </Fragment>
  );
};