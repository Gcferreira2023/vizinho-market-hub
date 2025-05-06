
/**
 * Serviço para otimização e manipulação de imagens
 */

// Função para construir URLs de imagens otimizadas
export const getOptimizedImageUrl = (
  originalUrl: string, 
  options: { 
    width?: number; 
    quality?: number; 
    format?: 'auto' | 'webp' | 'jpg' | 'png' 
  } = {}
) => {
  const { width = 800, quality = 80, format = 'auto' } = options;
  
  // Detectar se a URL já é do Unsplash ou similar que suporta parâmetros
  if (originalUrl.includes('unsplash.com')) {
    // Unsplash já suporta parâmetros de otimização
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}w=${width}&q=${quality}&fm=${format}&fit=crop`;
  }
  
  // Para URLs de armazenamento Supabase, use a API de transformação se disponível
  if (originalUrl.includes('supabase.co/storage/v1')) {
    // Nota: Este recurso pode exigir um plano pago do Supabase
    // Verifique a documentação atual para detalhes sobre transformação de imagens
    return originalUrl;
  }
  
  // Para outros casos, retornar a URL original
  return originalUrl;
};

// Função para determinar qual tamanho de imagem usar com base na largura do dispositivo
export const getResponsiveImageUrl = (
  originalUrl: string,
  breakpoints: { mobile?: number; tablet?: number; desktop?: number } = {}
) => {
  const { 
    mobile = 480, 
    tablet = 768, 
    desktop = 1200 
  } = breakpoints;

  // Detectar tamanho do dispositivo
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  
  let targetWidth = desktop;
  if (windowWidth < 768) {
    targetWidth = mobile;
  } else if (windowWidth < 1200) {
    targetWidth = tablet;
  }
  
  // Gerar URL otimizada com o tamanho apropriado
  return getOptimizedImageUrl(originalUrl, { width: targetWidth });
};

// Retorna os tamanhos para srcset em imagens responsivas
export const getImageSrcSet = (originalUrl: string) => {
  if (!originalUrl) return '';
  
  const widths = [320, 640, 960, 1280, 1600];
  
  // Para URLs que suportam parâmetros de dimensionamento
  if (originalUrl.includes('unsplash.com')) {
    return widths
      .map(width => `${getOptimizedImageUrl(originalUrl, { width })} ${width}w`)
      .join(', ');
  }
  
  // Para URLs que não suportam parâmetros, retornar apenas a original
  return originalUrl;
};

// Função para comprimir imagens antes do upload
export const compressImage = async (
  file: File, 
  options: { 
    maxWidth?: number; 
    maxHeight?: number; 
    quality?: number; 
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<File> => {
  // Se não tivermos o módulo browser-image-compression no projeto,
  // retorne o arquivo original
  return file;
  
  // Aqui seria a implementação de compressão de imagem,
  // mas isso exigiria importar uma biblioteca adicional
};
