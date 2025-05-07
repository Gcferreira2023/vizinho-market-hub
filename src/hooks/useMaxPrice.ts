
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMaxPrice(defaultMax = 2000) {
  const [maxPrice, setMaxPrice] = useState<number>(defaultMax);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ads')
          .select('price')
          .order('price', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Erro ao buscar preço máximo:', error);
          return;
        }

        // Se encontrou dados e o preço é maior que zero, use-o
        if (data && data.length > 0 && data[0].price > 0) {
          // Arredonda para o próximo múltiplo de 100 para uma melhor experiência do usuário
          const rawMaxPrice = Number(data[0].price);
          const roundedMax = Math.ceil(rawMaxPrice / 100) * 100;
          setMaxPrice(roundedMax);
          console.log(`Preço máximo encontrado: R$${rawMaxPrice}, arredondado para: R$${roundedMax}`);
        } else {
          console.log(`Nenhum preço encontrado, usando padrão: R$${defaultMax}`);
        }
      } catch (err) {
        console.error('Erro ao processar preço máximo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaxPrice();
  }, [defaultMax]);

  return { maxPrice, loading };
}
