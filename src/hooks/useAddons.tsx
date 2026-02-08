import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AddonService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useAddonServices() {
  return useQuery({
    queryKey: ['addon-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addon_services')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as AddonService[];
    },
  });
}

export function useCreateAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (addon: Omit<AddonService, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('addon_services')
        .insert(addon)
        .select()
        .single();
      if (error) throw error;
      return data as AddonService;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addon-services'] }),
  });
}

export function useUpdateAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AddonService> & { id: string }) => {
      const { data, error } = await supabase
        .from('addon_services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as AddonService;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addon-services'] }),
  });
}

export function useDeleteAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('addon_services')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addon-services'] }),
  });
}
