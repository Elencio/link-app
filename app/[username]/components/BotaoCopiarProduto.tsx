'use client';

interface Props {
  nome: string;
  preco: string;
  descricao: string;
}

export default function BotaoCopiarProduto({ nome, preco, descricao }: Props) {
  const copiarProduto = () => {
    const texto = `${nome} - R$ ${preco}\n${descricao}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto)
        .then(() => {
          alert('✅ Produto copiado para área de transferência!');
        })
        .catch(() => {
          fallbackCopyText(texto);
        });
    } else {
      fallbackCopyText(texto);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      alert('✅ Produto copiado para área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Não foi possível copiar. Copie manualmente: ' + text);
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <button
      onClick={copiarProduto}
      className="w-full mt-2 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
    >
      Copiar informações
    </button>
  );
}