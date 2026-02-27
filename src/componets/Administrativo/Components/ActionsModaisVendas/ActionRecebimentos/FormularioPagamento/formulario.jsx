import { Fragment, useState } from "react"
import { InputFieldModal } from "../../../../../Buttons/InputFieldModal";;
import { ButtonType } from "../../../../../Buttons/ButtonType";
import { get } from "../../../../../../api/funcRequest";
import { useQuery } from "react-query";
import Select from 'react-select';
import { usePagamento } from "../../../../../../hooks/useAlteracaoPagamento";
import { FooterModal } from "../../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../../Buttons/ButtonTypeModal";
import { useForm, Controller } from "react-hook-form"
import { schema } from "./usePagamentoSchema";
import FormField from "../../../../../Formularios/FormField";

const formatarMoeda = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '');
  if (!apenasNumeros) return '';
  if (apenasNumeros.length <= 2) return apenasNumeros;
  
  const centavos = apenasNumeros.slice(-2);
  const inteiros = apenasNumeros.slice(0, -2);
  
  const integrosFormatado = inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return integrosFormatado + '.' + centavos;
};

export const FormularioAlteracaoPagamento = ({
  dadosDetalheRecebimentos, 
  dadosAtivasVendas,
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
    onSubmit,
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

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        vrDinheiro: valorDinheiro,
        vrPix: valorPix,
        chavePix: nuChavePix,
        numeroOperacao: nuOperacao,
        nAutorizacao: nuAutorizacao,
        valorCartao: vrCartao,
        nParcelas: qtdParcelas,
        dataParcelaN1: dataParcela1,
        numeroOperacao2: nuOperacao2,
        numeroAutorizacao2: nuAutorizacao2,
        valorCartao2: vrCartao2,
        nParcelas2: qtdParcelas2,
        dataParcelaN2: dataParcela2,
        numeroOperacao3: nuOperacao3,
        numeroAutorizacao3: nuAutorizacao3,
        valorCartao3: vrCartao3,
        nParcelas3: qtdParcelas3,
        dataParcelaN3: dataParcela3,
        numeroOperacaoPOS: nuOperacaoPOS,
        numeroAutorizacaoPOS: nuAutorizacaoPOS,
        valorPos: vrPos,
        nqtdParcelasPos1: qtdParcelasPOS,
        dataParcelaPos1: dataParcelaPOS,
        numeroOperacaoPOS2: nuOperacaoPOS2,
        numeroAutorizacaoPOS2: nuAutorizacaoPOS2,
        valorPos2: vrPos2,
        nqtdParcelasPos2: qtdParcelasPOS2,
        datadaParcelaPos2: dataParcelaPOS2,
        valorVoucher: vrVoucher,
        numeroVoucher: nuVoucher,
        motivo: motivoAlteracao
      }
  
      await schema.validate(dadosParaValidar, { abortEarly: false });

      await onSubmit();
      await handleClose();
     

    } catch (validationError) {
      clearErrors();


      if (validationError.inner && validationError.inner.length > 0) {
        validationError.inner.forEach(error => {
          if (error.path) {
            setError(error.path, {
              type: 'manual',
              message: error.message
            });
          }
        });
      }
      console.log('Erro de validação:', validationError);
      const errorMessages = validationError.errors || [validationError.message];
      console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
    }
  }

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
        {optionsModulos[0]?.ALTERAR == 'True' ? (
          <ButtonType
            cor={pagamentos ? 'success' : 'danger'}
            textButton={'Alterar Pagamentos'}
            onClickButtonType={alterarPagamentoVisivel}
          />
        ) : (
          <h4 style={{color: 'red', fontWeight: 800}}>Colaborador não habilitado para essa função!</h4>
        )}
        <hr />
      </div>

      {pagamentos && (
        <>
          <form onSubmit={handleSubmit(handleValidatedSubmit)}>
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
                  <Controller
                    name="vrDinheiro"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Valor Dinheiro"}
                        name="vrDinheiro"
                        type="text"
                        value={valorDinheiro}
                        onChange={(e) => setValorDinheiro(formatarMoeda(e.target.value))}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
              </div>
              <hr />

            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-2 col-xl-3">       
                  <Controller
                    name="vrPix"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Valor PIX"}
                        name="vrPix"
                        type="text"
                        value={valorPix}
                        onChange={(e) => setValorPix(formatarMoeda(e.target.value))}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />

                </div>
                <div class="col-sm-6 col-md-6 col-xl-9">
                  <Controller
                    name="chavePix"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Nº Chave PIX"}
                        name="chavePix"
                        type="text"
                        value={nuChavePix}
                        onChange={(e) => setNuChavePix(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
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
                  <Controller
                    name="numeroOperacao"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"NSU_CTF"}
                        name="numeroOperacao"
                        type="text"
                        value={nuOperacao}
                        onChange={(e) => setNuOperacao(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
         
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <Controller
                    name="nAutorizacao"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Nº Autorização"}
                        name="nAutorizacao"
                        type="text"
                        value={nuAutorizacao}
                        onChange={(e) => setNuAutorizacao(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />

                </div>
              </div>
            </div>
            <hr />
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <Controller
                    name="valorCartao"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Valor Cartão"}
                        name="valorCartao"
                        type="text"
                        value={vrCartao}
                        onChange={(e) => setVrCartao(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
             
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
      
                  <Controller
                    name="nParcelas"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Qtd Parcelas"}
                        name="nParcelas"
                        type="number"
                        value={qtdParcelas}
                        onChange={(e) => setQtdParcelas(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <Controller
                    name="dataParcelaN1"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Data 1ª Parcela"}
                        name="dataParcelaN1"
                        type="date"
                        value={dataParcela1}
                        onChange={(e) => setDataParcela1(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
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
                  
                      <Controller
                        name="numeroOperacao2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"NSU_CTF 2"}
                            name="numeroOperacao2"
                            type="text"
                            value={nuOperacao2}
                            onChange={(e) => setNuOperacao2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <Controller
                        name="numeroAutorizacao2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Nº Autorização 2"}
                            name="numeroAutorizacao2"
                            type="text"
                            value={nuAutorizacao2}
                            onChange={(e) => setNuAutorizacao2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">
                      <Controller
                        name="valorCartao2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Valor Cartão 2"}
                            name="valorCartao2"
                            type="text"
                            value={vrCartao2}
                            onChange={(e) => setVrCartao2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="nParcelas2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Qtd Parcelas 2"}
                            name="nParcelas2"
                            type="number"
                            value={qtdParcelas2}
                            onChange={(e) => setQtdParcelas2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="dataParcelaN2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Data 1ª Parcela 2"}
                            name="dataParcelaN2"
                            type="date"
                            value={dataParcela2}
                            onChange={(e) => setDataParcela2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
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
                      <Controller
                        name="numeroOperacao3"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"NSU_CTF 3"}
                            name="numeroOperacao3"
                            type="text"
                            value={nuOperacao3}
                            onChange={(e) => setNuOperacao3(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="numeroAutorizacao3"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Nº Autorização 3"}
                            name="numeroAutorizacao3"
                            type="text"
                            value={nuAutorizacao3}
                            onChange={(e) => setNuAutorizacao3(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">
                     <Controller
                        name="valorCartao3"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Valor Cartão 3"}
                            name="valorCartao3"
                            type="text"
                            value={vrCartao3}
                            onChange={(e) => setVrCartao3(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="nParcelas3"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Qtd Parcelas 3"}
                            name="nParcelas3"
                            type="number"
                            value={qtdParcelas3}
                            onChange={(e) => setQtdParcelas3(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="dataParcelaN3"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Data 1ª Parcela 3"}
                            name="dataParcelaN3"
                            type="date"
                            value={dataParcela3}
                            onChange={(e) => setDataParcela3(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
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
                  <Controller
                    name="numeroOperacaoPOS"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"NSU_CTF"}
                        name="numeroOperacaoPOS"
                        type="text"
                        value={nuOperacaoPOS}
                        onChange={(e) => setNuOperacaoPOS(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <Controller
                    name="numeroAutorizacaoPOS"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Nº Autorização"}
                        name="numeroAutorizacaoPOS"
                        type="text"
                        value={nuAutorizacaoPOS}
                        onChange={(e) => setNuAutorizacaoPOS(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <Controller
                    name="valorPos"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Valor POS"}
                        name="valorPos"
                        type="text"
                        value={vrPos}
                        onChange={(e) => setVrPos(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <Controller
                    name="nqtdParcelasPos1"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Qtd Parcelas"}
                        name="nqtdParcelasPos1"
                        type="number"
                        value={qtdParcelasPOS}
                        onChange={(e) => setQtdParcelasPOS(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />

                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">
                  <Controller
                    name="dataParcelaPos1"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Data 1ª Parcela"}
                        name="dataParcelaPos1"
                        type="date"
                        value={dataParcelaPOS}
                        onChange={(e) => setDataParcelaPOS(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
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
                      <Controller
                        name="numeroOperacaoPOS2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"NSU_CTF 2"}
                            name="numeroOperacaoPOS2"
                            type="text"
                            value={nuOperacaoPOS2}
                            onChange={(e) => setNuOperacaoPOS2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="numeroAutorizacaoPOS2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Nº Autorização 2"}
                            name="numeroAutorizacaoPOS2"
                            type="text"
                            value={nuAutorizacaoPOS2}
                            onChange={(e) => setNuAutorizacaoPOS2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">
                      <Controller
                        name="valorPos2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Valor POS 2"}
                            name="valorPos2"
                            type="text"
                            value={vrPos2}
                            onChange={(e) => setVrPos2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="nqtdParcelasPos2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Qtd Parcelas 2"}
                            name="nqtdParcelasPos2"
                            type="number"
                            value={qtdParcelasPOS2}
                            onChange={(e) => setQtdParcelasPOS2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <Controller
                        name="datadaParcelaPos2"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={"Data 1ª Parcela 2"}
                            name="datadaParcelaPos2"
                            type="date"
                            value={dataParcelaPOS2}
                            onChange={(e) => setDataParcelaPOS2(e.target.value)}
                            errors={errors}
                            clearErrors={clearErrors}
                          />
                        )}
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
                  <Controller
                    name="valorVoucher"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Valor Voucher"}
                        name="valorVoucher"
                        type="text"
                        value={vrVoucher}
                        onChange={(e) => setVrVoucher(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
                <div class="col-sm-6 col-md-4 col-xl-4">
                  <Controller
                    name="numeroVoucher"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Numero Voucher"}
                        name="numeroVoucher"
                        type="text"
                        value={nuVoucher}
                        onChange={(e) => setNuVoucher(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-12">
                  <Controller
                    name="motivo"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={"Motivo da Alteração"}
                        name="motivo"
                        type="text"
                        value={motivoAlteracao}
                        onChange={(e) => setMotivoAlteracao(e.target.value)}
                        errors={errors}
                        clearErrors={clearErrors}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              onClickButtonFechar={handleClose}
              textButtonFechar={"Fechar"}
              corFechar={"secondary"}

              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar={handleValidatedSubmit}
              textButtonCadastrar={"Finalizar Alteração de Pagamentos"}
              corCadastrar={"success"}
              loadingTextCadastrar={"Cadastrando..."}
              autoLoadingCadastrar={true}
            />
          </form>
        </>
      )}
    </Fragment>
  )
}