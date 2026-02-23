import { Fragment } from "react"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";
//import { schema } from "./schemaCadastrarQuebraCaixa";
//import { useCadastrarAlvara } from "../hooks/actionCriarAlvara";
import { BsBuilding, BsPerson } from "react-icons/bs";
import Select from "react-select"
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlinePhoneEnabled } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { mascaraCNPJ } from "../../../../../utils/mascaraCNPJ";
import { mascaraTelefone } from "../../../../../utils/mascaraTelefone";
import { ActionListaAlvaraPrefeitura } from "./ActionAvaraPrefeituraLista/actionListaAlvaraPrefeitura.jsx";
import { useCriarAlvara } from "../hooks/actionCriarAlvara.jsx";

export const FormularioActionAlvaraEmpresa = ({ show, dadosAlvaraEmpresaSelecionada, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos, refetchAlvaraEmpresa }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, register } = useForm({
        mode: "onChange"
    });
    const {
        onSubmit,
        empresa,
        setEmpresa,
        motivoAjuste,
        setMotivoAjuste,
        dataLancamento,
        dataAtualFormatada,
        setDataAtualFormatada,
        dinheiroInformado,
        setDinheiroInformado,
        dinheiroAjuste,
        setDinheiroAjuste,
        dadosQuebraCaixasModal,
        setDadosQuebraCaixasModal,
        modalVisivelImprimir,
        setModalVisivelImprimir,
        modalQuebraVisivel,
        setModalQuebraVisivel,
        dados,
        operador,
        setOperador,
        setDataLancamento,
        dataTableRef
    } = useCriarAlvara({ show, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos });

    const handleValidatedSubmit = async () => {
        try {

            const dadosParaValidar = {
                Empresa: usuarioLogado?.NOFANTASIA,
                operador: usuarioLogado?.NOFUNCIONARIO,
                historicoDigitado: motivoAjuste,
                dataLancamento: dados?.[0]?.DTHORAFECHAMENTOCAIXA,
                dinheiroInformado: dadosDetelheCaixa?.[0]?.TOTALFECHAMENTOVRQUEBRACAIXA,
                dinheiroAjuste: dinheiroAjuste
            };

            // await schema.validate(dadosParaValidar, { abortEarly: false });
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
            //console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
        }
    };
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)} >
                <span class="d-flex align-items-center">
                    <BsBuilding size={25} />
                    <h1 class="font-weight-bold" style={{ margin: 0, marginLeft: "15px" }}>
                        Dados Empresa
                    </h1>
                </span>
                <div class="form-group">

                    <div class="row mt-3">

                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="ID"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"ID"}
                                        name="ID"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.IDEMPRESA}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="Status"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Status"}
                                        name="Status"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.STATIVO == "True" ? "Ativo" : "Inativo"}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />

                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <label className="form-label" htmlFor={""}>Grupo Empresarial</label>
                            <Select

                                label={"Despesa"}
                                options={optionsModulos.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                defaultInputValue={"Todos"}
                                //onChange={(e) => setTipoIndicacaoIE(e)}
                                isSearchable={true}
                                menuIsOpen={false}

                            />
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="Insc. Estadual"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Insc. Estadual"}
                                        name="IInsc. Estadual"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.NUINSCESTADUAL}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="Insc. Municipal"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Insc. Municipal"}
                                        name="Insc. Municipal"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.NUINSCMUNICIPAL}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />

                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="CNPJ"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"CNPJ"}
                                        name="CNPJ"
                                        type="text"
                                        readOnly={true}
                                        value={mascaraCNPJ(dadosAlvaraEmpresaSelecionada[0]?.NUCNPJ)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-12">
                            <Controller
                                name="Razão Social"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Razão Social"}
                                        name="Razão Social"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.NORAZAOSOCIAL}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-12">
                            <Controller
                                name="Nome Fantasia"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Nome Fantasia"}
                                        name="Nome Fantasia"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.NOFANTASIA}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <hr style={{ borderTop: "2px dashed #999" }} />

                <div class="form-group">

                    <span class="d-flex align-items-center">
                        <AiOutlineHome size={20} />
                        <h3 class="font-weight-bold" style={{ margin: 0, marginLeft: "15px" }}>
                            Endereço
                        </h3>
                    </span>
                    <div class="row mt-3">

                        <div class="col-sm-6 col-xl-12">
                            <Controller
                                name="Endereço"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Endereço"}
                                        name="Endereço"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.EENDERECO}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-12">
                            <Controller
                                name="Complemento"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Complemento"}
                                        name="Complemento"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.ECOMPLEMENTO}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Bairro"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Bairro"}
                                        name="Bairro"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.EBAIRRO}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Cidade"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Cidade"}
                                        name="Cidade"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.ECIDADE}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="UF"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"UF"}
                                        name="UF"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.SGUF}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-12">
                            <Controller
                                name="CEP"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"CEP"}
                                        name="CEP"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.NUCEP}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <hr style={{ borderTop: "2px dashed #999" }} />

                <span class="d-flex align-items-center">
                    <MdOutlinePhoneEnabled size={25} />
                    <h2 class="font-weight-bold" style={{ margin: 0, marginLeft: "15px" }}>
                        Contatos
                    </h2>
                </span>

                <div class="form-group mt-3 border p-3 rounded">

                    <span class="d-flex align-items-center">
                        <CiUser size={20} />
                        <h5 class="font-weight-bold" style={{ margin: 0, marginLeft: "5px" }}>
                            Gerente da Loja
                        </h5>
                    </span>

                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Nome</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.LISTA_GERENTES[0]?.NOFUNCIONARIO}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">E-mail</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.EEMAILPRINCIPAL}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder=""
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Telefone</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={mascaraTelefone(dadosAlvaraEmpresaSelecionada[0]?.LISTA_GERENTES[0]?.TELEFONE) || "Telefone não cadastrado"}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Telefone"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group mt-3 border p-3 rounded">

                    <span class="d-flex align-items-center">
                        <CiUser size={20} />
                        <h5 class="font-weight-bold" style={{ margin: 0, marginLeft: "5px" }}>
                            Gerente da Loja
                        </h5>
                    </span>

                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Nome</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.LISTA_GERENTES[1]?.NOFUNCIONARIO}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">E-mail</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.EEMAILPRINCIPAL}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder=""
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Telefone</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={mascaraTelefone(dadosAlvaraEmpresaSelecionada[0]?.LISTA_GERENTES[1]?.TELEFONE) || "Telefone não cadastrado"}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Telefone"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group mt-3 border p-3 rounded">

                    <span class="d-flex align-items-center">
                        <CiUser size={20} />
                        <h5 class="font-weight-bold" style={{ margin: 0, marginLeft: "5px" }}>
                            Gerente da Loja
                        </h5>
                    </span>

                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Nome</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.LISTA_GERENTES[2]?.NOFUNCIONARIO}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">E-mail</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.EEMAILPRINCIPAL}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder=""
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Telefone</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={mascaraTelefone(dadosAlvaraEmpresaSelecionada[0]?.LISTA_GERENTES[2]?.TELEFONE) || "Telefone não cadastrado"}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Telefone"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group mt-3 border p-3 rounded">

                    <span class="d-flex align-items-center">
                        <CiUser size={20} />
                        <h5 class="font-weight-bold" style={{ margin: 0, marginLeft: "5px" }}>
                            Supervisor da Loja
                        </h5>
                    </span>

                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Nome</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={(dadosAlvaraEmpresaSelecionada[0]?.LISTA_SUPERVISORES[0]?.NOFUNCIONARIO)}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">E-mail</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.EEMAILPRINCIPAL}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder=""
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-sm-6 col-xl-12">
                            <label className="form-label">Telefone</label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsPerson size={17} />
                                </span>

                                <input
                                    className="form-control"
                                    value={dadosAlvaraEmpresaSelecionada[0]?.LISTA_SUPERVISORES[0]?.TELEFONE || "Telefone nao cadastrado"}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Telefone"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <hr style={{ borderTop: "2px dashed #999" }} />

            </form>
            <ActionListaAlvaraPrefeitura
                dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}
                handleClose={handleClose}
                optionsModulos={optionsModulos}
                usuarioLogado={usuarioLogado}
                refetchAlvaraEmpresa={refetchAlvaraEmpresa}

            />

            <FooterModal
                //ButtonTypeCadastrar={ButtonTypeModal}
                //onClickButtonCadastrar={handleValidatedSubmit}
                //tipoBtnCadastrar={"submit"}
                // textButtonCadastrar={"Cadastrar Quebra Caixa"}
                //corCadastrar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}