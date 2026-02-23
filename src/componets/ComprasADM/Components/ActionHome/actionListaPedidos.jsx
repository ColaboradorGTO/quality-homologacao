import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { MdOutlineLocalPrintshop } from 'react-icons/md';
import { GrCertificate, GrView } from 'react-icons/gr';
import { FaCheck, FaShoppingBag } from 'react-icons/fa';
import { AiOutlineDelete} from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { Fragment, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import { BsTrash3 } from 'react-icons/bs';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from '../../../Tables/headerTable';

export const ActionListaPedidos = ({ dadosPedidos }) => {
  const [actionListaPedidos, setActionListaPedidos] = useState(true)
  const [actionPedidoResumido, setActionPedidoResumido] = useState(true)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();
  
  
    const onGlobalFilterChange = (e) => {
      setGlobalFilterValue(e.target.value);
    };
  
    const handlePrint = useReactToPrint({
      content: () => dataTableRef.current,
      documentTitle: 'Pedidos Periodo',
    });
  
    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Fabricante', 'Vr Pedido', 'Setor', 'Status', 'Situação']],
        body: dados.map(item => [
          item.contador,
          item.DTPEDIDOFORMATADABR,
          item.IDPEDIDO,
          item.NOFANTASIA,
          item.NOMECOMPRADOR,
          item.NOFORNECEDOR,
          item.FABRICANTE,
          formatMoeda(item.VRTOTALLIQUIDO),
          item.DSSETOR == 'CADASTRO' ? 'CADASTRO' : item.DSSETOR == 'COMPRAS' ? 'COMPRAS' : item.DSSETOR == 'COMPRAS ADM' ? 'COMPRAS ADM' : '',
          item.DSANDAMENTO == 'PRODUTOS/INCLUSÃO INICIADA' ? 'PRODUTOS/INCLUSÃO INICIADA' : item.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA' ? 'PRODUTOS/INCLUSÃO FINALIZADA' : item.DSANDAMENTO == 'PEDIDO EM ANÁLISE' ? 'PEDIDO EM ANÁLISE' : item.DSANDAMENTO == 'PEDIDO CANCELADO' ? 'PEDIDO CANCELADO' : item.DSANDAMENTO == 'PEDIDO INICIADO' ? 'PEDIDO INICIADO' : '',
          item.STMIGRADOSAP == null ? 'NÃO MIGRADO SAP' : 'MIGRADO SAP'
        ]),
        horizontalPageBreak: true,
        horizontalPageBreakBehaviour: 'immediately'
      });
      doc.save('pedidos_periodos.pdf');
    };
  
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const workbook = XLSX.utils.book_new();
      const header = ['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Fabricante', 'Vr Pedido', 'Setor', 'Status', 'Situação'];
      worksheet['!cols'] = [
        { wpx: 70, caption: 'Nº' },
        { wpx: 70, caption: 'Data' },
        { wpx: 70, caption: 'Nº Pedido' },
        { wpx: 70, caption: 'Marca' },
        { wpx: 70, caption: 'Comprador' },
        { wpx: 70, caption: 'Fornecedor' },
        { wpx: 70, caption: 'Fabricante' },
        { wpx: 70, caption: 'Vr Pedido' },
        { wpx: 70, caption: 'Setor' },
        { wpx: 70, caption: 'Status' },
        { wpx: 70, caption: 'Situação' },
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Periodo');
      XLSX.writeFile(workbook, 'pedidos_periodo.xlsx');
    };
  

  const calcularTotalFabricante = () => {
    let total = 0;
    for (let dados of dadosPedidos) {
      total += parseFloat(dados.VRTOTALLIQUIDO);
    }
    console.log(total, 'total');
    return total;

  }

  const dados = dadosPedidos.map((item, index) => {
    let contador = index + 1;
    const totalFabricante = calcularTotalFabricante();

    return {
      IDPEDIDO: item.IDPEDIDO,
      DTPEDIDO: item.DTPEDIDO,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      STCANCELADO: item.STCANCELADO,
      NOMECOMPRADOR: item.NOMECOMPRADOR,
      NOFANTASIA: item.NOFANTASIA,
      NOFORNECEDOR: item.NOFORNECEDOR,
      FABRICANTE: item.FABRICANTE,
      DSANDAMENTO: item.DSANDAMENTO,
      DSSETOR: item.DSSETOR,
      MODPEDIDO: item.MODPEDIDO,
      STMIGRADOSAP: item.STMIGRADOSAP,

      totalFabricante: totalFabricante,
      contador
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
      field: 'DTPEDIDO',
      header: 'Data',
      body: row => <th>{row.DTPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'IDPEDIDO',
      header: 'Nº Pedido',
      body: row => <th>{row.IDPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Marca',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'NOMECOMPRADOR',
      header: 'Comprador',
      body: row => <th>{row.NOMECOMPRADOR}</th>,
      sortable: true,
    },
    {
      field: 'NOFORNECEDOR',
      header: 'Fornecedor',
      body: row => <th>{row.NOFORNECEDOR}</th>,
      footer: 'Total ',
      sortable: true,
    },
    {
      field: 'FABRICANTE',
      header: 'Fabricante',
      body: row => <th>{row.FABRICANTE}</th>,

      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Vr Pedido',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      footer: formatMoeda(calcularTotalFabricante()),
      sortable: true,
    },
    {
      field: 'DSSETOR',
      header: 'Setor',
      body: row => {
        return (
          <div>
            <th style={{ color: row.DSSETOR == 'CADASTRO' ? 'green' : row.DSSETOR == 'COMPRAS' ? 'blue' : row.DSSETOR == 'COMPRAS ADM' ? 'gray' : '' }} >{row.DSSETOR}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'DSANDAMENTO',
      header: 'Status',
      body: row => {
        return (
          <div>
            <th style={{ color: 
              row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO INICIADA' ? 'blue' : 
              row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA' ? 'black' : 
              row.DSANDAMENTO == 'PEDIDO EM ANÁLISE' ? 'green' : row.DSANDAMENTO == 'PEDIDO CANCELADO' ? 'red' : row.DSANDAMENTO == 'PEDIDO INICIADO' ? 'blue' : ''}}
            >
              {row.DSANDAMENTO}
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
        if(row.DSSETOR == 'CADASTRO') {
          if(row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO INICIADA') {
            return ( 
              <th >{row.STMIGRADOSAP = ''}</th>
            )

          } else if(row.DSANDAMENTO == 'PRODUTOS/INCLUSÃO FINALIZADA') {
            if(row.STMIGRADOSAP == null) {
              return (
                <th style={{ color: row.STMIGRADOSAP = '#fd3995', fontWeight: 700 }}>{row.STMIGRADOSAP =  'NÃO MIGRADO SAP'}</th>
              )

            } else {
              return (
                <th style={{ color: row.STMIGRADOSAP = '#2196F3', fontWeight: 700 }}>{row.STMIGRADOSAP = 'MIGRADO SAP'}</th>
              )
            
            }
          }
        } else if(row.DSSETOR == 'COMPRAS') {
          return (
            <th style={{ color: row.STMIGRADOSAP = '#fd3995', fontWeight: 700 }}>{row.STMIGRADOSAP = ''}</th>
          )
        } else if(row.DSSETOR == 'COMPRASADM') {
          return (
            <th style={{ color: row.STMIGRADOSAP = '#fd3995', fontWeight: 700 }}>{row.STMIGRADOSAP = '' }</th>
          )
        }
      },
      sortable: true
    },
    {
      field: 'DSSETOR',
      header: 'Opções',
      body: (row) => {
        if(row.DSSETOR == 'CADASTRO') {
          return (
            <div className="p-1 "
              style={{ display: "flex" }}
            >
              
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
     
            </div>
          )
        } else if(row.DSSETOR == 'COMPRAS') {
          return (
            <div className="p-1 "
              style={{  display: "flex" }}
            >
            
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Imprimir Pedido Com Preço de Venda"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={MdOutlineLocalPrintshop}
                  cor={"dark"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton
                  titleButton={"Imprimir Pedido Sem Preço de Venda"}
                />
              </div>
            </div>
          )

        } else if(row.DSSETOR == 'COMPRASADM') {
          if(row.DSANDAMENTO == 'PEDIDO PARA SER CANCELADO') {
            return (
              <div className="p-1 "
                style={{ justifyContent: "space-between",  display: "flex" }}
              >
                <div className="p-1">
                  <ButtonTable
                    Icon={GrView}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Visualizar o Pedido"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLocalPrintshop}
                    cor={"warning"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Imprimir Pedido Com Preço de Venda"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLocalPrintshop}
                    cor={"dark"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Imprimir Pedido Sem Preço de Venda"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLocalPrintshop}
                    cor={"danger"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Cancelar Pedido"}
                  />
                </div>
              </div>
            )

          } else if(row.DSANDAMENTO == 'PEDIDO CANCELADO') {
            return (
              <div className="p-1 "
                style={{ justifyContent: "space-between",  display: "flex" }}
              >
                <div className="p-1">
                  <ButtonTable
                    Icon={GrView}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Visualizar o Pedido"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLocalPrintshop}
                    cor={"warning"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Imprimir Pedido Com Preço de Venda"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLocalPrintshop}
                    cor={"dark"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Imprimir Pedido Sem Preço de Venda"}
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
                    Icon={GrView}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Visualizar o Pedido"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLocalPrintshop}
                    cor={"warning"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Imprimir Pedido Com Preço de Venda"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={MdOutlineLocalPrintshop}
                    cor={"dark"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Imprimir Pedido Sem Preço de Venda"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={FaShoppingBag}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Enviar Compras"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={FiSend}
                    cor={"info"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Enviar Cadastro"}
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    Icon={BsTrash3}
                    cor={"danger"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Cancelar Pedido"}
                  />
                </div>
              </div>
            )
          }
        }    
      },
    },
  

  ]

  return (
    <Fragment>
      <div className="panel">
        
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>
        <div className="card mb-4" ref={dataTableRef}>

          <DataTable
            title="Lista de Pedidos"
            value={dados}
            size='small'
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
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
      </div>
    </Fragment>
  )
}