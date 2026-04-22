import { Fragment, useState, useRef } from "react"
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
import Swal from "sweetalert2";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { get } from "../../../../api/funcRequest";

export const ActionListaProdutoAvulso = ({ dadosProdutosAvulso }) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [dadosDetalheProduto, setDadosDetalheProduto] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
  
    const onGlobalFilterChange = (e) => {
      setGlobalFilterValue(e.target.value);
    };
  
    const handlePrint = useReactToPrint({
      content: () => dataTableRef.current,
      documentTitle: 'Produtos Avulso',
    });
  
    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Data', 'Cod. Barras', 'Descrição', 'Ref', 'QTD', 'Fabricante', 'Vl. Custo', 'Vl. Venda', 'Status', 'Situação']],
        body: dados.map(item => [
  
          item.DTCADASTROFORMAT,
          item.CODBARRAS,
          item.DSPRODUTO,
          item.NUREF,
          toFloat(item.QTDPRODUTO),
          item.DSFABRICANTE,
          formatMoeda(item.VRCUSTO),
          formatMoeda(item.VRVENDA),
          item.STCANCELADO == 'True' ? 'CANCELADO' : 'ATIVO',
          item.STMIGRADOSAP == 'True' ? (item.STCADASTRADO == 'True' ? 'INCLUIDO PDV / MIGRADO SAP' : 'NÃO INCLUIDO PDV / MIGRADO SAP') : (item.STCADASTRADO == 'True' ? 'INCLUIDO PDV / NÃO MIGRADO SAP' : 'NÃO INCLUIDO PDV / NÃO MIGRADO SAP')
          
  
        ]),
        horizontalPageBreak: true,
        horizontalPageBreakBehaviour: 'immediately'
      });
      doc.save('produtos_avulso.pdf');
    };
  
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const workbook = XLSX.utils.book_new();
      const header = ['Data', 'Cod. Barras', 'Descrição', 'Ref', 'QTD', 'Fabricante', 'Vl. Custo', 'Vl. Venda', 'Status', 'Situação'];
      worksheet['!cols'] = [
        { wpx: 150, caption: 'Data' },
        { wpx: 100, caption: 'Cod. Barras' },
        { wpx: 250, caption: 'Descrição' },
        { wpx: 100, caption: 'Ref' },
        { wpx: 50, caption: 'QTD' },
        { wpx: 150, caption: 'Fabricante' },
        { wpx: 100, caption: 'Vl. Custo' },
        { wpx: 100, caption: 'Vl. Venda' },
        { wpx: 100, caption: 'Status' },
        { wpx: 200, caption: 'Situação' },
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Avulso');
      XLSX.writeFile(workbook, 'produtos_avulso.xlsx');
    };

  const dados = dadosProdutosAvulso.map((item, index) => {

    return {
      DTCADASTROFORMAT: item.DTCADASTROFORMAT,
      CODBARRAS: item.CODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      NUREF: item.NUREF,
      QTDPRODUTO: item.QTDPRODUTO,
      DSFABRICANTE: item.DSFABRICANTE,
      VRCUSTO: item.VRCUSTO,
      VRVENDA: item.VRVENDA,
      STCANCELADO: item.STCANCELADO == 'True' ? 'CANCELADO' : 'ATIVO',
      STMIGRADOSAP: item.STMIGRADOSAP,
      STCADASTRADO: item.STCADASTRADO,
      IDDETALHEPRODUTOPEDIDO: item.IDDETALHEPRODUTOPEDIDO,
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
              row.STCANCELADO == 'CANCELADO' ? 'red' : 'blue' 
            }}
            >
              {row.STCANCELADO}
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
                  titleButton={"Ativar Produto Avulso"}
                  onClickButton
                  Icon={FaCheck}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  width="30px"
                  height="30px"
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
                      titleButton={"Cancelar Produto Avulso"}
                      onClickButton
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      width="30px"
                      height="30px"
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
                      titleButton={"Migrar para SAP"}
                      onClickButton
                      Icon={SiSap}
                      cor={"primary"}
                      iconColor={"white"}
                      iconSize={20}
                      width="30px"
                      height="30px"
                    />
                  </div>
                  <div className="p-1">
                  <ButtonTable
                      titleButton={"Cancelar Produto Avulso"}
                      onClickButton
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      width="30px"
                      height="30px"
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
                      titleButton={"Cancelar Produto Avulso"}
                      onClickButton
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      width="30px"
                      height="30px"
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
                      titleButton={"Editar Produto Avulso"}
                      onClickButton={() => handleClickEdit(row)}
                      Icon={CiEdit}
                      cor={"primary"}
                      iconColor={"white"}
                      iconSize={20}
                      width="30px"
                      height="30px"
                    />
                  </div>
                  <div className="p-1">
                  <ButtonTable
                      titleButton={"Cancelar Produto Avulso"}
                      onClickButton
                      Icon={BsTrash3}
                      cor={"danger"}
                      iconColor={"white"}
                      iconSize={20}
                      width="30px"
                      height="30px"
                    />
                  </div>
                  <div className="p-1">
                  <ButtonTable
                      titleButton={"Incluir para PDV"}
                      onClickButton
                      Icon={FaCashRegister}
                      cor={"success"}
                      iconColor={"white"}
                      iconSize={20}
                      width="30px"
                      height="30px"
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
 
      if (response.data && response.data.length > 0) {
        setDadosDetalheProduto(response.data)
        setModalEditar(true)
  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível obter os detalhes do produto avulso.',
        })
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickEdit = async (row) => {
    if (row.IDDETALHEPRODUTOPEDIDO) {
      handleEdit(row.IDDETALHEPRODUTOPEDIDO)
    }
  }

  return (
    <Fragment>
      <div id="panel-1" className="panel" >
        <div className="panel-hdr">
          <h2 >
            Lista de Produtos Avulso
          </h2>

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
            title="Lista de Produtos Avulso"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 30, 40, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
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
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
      <ActionEditarProodutodPedidoAvulsoModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheProduto={dadosDetalheProduto}
      />
    </Fragment>
  )
}
