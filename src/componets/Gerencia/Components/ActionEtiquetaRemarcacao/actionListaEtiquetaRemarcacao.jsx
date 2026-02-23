import { Fragment, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import HeaderTable from "../../../Tables/headerTable";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { BsTrash3 } from "react-icons/bs";
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionListaEtiquetaRemarcacao = ({ dadosAcumuladorEtiquetas, setDadosAcumuladorEtiquetas,  handleExcluirEtiqueta }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [quantidades, setQuantidades] = useState({});
  const [copias, setCopias] = useState(1);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: "Lista de Produtos",
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Nº", "Cod Barras", "Produto", "Quantidade"]],
      body: dados.map((item, index) => [
        index + 1,
        item.codigoBarras,
        item.produto,
        quantidades[item.idEtiqueta] || item.quantidade,
      ]),
    });
    doc.save("lista_produtos.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      dados.map((item, index) => ({
        Nº: index + 1,
        "Cod Barras": item.codigoBarras,
        Produto: item.produto,
        Quantidade: quantidades[item.idEtiqueta] || item.quantidade,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lista de Produtos");
    XLSX.writeFile(workbook, "lista_produtos.xlsx");
  };


  // const handleAtualizar = (idEtiqueta, novaQuantidade) => {
  //   setQuantidades((prev) => ({ ...prev, [idEtiqueta]: novaQuantidade }));
  // };

  const handleAtualizar = (idEtiqueta, novaQuantidade) => {
    setQuantidades((prev) => ({ ...prev, [idEtiqueta]: novaQuantidade }));
    setDadosAcumuladorEtiquetas((prevDados) =>
      prevDados.map((item) =>
        item.idEtiqueta === idEtiqueta ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const dados = dadosAcumuladorEtiquetas.map((item, index) => ({
    contador: index + 1,
    idEtiqueta: item.idEtiqueta,
    quantidade: item.quantidade,
    valor: item.valor,
  }));

  
  const colunasListaProdEtiquetas = [
    {
      field: "contador",
      header: "Nº",
      body: (row) => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: "valor",
      header: "Valor",
      body: (row) => <th>{formatMoeda(row.valor)}</th>,
      sortable: true,
    },
    {
      field: "quantidade",
      header: "Quantidade",
      body: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="number"
            value={quantidades[row.idEtiqueta] || row.quantidade}
            onChange={(e) =>
              handleAtualizar(row.idEtiqueta, parseInt(e.target.value, 10))
            }
            style={{ width: "100px", textAlign: "center" }}
          />
        </div>
      ),
    },
    {
      field: "rowIndex",
      header: "Opções",
      body: (row) => (
        <ButtonTable
          titleButton="Excluir"
          onClickButton={() => handleExcluirEtiqueta(row.idEtiqueta)}
          Icon={BsTrash3}
          iconSize={22}
          width="35px"
          height="35px"
          iconColor="#fff"
          cor="danger"
        />
      ),
      sortable: true,
    },
  ];

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Etiquetas</h2>
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
            value={dados}
            globalFilterValue={globalFilterValue}
            size="small"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasListaProdEtiquetas.map((coluna) => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                sortable={coluna.sortable}
                headerStyle={{
                  color: "white",
                  backgroundColor: "#7a59ad",
                  border: "1px solid #e9e9e9",
                  fontSize: "1rem",
                }}
                bodyStyle={{ fontSize: "1.5rem" }}
              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  );
};