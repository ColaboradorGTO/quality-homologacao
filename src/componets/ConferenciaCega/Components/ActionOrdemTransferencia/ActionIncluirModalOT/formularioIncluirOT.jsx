import { Fragment, useEffect } from "react"
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import { useSalvarOT } from "../../../hooks/useSalvarOT";
import { useForm } from "react-hook-form";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FaRegSave } from "react-icons/fa";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import Select from 'react-select';
import { ActionListaProdutos } from "./actionListaProdutos";

export const FormularioIncuirOT = () => {
    const { register, handleSubmit, errors } = useForm();
    const {
      empresaOrigem,
      setEmpresaOrigem,
      empresaDestino,
      setEmpresaDestino,
      produto,
      setProduto,
      onSubmit,
    } = useSalvarOT();

    const { data: dadosEmpresa = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
        'empresas',
        async () => {
          const response = await get(`/empresas`);
          return response.data;
        },
        { staleTime: 5 * 60 * 1000 }
      );

    const { data: dadosProdutos = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
        ['funcionarios-loja', produto],
        async () => {
          const response = await get(`/listaProdutos?idEmpresa=${empresaOrigem}&dsProduto=${produto} `);
          return response.data;
        },
        { enabled: produto.length === 8, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
      );
    
      useEffect(() => {
        if (dadosProdutos && dadosProdutos.length > 0) {
          Swal.fire({
            title: 'Produto já cadastrado!',
            icon: 'warning',
            confirmButtonText: 'Ok',
            customClass: {
              container: 'custom-swal',
            }
          });
        }
      }, [dadosProdutos]);
      
    return (
        <Fragment>
            <form onSubmit={''}>
              <div className="row" data-select2-id="736">
                <div className="col-sm-6 col-xl-6">
                  <label className="form-label" htmlFor={""}>Loja Origem</label>
                  <Select
                    closeMenuOnSelect={false}
                    options={dadosEmpresa?.map((item) => ({
                      value: item.IDEMPRESA,
                      label: item.NOFANTASIA
                    }
                    ))}
                    value={dadosEmpresa?.find(option => option.value === empresaOrigem)}
                    onChange={(e) => setEmpresaOrigem(e.value)}
                  />
                </div>
                <div className="col-sm-6 col-xl-6" data-select2-id="735">
                  <label className="form-label" htmlFor={""}>Loja Destino</label>
                  <Select
                    closeMenuOnSelect={false}
                    options={dadosEmpresa?.map((item) => ({
                      value: item.IDEMPRESA,
                      label: item.NOFANTASIA
                    }
                    ))}
                    value={dadosEmpresa?.find(option => option.value === empresaDestino)}
                    onChange={(e) => setEmpresaDestino(e.value)}
                  />
                </div>
              </div>


              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Produto"}
                    type="text"
                    value={produto}
                    onChangeModal={(e) => setProduto(e.target.value)}
                    placeholder={"Digite o Produto"}
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
                    onClickButtonType={handleSubmit(onSubmit)}

                  />
                </div>
                <div className="col-sm-8 col-xl-8 mt-4">
                  <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                </div>
              </div>
            </form>

            <ActionListaProdutos dadosProdutos={dadosProdutos} />
        </Fragment>
    )
}