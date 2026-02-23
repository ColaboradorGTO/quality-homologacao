// import { Fragment, useEffect, useState } from "react"
// import { ButtonSearch } from "../Buttons/ButtonSearch"
// import { InputField } from "../Buttons/Input"
// import { ActionMain } from "../Actions/actionMain"
// import { ButtonType } from "../Buttons/ButtonType"
// import TabelaPrincipal from "../Tables/TabelaMain"
// import axios from "axios"
// import { ComprasActionCadPromocaoModal } from "./comprasActionCadPromocaoModal"
// import { get } from "../../api/funcRequest"
// import { dataFormatada } from "../../utils/dataFormatada"
// import DataTable from 'react-data-table-component';
// import { formatMoeda } from "../../utils/formatMoeda"
// import { ButtonTable } from "../ButtonsTabela/ButtonTable"
// import { GrView } from "react-icons/gr"
// import Modal from 'react-bootstrap/Modal';
// import { ButtonTypeModal } from "../Buttons/ButtonTypeModal"
// import { HeaderModal } from "../Modais/HeaderModal/HeaderModal"
// import { FaRegTrashAlt } from "react-icons/fa"
// import { set } from "react-hook-form"
// import { FooterModal } from "../Modais/FooterModal/footerModal"
// import { ComprasActionDetalheEmpresaPromocao } from "./comprasActionDetalheEmpresaPromocao"

// export const ComprasPromocao = () => {
//   const [tabelaVisivel, setTabelaVisivel] = useState(false);
//   const [modalVisivel, setModalVisivel] = useState(false);
//   const [modalDetalhePromocaoVisivel, setModalDetalhePromocaoVisivel] = useState(false);
//   const [modalCadastrarVisivel, setModalCadastrarVisivel] = useState(false);
//   const [clickContador, setClickContador] = useState(0);
//   const [dadosExemplos, setDadosExemplos] = useState([]);
//   const [itensPorPagina, setItensPorPagina] = useState(10)
//   const [paginaAtual, setPaginaAtual] = useState(1);
//   const [dadosListaPromocao, setDadosListaPromocao] = useState([]);
//   const [dadosListaPromocaoEmpresa, setDadosListaPromocaoEmpresa] = useState([]);
//   const [dadosListaPromocaoProduto, setDadosListaPromocaoProduto] = useState([]);
//   const [dadosProdutoOrigem, setDadosProdutoOrigem] = useState([]);
//   const [dadosProdutoDestino, setDadosProdutoDestino] = useState([]);
//   const [dataInicio, setDataInicio] = useState("");
//   const [dataFim, setDataFim] = useState("");
//   const [itemSelecionado, setItemSelecionado] = useState(null);
  
//   useEffect(() => {
//     getListaProdutosCriados()
  
//   }, [])
  

//   const getListaProdutosCriados = async () => {
//     try {
//         const response = await get(`/listaPromocoes?dataPesquisaInicio=${dataInicio}&dataPesquisaFim=${dataFim}`)
//         if (response.data) {
//           setDadosListaPromocao(response.data)
//         }
//     } catch (error) {
//         console.log(error, "não foi possivel pegar os dados da tabela ")
//     }
//   }

//   const dadosPromocao = dadosListaPromocao.map((item, index) => {
//     let contador = index + 1;

//     return {
//       IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
//       DSPROMOCAOMARKETING: item.DSPROMOCAOMARKETING,
//       DTHORAINICIOFORMAT2: item.DTHORAINICIOFORMAT2,
//       DTHORAFIMFORMAT2: item.DTHORAFIMFORMAT2,
//       TPAPLICADOA: item.TPAPLICADOA,
//       APARTIRDEQTD: item.APARTIRDEQTD,
//       APARTIRDOVLR: item.APARTIRDOVLR,
//       TPFATORPROMO: item.TPFATORPROMO,
//       FATORPROMOVLR: item.FATORPROMOVLR,
//       FATORPROMOPERC: item.FATORPROMOPERC,
//       TPAPARTIRDE: item.TPAPARTIRDE,
//       VLPRECOPRODUTO: item.VLPRECOPRODUTO,
//       contador
//     }
//   });

