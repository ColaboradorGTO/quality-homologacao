import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../utils/dataAtual";
import { post, put } from "../api/funcRequest";
import { toFloat } from "../utils/toFloat";

/**
 * Hook de pagamentos com lógica corrigida em relação ao useAlteracaoPagamento
 * Mantém estrutura linear e visual para fácil compreensão do fluxo
 */
export const usePagamentoCorrigido = ({ dadosDetalheRecebimentos, optionsModulos, usuarioLogado }) => {
  // ESTADOS DE VALORES DE PAGAMENTO
  const [valorDistribuir, setValorDistribuir] = useState('');
  const [valorDinheiro, setValorDinheiro] = useState('');
  const [valorPix, setValorPix] = useState('');
  const [nuChavePix, setNuChavePix] = useState('');

  // ESTADOS TEF - CARTÃO 1
  const [dsTipoPagamentoTEF, setDsTipoPagamentoTEF] = useState('');
  const [nuOperacao, setNuOperacao] = useState('');
  const [nuAutorizacao, setNuAutorizacao] = useState('');
  const [vrCartao, setVrCartao] = useState('');
  const [dataParcela1, setDataParcela1] = useState('');
  const [qtdParcelas, setQtdParcelas] = useState(0);

  // ESTADOS TEF - CARTÃO 2
  const [incluirCartao2, setIncluirCartao2] = useState(false);
  const [dsTipoPagamentoTEF2, setDsTipoPagamentoTEF2] = useState('');
  const [nuOperacao2, setNuOperacao2] = useState('');
  const [nuAutorizacao2, setNuAutorizacao2] = useState('');
  const [vrCartao2, setVrCartao2] = useState('');
  const [dataParcela2, setDataParcela2] = useState('');
  const [qtdParcelas2, setQtdParcelas2] = useState(0);

  // ESTADOS TEF - CARTÃO 3
  const [incluirCartao3, setIncluirCartao3] = useState(false);
  const [dsTipoPagamentoTEF3, setDsTipoPagamentoTEF3] = useState('');
  const [nuOperacao3, setNuOperacao3] = useState('');
  const [nuAutorizacao3, setNuAutorizacao3] = useState('');
  const [vrCartao3, setVrCartao3] = useState('');
  const [dataParcela3, setDataParcela3] = useState('');
  const [qtdParcelas3, setQtdParcelas3] = useState(0);

  // ESTADOS POS - OPERADOR 1
  const [dsTipoPagamentoPOS, setDsTipoPagamentoPOS] = useState('');
  const [nuOperacaoPOS, setNuOperacaoPOS] = useState('');
  const [nuAutorizacaoPOS, setNuAutorizacaoPOS] = useState('');
  const [vrPos, setVrPos] = useState('');
  const [qtdParcelasPOS, setQtdParcelasPOS] = useState(0);
  const [dataParcelaPOS, setDataParcelaPOS] = useState('');

  // ESTADOS POS - OPERADOR 2
  const [incluirPos2, setIncluirPos2] = useState(false);
  const [dsTipoPagamentoPOS2, setDsTipoPagamentoPOS2] = useState('');
  const [nuOperacaoPOS2, setNuOperacaoPOS2] = useState('');
  const [nuAutorizacaoPOS2, setNuAutorizacaoPOS2] = useState('');
  const [vrPos2, setVrPos2] = useState('');
  const [qtdParcelasPOS2, setQtdParcelasPOS2] = useState(0);
  const [dataParcelaPOS2, setDataParcelaPOS2] = useState('');

  // ESTADOS VOUCHER
  const [vrVoucher, setVrVoucher] = useState('');
  const [nuVoucher, setNuVoucher] = useState('');

  // OUTROS ESTADOS
  const [motivoAlteracao, setMotivoAlteracao] = useState('');
  const [pagamentos, setPagamentos] = useState(false);
  const [itemAtual, setItemAtual] = useState(0);

  // =====================================================
  // useEffect para inicializar datas
  // =====================================================
  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataParcela1(dataAtual);
    setDataParcela2(dataAtual);
    setDataParcela3(dataAtual);
    setDataParcelaPOS(dataAtual);
    setDataParcelaPOS2(dataAtual);
  }, []);

  // =====================================================
  // useEffect para calcular itemAtual baseado nos pagamentos existentes
  // =====================================================
  useEffect(() => {
    const venda = dadosDetalheRecebimentos?.[0];
    setValorDistribuir(parseFloat(venda?.venda?.VRTOTALVENDA) || 0);

    if (venda?.vendaPagamento?.length > 0) {
      const nItemMaior = Math.max(...venda.vendaPagamento.map(pagamento => pagamento.pag.NITEM));
      setItemAtual(nItemMaior);
    } else {
      setItemAtual(0);
    }
  }, [dadosDetalheRecebimentos]);

  // =====================================================
  // useEffect para calcular valor a distribuir
  // =====================================================
  useEffect(() => {
    const venda = dadosDetalheRecebimentos?.[0];
    const vrDistribuir2 = toFloat(venda?.venda?.VRTOTALVENDA);

    const vrDin = toFloat(valorDinheiro);
    const vrPix = toFloat(valorPix);
    const vrCartao1 = toFloat(vrCartao);
    const vrPos1 = toFloat(vrPos);
    const vrCartao2Val = toFloat(vrCartao2);
    const vrCartao3Val = toFloat(vrCartao3);
    const vrPos2Val = toFloat(vrPos2);
    const vrVoucherVal = toFloat(vrVoucher);

    const somaValores = vrDin + vrPix + vrCartao1 + vrPos1 + vrCartao2Val + vrCartao3Val + vrPos2Val + vrVoucherVal;
    const somaDifere = vrDistribuir2 - somaValores;

    setValorDistribuir(parseFloat(somaDifere).toFixed(2));
  }, [valorDinheiro, valorPix, vrCartao, vrCartao2, vrCartao3, vrPos, vrPos2, vrVoucher, dadosDetalheRecebimentos]);

  // =====================================================
  // FUNÇÃO PRINCIPAL DE ENVIO DE PAGAMENTO
  // =====================================================
  const enviarPagamento = async () => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Usuário não tem permissão para alterar o pagamento!',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'custom-swal' }
      });
      return false;
    }

    if (toFloat(valorDistribuir) > 0) {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Valor a distribuir é maior que zero. Ajuste os valores de pagamento!',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'custom-swal' }
      });
      return false;
    }

    try {
      const idVenda = dadosDetalheRecebimentos[0].venda.IDVENDA;
      
      // ✅ CÓPIA LOCAL DE itemAtual QUE VAI INCREMENTAR AO LONGO DO FLUXO
      let nItemAtualLocal = itemAtual;

      // =====================================================
      // 1️⃣ PROCESSA DINHEIRO
      // =====================================================
      if (toFloat(valorDinheiro) > 0) {
        nItemAtualLocal++; // ✅ INCREMENTA
        const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

        const dadosPagamento = [{
          IDVENDAPAGAMENTO: idVendaPagamento,
          IDVENDA: idVenda,
          NITEM: nItemAtualLocal,
          TPAG: '000',
          DSTIPOPAGAMENTO: 'DINHEIRO',
          VALORRECEBIDO: parseFloat(valorDinheiro),
          VALORDEDUZIDO: 0,
          VALORLIQUIDO: parseFloat(valorDinheiro),
          DTPROCESSAMENTO: dataParcela1,
          DTVENCIMENTO: dataParcela1,
          NPARCELAS: 0,
          NOTEF: 'DINHEIRO',
          NUAUTORIZADOR: 'DINHEIRO',
          NOCARTAO: 'NÃO INFORMADO',
          NUOPERACAO: '',
          NSUTEF: '',
          NSUAUTORIZADORA: '',
          NUAUTORIZACAO: '',
          STCANCELADO: 'False',
          IDFUNCIONARIO: usuarioLogado.id,
        }];

        await post('/alterar-venda-pagamento', dadosPagamento);
      }

      // =====================================================
      // 2️⃣ PROCESSA PIX
      // =====================================================
      if (toFloat(valorPix) > 0) {
        if (!nuChavePix) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe a chave PIX!',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'custom-swal' }
          });
          return false;
        }

        nItemAtualLocal++; // ✅ INCREMENTA
        const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

        const dadosPagamento = [{
          IDVENDAPAGAMENTO: idVendaPagamento,
          IDVENDA: idVenda,
          NITEM: nItemAtualLocal,
          TPAG: '031',
          DSTIPOPAGAMENTO: 'PIX',
          VALORRECEBIDO: parseFloat(valorPix),
          VALORDEDUZIDO: 0,
          VALORLIQUIDO: parseFloat(valorPix),
          DTPROCESSAMENTO: dataParcela1,
          DTVENCIMENTO: dataParcela1,
          NPARCELAS: 0,
          NOTEF: 'PIX',
          NUAUTORIZADOR: 'PIX',
          NOCARTAO: 'NÃO INFORMADO',
          NUOPERACAO: '',
          NSUTEF: '',
          NSUAUTORIZADORA: '',
          NUAUTORIZACAO: nuChavePix,
          STCANCELADO: 'False',
          IDFUNCIONARIO: usuarioLogado.id,
        }];

        await post('/alterar-venda-pagamento', dadosPagamento);
      }

      // =====================================================
      // 3️⃣ PROCESSA CARTÃO 1 (TEF)
      // =====================================================
      if (toFloat(vrCartao) > 0) {
        if (!dsTipoPagamentoTEF) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento TEF 1!',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'custom-swal' }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelas) || 0;

        if (qtd === 0) {
          // ✅ SEM PARCELAS
          nItemAtualLocal++;
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

          const dadosPagamento = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoTEF.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoTEF.substring(4),
            VALORRECEBIDO: parseFloat(vrCartao),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrCartao),
            DTPROCESSAMENTO: dataParcela1,
            DTVENCIMENTO: dataParcela1,
            NPARCELAS: 0,
            NOTEF: 'TEF',
            NUAUTORIZADOR: dsTipoPagamentoTEF.substring(4),
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacao,
            NSUTEF: nuOperacao,
            NSUAUTORIZADORA: nuOperacao,
            NUAUTORIZACAO: nuAutorizacao,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
          }];

          await post('/alterar-venda-pagamento', dadosPagamento);
        } else {
          // ✅ COM PARCELAS - LOOP PARA CADA PARCELA
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrCartao / qtd).toFixed(2));

          for (let i = 1; i <= qtd; i++) {
            nItemAtualLocal++; // ✅ INCREMENTA A CADA ITERAÇÃO
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            // Calcula data de vencimento
            let dataVencimento = dataParcela1;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

            // Ajusta data se necessário
            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            // Calcula valor final da parcela
            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrCartao) {
                valorCredito = parseFloat((valorParcela - vrCartao).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrCartao) {
                valorCredito = parseFloat((vrCartao - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosPagamento = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA: idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoTEF.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoTEF.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcela1,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: qtd,
              NOTEF: 'TEF',
              NUAUTORIZADOR: dsTipoPagamentoTEF.substring(4),
              NOCARTAO: 'NÃO INFORMADO',
              NUOPERACAO: nuOperacao,
              NSUTEF: nuOperacao,
              NSUAUTORIZADORA: nuOperacao,
              NUAUTORIZACAO: nuAutorizacao,
              STCANCELADO: 'False',
              IDFUNCIONARIO: usuarioLogado.id,
            }];

            await post('/alterar-venda-pagamento', dadosPagamento);
          }
        }
      }

      // =====================================================
      // 4️⃣ PROCESSA CARTÃO 2 (TEF)
      // =====================================================
      if (toFloat(vrCartao2) > 0 && incluirCartao2) {
        if (!dsTipoPagamentoTEF2) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento TEF 2!',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'custom-swal' }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelas2) || 0;

        if (qtd === 0) {
          nItemAtualLocal++;
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

          const dadosPagamento = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoTEF2.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoTEF2.substring(4),
            VALORRECEBIDO: parseFloat(vrCartao2),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrCartao2),
            DTPROCESSAMENTO: dataParcela2,
            DTVENCIMENTO: dataParcela2,
            NPARCELAS: 0,
            NOTEF: 'TEF',
            NUAUTORIZADOR: dsTipoPagamentoTEF2.substring(4),
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacao2,
            NSUTEF: nuOperacao2,
            NSUAUTORIZADORA: nuOperacao2,
            NUAUTORIZACAO: nuAutorizacao2,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
          }];

          await post('/alterar-venda-pagamento', dadosPagamento);
        } else {
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrCartao2 / qtd).toFixed(2));

          for (let i = 1; i <= qtd; i++) {
            nItemAtualLocal++;
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            let dataVencimento = dataParcela2;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrCartao2) {
                valorCredito = parseFloat((valorParcela - vrCartao2).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrCartao2) {
                valorCredito = parseFloat((vrCartao2 - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosPagamento = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA: idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoTEF2.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoTEF2.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcela2,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: qtd,
              NOTEF: 'TEF',
              NUAUTORIZADOR: dsTipoPagamentoTEF2.substring(4),
              NOCARTAO: 'NÃO INFORMADO',
              NUOPERACAO: nuOperacao2,
              NSUTEF: nuOperacao2,
              NSUAUTORIZADORA: nuOperacao2,
              NUAUTORIZACAO: nuAutorizacao2,
              STCANCELADO: 'False',
              IDFUNCIONARIO: usuarioLogado.id,
            }];

            await post('/alterar-venda-pagamento', dadosPagamento);
          }
        }
      }

      // =====================================================
      // 5️⃣ PROCESSA CARTÃO 3 (TEF)
      // =====================================================
      if (toFloat(vrCartao3) > 0 && incluirCartao3) {
        if (!dsTipoPagamentoTEF3) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento TEF 3!',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'custom-swal' }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelas3) || 0;

        if (qtd === 0) {
          nItemAtualLocal++;
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

          const dadosPagamento = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoTEF3.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoTEF3.substring(4),
            VALORRECEBIDO: parseFloat(vrCartao3),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrCartao3),
            DTPROCESSAMENTO: dataParcela3,
            DTVENCIMENTO: dataParcela3,
            NPARCELAS: 0,
            NOTEF: 'TEF',
            NUAUTORIZADOR: dsTipoPagamentoTEF3.substring(4),
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacao3,
            NSUTEF: nuOperacao3,
            NSUAUTORIZADORA: nuOperacao3,
            NUAUTORIZACAO: nuAutorizacao3,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
          }];

          await post('/alterar-venda-pagamento', dadosPagamento);
        } else {
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrCartao3 / qtd).toFixed(2));

          for (let i = 1; i <= qtd; i++) {
            nItemAtualLocal++;
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            let dataVencimento = dataParcela3;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrCartao3) {
                valorCredito = parseFloat((valorParcela - vrCartao3).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrCartao3) {
                valorCredito = parseFloat((vrCartao3 - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosPagamento = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA: idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoTEF3.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoTEF3.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcela3,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: qtd,
              NOTEF: 'TEF',
              NUAUTORIZADOR: dsTipoPagamentoTEF3.substring(4),
              NOCARTAO: 'NÃO INFORMADO',
              NUOPERACAO: nuOperacao3,
              NSUTEF: nuOperacao3,
              NSUAUTORIZADORA: nuOperacao3,
              NUAUTORIZACAO: nuAutorizacao3,
              STCANCELADO: 'False',
              IDFUNCIONARIO: usuarioLogado.id,
            }];

            await post('/alterar-venda-pagamento', dadosPagamento);
          }
        }
      }

      // =====================================================
      // 6️⃣ PROCESSA POS 1
      // =====================================================
      if (toFloat(vrPos) > 0) {
        if (!dsTipoPagamentoPOS) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento POS 1!',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'custom-swal' }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelasPOS) || 0;

        if (qtd === 0) {
          nItemAtualLocal++;
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

          const dadosPagamento = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoPOS.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoPOS.substring(4),
            VALORRECEBIDO: parseFloat(vrPos),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrPos),
            DTPROCESSAMENTO: dataParcelaPOS,
            DTVENCIMENTO: dataParcelaPOS,
            NPARCELAS: 0,
            NOTEF: 'POS',
            NUAUTORIZADOR: dsTipoPagamentoPOS.substring(4),
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacaoPOS,
            NSUTEF: nuOperacaoPOS,
            NSUAUTORIZADORA: nuOperacaoPOS,
            NUAUTORIZACAO: nuAutorizacaoPOS,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
          }];

          await post('/alterar-venda-pagamento', dadosPagamento);
        } else {
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrPos / qtd).toFixed(2));

          for (let i = 1; i <= qtd; i++) {
            nItemAtualLocal++;
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            let dataVencimento = dataParcelaPOS;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrPos) {
                valorCredito = parseFloat((valorParcela - vrPos).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrPos) {
                valorCredito = parseFloat((vrPos - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosPagamento = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA: idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoPOS.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoPOS.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcelaPOS,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: qtd,
              NOTEF: 'POS',
              NUAUTORIZADOR: dsTipoPagamentoPOS.substring(4),
              NOCARTAO: 'NÃO INFORMADO',
              NUOPERACAO: nuOperacaoPOS,
              NSUTEF: nuOperacaoPOS,
              NSUAUTORIZADORA: nuOperacaoPOS,
              NUAUTORIZACAO: nuAutorizacaoPOS,
              STCANCELADO: 'False',
              IDFUNCIONARIO: usuarioLogado.id,
            }];

            await post('/alterar-venda-pagamento', dadosPagamento);
          }
        }
      }

      // =====================================================
      // 7️⃣ PROCESSA POS 2
      // =====================================================
      if (toFloat(vrPos2) > 0 && incluirPos2) {
        if (!dsTipoPagamentoPOS2) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento POS 2!',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'custom-swal' }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelasPOS2) || 0;

        if (qtd === 0) {
          nItemAtualLocal++;
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

          const dadosPagamento = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoPOS2.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoPOS2.substring(4),
            VALORRECEBIDO: parseFloat(vrPos2),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrPos2),
            DTPROCESSAMENTO: dataParcelaPOS2,
            DTVENCIMENTO: dataParcelaPOS2,
            NPARCELAS: 0,
            NOTEF: 'POS',
            NUAUTORIZADOR: dsTipoPagamentoPOS2.substring(4),
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacaoPOS2,
            NSUTEF: nuOperacaoPOS2,
            NSUAUTORIZADORA: nuOperacaoPOS2,
            NUAUTORIZACAO: nuAutorizacaoPOS2,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
          }];

          await post('/alterar-venda-pagamento', dadosPagamento);
        } else {
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrPos2 / qtd).toFixed(2));

          for (let i = 1; i <= qtd; i++) {
            nItemAtualLocal++;
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            let dataVencimento = dataParcelaPOS2;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrPos2) {
                valorCredito = parseFloat((valorParcela - vrPos2).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrPos2) {
                valorCredito = parseFloat((vrPos2 - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosPagamento = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA: idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoPOS2.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoPOS2.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcelaPOS2,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: qtd,
              NOTEF: 'POS',
              NUAUTORIZADOR: dsTipoPagamentoPOS2.substring(4),
              NOCARTAO: 'NÃO INFORMADO',
              NUOPERACAO: nuOperacaoPOS2,
              NSUTEF: nuOperacaoPOS2,
              NSUAUTORIZADORA: nuOperacaoPOS2,
              NUAUTORIZACAO: nuAutorizacaoPOS2,
              STCANCELADO: 'False',
              IDFUNCIONARIO: usuarioLogado.id,
            }];

            await post('/alterar-venda-pagamento', dadosPagamento);
          }
        }
      }

      // =====================================================
      // 8️⃣ PROCESSA VOUCHER
      // =====================================================
      if (toFloat(vrVoucher) > 0) {
        nItemAtualLocal++;
        const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

        const dadosPagamento = [{
          IDVENDAPAGAMENTO: idVendaPagamento,
          IDVENDA: idVenda,
          NITEM: nItemAtualLocal,
          TPAG: '024',
          DSTIPOPAGAMENTO: 'VOUCHER',
          VALORRECEBIDO: parseFloat(vrVoucher),
          VALORDEDUZIDO: 0,
          VALORLIQUIDO: parseFloat(vrVoucher),
          DTPROCESSAMENTO: dataParcela1,
          DTVENCIMENTO: dataParcela1,
          NPARCELAS: 0,
          NOTEF: 'VOUCHER',
          NUAUTORIZADOR: 'VOUCHER',
          NOCARTAO: 'NÃO INFORMADO',
          NUOPERACAO: '',
          NSUTEF: '',
          NSUAUTORIZADORA: '',
          NUAUTORIZACAO: nuVoucher || '',
          STCANCELADO: 'False',
          IDFUNCIONARIO: usuarioLogado.id,
        }];

        await post('/alterar-venda-pagamento', dadosPagamento);
      }

      // =====================================================
      // ATUALIZA itemAtual APÓS TODOS OS PAGAMENTOS
      // =====================================================
      setItemAtual(nItemAtualLocal);

      // =====================================================
      // ATUALIZA RESUMO DA VENDA COM TOTAIS
      // =====================================================
      const VRTotalCartao = toFloat(vrCartao) + toFloat(vrCartao2) + toFloat(vrCartao3);
      const VRTotalPOS = toFloat(vrPos) + toFloat(vrPos2) + toFloat(valorPix);

      const dadosUpVenda = [{
        IDVENDA: idVenda,
        VRRECDINHEIRO: toFloat(valorDinheiro),
        VRRECCONVENIO: 0,
        VRRECCHEQUE: 0,
        VRRECCARTAO: VRTotalCartao,
        VRRECPOS: VRTotalPOS,
        VRRECVOUCHER: toFloat(vrVoucher)
      }];

      await put('/atualiza-recebimento-venda', dadosUpVenda);

      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Pagamento registrado com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'custom-swal' }
      });

      return true;

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Erro ao processar pagamento',
        text: error.message,
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'custom-swal' }
      });
      return false;
    }
  };

  // =====================================================
  // FUNÇÃO DE CANCELAMENTO DE VENDA
  // =====================================================
  const cancelarVendaPagamento = async () => {
    if (toFloat(valorDistribuir) > 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'A soma dos valores é menor que o valor da Venda.',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'custom-swal' }
      });
      return false;
    } else {
      const dados = {
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        STCANCELADO: 'True',
        DTULTIMAALTERACAO: getDataAtual(),
        IDFUNCIONARIOCANCELA: usuarioLogado.id,
        TXTMOTIVOCANCELA: motivoAlteracao
      };
      
      await put('/alterar-venda-pagamento', dados);
      
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Venda cancelada com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'custom-swal' }
      });
      
      return true;
    }
  };

  // =====================================================
  // RETORNA TODOS OS ESTADOS E FUNÇÕES
  // =====================================================
  return {
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
    dataParcela1,
    setDataParcela1,
    dataParcela2,
    setDataParcela2,
    dataParcela3,
    setDataParcela3,
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
    pagamentos,
    setPagamentos,
    incluirCartao2,
    setIncluirCartao2,
    incluirCartao3,
    setIncluirCartao3,
    incluirPos2,
    setIncluirPos2,
    itemAtual,
    setItemAtual,
    enviarPagamento,
    cancelarVendaPagamento
  };
};
