import { useEffect } from "react"
import Swal from "sweetalert2";

export const useCadastroNFEPedido = (dadosDetalheProdutoPedido) => {

    useEffect(() => {
        console.log('useCadastroNFEPedido', dadosDetalheProdutoPedido)
    }, [dadosDetalheProdutoPedido])

    const { value: file } =  Swal.fire({
        title: "INSERIR XML DA NOTA FISCAL",
        text: "Arquivo XML",
        input: "file",
        inputAttributes: {
          "accept": "image/*",
          "aria-label": "Upload your profile picture"
        }
      });
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          Swal.fire({
            title: "Your uploaded picture",
            imageUrl: e.target.result,
            imageAlt: "The uploaded picture"
          });
        };
        reader.readAsDataURL(file);
      }
}   