//   const colunasPromocao = [
//     {
//       name: '#',
//       selector: row => row.contador,
//       sortable: true,
//       width: '5%'
//     },
//     {
//       name: 'Descrição',
//       selector: row => row.DSPROMOCAOMARKETING,
//       sortable: true,
//       width: '10%'
//     },
//     {
//       name: 'Data Início',
//       selector: row => dataFormatada(row.DTHORAINICIOFORMAT2),
//       sortable: true,
//     },
//     {
//       name: 'Data Fim',
//       selector: row => dataFormatada(row.DTHORAFIMFORMAT2),
//       sortable: true,
//     },
//     {
//       name: 'TP Aplicação',
//       selector: row => row.TPAPLICADOA,
//       sortable: true,
//       width: '15%'
//     },
//     {
//       name: 'QTD Apartir',
//       selector: row => parseFloat(row.APARTIRDEQTD),
//       sortable: true,
//     },
//     {
//       name: 'Vr. Apartir',
//       selector: row => formatMoeda(row.APARTIRDOVLR),
//       sortable: true,
//     },
//     {
//       name: 'Vr. Fator',
//       selector: row => formatMoeda(row.FATORPROMOVLR),
//       sortable: true,
//     },
//     {
//       name: 'Fator %',
//       selector: row => formatMoeda(row.FATORPROMOPERC),
//       sortable: true,
//     },
//     {
//       name: 'TP Apartir',
//       selector: row => row.TPAPARTIRDE,
//       sortable: true,
//     },
//     {
//       name: 'Vr. Produto',
//       selector: row => formatMoeda(row.VLPRECOPRODUTO),
//       sortable: true,
//     },
//     {
//       name: 'Opções',
//       width: '10%',
//       button: true,    
//       cell: (row) => (
//         <div style={{display: "flex", justifyContent: "space-around"}}>
//           <div className="p-1">
//             <ButtonTable
//               titleButton={"Detalhar Empresas da Promoção"}
//               onClickButton={() => handleClickDetalhar(row)}
//               Icon={GrView}
//               iconSize={18}
//               iconColor={"#fff"}
//               cor={"primary"} 

//             />
            
//           </div>
//           <div className="p-1">
//             <ButtonTable
//               titleButton={"Detalhar Produtos da Promoção"}
//               onClickButton={() => handleClickDetalharProduto(row)}
//               Icon={GrView}
//               iconSize={18}
//               iconColor={"#fff"}
//               cor={"info"}
//             />

//           </div>

//         </div>

//       ),
//     },
    
//   ]
  

//   // const handleClickDetalhar = (row) => {
//   //   setItemSelecionado(row);
//   //   setModalVisivel(true);
//   // };

//   const dadosPromocaoEmpresa = dadosListaPromocaoEmpresa.map((item, index) => {
//     let contador = index + 1;

//     return {
//       IDEMPRESAPROMOCAOMARKETING: item.IDEMPRESAPROMOCAOMARKETING,
//       IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
      
//       IDEMPRESA: item.IDEMPRESA,
//       STATIVO: item.STATIVO,
//       NOEMPPROMO: item.NOEMPPROMO,
//       contador
//     }
//   });

//   const colunasPromocaoEmpresa = [
//     {
//       name: '#',
//       selector: row => row.contador,
//       sortable: true,
//       width: '10%'
//     },
//     {
//       name: 'Empresa',
//       selector: row => row.NOEMPPROMO,
//       sortable: true,
      
//     },
//     {
//       name: 'Situação',
//       cell: (row) => (
//         <div style={{color: row.SATIVO == 'True' ? 'blue' : 'red'}}>

//           {row.STATIVO == 'True' ? 'Ativo' : 'Inativo' }
//         </div>
//       ) 
//     },
//     {
//       name: 'Opções',
//       button: true,
//       cell: (row) => (
//         <div style={{display: "flex", justifyContent: "space-around"}}>
//           <div className="p-1">
//             <ButtonTable
//               titleButton={"Excluir Empresas da Promoção"}
//               onClickButton={() => handleClickEdit(row) && expandableRowsComponent()}
//               Icon={FaRegTrashAlt}
//               iconSize={18}
//               iconColor={"#fff"}
//               cor={"danger"}
//             />
            
//           </div>
          

//         </div>

//       ),  
//     },
    
//   ]

//   const handleDetalhar = async (IDRESUMOPROMOCAOMARKETING) => {

//     try {

//       const response = await get(`/listaEmpresaPromocoes?idResumoPromocoes${IDRESUMOPROMOCAOMARKETING}`)
//       if (response.data && response.data.length > 0) {
//         setDadosListaPromocaoEmpresa(response.data)
//         setModalVisivel(true);
//       }
//     } catch (error) {
//       console.error('Erro ao buscar detalhes da venda: ', error);
//     }
//   };

