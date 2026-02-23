import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ActionListaVisualizarDetalhe } from "./actionListaVisualizarDetalhe";
import { toFloat } from "../../../../../utils/toFloat";


export const ActionDetalhesAlteracaoPrecos = ({ show, handleClose, dadosVisualizarDetalhe }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [statusSelecionado, setStatusSelecionado] = useState(null)
  const [authEdit, setAuthEdit] = useState(true);

  const optionsStatus = [
    { value: 'True', label: 'CANCELADA' },
    { value: 'False', label: 'EM ESPERA' },
    { value: 'FINALIZADA', label: 'FINALIZADA' }
  ]
  
  // useEffect(() => {
  //   if (dadosVisualizarDetalhe?.length > 0) {
  //     const dados = dadosVisualizarDetalhe[0].alteracaoPreco || {};

  //     const stCancelado = dados?.STCANCELADO;
  //     const stExecutado = dados?.STEXECUTADO == "True" ? "FINALIZADA" : "False";
  //     const dtAlterAgendada = new Date(dados.AGENDAMENTOALTERACAO);
  //     const dataHoraHoje = new Date();

  //     const authEditCheck = stExecutado == "False" && stCancelado != "True" && dtAlterAgendada.getTime() > dataHoraHoje.getTime();
  //     setAuthEdit(authEditCheck);

  //     const stAlteracao = stCancelado == "False" && stExecutado == "FINALIZADA" ? stExecutado : stCancelado;
  //     const selectedOption = optionsStatus.find(opt => opt.value == stAlteracao);
  //     setStatusSelecionado(selectedOption);
  //     console.log(selectedOption, 'selectedOption');
  //     console.log(statusSelecionado, 'statusSelecionado');
  //   }
  // }, [dadosVisualizarDetalhe]);

  useEffect(() => {
    if (dadosVisualizarDetalhe?.length > 0) {
      const dados = dadosVisualizarDetalhe[0]?.alteracaoPreco || {};
  
      const stCancelado = dados.STCANCELADO;
      const stExecutado = dados.STEXECUTADO === "True" ? "FINALIZADA" : "False";
      const dtAlterAgendada = new Date(dados.AGENDAMENTOALTERACAO);
      const dataHoraHoje = new Date();
  
      // Verifica se é permitido editar
      const authEditCheck = stExecutado === "False" && stCancelado !== "True" && dtAlterAgendada.getTime() > dataHoraHoje.getTime();
      setAuthEdit(authEditCheck);
  
      // Determina o status da alteração
      const stAlteracao = stCancelado === "False" && stExecutado === "FINALIZADA" ? stExecutado : stCancelado;
      
      // Verifica se há correspondência no optionsStatus
      const selectedOption = optionsStatus.find(opt => opt.value === stAlteracao) || null;
  
      setStatusSelecionado(selectedOption); // Define null se não encontrar
      console.log(selectedOption, 'selectedOption');
      console.log(statusSelecionado, 'statusSelecionado');
      console.log(dadosVisualizarDetalhe, "dadosVisualizarDetalhe");
    }
  }, [dadosVisualizarDetalhe]);

  
  const handleChangeStatus = (selectedOption) => {
    setStatusSelecionado(selectedOption);
  };

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
          title={"Edição de Alteração de Preços"}
          subTitle={`Alteração de Preço Nº: ${dadosVisualizarDetalhe[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}`}
          handleClose={handleClose}
        />


        <Modal.Body>
          <form action="">
            <div className="form-group">
              <div className="row">
                <div className="col-sm-3 col-xl-2">
                  <InputFieldModal
                    label={"Data Criação *"}
                    type={"text"}

                    id={"dtCreateListaPreco"}
                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.DATACRIACAOFORMATADA}
                    onChangeModal={""}
                    readOnly={true}
                    {...register("dtCreateListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    
                  />
                </div>
                <div className="col-sm-3 col-xl-2">
                  <InputFieldModal
                    label={"Data Alteração *"}
                    type={"text"}

                    id={"dtAlterListaPreco"}
                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.AGENDAMENTOALTERACAOFORMATADO}
                    onChangeModal={""}
                    readOnly={true}
                    {...register("dtAlterListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
           
                  />
                </div>

                <div className="col-sm-3 col-xl-2">

                  <label htmlFor="">Status Alteração *</label>
                  <Select
                    value={statusSelecionado}
                    options={optionsStatus}
                    onChange={handleChangeStatus}
                    // isDisabled={!authEdit}
                  />
                </div>
                <div className="col-sm-3 col-xl-1">
                  <InputFieldModal
                    label={"Alteração "}
                    type={"text"}

                    id={"idListaPreco"}
                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}
                    onChangeModal={""}
                    readOnly={true}
                    {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                   
                  />
                </div>
                <div className="col-sm-2 col-xl-3">
                  <InputFieldModal
                    label={"Lista Alvo de Alteração *"}
                    type={"text"}

                    id={"nomeListaPreco"}
                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.NOMELISTA}
                    onChangeModal={""}
                    readOnly={true}
                    {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    
                  />
                </div>

                <div className="col-sm-3 col-xl-2">
                  <InputFieldModal
                    label={"Qtd. Produtos"}
                    type={"text"}

                    id={"idListaPreco"}
                    value={toFloat(dadosVisualizarDetalhe[0]?.alteracaoPreco.QTDITENS)}
                    onChangeModal={""}
                    readOnly={true}
                    {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    
                  />
                </div>

              </div>


              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Responsável "}
                    type={"text"}

                    id={"nomeListaPreco"}
                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.NOFUNCIONARIO}
                    onChangeModal={""}

                    {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>

            </div>

            <ActionListaVisualizarDetalhe dadosVisualizarDetalhe={dadosVisualizarDetalhe} />
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