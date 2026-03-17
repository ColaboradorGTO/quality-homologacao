import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import Swal from "sweetalert2";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useReactToPrint } from "react-to-print";
import { Fragment, useRef, useState } from "react";
import HeaderTable from "../../../../Tables/headerTable";
import { FaMinus, FaRegTrashAlt } from "react-icons/fa";
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";

export const ActionListaProdutos = ({
  dadosProdutosTabela,
  setDadosProdutosTabela,
}) => {

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small')
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos Controle',
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Produto', 'Cód Barras', 'Descrição', 'R$ Venda', 'R$ Custo'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Cód Barras' },
      { wpx: 250, caption: 'Descrição' },
      { wpx: 100, caption: 'R$ Venda' },
      { wpx: 100, caption: 'R$ Custo' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Controle');
    XLSX.writeFile(workbook, 'produtos_controle_transferencia.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Produto', 'Cód Barras', 'Descrição', 'R$ Venda', 'R$ Custo']],
      body: dados.map(item => [
        item.IDPRODUTO,
        item.NUCODBARRAS,
        item.DSNOME,
        item.PRECOVENDA,
        item.PRECOCUSTO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_controle_transferencia.pdf');
  };

  const dados = dadosProdutosTabela.map((item, index) => {
    let contador = index + 1;
    return {
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      PRECOVENDA: item.PRECOVENDA,
      PRECOCUSTO: item.PRECOCUSTO,
      QUANTIDADE: item.QUANTIDADE,
      contador
    }
  });

  const colunasConferencia = [
    {
      field: 'IDPRODUTO',
      header: 'Produto',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'R$ Venda',
      body: row => <th>{row.PRECOVENDA}</th>,
      sortable: true,
    },
    {
      field: 'PRECOCUSTO',
      header: 'R$ Custo',
      body: row => <th>{row.PRECOCUSTO}</th>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => <th>{row.QUANTIDADE}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Opções',
      body: (row) => {

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              gap: "15px",
            }}
          >
            <ButtonTable
              titleButton={"Diminuir Quantidade"}
              onClickButton={() => handleRemoverProduto(row)}
              Icon={FaMinus}
              iconSize={16}
              width="30px"
              height="30px"
              iconColor={"#fff"}
              cor={"warning"}
              disabledBTN={[1, 2].indexOf(row.IDSTATUSOT) >= 0}
            />
            <ButtonTable
              titleButton={"Excluir Produto"}
              onClickButton={() => handleExcluirProduto(row)}
              Icon={FaRegTrashAlt}
              iconSize={16}
              width="30px"
              height="30px"
              iconColor={"#fff"}
              cor={"danger"}
              disabledBTN={row.IDSTATUSOT === 1}
            />
          </div>
        );
      }
    }
  ]

  const handleExcluirProduto = (produto) => {
    setDadosProdutosTabela(prev =>
      prev.filter(item => item.IDPRODUTO !== produto.IDPRODUTO)
    );
  };

  const handleRemoverProduto = (produto) => {
    const itemAtual = dadosProdutosTabela.find(
      item => item.IDPRODUTO === produto.IDPRODUTO
    );

    if (!itemAtual) return;

    if (itemAtual.QUANTIDADE === 1) {
      const modalElement = document.querySelector('.modal.show');

      Swal.fire({
        title: 'Atenção',
        text: 'Essa ação irá excluir o produto da O.T. Deseja prosseguir?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar',
        target: modalElement,
        customClass: {
          popup: 'custom-swal'
        }
      }).then(result => {
        if (result.isConfirmed) {
          setDadosProdutosTabela(prev =>
            prev.filter(item => item.IDPRODUTO !== produto.IDPRODUTO)
          );
        }
      });
      return;
    }
    setDadosProdutosTabela(prev =>
      prev.map(item =>
        item.IDPRODUTO === produto.IDPRODUTO
          ? { ...item, QUANTIDADE: item.QUANTIDADE - 1 }
          : item
      )
    );
  };

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>
            Lista de Produtos
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
            title="Lista de Produtos"
            value={dados}
            globalFilter={globalFilterValue}
            size={size}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasConferencia.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

    </Fragment>
  )
}