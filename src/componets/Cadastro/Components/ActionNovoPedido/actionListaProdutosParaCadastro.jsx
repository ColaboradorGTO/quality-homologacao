import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { IoIosAdd } from "react-icons/io";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { get, put } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { ButtonType } from "../../../Buttons/ButtonType";

export const ActionListaProdutosParaCadastro = ({ dadosVisualizarPedido, dadosProdutosPedidos }) => {
  const [modalEditarItemPedido, setModalEditarItemPedido] = useState(false);
  const [dadosItemPedido, setDadosItemPedido] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Previa Produtos ',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Cód Barras', 'Produto', 'NCM', 'TM', 'Qtd', 'Vr. Custo', 'Vr Venda', 'Total Custo', 'Obs', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.CODBARRAS,
        item.DSPRODUTO,
        item.NUNCM,
        item.DSTAMANHO,
        toFloat(item.QTDPRODUTO),
        formatMoeda(item.VRCUSTO),
        formatMoeda(item.VRVENDA),
        formatMoeda(item.VRTOTALCUSTO),
        item.STEDITADOCOMPRAS === 'True' ? 'PRODUTO ALTERADO' : 'PRODUTO SEM ALTERAÇÃO',
        item.STREPOSICAO == 'True' && item.STMIGRADOSAP == 'True' ? 'PRODUTO REPOSIÇÃO / MIGRADO SAP' : item.STREPOSICAO == 'True' && item.STMIGRADOSAP != 'True' ? 'PRODUTO REPOSIÇÃO / NÃO MIGRADO SAP' : item.STMIGRADOSAP == 'True' ? item.STCADASTRO == 'True' && item.IDPRODCADASTRO > 0 && item.IDPRODCADASTRO != 'NULL' ? 'INCLUIDO PDV / MIGRADO SAP' : 'NÃO INCLUIDO PDV / NÃO MIGRADO SAP' : item.STCADASTRO == 'True' && item.IDPRODCADASTRO > 0 && item.IDPRODCADASTRO != 'NULL' ? 'INCLUIDO PDV / NÃO MIGRADO SAP' : 'NÃO INCLUIDO PDV / NÃO MIGRADO SAP',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('previa_produtos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Cód Barras', 'Produto', 'NCM', 'TM', 'Qtd', 'Vr. Custo', 'Vr Venda', 'Total Custo', 'Obs', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Cód Barras' },
      { wpx: 200, caption: 'Produto' },
      { wpx: 100, caption: 'NCM' },
      { wpx: 100, caption: 'TM' },
      { wpx: 100, caption: 'Qtd' },
      { wpx: 100, caption: 'Vr. Custo' },
      { wpx: 100, caption: 'Vr Venda' },
      { wpx: 100, caption: 'Total Custo' },
      { wpx: 100, caption: 'Obs' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Previa Produtos');
    XLSX.writeFile(workbook, 'previa_cadastro_produtos.xlsx');
  };


  const dados = dadosProdutosPedidos.map((item, index) => {
    let contador = index + 1;
    return {

        contador,
        CODBARRAS: item.CODBARRAS,
        DSPRODUTO: item.DSPRODUTO,
        NUNCM: item.NUNCM,
        DSTAMANHO: item.DSTAMANHO,
        QTDPRODUTO: item.QTDPRODUTO,
        VRCUSTO: item.VRCUSTO,
        VRVENDA: item.VRVENDA,

        STEDITADOCOMPRAS: item.STEDITADOCOMPRAS,
        STMIGRADOSAP: item.STMIGRADOSAP,
        STREPOSICAO: item.STREPOSICAO,
        STCADASTRO: item.STCADASTRO,
        IDDETALHEPRODUTOPEDIDO: item.IDDETALHEPRODUTOPEDIDO,
        IDRESUMOPEDIDO: item.IDRESUMOPEDIDO,
        IDPRODCADASTRO: item.IDPRODCADASTRO,
        DTCADASTRO: item.DTCADASTRO,
        DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
        VRTOTALCUSTO: item.VRTOTALCUSTO,
        QTDESTOQUEIDEAL: item.QTDESTOQUEIDEAL,
    }
  });
  
  const colunasPedidos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'row.CODBARRAS',
      header: 'Cód Barras',
      body: row => <th>{row.CODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: row => <th>{row.DSPRODUTO}</th>,
      sortable: true,
    },
    {
    field: 'NUNCM',
    header: 'NCM',
    body: row => <th>{row.NUNCM}</th>,
    sortable: true,
    },
    {
    field: 'DSTAMANHO',
    header: 'TM',
    body: row => <th>{row.DSTAMANHO}</th>,
    sortable: true,
    },
    {
      field: 'QTDPRODUTO',
      header: 'Qtd',
      body: row => <th>{row.QTDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'VRCUSTO',
      header: 'Vr. Custo',
      body: row => <th>{row.VRCUSTO}</th>,
      sortable: true,
    },
    {
      field: 'VRVENDA',
      header: 'Vr Venda',
      body: row => <th>{formatMoeda(row.VRVENDA)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALCUSTO',
      header: 'Total Custo',
      body: row => <th>{formatMoeda(row.VRTOTALCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'STEDITADOCOMPRAS',
      header: 'Obs',
      body: row => {
        if (row.STEDITADOCOMPRAS === 'True') {
          return <th style={{ color: 'red' }}>PRODUTO ALTERADO</th>
    
        } else {
          return <th style={{ color: 'red' }}>PRODUTO SEM ALTERAÇÃO</th>
        }
      },
      sortable: true,
    },
    {
      field: 'STREPOSICAO',
      header: 'Situação',
      body: row => {
        if (row.STREPOSICAO == 'True' && row.STMIGRADOSAP == 'True') {
          return <th style={{ color: 'blue' }}>PRODUTO REPOSIÇÃO / MIGRADO SAP</th>
    
        } else if(row.STREPOSICAO == 'True' && row.STMIGRADOSAP != 'True') {

            return <th style={{ color: 'blue' }}>PRODUTO REPOSIÇÃO / <label htmlFor="" style={{ color: 'red' }}>NÃO MIGRADO SAP</label></th>
        } else {
            if(row.STMIGRADOSAP == 'True') {
              if(row.STCADASTRO == 'True' && row.IDPRODCADASTRO > 0 && row.IDPRODCADASTRO != 'NULL') {
                return <th style={{ color: 'blue' }}>INCLUIDO PDV / MIGRADO SAP</th>
              } else {
                return <th style={{ color: 'red' }}>NÃO INCLUIDO PDV / <label htmlFor="" style={{ color: 'blue' }}>MIGRADO SAP</label></th>
              }
            } else {
              if(row.STCADASTRO == 'True' && row.IDPRODCADASTRO > 0 && row.IDPRODCADASTRO != 'NULL') {
                return <th style={{ color: 'blue' }}>INCLUIDO PDV / <label htmlFor="" style={{ color: 'red' }}>NÃO MIGRADO SAP</label></th>
              } else {
                return <th style={{ color: 'red' }}>NÃO INCLUIDO PDV / <label htmlFor="" style={{ color: 'red' }}>NÃO MIGRADO SAP</label></th>
              }
            }
        }
        
      },
      sortable: true,
    },
    {
      field: 'contador',
      header: 'Opções',
      body: row => {
        if (row.STCADASTRO == 'True' && row.IDPRODCADASTRO > 0 && row.IDPRODCADASTRO != 'NULL') {
          if(row.STREPOSICAO == 'True' && row.STMIGRADOSAP != 'True') {
            return (
              <div className="p-1 "
                style={{ justifyContent: "space-between", display: "flex" }}
              >
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEditar(row)}
                    titleButton={"Editar Produto do Pedido"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEditar(row)}
                    titleButton={"Migrar para SAP"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={BsTrash3}
                    cor={"danger"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickVisualizarPedido(row)}
                    titleButton={"Cancelar Produto do Pedido"}
                  />
                </div>
              </div>
            )
          } else {
            if(row.STMIGRADOSAP == 'True') {
              return ( 
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEditar(row)}
                    titleButton={"Editar Produto do Pedido"}
                  />
                </div>
              )
            } else {
              return (
                <div className="p-1 "
                  style={{ justifyContent: "space-between", display: "flex" }}
                >
                  <div className="p-1">
                    <ButtonTable
                      Icon={CiEdit}
                      cor={"primary"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton={() => handleClickEditar(row)}
                      titleButton={"Editar Produto do Pedido"}
                    />
                  </div>
                  <div className="p-1">
                    <ButtonTable
                      Icon={CiEdit}
                      cor={"primary"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton={() => handleClickEditar(row)}
                      titleButton={"Migrar para SAP"}
                    />
                  </div>
                  <div className="p-1">
                    <ButtonTable
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton={() => handleClickVisualizarPedido(row)}
                      titleButton={"Cancelar Produto do Pedido"}
                    />
                  </div>
                </div>
              )
            }
          }
     
        } else { 
          if(row.STREPOSICAO == 'True' && row.STMIGRADOSAP != 'True') {
            return (
              <div className="p-1 "
                style={{ justifyContent: "space-between", display: "flex" }}
              >
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEditar(row)}
                    titleButton={"Editar Produto do Pedido"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEditar(row)}
                    titleButton={"Migrar para SAP"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={BsTrash3}
                    cor={"danger"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickVisualizarPedido(row)}
                    titleButton={"Cancelar Produto do Pedido"}
                  />
                </div>
              </div>
            )
          } else {
            if(row.STMIGRADOSAP == 'True' && row.IDPRODCADASTRO > 0 && row.IDPRODCADASTRO != 'NULL') {
              return ( 
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEditar(row)}
                    titleButton={"Editar Produto do Pedido"}
                  />
                </div>
              )
            } else if(row.STMIGRADOSAP == 'True' && row.STREPOSICAO == 'True') {
              return ( 
                <div className="p-1">
                  <ButtonTable
                    Icon={CiEdit}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => handleClickEditar(row)}
                    titleButton={"Editar Produto do Pedido"}
                  />
                </div>
              )
            } else {
              return (
                <div className="p-1 "
                  style={{ justifyContent: "space-between", display: "flex" }}
                >
                  <div className="p-1">
                    <ButtonTable
                      Icon={CiEdit}
                      cor={"primary"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton={() => handleClickEditar(row)}
                      titleButton={"Editar Produto do Pedido"}
                    />
                  </div>
                  <div className="p-1">
                    <ButtonTable
                      Icon={CiEdit}
                      cor={"success"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton={() => handleClickEditar(row)}
                      titleButton={"Incluir para PDV"}
                    />
                  </div>
                  <div className="p-1">
                    <ButtonTable
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton={() => handleClickVisualizarPedido(row)}
                      titleButton={"Cancelar Produto do Pedido"}
                    />
                  </div>
                </div>
              )
            }
          }
        } 
      },
      sortable: true,
    },
  ]

  const handleClickEditar = (row) => {
    if (row && row.IDDETPEDIDO) {
      handleEditar(row.IDDETPEDIDO);
    }
  };

  const handleEditar = async (IDDETPEDIDO) => {
    try {
      const response = await get(`/editar-item-pedido?idDetalhePedido=${IDDETPEDIDO}`);
      setDadosItemPedido(response.data);
      setModalEditarItemPedido(true);
    } catch (error) {
      console.error(error);
    }
  }

  const handleProdutoPDV = async (IDRESUMOPEDIDIO) => {
    if (!dadosProdutosPedidos || dadosProdutosPedidos.length === 0) {
      Swal.fire({
        icon: "warning",
        title: `Não Existem Produtos do Pedido: ${IDRESUMOPEDIDIO} para serem Incluídos no PDV`,
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    let stCadastradoTrue = "True";

    for (const produto of dadosProdutosPedidos) {
      if (produto.STCADASTRADO !== "True") {
        stCadastradoTrue = produto.STCADASTRADO;
      }
    }

    if (stCadastradoTrue !== "True") {

      Swal.fire({
        title: 'Certeza que Deseja Incluir Todos esses Produtos no PDV?',
        text: 'Você não poderá reverter esta ação!',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger',
          loader: 'custom-loader'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const putData = {  
              IDRESUMOPEDIDIO: IDRESUMOPEDIDIO,
      
            }
            const response = await put('/incluir_todos_produtos_pdv/:id', putData)
            
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'INCLUIR TODOS PRODUTOS NO PDV';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
    
            const responsePost = await post('/log-web', postData)
        
            Swal.fire({
              title: 'Cancelado', 
              text: 'Conciliação do Depósito cancelado com Sucesso', 
              icon: 'success'
            })
  
            return responsePost;
          } catch (error) {
            
            let textoFuncao = 'ERRO AO INCLUIR TODOS PRODUTOS NO PDV';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: 'ERRO AO INCLUIR TODOS PRODUTOS NO PDV',
              IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
          }
        }
      })
    } else {
      Swal.fire({
        icon: "warning",
        title: `Não Existem Produtos do Pedido: ${IDRESUMOPEDIDIO} para serem Incluídos no PDV`,
        showConfirmButton: false,
        timer: 3000
      });
    }
  }
  
  const handleClickCancelar = (row) => {
    if (row && row.IDDEPOSITOLOJA) {
      handleProdutoPDV(row.IDDEPOSITOLOJA);
    }
  };


  const handleMigrarSAP = async (IDRESUMOPEDIDIO) => {
    if (!dadosProdutosPedidos || dadosProdutosPedidos.length === 0) {
      Swal.fire({
        icon: "warning",
        title: `Não Existem Produtos do Pedido: ${IDRESUMOPEDIDIO} para serem Incluídos no PDV`,
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    let stCadastradoTrue = "True";

    for (const produto of dadosProdutosPedidos) {
      if (produto.STCADASTRADO !== "True") {
        stCadastradoTrue = produto.STCADASTRADO;
      }
    }

    if (stCadastradoTrue !== "True") {

      Swal.fire({
        title: 'Certeza que Deseja Incluir Todos esses Produtos no PDV?',
        text: 'Você não poderá reverter esta ação!',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger',
          loader: 'custom-loader'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const putData = {  
              IDRESUMOPEDIDIO: IDRESUMOPEDIDIO,
      
            }
            const response = await put('/incluir_todos_produtos_pdv/:id', putData)
            
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'INCLUIR TODOS PRODUTOS NO SAP';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
    
            const responsePost = await post('/log-web', postData)
        
            Swal.fire({
              title: 'Sucesso', 
              text: 'Migração do Produto no SAP com Sucesso', 
              icon: 'success'
            })
  
            return responsePost;
          } catch (error) {
            
            let textoFuncao = 'ERRO AO INCLUIR TODOS PRODUTOS NO SAP';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: 'ERRO AO INCLUIR TODOS PRODUTOS NO SAP',
              IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
          }
        }
      })
    } else {
      Swal.fire({
        icon: "warning",
        title: `Não Existem Produtos do Pedido: ${IDRESUMOPEDIDIO} para serem Migrados para o SAP`,
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista dos Produtos do Pedido</h2>
        </div>
        <div className="row mb-4">
        
          <ButtonType
            Icon={AiOutlineSearch}
            iconSize="16px"
            textButton="Incluir Todos Novos PDV"
            cor="primary"
            tipo="button"
            onClickButtonType={() => handleProdutoPDV(dadosVisualizarPedido.IDRESUMOPEDIDO)}
          />
          <ButtonType
            Icon={AiOutlineSearch}
            iconSize="16px"
            textButton="Migrar Todos Novos SAP"
            cor="secondary"
            tipo="button"
            onClickButtonType={() => handleMigrarSAP(dadosVisualizarPedido.IDRESUMOPEDIDO)}
          />
          <ButtonType
            Icon={AiOutlineSearch}
            iconSize="16px"
            textButton="Relatório Produtos Criado"
            cor="info"
            tipo="button"
            onClickButtonType={() => handlePrint()}
          />
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>
        <div className="card" ref={dataTableRef}>
          <DataTable
            title="Produtos do Pedido"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 100, 500, 1000, dados.length]}
            sortOrder={-1}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
          {colunasPedidos.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.688rem' }}
            />
          ))}
          </DataTable>
        </div>

          
      </div>
    </Fragment>
  )
}