import { Fragment, useEffect, useRef, useState } from "react"
import { Modal } from "react-bootstrap"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Select from 'react-select';
import { AiOutlineSearch } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { toFloat } from "../../../../../utils/toFloat";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import HeaderTable from "../../../../Tables/headerTable";
import { ButtonType } from "../../../../Buttons/ButtonType";
import { useAlterarVendaVendedor } from "../hooks/useAlterarVendaVendedor";
import { useQuery } from "react-query";
import { get } from "../../../../../api/funcRequest";


export const ActionDetalheAlterarVendaModal = ({ show, handleClose, dadosVendasDetalhada, empresaSelecionada, optionsModulos, usuarioLogado }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const {
    alterarVendaVendedor,
    selectAll,
    setSelectAll,
    selectedIds,
    setSelectedIds, 
    vendedorSelecionado,
    setVendedorSelecionado,
  } = useAlterarVendaVendedor({ optionsModulos, usuarioLogado, handleClose})
  
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Venda Detalhe',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Código Barras', 'Descrição', 'Vr Unit', 'QTD', 'Vr Recebido', 'Vendedor', 'Situação']],
      body: dadosDetalhadosModal.map(item => [
        item.IDVENDADETALHE,
        item.NUCODBARRAS,
        item.DSNOME,
        formatMoeda(item.VUNCOM),
        parseFloat(item.QTD),
        formatMoeda(item.VRTOTALLIQUIDO),
        item.VENDEDOR_NOME,
        item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('venda_detalhe.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Código Barras', 'Descrição', 'Vr Unit', 'QTD', 'Vr Recebido', 'Vendedor', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Código Barras' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Vr Unit' },
      { wpx: 100, caption: 'QTD' },
      { wpx: 100, caption: 'Vr Recebido' },
      { wpx: 100, caption: 'Vendedor' },
      { wpx: 100, caption: 'Situação' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Venda Detalhe');
    XLSX.writeFile(workbook, 'venda_detalhe.xlsx');
  };

  const { data: dadosVendedor = [], error: errorVendedor, isLoading: isLoadingVendedor } = useQuery(
    'funcionario-ativo-por-empresa',
    async () => {
      const response = await get(`/funcionario-ativo-por-empresa?idEmpresa=${empresaSelecionada}`);

      return response.data;
    },
    { enabled: Boolean(empresaSelecionada), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  );

  const dadosExcel = dadosVendasDetalhada.map((item) => {

    return {
      IDVENDADETALHE: item.IDVENDADETALHE,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VUNCOM: parseFloat(item.VUNCOM),
      QTD: item.QTD,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      STCANCELADO: item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado',
      IDVENDA: item.IDVENDA,

    }
  });
  const dadosDetalhadosModal = dadosVendasDetalhada.map((item) => {

    return {
      IDVENDA: item.IDVENDA,
      IDVENDADETALHE: item.IDVENDADETALHE,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VUNCOM: parseFloat(item.VUNCOM),
      QTD: item.QTD,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      STCANCELADO: item.STCANCELADO,
      STTROCA: item.STTROCA,
    }
  });

  const colunasVendasDetalhadasModal = [
    {
      field: 'IDVENDADETALHE',
      header: (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
          selectionMode="multiple"
        />
      ),
      body: (row) => {
        return (
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.IDVENDADETALHE)}
              onChange={(e) => {
                const updatedSelectedIds = e.target.checked
                  ? [...selectedIds, row.IDVENDADETALHE]
                  : selectedIds.filter(id => id !== row.IDVENDADETALHE);
                setSelectedIds(updatedSelectedIds);
                setSelectAll(updatedSelectedIds.length === dadosDetalhadosModal.length);
              }}
              selectionMode="multiple"
            />
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'IDVENDADETALHE',
      header: 'ID',
      body: row => <th>{row.IDVENDADETALHE}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
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
      field: 'VUNCOM',
      header: 'Vr Unit',
      body: row => <th>{formatMoeda(row.VUNCOM)}</th>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => <th>{toFloat(row.QTD)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Vr Recebido',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      sortable: true,
    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Vendedor',
      body: row => <th>{row.VENDEDOR_NOME} </th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => <th style={{ color: row.STCANCELADO === 'False' ? 'BLUE' : 'red' }}>{row.STCANCELADO === 'False' ? 'Ativo' : 'Cancelado'}</th>,
      sortable: true,
    }
  ];

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectAll(false);
    }
  }, [selectedIds]);

  useEffect(() => {
    if (!show) {
      setSelectedIds([]);
      setSelectAll(false);
    }
  }, [show]);


  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked)

    const updatedSelectedIds = isChecked ? dadosDetalhadosModal.map(item => item.IDVENDADETALHE) : []
    setSelectedIds(updatedSelectedIds)

  }

  const handleChangeVendedor = (e) => {
    setVendedorSelecionado(e.value);
  }

  
  return (
    <Fragment>


      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Venda"}
          subTitle={" Detalhes da Venda"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <div className="panel">
            <div className="panel-hdr">

              <h2>{`Lista de Produtos da Venda Nº` + dadosVendasDetalhada[0]?.IDVENDA}</h2>
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
                title="Detalhes da Venda"
                value={dadosDetalhadosModal}
                globalFilter={globalFilterValue}
                size="small"
                sortOrder={-1}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[10, 20, 50, 100, dadosDetalhadosModal.length]}
                showGridlines
                cellMemo={false}
                stripedRows
                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
              >
                {colunasVendasDetalhadasModal.map(coluna => (
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

        </Modal.Body>

        <div

          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            justifyItems: "center",
            display: "flex",
            flexDirection: "row",
            marginLeft: "10px",
          }}

        >

          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ width: '50%' }}>
              <label htmlFor="">Vendedor *</label>
              <Select
                defaultValue={vendedorSelecionado}
                options={[
                  { value: '', label: 'Selecione...' },
                  ...dadosVendedor.map((item) => {
                    return {
                      value: item.ID,
                      label: `${item.IDFUNCIONARIO} - ${item.NOFUNCIONARIO} `
                    }
                  })]}
                onChange={handleChangeVendedor}
              />

            </div>

            <ButtonType
              textButton={"Alterar Venda Vendedor"}
              onClickButtonType={alterarVendaVendedor}
              cor="success"
              Icon={AiOutlineSearch}
            />
          </div>

        </div>

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