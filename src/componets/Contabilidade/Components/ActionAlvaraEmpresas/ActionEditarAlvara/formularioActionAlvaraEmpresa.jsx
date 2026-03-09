import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";
import Select from "react-select"
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlinePhoneEnabled } from "react-icons/md";
import { BsBuilding, BsEnvelopeAt, BsPerson, BsTelephone } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { mascaraTelefone } from "../../../../../utils/mascaraTelefone";
import { mascaraCNPJ } from "../../../../../utils/mascaraCNPJ.js";
import { ActionListaAlvaraPrefeitura } from "./ActionAvaraPrefeituraLista/actionListaAlvaraPrefeitura.jsx";
import { ActionListaAlvaraBombeiro } from "./ActionAvaraBombeiroLista/actionListaAlvaraBombeiro.jsx";
import { ActionListaAlvaraMeioAmbiente } from "./ActionAvaraMeioAmbienteLista/actionListaAlvaraMeioAmbiente.jsx";
import { ActionListaAlvaraVigilanciaSanitaria } from "./ActionAvaraVigilanciaSanitariaLista/actionListaAlvaraVigilanciaSanitaria.jsx";

export const FormularioActionAlvaraEmpresa = ({
    dadosAlvaraEmpresaSelecionada,
    handleClose,
    usuarioLogado,
    optionsModulos,
    refetchAlvaraEmpresa,
    refetchAlvaraSelecionado
}) => {

    const { formState: { errors }, clearErrors, control } = useForm({
        mode: "onChange"
    });

    const grupoEmpresarial = [
        { IDGRUPOEMPRESARIAL: "1", DSGRUPOEMPRESARIAL: "TO-TESOURA DE OURO" },
        { IDGRUPOEMPRESARIAL: "2", DSGRUPOEMPRESARIAL: "MG-MAGAZINE" },
        { IDGRUPOEMPRESARIAL: "3", DSGRUPOEMPRESARIAL: "YO-YORUS" },
        { IDGRUPOEMPRESARIAL: "4", DSGRUPOEMPRESARIAL: "FC-FREE CENTER" },
        { IDGRUPOEMPRESARIAL: "5", DSGRUPOEMPRESARIAL: "OT-OUTLET" },
    ]

    const getGrupoNome = (id) => {
        const grupo = grupoEmpresarial.find(
            item => String(item.IDGRUPOEMPRESARIAL) === String(id)
        );

        return grupo ? grupo.DSGRUPOEMPRESARIAL : "";
    };

    return (
        <Fragment>
            <form className="border p-2 rounded h-100 shadow-sm bg-white">
                <span class="d-flex align-items-center">
                    <BsBuilding size={25} />
                    <h1 class="font-weight-bold" style={{ margin: 0, marginLeft: "15px" }}>
                        Dados Empresa
                    </h1>
                </span>
                <div class="form-group">

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-1">
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
                        <div class="col-sm-6 col-xl-2">
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
                        <div class="col-sm-6 col-xl-3">
                            <Controller
                                name="Grupo Empresarial"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Grupo Empresarial"}
                                        name="Grupo Empresarial"
                                        type="text"
                                        readOnly={true}
                                        value={getGrupoNome(dadosAlvaraEmpresaSelecionada[0]?.IDGRUPOEMPRESARIAL)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>

                        <div class="col-sm-6 col-xl-2">
                            <Controller
                                name="Insc. Estadual"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Insc. Estadual"}
                                        name="Insc. Estadual"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraEmpresaSelecionada[0]?.NUINSCESTADUAL}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-2">
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
                        <div class="col-sm-6 col-xl-2">
                            <Controller
                                name="CNPJ"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"CNPJ"}
                                        name="CNPJ"
                                        type="text"
                                        readOnly={true}
                                        value={mascaraCNPJ(String(dadosAlvaraEmpresaSelecionada[0]?.NUCNPJ) || '')}
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

                        <div class="col-sm-6 col-xl-6">
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

                <hr style={{ borderTop: "1px dashed #eeeeee", margin: "30px 0" }} />

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
                        <div class="col-sm-6 col-xl-6">
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

                        <div class="col-sm-6 col-xl-3">
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
                        <div class="col-sm-6 col-xl-3">
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
                        <div class="col-sm-6 col-xl-1">
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
                    <div class="row mt-3 g-3">
                        <div class="col-sm-6 col-xl-2">
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

                <hr style={{ borderTop: "1px dashed #eeeeee", margin: "30px 0" }} />

                <span class="d-flex align-items-center">
                    <MdOutlinePhoneEnabled size={25} />
                    <h2 class="font-weight-bold" style={{ margin: 0, marginLeft: "15px" }}>
                        Contatos
                    </h2>
                </span>

                <div className="row  m-3 g-3">

                    {dadosAlvaraEmpresaSelecionada?.[0]?.LISTA_GERENTES?.map((gerente, index) => (
                        <div key={`gerente-${index}`} className="mt-3 col-sm-6 col-xl-6">
                            <div className="border p-3 rounded h-100 shadow-sm bg-white">

                                <span className="d-flex align-items-center">
                                    <CiUser size={20} />
                                    <h5 className="font-weight-bold ms-2 mb-0">
                                        Gerente da Loja
                                    </h5>
                                </span>

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <label className="form-label">Nome</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <BsPerson size={17} />
                                            </span>
                                            <input
                                                className="form-control"
                                                value={gerente?.NOFUNCIONARIO || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <label className="form-label">E-mail</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <BsEnvelopeAt size={17} />
                                            </span>
                                            <input
                                                className="form-control"
                                                value={dadosAlvaraEmpresaSelecionada?.[0]?.EEMAILPRINCIPAL || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <label className="form-label">Telefone</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <BsTelephone size={17} />
                                            </span>
                                            <input
                                                className="form-control"
                                                value={
                                                    mascaraTelefone(gerente?.TELEFONE) ||
                                                    "Telefone não cadastrado"
                                                }
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                    {dadosAlvaraEmpresaSelecionada?.[0]?.LISTA_SUPERVISORES?.map((supervisor, index) => (
                        <div key={`supervisor-${index}`} className="mt-3 col-sm-6 col-xl-6">
                            <div className="border p-3 rounded h-100 shadow-sm bg-white">

                                <span className="d-flex align-items-center">
                                    <CiUser size={20} />
                                    <h5 className="font-weight-bold ms-2 mb-0">
                                        Supervisor da Loja
                                    </h5>
                                </span>

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <label className="form-label">Nome</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <BsPerson size={17} />
                                            </span>
                                            <input
                                                className="form-control"
                                                value={supervisor?.NOFUNCIONARIO || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <label className="form-label">E-mail</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <BsEnvelopeAt size={17} />
                                            </span>
                                            <input
                                                className="form-control"
                                                value={dadosAlvaraEmpresaSelecionada?.[0]?.EEMAILPRINCIPAL || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <label className="form-label">Telefone</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <BsTelephone size={17} />
                                            </span>
                                            <input
                                                className="form-control"
                                                value={
                                                    mascaraTelefone(supervisor?.TELEFONE) ||
                                                    "Telefone não cadastrado"
                                                }
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                <hr style={{ borderTop: "1px dashed #eeeeee", margin: "30px 0" }} />


                <div className="row m-0 g-3">

                    <div className="col-12 col-xl-6">
                        <ActionListaAlvaraBombeiro
                            dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}
                            handleClose={handleClose}
                            optionsModulos={optionsModulos}
                            usuarioLogado={usuarioLogado}
                            refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                            refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                        />
                    </div>

                    <div className="col-12 col-xl-6">
                        <ActionListaAlvaraMeioAmbiente
                            dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}
                            handleClose={handleClose}
                            optionsModulos={optionsModulos}
                            usuarioLogado={usuarioLogado}
                            refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                            refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                        />
                    </div>

                    <div className="col-12 col-xl-6">
                        <ActionListaAlvaraVigilanciaSanitaria
                            dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}
                            handleClose={handleClose}
                            optionsModulos={optionsModulos}
                            usuarioLogado={usuarioLogado}
                            refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                            refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                        />
                    </div>

                    <div className="col-12 col-xl-6">
                        <ActionListaAlvaraPrefeitura
                            dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}
                            handleClose={handleClose}
                            optionsModulos={optionsModulos}
                            usuarioLogado={usuarioLogado}
                            refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                            refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                        />
                    </div>
                </div>
            </form>
            <FooterModal
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}