import { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FaRegSave } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Select from 'react-select';

export const ActionOrdemTransferenciaModal = ({ show, handleClose, dadosConferencia }) => {

  const dados = dadosConferencia.map((item, index) => {
    let contador = index + 1;
 
    return {
      IDRESUMOOT: item.IDRESUMOOT,
      DATAEXPEDICAOFORMATADA: item.DATAEXPEDICAOFORMATADA,
      EMPRESAORIGEM: item.EMPRESAORIGEM,
      EMPRESADESTINO: item.EMPRESADESTINO,
      NUMERONOTASEFAZ: item.NUMERONOTASEFAZ,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),
      DESCRICAOOT: item.DESCRICAOOT,


      IDSAPORIGEM: item.IDSAPORIGEM,
      IDSAPDESTINO: item.IDSAPDESTINO,
      ERRORLOGSAP: item.ERRORLOGSAP,

      contador
    }
  });

  const colunasConferencia = [
    {
      field: 'IDRESUMOOT',
      header: 'Nº OT',
      body: row => row.IDRESUMOOT,
      sortable: true,
    },
    {
      field: 'DATAEXPEDICAOFORMATADA',
      header: 'Data Criação',
      body: row => row.DATAEXPEDICAOFORMATADA,
      sortable: true,
    },
    {
      field: 'EMPRESAORIGEM',
      header: 'Loja Origem',
      body: row => row.EMPRESAORIGEM,
      sortable: true,
    },
    {
      field: 'EMPRESADESTINO',
      header: 'Loja Destino',
      body: row => row.EMPRESADESTINO,
      sortable: true,
    },
    {
      field: 'NUMERONOTASEFAZ',
      header: 'Número NF-e',
      body: row => row.NUMERONOTASEFAZ,
      sortable: true,
    },
    {
      field: 'DESCRICAOOT',
      header: 'Status',
      body: row => row.DESCRICAOOT,
      sortable: true,
    },
    {
      field: 'IDSTATUSOT',
      header: 'Opções',
      body: (row) => {

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "150px",
              
            }}
          >
            <ButtonTable
              titleButton={"Editar / Visualizar"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={CiEdit}
              iconSize={16}
              iconColor={"#fff"}
              cor={"primary"}
              disabledBTN={[1, 2].indexOf(row.IDSTATUSOT) >= 0}
            />
            <ButtonTable
              titleButton={"Cancelar"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={FaRegTrashAlt}
              iconSize={16}
              iconColor={"#fff"}
              cor={"danger"}
              disabledBTN={row.IDSTATUSOT === 1}
            />
            <ButtonTable
              titleButton={"Encerrar OT"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={FaCheck}
              iconSize={16}
              iconColor={"#fff"}
              cor={"info"}
              disabledBTN={row.IDSTATUSOT === 6}
            />
          

            <Fragment>
              
              { row.ERRORLOGSAP !== '' && row.ERRORLOGSAP !== null ? (
                <Fragment>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickDetalhar(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"danger"}
                      
                    />
                </Fragment>
              ) : (
                (row.ERRORLOGSAP === '' || row.ERRORLOGSAP === null) && row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0 ? (
                <Fragment>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickDetalhar(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"success"}
                      
                    />
                </Fragment>
              ) : (
                <Fragment>
                    <ButtonTable
                      titleButton={"Status Nota Fiscal"}
                      onClickButton={() => handleClickDetalhar(row)}
                      Icon={FaExclamation}
                      iconSize={16}
                      iconColor={"#fff"}
                      cor={"warning"}
                      
                    />
                </Fragment>

                ) ) }

            </Fragment>
          </div>
        );
      }
    }
  ]

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
            <div className="modal-body" id="resultadoot"><div id="resultadocadestrutura"></div>

              <div className="form-group" data-select2-id="737">
                <div className="row" data-select2-id="736">
                  <div className="col-sm-6 col-xl-6">
                    <InputFieldModal
                      label={"Loja Origem"}
                      type="text"
                      
                      readOnly={true}
                    />
                  </div>
                  <div className="col-sm-6 col-xl-6" data-select2-id="735">
                    {/* <InputSelect
                      label={"Loja Destino"}
                      type="select"
                      // id="idlojadestinomodal"
                      options
                    /> */}
                    <label htmlFor="">Loja Destino</label>
                    {/* <Select
                      defaultValue={usuarioSelecionado}
                      options={[
                        { value: '', label: 'Selecione...' },
                        ...dadosFuncionarios.map((item) => {
                          return {
                            value: item.ID,
                            label: `${item.ID} - ${item.NOFUNCIONARIO}`
                          }
                        })]}
                      onChange={handleChangeUsuario}
                    /> */}
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

              <DataTable

                title="Vendas por Loja"
                value={dados}
                sortField="VRTOTALPAGO"
                sortOrder={-1}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 30, 50, 100]}

                showGridlines
                stripedRows
                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
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

            <FooterModal
              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar={""}
              textButtonCadastrar={"Cadastrar"}
              corCadastrar="success"

              ButtonTypeFechar={ButtonTypeModal}
              textButtonFechar={"Fechar"}
              onClickButtonFechar={handleClose}
              corFechar="secondary"
            />
          </div>
        </Modal>
    </Fragment>
  )
}