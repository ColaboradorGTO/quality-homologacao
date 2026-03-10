import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { Fragment } from "react"


export const ActionDocumentacaoCriar = ({ show, handleClose }) => {
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
                        Regras de Negócio
                    </h1>


                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}>
                            1. Seleção de Mecânica
                        </h2>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            É obrigatório selecionar uma mecânica para atualizar a promoção.
                        </li>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            A mecânica define como a promoção será aplicada (por pares, todos os produtos, menos na primeira, em um produto, etc).
                        </li>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            Algumas validações específicas são feitas conforme o tipo de mecânica e aplicação de destino.
                        </li>
                    </ul>

                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}>  2. Empresas Vinculadas  </h2>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            É obrigatório selecionar pelo menos uma empresa para a promoção.
                        </li>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            Por padrão, as empresas já vinculadas à promoção são carregadas e selecionadas.
                        </li>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            O usuário pode adicionar ou remover empresas conforme necessário.
                        </li>
                        {/* <li style={{ color: "#000", fontWeight: "500" }}>
                            Não é permitido cadastrar mais de 3 promoções ativas para a mesma empresa.
                        </li> */}
                    </ul>

                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}>  3. Descrição da Promoção  </h2>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            É obrigatório preencher a descrição da promoção.
                        </li>
                        <li style={{ color: "#000", fontWeight: "500" }}>
                            A descrição deve ter entre **20 e 80 caracteres**.
                        </li>
                    </ul>

                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}>  4. Produtos Origem e Destino  </h2>
                        {/* <h3 style={{ color: "red", fontWeight: "600" }}>
                           Observação: via upload de arquivo, somente pelo N.Item serão inseridos(.csv, .xls, .xlsx).
                            
                        </h3> */}
                        <h4 style={{ color: "red", fontWeight: "600" }}>
                            Observação: via upload de arquivo, somente pelo N.Item serão inseridos(.csv, .xls, .xlsx).
                            Não funciona com o código de barras e não pode passar de 1000 itens por arquivo.
                            
                        </h4>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            Para algumas mecânicas, os produtos de origem e destino devem ser iguais:
                            <ul>
                                <li style={{ color: "#000", fontWeight: "500" }}>Por pares ou menos na primeira: produtos de origem e destino devem ser idênticos.</li>
                                <li style={{ color: "#000", fontWeight: "500" }}>Por todos os produtos: quantidade de produtos de origem e destino deve ser igual.</li>
                                <li style={{ color: "#000", fontWeight: "500" }}>Em um produto: apenas um produto pode ser enviado tanto na origem quanto no destino, e eles devem ser iguais.</li>
                            </ul>
                        </li>
                    </ul>

                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}>  5. Validações de Promoção Ativa  </h2>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            Não é permitido cadastrar uma promoção se já existir:
                            <ul>
                                <li style={{ color: "#000", fontWeight: "500" }}>Uma promoção ativa com a mesma aplicação de destino na empresa.</li>
                                <li style={{ color: "#000", fontWeight: "500" }}>Uma promoção por pares e em um produto ao mesmo tempo.</li>
                                <li style={{ color: "#000", fontWeight: "500" }}>Um desconto ativo com o mesmo tipo de desconto na empresa.</li>
                                <li style={{ color: "#000", fontWeight: "500" }}>Mais de 3 promoções ativas para a mesma empresa.</li>
                                <li style={{ color: "#000", fontWeight: "500" }}>Promoção por pares já existente.</li>
                                <li style={{ color: "#000", fontWeight: "500" }}>Promoção menos na primeira já existente.</li>
                            </ul>
                        </li>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            Produtos destino não podem estar vinculados a outra promoção ativa.
                        </li>
                    </ul>

                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}> 6. Datas  </h2>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            A data de início e fim da promoção são obrigatórias.
                        </li>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            A data final é sempre enviada com o horário "23:59:59".
                        </li>
                    </ul>

                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}> 7. Status da Promoção  </h2>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            O status da promoção pode ser "ATIVO" ou "INATIVO".
                        </li>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            Lembrando que a promoção será ativada ou desativada de acordo com a data de início e fim.
                        </li>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            O status "ativo" ou "inativo" serve apenas para exibição ao usuário, se as datas estiverem dentro do prazo, o PDV continuará aplicando os descontos da promoção.
                        </li>

                    </ul>

                    <ul>
                        <h2 style={{ color: "#7453A6", fontWeight: "bold" }}> 8. Promoção por Estrutura Mercadológica  </h2>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            Ao criar uma promoção por estrutura não pode adicionar produtos.
                        </li>
                        <li style={{ color: "#000", fontWeight: "600" }}>
                            Toda estrutura de produtos será bloqueada para pesquisa e cadastro da promoção.
                        </li>
        
                    </ul>

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