//   const handleClickDetalhar = (row) => {
//     if (row && row.IDRESUMOPROMOCAOMARKETING) {
//       handleDetalhar(row.IDRESUMOPROMOCAOMARKETING);
//     }
//   };

//   const handleDetalharProduto = async (IDRESUMOPROMOCAOMARKETING) => {

//     try {

//       const response = await get(`/listaEmpresaPromocoes?idResumoPromocoes${IDRESUMOPROMOCAOMARKETING}`)

//       if (response.data && response.data.length > 0) {
//         setDadosListaPromocaoProduto(response.data)
//         setModalDetalhePromocaoVisivel(true);
//         console.log(response.data)
//       }
//     } catch (error) {
//       console.error('Erro ao buscar detalhes da venda: ', error);
//     }
//   };

//   const handleClickDetalharProduto = (row) => {
//     if (row && row.IDRESUMOPROMOCAOMARKETING) {
//       handleDetalharProduto(row.IDRESUMOPROMOCAOMARKETING);
//     }
//   };

//   const dadosListaProdutoOrigem = dadosProdutoOrigem.map((item, index) => {
//     let contador = index + 1;
//     // console.log(item, 'item origem')
//     return {
//       IDDETALHEPROMOCAOMARKETINGORIGEM: item.IDDETALHEPROMOCAOMARKETINGORIGEM,
//       IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
//       IDPRODUTOORIGEM: item.IDPRODUTOORIGEM,
//       NUCODBARRAS: item.NUCODBARRAS,
//       DSPRODUTO: item.DSPRODUTO,
//       contador
//     }
//   });

//   const colunasProdutoOrigem = [ 
//     {
//       name: "#",
//       selector: row => row.contador,
//       sortable: true,
//     },
//     {
//       name: "Cod. Barras",
//       selector: row => row.NUCODBARRAS,
//       sortable: true,
//     },
//     {
//       name: "Produtos",
//       selector: row => row.DSPRODUTO,
//       sortable: true,
//     },
//     {
//       name: 'Opções',
//       button: true,
//       cell: (row) => (
//         <div style={{display: "flex", justifyContent: "space-around"}}>
//           <div className="p-1">
//             <ButtonTable
//               titleButton={"Excluir Produto da Promoção"}
//               onClickButton
//               Icon={FaRegTrashAlt}
//               iconSize={18}
//               iconColor={"#fff"}
//               cor={"danger"}
//             />
            
//           </div>
//         </div>

//       ),  
//     }
    
//   ]

//   const dadosListaProdutoDestino = dadosProdutoDestino.map((item, index) => {
//     let contador = index + 1;
//     // console.log(item, 'item destinos')
//     return  {
//       IDDETALHEPROMOCAOMARKETINGDESTINO: item.IDDETALHEPROMOCAOMARKETINGDESTINO,
//       IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
//       IDPRODUTODESTINO: item.IDPRODUTODESTINO,
//       NUCODBARRASDESTINO: item.NUCODBARRASDESTINO,
//       DSPRODUTODESTINO: item.DSPRODUTODESTINO,
//       contador
//     }
//   })
//   const colunasProdutoDestino = [ 
//     {
//       name: "#",
//       selector: row => row.contador,
//       sortable: true,
//     },
//     {
//       name: "Cod. Barras",
//       selector: row => row.NUCODBARRASDESTINO,
//       sortable: true,
//     },
//     {
//       name: "Produtos",
//       selector: row => row.DSPRODUTODESTINO,
//       sortable: true,
//     },
//     {
//       name: 'Opções',
//       button: true,
//       cell: (row) => (
//         <div style={{display: "flex", justifyContent: "space-around"}}>
//           <div className="p-1">
//             <ButtonTable
//               titleButton={"Excluir Produto da Promoção"}
//               onClickButton
//               Icon={FaRegTrashAlt}
//               iconSize={18}
//               iconColor={"#fff"}
//               cor={"danger"}
//             />
            
//           </div>
//         </div>

//       ),  
//     }
    
//   ]

//   const handleExcluirProdutoDestino = async (IDPRODUTODESTINO) => {

//   }
//   const handleClickExcluirProdutoDestino = (row) => {
//     if (row && row.IDPRODUTODESTINO) {
//       handleExcluirProdutoDestino(row.IDPRODUTODESTINO);
//     }
//   }

