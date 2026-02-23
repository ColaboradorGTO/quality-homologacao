import React from 'react';

export const InputListaMenus = ({
    menusPermitidos, 
    moduloSelecionadoObj,
    menuFilhoSelecionado,
    setMenuFilhoSelecionado 
}) => {
    const data = menusPermitidos || [];

    if (data.length === 0) {
        return null;
    }

    const handleCheckboxChange = (id) => {
        setMenuFilhoSelecionado(prev => {
            // Se menuFilhoSelecionado é um array
            if (Array.isArray(prev)) {
                if (prev.includes(id)) {
                    // Remove o ID se já estiver selecionado
                    return prev.filter(item => item !== id);
                } else {
                    // Adiciona o ID se não estiver selecionado
                    return [...prev, id];
                }
            } 
            // Se menuFilhoSelecionado é um único valor
            else {
                // Alterna entre o ID e null/undefined
                return prev === id ? null : id;
            }
        });
    };

    const divisor = data.length <= 5 ? 1 : data.length <= 10 ? 2 : 2;
    const itemsPerColumn = Math.ceil(data.length / divisor);

    const columns = [];
    for (let i = 0; i < divisor; i++) {
        columns.push(data.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
    }


    return (
        <div className="pendencias-container">
            {/* <div>
                <span style={{color: '#000', fontSize: '22px', fontWeight: 600}}>{`Menu:`}</span>
                <span style={{color: '#fff', fontSize: '22px'}} className=" h6 fw-600">{` ${moduloSelecionadoObj?.NOME || ''}`}</span>
            </div> */}
   
            <div className="row mb-2 ml-3" style={{marginTop: '2rem'}}>
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="d-flex flex-column flex-fill">
                        {column.map(({ ID, DSNOME }) => (
                            <div key={ID} className="form-group form-check">
                                <input
                                    className="form-check-input"
                                    title={DSNOME}
                                    type="checkbox"
                                    id={ID}
                                    value={ID}
                                    checked={
                                        Array.isArray(menuFilhoSelecionado) 
                                            ? menuFilhoSelecionado.includes(ID)
                                            : menuFilhoSelecionado === ID
                                    }
                                    onChange={() => handleCheckboxChange(ID)}
                                />
                                <label
                                    style={{color: '#fff'}}
                                    className="form-check-label d-inline-block fw-700 "
                                    title={DSNOME}
                                    htmlFor={ID}
                                >
                                    {DSNOME}
                                </label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};