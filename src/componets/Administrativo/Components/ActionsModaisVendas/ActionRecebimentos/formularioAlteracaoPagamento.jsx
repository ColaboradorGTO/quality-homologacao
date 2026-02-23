import { Fragment, useState } from "react"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";;
import { ButtonType } from "../../../../Buttons/ButtonType";
import { get } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import Select from 'react-select';
import { usePagamento } from "../../../../../hooks/useAlteracaoPagamento";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { useForm, Controller } from "react-hook-form"
import { mascaraValor } from "../../../../../utils/mascaraValor";

export const FormularioAlteracaoPagamento = ({
  dadosDetalheRecebimentos, 
  handleClose,
  optionsModulos, 
  usuarioLogado 
}) => {
  const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
    mode: "onChange"
  });
  const {
    valorDistribuir,
    setValorDistribuir,
    valorDinheiro,
    setValorDinheiro,
    valorPix,
    setValorPix,
    nuChavePix,
    setNuChavePix,
    dsTipoPagamentoTEF,
    setDsTipoPagamentoTEF,
    nuOperacao,
    setNuOperacao,
    nuAutorizacao,
    setNuAutorizacao,
    vrCartao,
    setVrCartao,
    dataParcela2,
    setDataParcela2,
    dsTipoPagamentoTEF2,
    setDsTipoPagamentoTEF2,
    nuOperacao2,
    setNuOperacao2,
    nuAutorizacao2,
    setNuAutorizacao2,
    vrCartao2,
    setVrCartao2,
    qtdParcelas,
    setQtdParcelas,
    qtdParcelas2,
    setQtdParcelas2,
    dataParcela3,
    setDataParcela3,
    dsTipoPagamentoTEF3,
    setDsTipoPagamentoTEF3,
    nuOperacao3,
    setNuOperacao3,
    nuAutorizacao3,
    setNuAutorizacao3,
    vrCartao3,
    setVrCartao3,
    qtdParcelas3,
    setQtdParcelas3,
    dsTipoPagamentoPOS,
    setDsTipoPagamentoPOS,
    nuOperacaoPOS,
    setNuOperacaoPOS,
    nuAutorizacaoPOS,
    setNuAutorizacaoPOS,
    vrPos,
    setVrPos,
    qtdParcelasPOS,
    setQtdParcelasPOS,
    dataParcelaPOS,
    setDataParcelaPOS,
    dsTipoPagamentoPOS2,
    setDsTipoPagamentoPOS2,
    nuOperacaoPOS2,
    setNuOperacaoPOS2,
    nuAutorizacaoPOS2,
    setNuAutorizacaoPOS2,
    vrPos2,
    setVrPos2,
    qtdParcelasPOS2,
    setQtdParcelasPOS2,
    dataParcelaPOS2,
    setDataParcelaPOS2,
    vrVoucher,
    setVrVoucher,
    nuVoucher,
    setNuVoucher,
    motivoAlteracao,
    setMotivoAlteracao,
    dataParcela1,
    setDataParcela1,
    pagamentos,
    setPagamentos,
    incluirCartao2,
    setIncluirCartao2,
    incluirCartao3,
    setIncluirCartao3,
    incluirPos2,
    setIncluirPos2,
    cancelarVendaPagamento
  } = usePagamento({dadosDetalheRecebimentos,  optionsModulos, usuarioLogado });

  const [alerta, setAlerta] = useState(false);


  const { data: optionsPagamentosTef = [], error: errorPagamentosTef, isLoading: isLoadingPagamentosTef, refetch } = useQuery(
    'pagamento-tef',
    async () => {
      const response = await get(`/pagamento-tef`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );
  const { data: optionsPagamentosPOS = [], error: errorPagamentosPOS, isLoading: isLoadingPagamentosPOS, refetch: refetchPagamentoPOS } = useQuery(
    'pagamento-pos',
    async () => {
      const response = await get(`/pagamento-pos`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const enviar = async () => {
    // e.preventDefault(); 
    const result = await cancelarVendaPagamento();
    // handleClose();
    // console.log('resultado alteração pagamento:', result);
    return result;
  };

  const handleClickCartão2 = () => {
    setIncluirCartao2(prev => !prev)
  }
  const handleClickCartão3 = () => {
    setIncluirCartao3(prev => !prev)
  }

  const handleClickPos2 = () => {
    setIncluirPos2(prev => !prev)
  }

  const alterarPagamentoVisivel = () => {
    const idsPermitidos = [ 2001, 2024, 5074, 5025, 30174, 30514];
   
    if (idsPermitidos.includes(usuarioLogado?.id)) {
      setPagamentos(prev => !prev);
      setAlerta(false);
    } else {
      setAlerta(true);
    }
  };
  
  return (

    <Fragment>

      <div className="pt-5">
        <ButtonType
          cor={pagamentos ? 'success' : 'danger'}
          textButton={'Alterar Pagamentos'}
          onClickButtonType={alterarPagamentoVisivel}
        />
        <hr />
        {alerta && (

          <h4 style={{color: 'red', fontWeight:  800}}>Colaborador não habilitado para essa função!</h4>
        )}
      </div>

      {pagamentos && (
        <>
          <form onSubmit={handleSubmit(enviar)}>
            <div class="form-group">
              <div class="row">
                <div class="col-sm-6 col-md-3 col-xl-4">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    id="vrDistribuir"
                    label="Restante a Distribuir (menos Voucher)"
                    value={valorDistribuir}
                    onChangeModal={(e) => setValorDistribuir(e.target.value)}
                  />
                </div>
                
              </div>
              <div class="row mt-4">
                <div class="col-sm-3 col-md-3 col-xl-4">
                  <InputFieldModal
                    className="form-control input"
                    id="vrDinheiro"
                    label="Valor Dinheiro"
                    value={valorDinheiro}
                    onChangeModal={(e) => setValorDinheiro(e.target.value)}
                  />
                </div>
              </div>
              <hr />

            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-2 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    id="vrPix"
                    label="Valor PIX"
                    value={valorPix}
                    onChangeModal={(e) => setValorPix(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-9">
                  <InputFieldModal
                    className="form-control input"
                    id="nuChavePix"
                    label="Nº Chave PIX"
                    value={nuChavePix}
                    onChangeModal={(e) => setNuChavePix(e.target.value)}
                  />
                </div>
              </div>
              <hr />

            </div>

            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-6 col-xl-6">
                  <label htmlFor="">Descrição Cartão TEF</label>
                  <Select
                    defaultValue={dsTipoPagamentoTEF}
                    options={optionsPagamentosTef.map((pagamento) => ({
                      value: pagamento.DSTIPOPAGAMENTOTEF,
                      label: pagamento.DSTIPOPAGAMENTOTEF,
                    }))}
                    onChange={(e) => setDsTipoPagamentoTEF(e.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    id="nuOperacao"
                    label="NSU_CTF"
                    value={nuOperacao}
                    onChangeModal={(e) => setNuOperacao(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    id="nuAutorizacao"
                    label="Nº Autorização"
                    value={nuAutorizacao}
                    onChangeModal={(e) => setNuAutorizacao(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    id="vrCartao"
                    label="Valor Cartão"
                    value={vrCartao}
                    onChangeModal={(e) => setVrCartao(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    id="qtdParcelas"
                    label="Qtd Parcelas"
                    value={qtdParcelas}
                    onChangeModal={(e) => setQtdParcelas(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    type={'date'}
                    id="dataParcela1"
                    label="Data 1ª Parcela"
                    value={dataParcela1}
                    onChangeModal={(e) => setDataParcela1(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <ButtonType
                    cor={incluirCartao2 ? 'warning' : 'success'}
                    textButton={incluirCartao2 ? 'Retirar Cartão 2' : 'Incluir Cartão 2'}
                    onClickButtonType={handleClickCartão2}
                  />
                </div>
              </div>
            </div>
            <hr />
            {/* Início Cartão 2 */}
            {incluirCartao2 && (
              <>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">
                      <label htmlFor=""> Descrição Cartão TEF 2 </label>
                      <Select
                        defaultValue={dsTipoPagamentoTEF2}
                        options={optionsPagamentosTef.map((pagamento) => ({
                          value: pagamento.DSTIPOPAGAMENTOTEF,
                          label: pagamento.DSTIPOPAGAMENTOTEF,
                        }))}
                        onChange={(e) => setDsTipoPagamentoTEF2(e.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuOperacao2"
                        label="NSU_CTF 2"
                        value={nuOperacao2}
                        onChangeModal={(e) => setNuOperacao2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuAutorizacao2"
                        label="Nº Autorização 2"
                        value={nuAutorizacao2}
                        onChangeModal={(e) => setNuAutorizacao2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        id="vrCartao2"
                        label="Valor Cartão 2"
                        value={vrCartao2}
                        onChangeModal={(e) => setVrCartao2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={'number'}
                        id="qtdParcelas2"
                        label="Qtd Parcelas 2"
                        value={qtdParcelas2}
                        onChangeModal={(e) => setQtdParcelas2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        id="dataParcela2"
                        label="Data 1ª Parcela 2"
                        value={dataParcela2}
                        onChangeModal={(e) => setDataParcela2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <ButtonType
                        cor={incluirCartao3 ? 'warning' : 'success'}
                        textButton={incluirCartao3 ? 'Retirar Cartão 3' : 'Incluir Cartão 3'}
                        onClickButtonType={handleClickCartão3}
                      />
                    </div>
                  </div>
                </div>
                <hr />
              </>
            )}
            {/* Fim Cartão 2 */}

            {/* Início Cartão 3 */}
            {incluirCartao3 && (
              <>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">
                      <label htmlFor=""> Descrição Cartão TEF 3 </label>
                      <Select
                        defaultValue={dsTipoPagamentoTEF3}
                        options={optionsPagamentosTef.map((pagamento) => ({
                          value: pagamento.DSTIPOPAGAMENTOTEF,
                          label: pagamento.DSTIPOPAGAMENTOTEF,
                        }))}
                        onChange={(e) => setDsTipoPagamentoTEF3(e.value)}
                      />

                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuOperacao3"
                        label="NSU_CTF 3"
                        value={nuOperacao3}
                        onChangeModal={(e) => setNuOperacao3(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuAutorizacao3"
                        label="Nº Autorização 3"
                        value={nuAutorizacao3}
                        onChangeModal={(e) => setNuAutorizacao3(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="vrCartao3"
                        label="Valor Cartão 3"
                        value={vrCartao3}
                        onChangeModal={(e) => setVrCartao3(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'number'}
                        id="qtdParcelas3"
                        label="Qtd Parcelas 3"
                        value={qtdParcelas3}
                        onChangeModal={(e) => setQtdParcelas3(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        id="dataParcela3"
                        label="Data 1ª Parcela 3"
                        value={dataParcela3}
                        onChangeModal={(e) => setDataParcela3(e.target.value)}
                      />
                    </div>

                  </div>

                </div>
                <hr />
              </>
            )}
            {/* Fim Cartão 3 */}

            {/* Início POS  */}
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-6 col-xl-6">
                  <label htmlFor=""> Descrição POS </label>
                  <Select
                    defaultValue={dsTipoPagamentoPOS}
                    options={optionsPagamentosPOS.map((pagamento) => ({
                      value: pagamento.DSTIPOPAGAMENTOPOS,
                      label: pagamento.DSTIPOPAGAMENTOPOS,
                    }))}
                    onChange={(e) => setDsTipoPagamentoPOS(e.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    type={"text"}
                    id="nuOperacaoPOS"
                    label="NSU_CTF "
                    value={nuOperacaoPOS}
                    onChangeModal={(e) => setNuOperacaoPOS(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    type={"text"}
                    id="nuAutorizacaoPOS"
                    label="Nº Autorização "
                    value={nuAutorizacaoPOS}
                    onChangeModal={(e) => setNuAutorizacaoPOS(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    id="vrPos"
                    type={"text"}
                    label="Valor POS"
                    value={vrPos}
                    onChangeModal={(e) => setVrPos(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    id="qtdParcelasPOS"
                    type={"number"}
                    label="Qtd Parcelas"
                    value={qtdParcelasPOS}
                    onChangeModal={(e) => setQtdParcelasPOS(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <InputFieldModal
                    className="form-control input"
                    type={'date'}
                    id="dataParcelaPOS"
                    label="Data 1ª Parcela"
                    value={dataParcelaPOS}
                    onChangeModal={(e) => setDataParcelaPOS(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <ButtonType
                    cor={incluirPos2 ? 'warning' : 'success'}
                    textButton={incluirPos2 ? 'Retirar POS 2' : 'Incluir POS 2'}
                    onClickButtonType={handleClickPos2}
                  />
                </div>
              </div>
            </div>
            {/* Fim POS  */}
            <hr />
            {/* Início POS  2*/}
            {incluirPos2 && (
              <>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">
                      <label htmlFor=""> Descrição POS 2</label>
                      <Select
                        defaultValue={dsTipoPagamentoPOS2}
                        options={optionsPagamentosPOS.map((pagamento) => ({
                          value: pagamento.DSTIPOPAGAMENTOPOS,
                          label: pagamento.DSTIPOPAGAMENTOPOS,
                        }))}
                        onChange={(e) => setDsTipoPagamentoPOS2(e.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={"text"}
                        id="nuOperacaoPOS2"
                        label="NSU_CTF 2"
                        value={nuOperacaoPOS2}
                        onChangeModal={(e) => setNuOperacaoPOS2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={"text"}
                        id="nuAutorizacaoPOS2"
                        label="Nº Autorização 2"
                        value={nuAutorizacaoPOS2}
                        onChangeModal={(e) => setNuAutorizacaoPOS2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={"text"}
                        id="vrPos2"
                        label="Valor POS 2"
                        value={vrPos2}
                        onChangeModal={(e) => setVrPos2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={"number"}
                        id="qtdParcelasPOS2"
                        label="Qtd Parcelas 2"
                        value={qtdParcelasPOS2}
                        onChangeModal={(e) => setQtdParcelasPOS2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        id="dataParcelaPOS2"
                        label="Data 1ª Parcela 2"
                        value={dataParcelaPOS2}
                        onChangeModal={(e) => setDataParcelaPOS2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Fim POS  2*/}
            <hr />
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-4 col-xl-4">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Valor Voucher"
                    value={vrVoucher}
                    onChangeModal={(e) => setVrVoucher(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-4 col-xl-4">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Nº Voucher"
                    value={nuVoucher}
                    onChangeModal={(e) => setNuVoucher(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-12">
                  <InputFieldModal
                    className="form-control input"
                    id={"motivoAlteracao"}
                    type={"text"}
                    label="Motivo da Alteração"
                    value={motivoAlteracao}
                    onChangeModal={(e) => setMotivoAlteracao(e.target.value)}
                  />
                </div>
              </div>
            </div>


            {/* <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Enviar</button> */}

            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              onClickButtonFechar={handleClose}
              textButtonFechar={"Fechar"}
              corFechar={"secondary"}

              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar={handleSubmit}
              textButtonCadastrar={"Finalizar Alteração de Pagamentos"}
              corCadastrar={"success"}
            />
          </form>
        </>
      )}
    </Fragment>
  )
}