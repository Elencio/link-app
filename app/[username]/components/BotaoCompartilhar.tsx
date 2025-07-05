'use client';

import { useEffect, useState } from 'react';

interface Props {
  nomeVendedor: string;
}

export default function BotaoCompartilhar({ nomeVendedor }: Props) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const compartilharCatalogo = async () => {
    const dadosCompartilhamento = {
      title: `Catálogo de ${nomeVendedor}`,
      text: `Confira os produtos incríveis de ${nomeVendedor}!`,
      url: currentUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(dadosCompartilhamento);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', err);
          copiarLink();
        }
      }
    } else {
      copiarLink();
    }
  };

  const copiarLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl)
        .then(() => {
          alert('🔗 Link do catálogo copiado para área de transferência!');
        })
        .catch(() => {
          fallbackCopyText(currentUrl);
        });
    } else {
      fallbackCopyText(currentUrl);
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
      alert('🔗 Link do catálogo copiado!');
    } catch (err) {
        console.error('Erro:', err);
      alert('❌ Não foi possível copiar. Copie manualmente: ' + text);
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <button
      onClick={compartilharCatalogo}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
       Compartilhar catálogo
    </button>
  );
}