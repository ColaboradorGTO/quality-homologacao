import React, { Fragment, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { InputSelect } from "../../../Buttons/InputSelect";
import { useForm } from "react-hook-form";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import Select from 'react-select';

export const ActionCadastrarEmpresaModal = ({ show, handleClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [grupoEmpresarial, setGrupoEmpresarial] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [dataCriacao, setDataCriacao] = useState('');
  const [CNPJ, setCNPJ] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('');
  const [CNAE, setCNAE] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [ibge, setIbge] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [pis, setPis] = useState('');
  const [cofins, setCofins] = useState('');



  const optionsStatus = [
    { value: "True", label: "SIM" },
    { value: "False", label: "NÃO" }
  ]
  return (

    <Fragment>

      <Modal show={show} handleClose={handleClose} size="lg">
        <HeaderModal
          title={"Dados da Empresa"}
          subTitle={"Cadastrar ou Atualizar informações da Empresa"}
          handleClose={handleClose}
        />

        <Modal.Body>


          <div className="row">
            <div className="col-sm-3 col-xl-4">
            <InputSelect
                options={optionsStatus}
                label={"Grupo Empresarial"}
                type="select"
                id=""

              />
              {/* <Select
                  closeMenuOnSelect={false}
                  options={atualizacaoDiario.map((item) => {
                    return {
                      value: item.value, 
                      label: item.label
                    };
                  })}
                  value={atualizacaoDiario.find(option => option.value === statusLimpar)}
                  onChange={(selectedOption) => setStatusLimpar(selectedOption?.value)}
              /> */}
            </div>
            <div className="col-sm-3 col-xl-4">
              <InputSelect
                options={options}
                label={"Situação"}
                type="select"
                id=""

              />

              <Select
                closeMenuOnSelect={false}
                options={optionsStatus.map((item) => {
                  return {
                    value: item.value, 
                    label: item.label
                  };
                })}
                value={optionsStatus.find(option => option.value === statusSelecionado)}
                onChange={(selectedOption) => setStatusSelecionado(selectedOption?.value)}
              />
            </div>
            <div className="col-sm-3 col-xl-4">
              <InputFieldModal
                label={"Data de Criação *"}
                type="date"
                id={"dataCriacao"}
                value={dataCriacao}
                onChangeModal={(e) => setDataCriacao(e.target.value)}
                {...register("data", { required: "Campo obrigatório Informe o Data Criação", })}
                />
                {errors.data && <span className="text-danger">{errors.data.message}</span>}
            </div>

          </div>

          <div className="row mt-3">
            <div className="col-sm-3 col-xl-4">
              <InputFieldModal
                label={"CNPJ*"}
                type="text"
                placeholder={"DIGITE SEM PONTOS OU TRAÇOS"}
                id={"CNPJ"}
                value={CNPJ}
                onChangeModal={(e) => setCNPJ(e.target.value)}
                {...register("PJ", { required: "Campo obrigatório Informe o CNPJ", })}
              />
              {errors.PJ && <span className="text-danger">{errors.PJ.message}</span>}
            </div>
            <div className="col-sm-3 col-xl-4">
              <InputFieldModal
                label={"Inscrição Estadual"}
                type="text"
                placeholder={"DIGITE SEM PONTOS OU TRAÇOS"}
                id={"inscricaoEstadual"}
                value={inscricaoEstadual}
                onChangeModal={(e) => setInscricaoEstadual(e.target.value)}
                {...register("inscEstadual", { required: "Campo obrigatório Informe a Inscrição Estadual", })}
              />
              {errors.inscEstadual && <span className="text-danger">{errors.inscEstadual.message}</span>}
            </div>

            <div className="col-sm-3 col-xl-4">
              <InputFieldModal
                label={"Inscrição Municipal"}
                type="text"
                placeholder={"DIGITE SEM PONTOS OU TRAÇOS"}
                id={"inscMunicipal"}
                value={inscricaoMunicipal}
                onChangeModal={(e) => setInscricaoMunicipal(e.target.value)}
                {...register("inscMunicipal", { required: "Campo obrigatório Informe a Inscrição Municipal", })}
              />
              {errors.inscMunicipal && <span className="text-danger">{errors.inscMunicipal.message}</span>}
            </div>
          </div>

  
          <div className="form-group" onsubmit="return false">
            <div className="row mt-3">
              <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"CNAE"}
                  type="text"
                  placeholder={"DIGITE SEM PONTOS OU TRAÇOS"}
                  id={"CN"}
                  value={CNAE}
                  onChangeModal={(e) => setCNAE(e.target.value)}
                  {...register("CN", { required: "Campo obrigatório Informe o CNAE", })}
                />
                {errors.CN && <span className="text-danger">{errors.CN.message}</span>}
              </div>
              <div className="col-sm-4 col-xl-4">
                <InputFieldModal
                  label={"Razão Social*"}
                  type="text"
                  id={"razao"}
                  value={razaoSocial}
                  onChangeModal={(e) => setRazaoSocial(e.target.value)}
                  {...register("razao", { required: "Campo obrigatório Informe a Razão Social", })}
                />
                {errors.razao && <span className="text-danger">{errors.razao.message}</span>}
              </div>
              <div className="col-sm-1 col-xl-4">
                <InputFieldModal
                  label={"Nome Fantasia"}
                  type="text"
                  id={"nomeLoja"}
                  value={nomeFantasia}
                  onChangeModal={(e) => setNomeFantasia(e.target.value)}
                  {...register("nomeLoja", { required: "Campo obrigatório Informe o Nome Fantasia", })}
                />
                {errors.nomeLoja && <span className="text-danger">{errors.nomeLoja.message}</span>}
              </div>

            </div>

            <div className="row mt-3" >
              <div className="col-sm-4 col-xl-4">
                <InputFieldModal
                  label={"CEP"}
                  type="number"
                  placeholder={"DIGITE SEM PONTOS OU TRAÇOS"}
                  id={"cepCidade"}
                  value={cep}
                  onChangeModal={(e) => setCep(e.target.value)}
                  {...register("cepCidade", { required: "Campo obrigatório Informe o CEP", })}
                />
                {errors.cepCidade && <span className="text-danger">{errors.cepCidade.message}</span>}
              </div>
              <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"Endereço"}
                  type="text"
                  id={"end"}
                  value={endereco}
                  onChangeModal={(e) => setEndereco(e.target.value)}
                  {...register("end", { required: "Campo obrigatório Informe o Endereço", })}
                />
                {errors.end && <span className="text-danger">{errors.end.message}</span>}
              </div>

              <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"Complemento"}
                  type="text"
                  id={"comp"}
                  value={complemento}
                  onChangeModal={(e) => setComplemento(e.target.value)}
                  {...register("comp", { required: "Campo obrigatório Informe o Complemento", })}
                />
                {errors.comp && <span className="text-danger">{errors.comp.message}</span>}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"Bairro"}
                  type="text"
                  id={"bairroCidade"}
                  value={bairro}
                  onChangeModal={(e) => setBairro(e.target.value)}
                  {...register("bairroCidade", { required: "Campo obrigatório Informe o Bairro", })}
                />
                {errors.bairroCidade && <span className="text-danger">{errors.bairroCidade.message}</span>}
              </div>
              <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"Cidade"}
                  type="text"
                  id={"cid"}
                  value={cidade}
                  onChangeModal={(e) => setCidade(e.target.value)}
                  {...register("cid", { required: "Campo obrigatório Informe a Cidade", })}
                />
                {errors.cid && <span className="text-danger">{errors.cid.message}</span>}
              </div>

              <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"Estado"}
                  type="text"
                  id={"Esta"}
                  value={estado}
                  onChangeModal={(e) => setEstado(e.target.value)}
                  {...register("Esta", { required: "Campo obrigatório Informe o Estado", })}
                />
                {errors.Esta && <span className="text-danger">{errors.Esta.message}</span>}
              </div>

              <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"IBGE"}
                  type="text"
                  placeholder={"DIGITE SEM PONTOS OU TRAÇOS"}
                  id={"ibg"}
                  value={ibge}
                  onChangeModal={(e) => setIbge(e.target.value)}
                  {...register("ibg", { required: "Campo obrigatório Informe o IBGE", })}
                />
                {errors.ibg && <span className="text-danger">{errors.ibg.message}</span>}
              </div>
            </div>


            <div className="row mt-3">
            <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"E-mail"}
                  type="email"
                  id={"ema"}
                  value={email}
                  onChangeModal={(e) => setEmail(e.target.value)}
                  {...register("ema", { required: "Campo obrigatório Informe o E-mail", })}
                />
                {errors.ema && <span className="text-danger">{errors.ema.message}</span>}
              </div>
            <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"Telefone"}
                  type="number"
                  id={"numero"}
                  value={telefone}
                  onChangeModal={(e) => setTelefone(e.target.value)}
                  {...register("numero", { required: "Campo obrigatório Informe o Telefone", })}
                />
                {errors.numero && <span className="text-danger">{errors.numero.message}</span>}
              </div>
            <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"PIS"}
                  type="number"
                  placeholder={"1.65"}
                  id={"pi"}
                  value={pis}
                  onChangeModal={(e) => setPis(e.target.value)}
                  {...register("pi", { required: "Campo obrigatório Informe o PIS", })}
                />
                {errors.pi && <span className="text-danger">{errors.pi.message}</span>}
              </div>
            <div className="col-sm-2 col-xl-4">
                <InputFieldModal
                  label={"COFINS"}
                  type="number"
                  placeholder={"7.65"}
                  id={"cof"}
                  value={cofins}
                  onChangeModal={(e) => setCofins(e.target.value)}
                  {...register("cof", { required: "Campo obrigatório Informe o COFINS", })}
                />
                {errors.cof && <span className="text-danger">{errors.cof.message}</span>}
              </div>
            </div>

          </div>


          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            textButtonCadastrar={"Atualizar"}
            onClickButtonCadastrar={''}
            corCadastrar="success"

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"

          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
