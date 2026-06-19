import { Fragment, useState } from "react";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionListaEtiquetaRemarcacao } from "./actionListaEtiquetaRemarcacao";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { GoDownload } from "react-icons/go";
import Swal from "sweetalert2";
import { ActionImprimirEtiquetaModal } from "./actionImprimirEtiquetaModal";
import { ActionImprimirAcumuladorEtiquetaModal } from "./actionImprimirAcumuladorEtiquetaModal";
import { formatToDecimal, maskValorEmDecimal } from "../../../../utils/mascaraValor";

export const ActionPesquisaEtiquetaRemarcacao = ({ }) => {
  const [modalDetalhar, setModalDetalhar] = useState(false);
  const [modalAcumulador, setModalAcumulador] = useState(false);
  const [preco, setPreco] = useState(0);
  const [quantidadeEtiquetas, setQuantidadeEtiquetas] = useState(0);
  const [idEtiqueta, setIdEtiqueta] = useState(0);
  const [dadosEtiquetas, setDadosEtiquetas] = useState([]);
  const [dadosAcumuladorEtiquetas, setDadosAcumuladorEtiquetas] = useState([]);
  const [dadosAcumuladorImpressao, setDadosAcumuladorImpressao] = useState([]);
  const [copias, setCopias] = useState(1);
  const [copiasImprimir, setCopiasImprimir] = useState(1);

  const multiplicarObjetos = (dados, copias) => {
    const objetosMultiplicados = [];
    for (let i = 0; i < copias; i++) {
      objetosMultiplicados.push(...dados);
    }
    return objetosMultiplicados;
  };

  const handleImprimir = async () => {
    if (dadosAcumuladorEtiquetas.length > 0) {
      const copiasNum = Number(copias) || 1;
      const objetosMultiplicados = multiplicarObjetos(dadosAcumuladorEtiquetas, copiasNum);

      setDadosAcumuladorImpressao(objetosMultiplicados);
      setDadosEtiquetas([]);
      setModalAcumulador(true);
    } else if (preco > 0 || dadosEtiquetas.length > 0) {

      setDadosEtiquetas(dadosEtiquetas)

      const { value: formValues, isDismissed } = await Swal.fire({
        icon: 'question',
        text: 'Digite a quantidade de Etiquetas.',
        input: 'text',
        inputValue: quantidadeEtiquetas,
        inputPlaceholder: 'Digite a quantidade de etiquetas',
        width: '25rem',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar!',
        confirmButtonColor: '#2196f3',
        cancelButtonText: 'Não, Voltar!',
        cancelButtonColor: '#dd3333',
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Digite uma quantidade válida!';
          }
        },
      });

      if (isDismissed) {
   
        setQuantidadeEtiquetas(0);
      } else if (formValues) {
        const qtdEtiqueta = parseInt(formValues, 10);
        setQuantidadeEtiquetas(qtdEtiqueta);

        const novasEtiquetas = Array.from({ length: qtdEtiqueta }, (_, index) => ({
          idEtiqueta: idEtiqueta + index + 1,
          quantidade: 1,
          valor: preco,
        }));

        setDadosEtiquetas((prevEtiquetas) => [...prevEtiquetas, ...novasEtiquetas]);
        setIdEtiqueta((prevId) => prevId + 1);
        setModalDetalhar(true);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Valor Inválido',
        text: 'O valor deve ser maior que 0 para imprimir etiquetas!',
      });
    }
  };

  const handleAcumuladorEtiquetas = async () => {
    if (parseFloat(preco) > 0) {
      const { value: formValues, isDismissed } = await Swal.fire({
        title: 'Digite a quantidade de Etiquetas.',
        input: 'text',
        inputValue: quantidadeEtiquetas,
        inputPlaceholder: 'Digite a quantidade de etiquetas',
        width: '25rem',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar!',
        confirmButtonColor: '#2196f3',
        cancelButtonText: 'Não, Voltar!',
        cancelButtonColor: '#dd3333',
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Digite uma quantidade válida!';
          }
        },
      });

      if (formValues) {
        const qtd = parseInt(formValues, 10);

        const etiquetaExistente = dadosAcumuladorEtiquetas.find(
          (etiqueta) => etiqueta.valor === preco
        );

        if (etiquetaExistente) {
          const novasEtiquetas = dadosAcumuladorEtiquetas.map((etiqueta) =>
            etiqueta.valor === preco
              ? { ...etiqueta, quantidade: etiqueta.quantidade + qtd }
              : etiqueta
          );
          setDadosAcumuladorEtiquetas(novasEtiquetas);

        } else {
          const novasEtiquetas = Array.from({ length: 1 }, (_, index) => ({
            idEtiqueta: idEtiqueta + index + 1,
            quantidade: qtd,
            valor: preco,
          }));
          setDadosAcumuladorEtiquetas((prevEtiquetas) => [...prevEtiquetas, ...novasEtiquetas]);
          setIdEtiqueta((prevId) => prevId + 1);
        }
        setQuantidadeEtiquetas(qtd);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Valor Inválido',
        text: 'O valor deve ser maior que 0 para imprimir etiquetas!',
      });
    }
  };

  const handleCancelar = () => {
    setDadosAcumuladorEtiquetas([]);
    setDadosEtiquetas([]);
    setQuantidadeEtiquetas(0);
    setCopias(1);
    Swal.fire({
      icon: 'warning',
      title: 'Dados Removidos',
      text: 'Todos os dados foram removidos com sucesso!',
    });
  };

  const handleExcluirEtiqueta = (id) => {
    setDadosAcumuladorEtiquetas((prevEtiquetas) => prevEtiquetas.filter(etiqueta => etiqueta.idEtiqueta !== id));
    Swal.fire({
      icon: 'success',
      title: 'Etiqueta Removida',
      text: 'A etiqueta foi removida com sucesso!',
    });
  };

  const handleUpdateQuantidadeEtiqueta = (idEtiqueta, novaQuantidade) => {
    const updatedEtiquetas = dadosEtiquetas.map((etiqueta) =>
      etiqueta.idEtiqueta === idEtiqueta ? { ...etiqueta, quantidade: novaQuantidade } : etiqueta
    );
    setDadosEtiquetas(updatedEtiquetas);
  };

  const fecharModalAcumulador = () => {
    setModalAcumulador(false);
    setDadosAcumuladorImpressao([]);
  };

  const fecharModalImprimir = () => {
    setModalDetalhar(false);
    setDadosEtiquetas([]);
  };

  const handlePrecoChange = (e) => {
    const formattedValue = formatToDecimal(e.target.value, 2);
    setPreco(formattedValue);
  };

  return (
    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={[""]}
        title="Etiquetas de Remarcação"
        subTitle="Nome da Loja"

        InputFieldComponent={InputField}
        labelInputField={"Valor(R$)"}
        valueInputField={maskValorEmDecimal(preco)}
        onChangeInputField={handlePrecoChange}
        placeHolderInputFieldComponent={"Digite o valor da etiqueta"}

        InputFieldQuantidadeComponent={dadosAcumuladorEtiquetas.length > 0 ? InputField : null}
        labelInputFieldQuantidade={"QTD CÓPIAS"}
        valueInputQuantidade={copias}
        onChangeInputQuantidade={(e) => setCopias(e.target.value)}
        placeHolderInputFieldQuantidade={"Digite a quantidade"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Imprimir"}
        onButtonClickCadastro={handleImprimir}
        corCadastro={"primary"}
        IconCadastro={MdOutlineLocalPrintshop}
        //styleCadastro={{display: preco > 0 ? 'block' : 'none'}}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Limpar Todos"}
        onButtonClickVendasEstrutura={handleCancelar}
        corVendasEstrutura={"danger"}
        iconVendasEstrutura={BsTrash3}
        styleVendasEstrutura={{ display: dadosAcumuladorEtiquetas.length > 0 || parseFloat(preco) > 0 ? 'block' : 'none' }}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Guardar"}
        onButtonClickCancelar={handleAcumuladorEtiquetas}
        corCancelar={"success"}
        IconCancelar={GoDownload}
        styleCancelar={{ display: parseFloat(preco) > 0 ? 'block' : 'none' }}
      />

      <ActionListaEtiquetaRemarcacao
        dadosAcumuladorEtiquetas={dadosAcumuladorEtiquetas}
        setDadosAcumuladorEtiquetas={setDadosAcumuladorEtiquetas}
        handleExcluirEtiqueta={handleExcluirEtiqueta}
        handleUpdateQuantidadeEtiqueta={handleUpdateQuantidadeEtiqueta}
      />

      <ActionImprimirEtiquetaModal
        show={modalDetalhar}
        handleClose={fecharModalImprimir}
        dadosEtiquetas={dadosEtiquetas}
        quantidadeEtiquetas={quantidadeEtiquetas}
        copias={copiasImprimir}
      />

      <ActionImprimirAcumuladorEtiquetaModal
        show={modalAcumulador}
        handleClose={fecharModalAcumulador}
        dadosAcumuladorEtiquetas={dadosAcumuladorImpressao}
        quantidadeEtiquetas={quantidadeEtiquetas}
        copias={copias}
      />
    </Fragment>
  );
};