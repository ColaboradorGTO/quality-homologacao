import { Fragment, useEffect, useState } from "react"
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai"
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { CiEdit } from "react-icons/ci";
import { FaRegSave } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../Modais/FooterModal/footerModal";
import TabelaPrincipal from "../Tables/TabelaMain";
import axios from "axios";
import { InputSelect } from "../Buttons/InputSelect";
import { InputFieldModal } from "../Buttons/InputFieldModal";
import { ButtonType } from "../Buttons/ButtonType";
import { ButtonTypeModal } from "../Buttons/ButtonTypeModal";

export const ConferenciaCegaActionIncluirotModal = ({ show, handleClose }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    getTabelas()
  }, [])

  const getTabelas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/ListaVendas")
      if (response.data) {
        setDadosExemplos(response.data)
        // console.log(response.data, 'get tabelas')
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const colunasExemplo = [
    'Produto',
    'Cód. Barras',
    'Descrição',
    'R$ Venda',
    'R$ Custo',
    'Qtd',
    'Opções'
  ];

  const handleEdit = (item) => {
    // Lógica para manipular a edição do item
    console.log(`Editando item: ${item.id}`);
  };

  const handleSave = (item) => {
    // Lógica para salvar o item editado
    console.log(`Salvando item: ${item.id}`);
  };

  const handleCancel = (item) => {
    // Lógica para cancelar a edição do item
    console.log(`Cancelando edição do item: ${item.id}`);
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  }

  const handleProximaPagina = () => {
    const totalPaginas = Math.ceil(dadosExemplos.length / itensPorPagina);
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  }

  const handlePaginaClicada = (pagina) => {
    setPaginaAtual(pagina);
  }

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = paginaAtual * itensPorPagina;
  const dadosPaginados = dadosExemplos.slice(indiceInicial, indiceFinal);

  const options = [
    { value: "Funcionario 1", label: "Funcionario 1" },
    { value: "Funcionario 2", label: "Funcionario 2" },
  ]

  return (

    <Fragment>

      <div id="resultadocadestrutura"></div>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"

      >
        <div className="modal-content">

          <HeaderModal
            title="Ordem de Transferência"
            subtitle="Nome da Loja"
            handleClose={handleClose}
          />
          <div className="modal-body" id="resultadoot"><div id="resultadocadestrutura"></div>

            <div className="form-group" data-select2-id="737">
              <div className="row" data-select2-id="736">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Loja Origem"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}  
                  />                 
                </div>
                <div className="col-sm-6 col-xl-6" data-select2-id="735">
                  <InputSelect
                    label={"Loja Destino"}
                    type="select"
                    // id="idlojadestinomodal"
                    options={options}  
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-6 col-xl-4">
                <InputFieldModal
                    label={"Produto"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={false}  
                  />   
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-8 col-xl-8">
                  
                <ButtonTypeModal
                  Icon={FaRegSave}
                  textButton={"Salvar"}
                  cor={"info"}
                  className={"mr-4"}
                  // onClickButtonType={salvarot}

                />
               </div>
                <div className="col-sm-8 col-xl-8 mt-4">
                  <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                </div>
              </div>
            </div>

            <TabelaPrincipal
              id="tabelaprodutos"
              colunas={colunasExemplo}
              data={dadosPaginados}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              paginaAtual={paginaAtual}
              itensPorPagina={itensPorPagina}
              onPaginaAnterior={handlePaginaAnterior}
              onProximaPagina={handleProximaPagina}
              onPaginaClicada={handlePaginaClicada}

            />
                  
          </div>

          <FooterModal handleClose={handleClose} />
        </div>
      </Modal>

    </Fragment>
  )
}