//   const handleEcluirProdutoOrigem = async (IDPRODUTOORIGEM) => {
//   }
//   const handleClickExcluirProdutoOrigem = (row) => {
//     if (row && row.IDPRODUTOORIGEM) {
//       handleEcluirProdutoOrigem(row.IDPRODUTOORIGEM);
//     }
//   }

//   const handlePaginaAnterior = () => {
//     if (paginaAtual > 1) {
//       setPaginaAtual(paginaAtual - 1);
//     }
//   }

//   const handleProximaPagina = () => {
//     const totalPaginas = Math.ceil(dadosExemplos.length / itensPorPagina);
//     if (paginaAtual < totalPaginas) {
//       setPaginaAtual(paginaAtual + 1);
//     }
//   }

//   const handlePaginaClicada = (pagina) => {
//     setPaginaAtual(pagina);
//   }

//   const indiceInicial = (paginaAtual - 1) * itensPorPagina;
//   const indiceFinal = paginaAtual * itensPorPagina;
//   const dadosPaginados = dadosExemplos.slice(indiceInicial, indiceFinal);


//   const handleClick = () => {
//     setClickContador(prevContador => prevContador + 1);

//     if (clickContador % 2 === 0) {
//       setTabelaVisivel(false)
//       getListaProdutosCriados()
//     } else {

//       setTabelaVisivel(true)
//     }
//   }

//   const handleCloseModal = () => {
//     setModalVisivel(false);
//     setModalDetalhePromocaoVisivel(false);
//     setModalCadastrarVisivel(false);
//   }

//   const handleModalCadastro = () => {
//     setModalCadastrarVisivel(true);
//   }


//   return (

//     <Fragment>

//       <ActionMain
//         linkComponentAnterior={["Home"]}
//         linkComponent={["Lista de Promoções"]}
//         title="Programação - Promoções"
//         subTitle="Nome da Loja"

//         InputFieldDTInicioComponent={InputField}
//         valueInputFieldDTInicio={dataInicio}
//         labelInputFieldDTInicio={"Data Início"}
//         onChangeInputFieldDTInicio={(e) => setDataInicio(e.target.value)}

//         InputFieldDTFimComponent={InputField}
//         labelInputFieldDTFim={"Data Fim"}
//         valueInputFieldDTFim={dataFim}
//         onChangeInputFieldDTFim={(e) => setDataFim(e.target.value)}

//         ButtonSearchComponent={ButtonSearch}
//         linkNomeSearch={"Pesquisar"}
//         onButtonClickSearch={handleClick }

//         ButtonTypeCadastro={ButtonType}
//         linkNome={"Cadastrar Promoção"}
//         onButtonClickCadastro={handleModalCadastro}
//         corCadastro={"success"}
//       />

//       {tabelaVisivel && (
//          <DataTable
//          title="Lista de Pedidos Por Período"
//          columns={colunasPromocao}
//          data={dadosPromocao}

//          responsive
//          pagination={itensPorPagina}
//          paginationPerPage={10}
//          customStyles={{
//            header: {
//              style: {
//                backgroundColor: '#f2f2f2',
//                color: '#7a59ad',
//              },
//            },
//            headCells: {
//              style: {
//                backgroundColor: '#7a59ad',
//                color: 'white',
//                border: '1px solid #e9e9e9',
//              },
//            },
//            cells: {
//              style: {
//                backgroundColor: '#fbfbfb',
//                border: '0.1px solid #e9e9e9',
//                color: '#000',
//              },
//            },
//            pagination: {
//              style: {
//                backgroundColor: '#7a59ad',
//                color: 'white',
//              },
//            },

//          }}
//        />
//       )}

//       {modalVisivel && (
//       <Modal
//         show={modalVisivel}
//         onHide={handleCloseModal}
//         size="lg"
//         className="modal fade"
//         tabIndex={-1}
//         role="dialog"
//         aria-hidden="true"
//       >

//           <HeaderModal
//             title={`Detalhe da Promoção:   ${dadosPromocao[0]?.DSPROMOCAOMARKETING} - Nº ${dadosPromocao[0]?.IDRESUMOPROMOCAOMARKETING}`}
//             subTitle={"Lista das Empresas da Promoção"}
//             handleClose={handleCloseModal}
//           />
        
//           <Modal.Body>
        
