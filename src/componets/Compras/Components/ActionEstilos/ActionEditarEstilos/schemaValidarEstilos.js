import * as yup from 'yup';

export const schema = yup.object({

  descricaoTecido: yup
    .string()
    .required('Descrição Obrigatória')
    .test(
      'descricao-valida',
      'Descrição deve conter apenas letras e espaços, favor preencher e tentar novamente!',
      (value) => {
        if (!value) return false;
        return /^[A-Za-zÀ-ÿ\s]+$/.test(value);
      }
    ),

});
