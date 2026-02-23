import { Fragment } from "react"
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { get } from "../../../../../api/funcRequest";
import { useEncerrarOT } from "../../../hooks/useEncerrarOT";


export const FormularioMotivoEncerrarOT = (dadosEncerrarOT) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    statusDivergencia,
    setStatusDivergencia,
    observacao,
    setObservacao,
    onSubmitEncerrar,
  } = useEncerrarOT(dadosEncerrarOT);

 
  const { data: dadosStatus = [], error: errorStatus, isLoading: isLoadingStatus } = useQuery(
    'status-divergencia',
    async () => {
      const response = await get(`/status-divergencia`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  return (
    <Fragment>
      <form onSubmit={''}>
        <div className="row" data-select2-id="736">
          <div className="col-sm-6 col-xl-4">
            <label className="form-label" htmlFor={""}>Loja Origem</label>
            <Select
              closeMenuOnSelect={false}
              options={dadosStatus?.map((item) => ({
                value: item.IDSTATUSDIVERGENCIA,
                label: item.DESCRICAODIVERGENCIA
              }
              ))}
              value={dadosStatus?.find(option => option.value === statusDivergencia)}
              onChange={(e) => setStatusDivergencia(e.value)}
            />
          </div>

          <div className="col-sm-6 col-xl-8">
            <label className="form-label" htmlFor="textarea">Observação</label>
            <textarea
              className="form-control"
              id="textarea"
              rows="3"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Digite aqui a Observação"
            >
            </textarea>
          </div>
        </div>

        <div className="row mt-4">
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-success mt-4"
            onClick={handleSubmit(onSubmitEncerrar)}
          >
            Encerrar OT
          </button>
        </div>
      </form>
    </Fragment>
  )
}