import React, { Fragment, useState } from 'react';

export const ButtonTypeModal = ({ 
  textButton,
  onClickButtonType,
  id,
  className,
  cor,
  tipo,
  Icon,
  iconColor,
  iconSize,
  style,
  buttonDisabled,
  // Novas props para controle de loading
  loading = false,           // Controle externo de loading
  loadingText,              // Texto durante loading (opcional)
  autoLoading = true,       // Auto-detecta Promises (default: true)
  disabled = false          // Controle externo de disabled
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  // Determina o estado final de loading e disabled
  const isLoading = loading || internalLoading;
  const isDisabled = disabled || buttonDisabled || isLoading;

  // Handler que controla o loading automaticamente
  const handleClick = async () => {
    if (isDisabled || !onClickButtonType) return;

    if (autoLoading) {
      try {
        setInternalLoading(true);
        const result = onClickButtonType();
        
        // Se retornar uma Promise, aguarda ela terminar
        if (result && typeof result.then === 'function') {
          await result;
        }
      } catch (error) {
        console.error('Erro no click do botão:', error);
        // Você pode adicionar tratamento de erro aqui
      } finally {
        setInternalLoading(false);
      }
    } else {
      // Se auto-loading está desabilitado, executa normalmente
      onClickButtonType();
    }
  };

  // Determina o texto do botão
  const displayText = isLoading && loadingText ? loadingText : textButton;
  let btnClasses = "btn waves-effect waves-themed";

  if(cor === "primary") {
    btnClasses += " btn-primary";
  } else if(cor === "secondary") {
    btnClasses += " btn-secondary";
  } else if (cor === "success") {
    btnClasses += " btn-success";
  } else if (cor === "danger") {
    btnClasses += " btn-danger";
  } else if (cor === "warning") {
    btnClasses += " btn-warning";
  } else if (cor === "info") {
    btnClasses += " btn-info";
  }

  const typeButton = tipo === "button" ? "button" : "submit";


  return (
    <Fragment>
      <div className="">
        <button
          name={textButton}
          id={id}
          className={`${btnClasses} ${className} ${isLoading ? 'loading' : ''}`}
          type={typeButton}
          onClick={handleClick}
          style={style}
          disabled={isDisabled}
        >
          {/* Ícone de loading durante carregamento */}
          {isLoading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : (
            Icon && <Icon size={iconSize} color={iconColor} />
          )}
         
          {displayText}
          
        </button>
      </div>
    </Fragment>
  );
};

