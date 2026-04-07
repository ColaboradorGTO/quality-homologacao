import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ActionListaVisualizarDetalhe } from "./actionListaVisualizarDetalhe";
import { Formulario } from "./formulario";

export const ActionDetalhesAlteracaoPrecos = ({
  show,
  handleClose,
  dadosVisualizarDetalhe,
  optionsModulos,
  usuarioLogado
}) => {
  const [title, setTitle] = useState('');
  const [authEdit, setAuthEdit] = useState(true);

  useEffect(() => {
    if (dadosVisualizarDetalhe?.length > 0) {
      const dados = dadosVisualizarDetalhe[0]?.alteracaoPreco || {};
      const stCancelado = dados.STCANCELADO;
      const stExecutado = dados.STEXECUTADO === "True" ? "FINALIZADA" : "False";
      const dtAlterAgendada = new Date(dados.AGENDAMENTOALTERACAO);
      const dataHoraHoje = new Date();

      const authEditCheck = stExecutado === "False" && stCancelado !== "True" && dtAlterAgendada.getTime() > dataHoraHoje.getTime();
      setAuthEdit(authEditCheck);
      if (!authEditCheck && (stExecutado != 'False' || stCancelado == 'True')) {
        setTitle(`Visualização dos Detalhes da Alteração de Preços`);
      } else {
        setTitle('Edição de Alteração de Preços');
      }
    }
  }, [dadosVisualizarDetalhe]);

  return (

    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        centered
      >
        <HeaderModal
          title={title}
          subTitle={`Alteração de Preço Nº: ${dadosVisualizarDetalhe[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}`}
          handleClose={handleClose}
        />

        <Modal.Body>

          <Formulario
            handleClose={handleClose}
            dadosVisualizarDetalhe={dadosVisualizarDetalhe}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
          />

          <ActionListaVisualizarDetalhe dadosVisualizarDetalhe={dadosVisualizarDetalhe} />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}