//             <DataTable
//               columns={colunasPromocaoEmpresa}
//               data={dadosPromocaoEmpresa}
//               pagination={itensPorPagina}
//               paginationPerPage={10}
//               customStyles={{
//                 header: {
//                   style: {
//                     backgroundColor: '#f2f2f2',
//                     color: '#7a59ad',
//                   },
//                 },
//                 headCells: {
//                   style: {
//                     backgroundColor: '#7a59ad',
//                     color: 'white',
//                     border: '1px solid #e9e9e9',
//                   },
//                 },
//                 cells: {
//                   style: {
//                     backgroundColor: '#fbfbfb',
//                     border: '1px solid #e9e9e9',
//                     color: '#000',
//                   },
//                 },
//                 pagination: {
//                   style: {
//                     backgroundColor: '#7a59ad',
//                     color: 'white',
//                   },
//                 },

//               }}
//             />
            
        
//           </Modal.Body>

//           <div style={{ display: "flex", justifyContent: "end", }} className="modal-footer">
          
//             <ButtonTypeModal 
//               textButton={"Fechar"} 
//               onClickButtonType={handleCloseModal}
//               cor="secondary" 
//               tipo="button" 
//             />
            
//         </div>
//       </Modal>
//       )}   

//       {modalDetalhePromocaoVisivel && (
//         <Modal
//           show={modalDetalhePromocaoVisivel}
//           onHide={handleCloseModal}
//           size="lg"
//           className="modal fade"
//           tabIndex={-1}
//           role="dialog"
//           aria-hidden="true"
//         >

//           <HeaderModal
//             title={`Detalhe da Promoção:   ${dadosPromocao[0]?.DSPROMOCAOMARKETING} - Nº ${dadosPromocao[0]?.IDRESUMOPROMOCAOMARKETING}`}
//             subTitle={"Lista dos Produtos da Promoção"}
//             handleClose={handleCloseModal}
//           />
        
//           <Modal.Body>
          
//             <div>

//               <DataTable
//                 title="Produtos de Origem"
//                 columns={colunasProdutoOrigem}
//                 data={dadosListaProdutoOrigem}
//                 pagination={itensPorPagina}
//                 paginationPerPage={10}
//                 customStyles={{
//                   header: {
//                     style: {
//                       backgroundColor: '#f2f2f2',
//                       color: '#7a59ad',
//                     },
//                   },
//                   headCells: {
//                     style: {
//                       backgroundColor: '#7a59ad',
//                       color: 'white',
//                       border: '1px solid #e9e9e9',
//                     },
//                   },
//                   cells: {
//                     style: {
//                       backgroundColor: '#fbfbfb',
//                       border: '1px solid #e9e9e9',
//                       color: '#000',
//                     },
//                   },
//                   pagination: {
//                     style: {
//                       backgroundColor: '#7a59ad',
//                       color: 'white',
//                     },
//                   },

//                 }}
//               />
//             </div>
//             <div className="mt-5">
//               <DataTable
//                 title="Produtos de Destino"
//                 columns={colunasProdutoDestino}
//                 data={dadosListaProdutoDestino}
//                 pagination={itensPorPagina}
//                 paginationPerPage={10}
//                 customStyles={{
//                   header: {
//                     style: {
//                       backgroundColor: '#f2f2f2',
//                       color: '#7a59ad',
//                     },
//                   },
//                   headCells: {
//                     style: {
//                       backgroundColor: '#7a59ad',
//                       color: 'white',
//                       border: '1px solid #e9e9e9',
//                     },
//                   },
//                   cells: {
//                     style: {
//                       backgroundColor: '#fbfbfb',
//                       border: '1px solid #e9e9e9',
//                       color: '#000',
//                     },
//                   },
//                   pagination: {
//                     style: {
//                       backgroundColor: '#7a59ad',
//                       color: 'white',
//                     },
//                   },

//                 }}
//               />

//             </div>
          
//           </Modal.Body>

//           <FooterModal>
          
//             <ButtonTypeModal 
//               textButton={"Fechar"} 
//               onClickButtonType={handleCloseModal}
//               cor="secondary" 
//               tipo="button" 
//             />
            
//           </FooterModal>
//         </Modal>
//       )}

//       <ComprasActionCadPromocaoModal
//         show={modalCadastrarVisivel}
//         handleClose={handleCloseModal}
//       />
//     </Fragment>
//   )
// }



  

// {/* <ComprasActionDetalheEmpresaPromocao
// show={modalVisivel}
// handleClose={() => {
//   setItemSelecionado(null);
//   handleCloseModal();
// }}
// item={itemSelecionado}
// /> */}