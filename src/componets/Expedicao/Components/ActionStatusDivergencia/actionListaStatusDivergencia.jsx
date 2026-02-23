import { Fragment, useState } from "react"
import { put } from "../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CiEdit } from "react-icons/ci";
import { ButtonTable } from "../ButtonsTabela/ButtonTable";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../Buttons/InputFieldModal";
import { ButtonTypeModal } from "../Buttons/ButtonTypeModal";

import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import AsyncSelect from 'react-select/async';

export const ActionListaStatusDivergencia = () => {
  const { register, handleSubmit, errors } = useForm();
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [modalCadastrarVisivel, setModalCadastrarVisivel] = useState(false);


  const dados = dadosDivergencia.map((item, index) => {
    let contador = index + 1;

    return {
      DATACRIACAO: item.DATACRIACAO,
      DATACRIACAOFORMATADA: item.DATACRIACAOFORMATADA,
      DESCRICAODIVERGENCIA: item.DESCRICAODIVERGENCIA,
      IDSTATUSDIVERGENCIA: item.IDSTATUSDIVERGENCIA,
      IDUSRCRIACAO: item.IDUSRCRIACAO,
      STATIVO: item.STATIVO,
      contador
    }
  });

  const colunasDivergencia = [
    {
      name: 'IdStatus',
      selector: row => row.IDSTATUSDIVERGENCIA,
      sortable: true,
    },
    {
      name: 'Descricao',
      selector: row => row.DESCRICAODIVERGENCIA,
      sortable: true,
    },
    {
      name: 'Data',
      selector: row => row.DATACRIACAOFORMATADA,
      sortable: true,
    },
    {
      name: 'Status',
      cell: (row) => (
        <div>
          {row.STATIVO === 'True' ? 'Ativo' : 'Inativo'}
        </div>
      ),

      sortable: true,
    },

    {
      name: 'Opções',
      button: true,
      width: "10%",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%"
          }}
        >
          <ButtonTable
            titleButton={"Alterar"}
            onClickButton={() => handleEdit(row)}
            Icon={CiEdit}
            iconSize={16}
            iconColor={"#fff"}
            cor={"info"}

          />



        </div>
      )


    }

  ]

  const inserirSD = async (data) => {
    let postData = {
      DESCRICAODIVERGENCIA,
      IDUSRCRIACAO: usuarioLogado.id,
      STATIVO: statusSelecionada
    }

    const response = await post('/inserirSD', postData)
      .then(response => {
        console.log(response, 'cadastro com sucesso no front end!')
      })

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cadastrado com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao cadastrar!',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(error)
      })

  }
  const alterarSD = async (data) => {
    let postData = {
      IDSTATUSDIVERGENCIA,
      DESCRICAODIVERGENCIA,
      STATIVO: statusSelecionada
    }

    const response = await put('/updateStatusDivergencia', postData)
      .then(response => {
        console.log(response, 'despesa cadastrada com sucesso front end!')
      })

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Atualizada com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao atualizar!',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(error)
      })

  }



  return (
    <Fragment>

      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dados}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasDivergencia.map(coluna => (
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





      {/* <ConferenciaCegaActionIncluirotModal
        show={modalEditarVisivel}
        handleClose={handleClose}
      /> */}

      {modalEditarVisivel && (
        <Modal
          show={showModal}
          onHide={handleClose}
          size="xl"
        >
          <HeaderModal
            title="Status de Divergência"
            subTitle="Cadastrar ou Atualizar informações de Status de Divergência"
            handleClose={handleClose}
          />
          <Modal.Body>

            <form onSubmit >
              <div className="row" data-select2-id="736">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Descrição"}
                    type="text"
                    value={descricao}
                    onChange={handleChangeDescricao}
                    placeholder={"OUTROS"}
                  />
                </div>
                <div className="col-sm-6 col-xl-6" >
                  <label htmlFor="">Status</label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    value={statusSelecionada}
                    onChange={handleChangeStatus}
                    defaultOptions
                    isSearchable
                  />
                </div>
              </div>

            </form>

          </Modal.Body>

          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            // onClickButtonCadastrar={inserirSD}
            onClickButtonCadastrar
            textButtonCadastrar={"Atualizar"}

            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}

          />

        </Modal>
      )}

      {modalCadastrarVisivel && (
        <Modal
          show={showModal}
          onHide={handleClose}
          size="xl"
        >
          <HeaderModal
            title="Status de Divergência"
            subTitle="Cadastrar ou Atualizar informações de Status de Divergência"
            handleClose={handleClose}
          />
          <Modal.Body>

            <form onSubmit >
              <div className="row" data-select2-id="736">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Descrição"}
                    type="text"
                    value={descricao}
                    onChange={handleChangeDescricao}
                    placeholder={"OUTROS"}
                  />
                </div>
                <div className="col-sm-6 col-xl-6" >
                  <label htmlFor="">Status</label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    value={statusSelecionada}
                    onChange={handleChangeStatus}
                    defaultOptions
                    isSearchable
                  />
                </div>
              </div>

            </form>

          </Modal.Body>

          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            // onClickButtonCadastrar={inserirSD}
            onClickButtonCadastrar
            textButtonCadastrar={"Atualizar"}

            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}

          />

        </Modal>
      )}

    </Fragment>
  )
}