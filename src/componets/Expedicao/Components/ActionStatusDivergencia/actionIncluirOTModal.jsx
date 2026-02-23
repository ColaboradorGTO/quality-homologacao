import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../Buttons/InputFieldModal";
import { ButtonTypeModal } from "../Buttons/ButtonTypeModal";
import { FaCheck, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { put } from "../../api/funcRequest";
import { CiEdit } from "react-icons/ci";
import { ButtonTable } from "../ButtonsTabela/ButtonTable";

export const ActionIncluirOTModal = ({
  show,
  handleClose,
  dadosDetalheTransferencia,
  dadosTransferenciaDetalhe,
  setDadosDetalheTransferencia
  
}) => {
  const { register, handleSubmit, errors } = useForm();
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
  // const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState(dadosDetalheTransferencia)

  const dadosTransferenciaDetalhe = dadosDetalheTransferencia.map((item, index) => {
    let contador = index + 1;

    return {
      IDRESUMOOT: item.IDRESUMOOT,
      IDPRODUTO: item.IDPRODUTO,
      IDEMPRESAORIGEM: item.IDEMPRESAORIGEM,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VLRUNITVENDA: item.VLRUNITVENDA,
      VLRUNITCUSTO: item.VLRUNITCUSTO,
      QTDEXPEDICAO: parseInt(item.QTDEXPEDICAO),
      QTDRECEPCAO: parseInt(item.QTDRECEPCAO),
      QTDDIFERENCA: parseInt(item.QTDDIFERENCA),
      QTDAJUSTE: parseInt(item.QTDAJUSTE),
      IDEMPRESADESTINO: item.IDEMPRESADESTINO,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),
      contador
    }
  });
  const colunasDetalheTransferencia = [
    {
      field: 'IDPRODUTO',
      header: 'Produto',
      body: row => row.IDPRODUTO,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => row.NUCODBARRAS,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => row.DSNOME,
      sortable: true,
    },
    {
      field: 'VLRUNITCUSTO',
      header: 'R$ Custo',
      body: row => row.VLRUNITCUSTO,
      sortable: true,
    },
    {
      field: 'VLRUNITVENDA',
      header: 'R$ Venda',
      body: row => row.VLRUNITVENDA,
      sortable: true,
    },
    {
      field: 'QTDEXPEDICAO',
      header: 'qtd Expedição',
      body: row => row.QTDEXPEDICAO,
      sortable: true,
    },
    {
      field: 'QTDRECEPCAO',
      header: 'qtd Dirença',
      body: row => row.QTDRECEPCAO,
      sortable: true,
    },

    {
      field: 'QTDDIFERENCA',
      header: 'Qtd Ajuste',
      button: true,
      width: "8%",
      body: (row) => (
        <div  >

          <input
            // style={{width: "60%"}}
            className="form-control"
            id={row.IDPRODUTO}
            type="number"
            name=""
            value={row.QTDAJUSTE}
            placeholder={"2"}
            onChange={(e) => handleChangeAjuste(e, row)}
          />
        </div>

      )
    },
    {
      field: 'IDSTATUSOT',
      header: 'Opções',
      button: true,
      body: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%"
          }}
        >
          <ButtonTable
            titleButton={"Excluir Produto"}
            onClickButton={() => handleClickEdit(row)}
            Icon={FaRegTrashAlt}
            iconSize={16}
            iconColor={"#fff"}
            cor={"danger"}
            id={row.NUCODBARRAS && row.QTDEXPEDICAO && row.IDRESUMOOT && row.IDPRODUTO}
            disabledBTN={row.IDSTATUSOT === 6}
          />
        </div>
      )
    }
  ]

  const handleChangeAjuste = (e, row) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const updateRow = { ...row, QTDAJUSTE: value };
      const updateData = dadosTransferenciaDetalhe.map((item => (item.IDPRODUTO === row.IDPRODUTO ? updateRow : item)));
      setDadosDetalheTransferencia(updateData);
      setAjusteQuantidade(value);

    }
  }

  const salvarOT = async (data) => {
    let postData = {
      // IDPRODUTO,
      // QTDEXPEDICAO: QTDEXPEDICAO,
      // QTDRECEPCAO: QTDRECEPCAO,
      // QTDDIFERENCA: QTDDIFERENCA,
      // VLRUNITVENDA: VLRUNITVENDA,
      // VLRUNITCUSTO: VLRUNITCUSTO,
      // STFALTA: STFALTA,
      // STSOBRA: STSOBRA,
      // IDSTATUSOT: IDSTATUSOT,
      // IDRESUMOT: IDRESUMOT,
      QTDAJUSTE: ajusteQuantidade,
    }


    const response = await put('/updateOrdemTransferencia', postData)
      .then(response => {



        console.log(response, 'despesa cadastrada com sucesso front end!')
      })

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Ordem de Transferência atualizada com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao atualizar Ordem de Transferência!',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(error)
      })

  }

  return (

    <Fragment>

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
          <div className="modal-body" id="resultadoot">


            <form onSubmit={handleSubmit(salvarOT)}>
              <div className="row" data-select2-id="736">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Loja Origem"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}
                    value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
                  />
                </div>
                <div className="col-sm-6 col-xl-6" data-select2-id="735">
                  <InputFieldModal
                    label={"Loja Destino"}
                    type="select"
                    value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                    readOnly={true}
                  />
                </div>
              </div>


              <div className="row mt-4">
                <div className="col-sm-6 col-xl-4">
                  <InputFieldModal
                    label={"Produto"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-sm-8 col-xl-8">

                  <ButtonTypeModal
                    Icon={FaRegSave}
                    textButton={"Salvar"}
                    cor={"info"}
                    className={"mr-4"}
                    onClickButtonType={salvarOT}

                  />
                </div>
                <div className="col-sm-8 col-xl-8 mt-4">
                  <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                </div>
              </div>
            </form>



            <div className="card">
              <DataTable
                title="Vendas por Loja"
                value={dadosTransferenciaDetalhe}
                sortField="VRTOTALPAGO"
                sortOrder={-1}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20, 50]}
                showGridlines
                stripedRows
                emptyMessage="Sem Registros para Exibir"
              >
                {colunasDetalheTransferencia.map(coluna => (
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

          <FooterModal handleClose={handleClose} />
        </div>
      </Modal>
    </Fragment>
  )
}
