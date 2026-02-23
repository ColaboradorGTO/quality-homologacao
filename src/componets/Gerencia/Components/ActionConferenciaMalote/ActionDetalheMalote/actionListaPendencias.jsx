import React from 'react';

export const ListaPendencias = ({dadosPendenciasMalotes }) => {
  const  data = dadosPendenciasMalotes || [];

  if (data.length === 0) {
    return null;
  }

  // Calculate column distribution
  const divisor = data.length <= 5 ? 1 : data.length <= 10 ? 2 : 3;
  const itemsPerColumn = Math.ceil(data.length / divisor);

  // Split data into columns
  const columns = [];
  for (let i = 0; i < divisor; i++) {
    columns.push(data.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
  }

  return (
    <div className="pendencias-container">
      <label className="text-dark h6 fw-900" htmlFor="pendenciasMalote">
        Pendências:
      </label>
      <div className="row mb-2 ml-3">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="d-flex flex-column flex-fill">
            {column.map(({ IDPENDENCIA, TXTPENDENCIA }) => (
              <div key={IDPENDENCIA} className="form-group form-check">
                <input
                  className="form-check-input"
                  title={TXTPENDENCIA}
                  type="checkbox"
                  id={IDPENDENCIA}
                  value={TXTPENDENCIA}
                  disabled
                />
                <label
                  className="form-check-label d-inline-block fw-700 text-dark"
                  title={TXTPENDENCIA}
                  htmlFor={IDPENDENCIA}
                >
                  {TXTPENDENCIA}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};