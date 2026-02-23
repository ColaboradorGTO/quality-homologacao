import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { Fragment } from "react"
import { Accordion, AccordionTab } from 'primereact/accordion';

export const ActionDocumentacaoAtualizar = ({ show, handleClose }) => {
    return (
        <Fragment>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                className="modal fade"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
                dialogClassName="draggable-modal"
            >
                <HeaderModal
                    title={"Atualização de Promoção"}
                    subTitle={"Regras de Negócio"}
                    handleClose={handleClose}
                />

                <Modal.Body>
                    <h1 style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>
                        Regras de Negócio - Edição de Promoção
                    </h1>

                    <div style={{ marginBottom: "20px" }}>
                        <h2 style={{ color: "#28a745", fontWeight: "bold", marginBottom: "10px" }}>
                            ✅ O que PODE ser alterado:
                        </h2>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Data Fim:</strong> Pode ser estendida ou reduzida conforme necessário
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Empresas da Promoção:</strong> Adicionar ou remover empresas participantes
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Produtos Origem:</strong> Adicionar ou remover produtos de origem da promoção
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Produtos Destino:</strong> Adicionar ou remover produtos de destino da promoção
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Status:</strong> Ativar ou desativar a promoção
                            </li>
                        </ul>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <h2 style={{ color: "#dc3545", fontWeight: "bold", marginBottom: "10px" }}>
                            ❌ O que NÃO pode ser alterado:
                        </h2>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Mecânica:</strong> Não pode ser alterada após a criação da promoção
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Data Início:</strong> Não pode ser modificada após criação
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Descrição:</strong> Permanece fixa após criação
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Valores de Desconto:</strong> Percentual e valor fixo não podem ser alterados
                            </li>
                            <li style={{ color: "#000", fontWeight: "500", marginBottom: "8px" }}>
                                <strong>Quantidades:</strong> QTD a partir de e valor a partir de são fixos
                            </li>
                        </ul>
                    </div>

                    <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", border: "1px solid #dee2e6" }}>
                        <h3 style={{ color: "#495057", fontWeight: "bold", marginBottom: "10px" }}>
                            📋 Instruções Importantes:
                        </h3>
                        <ol style={{ paddingLeft: "20px" }}>
                            <li style={{ marginBottom: "8px" }}>
                                Para adicionar produtos, use o campo de pesquisa ou faça upload de arquivo CSV/Excel
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                    Se os produtos forem inseridos via CSV/Excel, o arquivo deve conter apenas uma coluna com o número de itens.
                                     Não funciona com Código de Barras.
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                Para remover produtos, clique no botão de visualizar Produtos da Promoção Ativa e remova individualmente
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                Para remover Empresa da Promoção, clique no botão de visualizar Empresas e remova individualmente
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                Alterações em empresas afetam onde a promoção será aplicada
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                A data fim não pode ser anterior à data atual 
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                Quando for alterar a data de uma promoção e ela estiver inativa, altere a data e o status para ativar a data fim, ativa no PDV e o status ativa para pesquisar a promoção.
                            </li>
                        </ol>
                    </div>
                </Modal.Body>

                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}
                />
            </Modal>
        </Fragment>
    )
}