import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
//import { useEditarFuncionario } from "../hooks/useEditarFuncionario";
import { mascaraCPF } from "../../../../../utils/formatCPF";
import { format, subDays } from "date-fns";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
//import { schema } from "./schamaValidarFuncionario";
import { mascaraTelefone } from "../../../../../utils/mascaraTelefone";
import { formatarMoeda } from "../../../../../utils/formatMoeda";
import { useAtualizarMenuFilho } from "../hook/useAtualizarMenuFilho";
import { schema } from "./schema";
//import { schemaLogin } from "./schamaValidarLogin";

export const FormularioEditar = ({
  handleClose,
  dadosDetalhesMenuFilho,
  refetchMenuFilho,
  optionsModulos,
  usuarioLogado,
  dadosMenuPai

}) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
    mode: "onChange"
  });




  const {
    moduloSelecionado,
    setModuloSelecionado,
    urlFinal,
    setUrlFinal,
    nomeMenu,
    setNomeMenu,
    idMenu,
    setIdMenu,
    currentPage,
    setCurrentPage,
    selectedModule,
    setSelectedModule,
    complementoUrl,
    setComplementoUrl,
    moduloUsuario,
    setModuloUsuario,
    onSubmit

  } = useAtualizarMenuFilho({
    handleClose,
    dadosDetalhesMenuFilho,
    refetchMenuFilho,
    optionsModulos,
    usuarioLogado,
    dadosMenuPai
  });


  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        nomeMenuDigitado: nomeMenu,
        moduloPaiSelecionado: moduloSelecionado,
        urlDigitada: urlFinal,
      };

      await schema.validate(dadosParaValidar, { abortEarly: false });
      onSubmit();
    } catch (validationError) {
      console.error('❌ Erro de validação:', validationError);

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
      console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
    }
  }

  const limparTexto = (texto) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
  };

  const nomeModuloLimpo = moduloSelecionado?.label
    ? limparTexto(moduloSelecionado.label)
    : "";

  const prefixo = `/${nomeModuloLimpo}/ActionPesquisa`;
  const valorFinal = `${prefixo}${complementoUrl}`;

  const handleChange = (e) => {
    const texto = e.target.value.replace(/\s/g, "");

    if (!texto.startsWith(prefixo)) return;

    let complemento = texto.slice(prefixo.length);

    if (complemento.length > 0) {
      complemento = complemento.charAt(0).toUpperCase() + complemento.slice(1);
    }

    setComplementoUrl(complemento);
    setUrlFinal(`${prefixo}${complemento}`)
  };


  return (
    <Fragment>

      <form onSubmit={handleSubmit(handleValidatedSubmit)}/*onSubmit={handleSubmit(handleValidatedSubmit)} */>

        <div className="row form-group">
          <div className="col-sm-6 col-md-6 col-xl-2 " >

            <Controller
              name="idMenuSelecionado"
              control={control}
              render={({ field }) => (
                <FormField
                  name="idMenuSelecionado"
                  label={"ID"}
                  type="text"
                  errors={errors}
                  clearErrors={clearErrors}
                  value={idMenu}
                  readOnly={true}
                  onChangeModal={e => setIdMenu(e.target.value)}
                />

              )}
            />
          </div>
          <div className="col-sm-6 col-md-6 col-xl-6 " >
            <Controller
              name="nomeMenuDigitado"
              control={control}
              render={({ field }) => (
                <FormField
                  name="nomeMenuDigitado"
                  label={"Nome Menu"}
                  type="text"
                  errors={errors}
                  clearErrors={clearErrors}
                  value={nomeMenu}
                  onChangeModal={e => setNomeMenu(e.target.value)}

                />

              )}
            />
          </div>
          <div className="col-sm-6 col-md-6 col-xl-4 " >
            <label htmlFor="">Modulo</label>
            <Select
              className="basic-single"
              classNamePrefix={"select"}
              options={dadosMenuPai.map((item) => ({
                value: item.IDMODULO,
                label: item.DSMENU

              }))}
              value={moduloSelecionado}
              onChange={(e) => setModuloSelecionado(e)}
            />{errors.moduloPaiSelecionado && (
              <AlertError
                error={errors.moduloPaiSelecionado?.value || errors.moduloPaiSelecionado}
                onClose={clearErrors}
                fieldName="moduloPaiSelecionado"
              />
            )}
          </div>

        </div>
        <div className="row form-group">
          <div className="col-sm-6 col-md-6 col-xl-12 " >
            <Controller
              name="urlDigitada"
              control={control}
              render={({ field }) => (
                <FormField
                  name="urlDigitada"
                  label={"URL"}
                  type="text"

                  errors={errors}
                  clearErrors={clearErrors}
                  value={urlFinal}
                  onChangeModal={handleChange}
                //onChangeModal={e => setUrlFinal(e.target.value)}

                />

              )}
            />
          </div>
        </div>

        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"

          ButtonTypeConfirmar={ButtonTypeModal}
          textButtonConfirmar={"Atualizar"}
          onClickButtonConfirmar={handleSubmit(handleValidatedSubmit)}
          corConfirmar="success"

        />
      </form>


    </Fragment>
  )
}