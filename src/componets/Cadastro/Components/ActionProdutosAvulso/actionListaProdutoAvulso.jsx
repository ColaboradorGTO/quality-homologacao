import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";

import { GrFormView, GrView } from "react-icons/gr";
import { MdOutlineLocalPrintshop, MdOutlineSend } from "react-icons/md";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCashRegister, FaCheck } from "react-icons/fa";
import { SiSap } from "react-icons/si";
import { BsTrash3 } from "react-icons/bs";
import { toFloat } from "../../../../utils/toFloat";
import { ActionEditarProodutodPedidoAvulsoModal } from "./actionEditarProdutoPedidoAvulsoModal";


export const ActionListaProdutoAvulso = ({ dadosProdutosAvulso }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheProduto, setDadosDetalheProduto] = useState([]);


 

  const dadosListaProdutosAvulso = dadosProdutosAvulso.map((item, index) => {
    let contador = index + 1;

    return {
      IDDETALHEPRODUTOPEDIDO: item.IDDETALHEPRODUTOPEDIDO,
      DTCADASTROFORMAT: item.DTCADASTROFORMAT,
      NUREF: item.NUREF,
      CODBARRAS: item.CODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      QTDPRODUTO: item.QTDPRODUTO,
      VRCUSTO: item.VRCUSTO,
      VRVENDA: item.VRVENDA,
      DSFABRICANTE: item.DSFABRICANTE,
      STMIGRADOSAP: item.STMIGRADOSAP,
      STCANCELADO: item.STCANCELADO,
      STCADASTRADO: item.STCADASTRADO,
      contador
    }
  });


  const colunasPedidos = [

    {
      field: 'DTCADASTROFORMAT',
      header: 'Data',
      body: row => <th>{row.DTCADASTROFORMAT}</th>,
      sortable: true,
    },
    {
      field: 'CODBARRAS',
      header: 'Cod. Barras',
      body: row => <th>{row.CODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Descrição',
      body: row => <th>{row.DSPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUREF',
      header: 'Ref',
      body: row => <th>{row.NUREF}</th>,
      sortable: true,
    },
    {
      field: 'QTDPRODUTO',
      header: 'QTD',
      body: row => <th>{toFloat(row.QTDPRODUTO)}</th>,
      footer: 'Total ',
      sortable: true,
    },
    {
      field: 'DSFABRICANTE',
      header: 'Fabricante',
      body: row => <th>{row.DSFABRICANTE}</th>,

      sortable: true,
    },
    {
      field: 'VRCUSTO',
      header: 'Vl. Custo',
      body: row => <th>{formatMoeda(row.VRCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'VRVENDA',
      header: 'Vl. Venda',
      body: row => <th>{formatMoeda(row.VRVENDA)}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Status',
      body: row => {
        return (
          <div>
            <th style={{ color: 
              row.STCANCELADO == 'True' ? 'red' : 'blue' 
            }}
            >
              {row.STCANCELADO == 'True' ? 'CANCELADO' : 'ATIVO'}
            </th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'STMIGRADOSAP',
      header: 'Situação',
      body: (row) => { 
        if(row.STMIGRADOSAP == 'True') {
          if(row.STCADASTRADO == 'True') {
            return ( 
              <th style={{color: 'blue' }}>
                INCLUIDO PDV / MIGRADO SAP
              </th>
            )
      
          }else {
            return (
              <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <th style={{color: 'red' }} >
                  NÃO INCLUIDO PDV
                </th>
                <th> / </th>
                <th style={{color: 'blue' }}>
                  MIGRADO SAP
                </th>
              </div>
            )
          }
          
        } else {
          if(row.STCADASTRADO == 'True') {
            return ( 
              <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <th style={{color: 'blue' }} >
                  INCLUIDO PDV  
                </th>
                <th>/</th>
                <th style={{color: 'red' }}>
                  NÃO MIGRADO SAP
                </th>
              </div>
            )
      
          } else {
            return ( 
              <div>
                 <th style={{color: 'red' }}>
                   NÃO INCLUIDO PDV NÃO MIGRADO SAP
                 </th>
               </div>
             )
           }
      
         }
       },
      sortable: true
    },
    {
      field: 'IDDETALHEPRODUTOPEDIDO',
      header: 'Opções',
      body: (row) => {
        if(row.STCANCELADO == 'TRUE') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={FaCheck}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Ativar Produto Avulso"}
                />
              </div>
            </div>
          ) 
        } else {
          if(row.STCADASTRADO == 'True') {
            if(row.STMIGRADOSAP == 'True') {
              return (
                <div className="p-1 "
                  style={{ justifyContent: "space-between",  display: "flex" }}
                >
                  <div className="p-1">
                    <ButtonTable
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton
                      titleButton={"Cancelar Produto Avulso"}
                    />
                  </div>
                </div>
              )
              
            } else {
              return (
                <div className="p-1 "
                  style={{ justifyContent: "space-between",  display: "flex" }}
                >
                  <div className="p-1">
                    <ButtonTable
                      Icon={SiSap}
                      cor={"primary"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton
                      titleButton={"Migrar para SAP"}
                    />
                  </div>
                  <div className="p-1">
                  <ButtonTable
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton
                      titleButton={"Cancelar Produto Avulso"}
                    />
                  </div>
                </div>
              )

            }
          } else {
            if(row.STMIGRADOSAP == 'True') {
              return (
                <div className="p-1 "
                  style={{ justifyContent: "space-between",  display: "flex" }}
                >
                  <div className="p-1">
                    <ButtonTable
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton
                      titleButton={"Cancelar Produto Avulso"}
                    />
                  </div>
                </div>
              )
              
            } else {
              return (
                <div className="p-1 "
                  style={{ justifyContent: "space-between",  display: "flex" }}
                >
                  <div className="p-1">
                    <ButtonTable
                      Icon={CiEdit}
                      cor={"primary"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton={() => handleClickEdit(row)}
                      titleButton={"Editar Produto Avulso"}
                    />
                  </div>
                  <div className="p-1">
                  <ButtonTable
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      onClickButton
                      titleButton={"Cancelar Produto Avulso"}
                    />
                  </div>
                  <div className="p-1">
                  <ButtonTable
                      Icon={FaCashRegister}
                      cor={"success"}
                      iconColor={"white"}
                      iconSize={18}
                      onClickButton
                      titleButton={"Incluir para PDV"}
                    />
                  </div>
                </div>
              )

            }
          }
        }  
      },
    },

  ]

  const handleEdit = async (IDDETALHEPRODUTOPEDIDO) => {
    try {
      const response = await get(`/produtoAvulso?idDetalhePedidoProduto=${IDDETALHEPRODUTOPEDIDO}`)
 
      if (response.data) {
        setDadosDetalheProduto(response.data)
  
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickEdit = async (row) => {
    if (row.IDDETALHEPRODUTOPEDIDO) {
      handleEdit(row.IDDETALHEPRODUTOPEDIDO)
      setModalEditar(true)
    }
  }

  return (
    <Fragment>
      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dadosListaProdutosAvulso}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500]}
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
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>
      </div>

      <ActionEditarProodutodPedidoAvulsoModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheProduto={dadosDetalheProduto}
      />
    </Fragment>
  )
}
