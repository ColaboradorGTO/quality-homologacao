import { Fragment, useEffect, useState } from "react";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { useNavigate } from "react-router-dom";
import { ActionListaEtiquetaRemarcacao } from "./actionListaEtiquetaRemarcacao";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { GoDownload } from "react-icons/go";
import Swal from "sweetalert2";
import { ActionDetalharEtiquetaModal } from "./actionDetalharEtiquetaModal";

export const ActionPesquisaEtiquetaRemarcacao = () => {
  const [modalDetalhar, setModalDetalhar] = useState(false);
  const [preco, setPreco] = useState(0);
  const [quantidadeEtiquetas, setQuantidadeEtiquetas] = useState(0);
  const [acumuladorEtiquetas, setAcumuladorEtiquetas] = useState([]);
  const [idEtiqueta, setIdEtiqueta] = useState(0);
  const [btnVisivel, setBtnVisivel] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleImprimir = async () => {
    if (preco > 0) {
      const { value: formValues } = await Swal.fire({
        title: 'Digite a quantidade de Etiquetas.',
        input: 'number',
        inputValue: quantidadeEtiquetas,
        inputPlaceholder: 'Digite a quantidade de etiquetas',
        width: '25rem',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#4AD4C5',
        cancelButtonText: 'Voltar',
        cancelButtonColor: '#FD61AA',
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Digite uma quantidade válida!';
          }
        },
      });

      if (formValues) {
        const qtdEtiqueta = parseInt(formValues, 10);
        const etiquetas = [...acumuladorEtiquetas];
        const novaEtiqueta = {
          idEtiqueta: idEtiqueta + 1,
          quantidade: qtdEtiqueta,
          valor: preco,
        };
        etiquetas.push(novaEtiqueta);
        setAcumuladorEtiquetas(etiquetas);
        setQuantidadeEtiquetas(qtdEtiqueta);
        setIdEtiqueta(idEtiqueta + 1);
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
    if (quantidadeEtiquetas > 0) {
      const etiquetas = [...acumuladorEtiquetas];
      const novaEtiqueta = {
        idEtiqueta: idEtiqueta + 1,
        quantidade: quantidadeEtiquetas,
        valor: preco,
      };
      etiquetas.push(novaEtiqueta);
      setAcumuladorEtiquetas(etiquetas);
      setIdEtiqueta(idEtiqueta + 1);
      Swal.fire({
        icon: 'success',
        title: 'Etiquetas Adicionadas',
        text: `${quantidadeEtiquetas} etiquetas foram adicionadas!`,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Quantidade Inválida',
        text: 'Digite uma quantidade válida antes de adicionar etiquetas!',
      });
    }
  };

  const handleCancelar = () => {
    setAcumuladorEtiquetas([]);
    setQuantidadeEtiquetas(0);
    Swal.fire({
      icon: 'warning',
      title: 'Dados Removidos',
      text: 'Todos os dados foram removidos com sucesso!',
    });
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
        valueInputField={preco}
        onChangeInputField={(e) => setPreco(e.target.value)}
        placeHolderInputFieldComponent={"Digite o valor da etiqueta"}
      />

      <div className="row mb-4">
        <ButtonType
          Icon={MdOutlineLocalPrintshop}
          iconSize="16px"
          textButton="Imprimir"
          cor="primary"
          tipo="button"
          onClickButtonType={handleImprimir}
        />
        <ButtonType
          Icon={GoDownload}
          iconSize="16px"
          textButton="Guardar"
          cor="success"
          tipo="button"
          onClickButtonType={handleAcumuladorEtiquetas}
        />
        <ButtonType
          Icon={BsTrash3}
          iconSize="16px"
          textButton="Cancelar"
          cor="danger"
          tipo="button"
          onClickButtonType={handleCancelar}
        />
      </div>

      <ActionListaEtiquetaRemarcacao
        acumuladorEtiquetas={acumuladorEtiquetas}
        quantidadeEtiquetas={quantidadeEtiquetas}
      />

      <ActionDetalharEtiquetaModal 
        show={modalDetalhar}
        handleClose={() => setModalDetalhar(false)}
        acumuladorEtiquetas={acumuladorEtiquetas}
        quantidadeEtiquetas={quantidadeEtiquetas}
      />
    </Fragment>
  );
};