import { Fragment, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { get, post, put } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2";
import axios from "axios";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../utils/dataAtual";
import { useForm } from "react-hook-form";

export const ActionUpdateDescontoFuncionarioModal = ({ show, handleClose, dadosDescontoFuncionarios, handleClick }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [empresa, setEmpresa] = useState('');
  const [cpf, setCpf] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [motivoDesconto, setMotivoDesconto] = useState('');
  const [percentualDesconto, setPercentualDesconto] = useState('');
  const [dataInicioDesconto, setDataInicioDesconto] = useState('');
  const [dataFimDesconto, setDataFimDesconto] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [ipUsuario, setIpUsuario] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataInicioDesconto(dataAtual);
    setDataFimDesconto(dataAtual);
  })
  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
  }, [usuarioLogado]);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if(response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
     
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 
    }
  );
  
  useEffect(() => {
    if (dadosDescontoFuncionarios) {
      setEmpresa(dadosDescontoFuncionarios[0]?.NOFANTASIA);
      setCpf(dadosDescontoFuncionarios[0]?.NUCPF);
      setFuncionario(dadosDescontoFuncionarios[0]?.NOFUNCIONARIO);
      setPercentualDesconto(dadosDescontoFuncionarios[0]?.PERCDESCUSUAUTORIZADO || "0" );
      
    }
    
  }, [dadosDescontoFuncionarios]);
  const onSubmit = async (data) => {
    const putData = {
      DTINICIODESC: String(dataInicioDesconto),
      DTFIMDESC: String(dataFimDesconto),
      PERCDESCUSUAUTORIZADO:percentualDesconto ? Number(percentualDesconto) : 0,
      TXTMOTIVODESCONTO:String(motivoDesconto),
      IDFUNCALTERACAO: Number(usuarioLogado?.id),
      ID: Number(dadosDescontoFuncionarios[0]?.ID),

    }

    try {
      const response = await put('/funcionarios-desconto/:id', putData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      const textoFuncao = 'RH/ATUALIZAR DESCONTO FUNCIONARIO AUTORIZADO';
  
      
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
  
      handleClick()
      handleClose()
      const responsePost = await post('/log-web', createData)
  
      
      return responsePost.data;
    } catch (error) {
      Swal.fire({
        title: 'Erro ao Atualizar',
        text: 'Erro ao Tentar Atualizar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      console.error('Erro ao parsear o usuário do localStorage:', error);
    }
  }

  const handleChangeValor = (e) => {
    let valor = e.target.value.replace(",", ".");
    
    // Se o valor não tiver casas decimais, adicione ".00"
    if (!valor.includes(".")) {
      valor = `${valor}.00`;
    } else {
      // Se o valor tiver casas decimais, garanta que tenha duas casas decimais
      const [inteiro, decimal] = valor.split(".");
      valor = `${inteiro}.${decimal.padEnd(2, "0")}`;
    }
  
    // Atualize o estado ou faça o que for necessário com o valor formatado
   // console.log(valor);
  };
  

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >


        <HeaderModal
          title={"Dados do Funcionário"}
          subTitle={"Cadastrar ou Atualizar Informações do Funcionário"}
          handleClose={handleClose}
        />


        <Modal.Body>

          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-12">

                <InputFieldModal
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  label="Empresa"
                  value={empresa}
                  onChangeModal={(e) => setEmpresa(e.target.value)}

                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-4 col-xl-4">


                <InputFieldModal
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  label="CPF"
                  value={cpf}
                  onChangeModa={(e) => setCpf(e.target.value)}

                />
              </div>
              <div className="col-sm-8 col-xl-8">
                <InputFieldModal
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  label="Funcionário"
                  value={funcionario}
                  onChangeModal={(e) => setFuncionario(e.target.value)}

                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-12 col-xl-12">
                <InputFieldModal
                  type="text"
                  className="form-control input"
                  label="Motivo do Desconto"
                  value={motivoDesconto}
                  onChangeModal={(e) => setMotivoDesconto(e.target.value)}

                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 col-md-4 col-xl-4">

                <InputFieldModal
                  type="text"
                  className="form-control input"
                  label="% Desconto Autorizado"
                  value={percentualDesconto}
                  onChangeModal={(e) => {
                    const valor = e.target.value.replace(".", "").replace(",", ".");
                    setPercentualDesconto(valor);
                  }}

                  // onChangeModal={handleChangeValor}

                  
                />
              </div>
              <div className="col-sm-3 col-md-4 col-xl-4">

                <InputFieldModal
                  type="date"
                  className="form-control input"
                  label="Início Desconto"
                  value={dataInicioDesconto}
                  onChangeModal={(e) => setDataInicioDesconto(e.target.value)}

                />
              </div>
              <div className="col-sm-3 col-md-4 col-xl-4">

                <InputFieldModal
                  type="date"
                  className="form-control input"
                  label="Fim Desconto"
                  value={dataFimDesconto}
                  onChangeModal={(e) => setDataFimDesconto(e.target.value)}

                />
              </div>
            </div>
          </div>

          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"

            ButtonTypeCadastrar={ButtonTypeModal}
            textButtonCadastrar={"Atualizar"}
            onClickButtonCadastrar={handleSubmit(onSubmit)}
            corCadastrar="success"

          />
        </Modal.Body>




      </Modal>
    </Fragment>
    
  )
}