import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sofa, BedDouble, Shirt, Zap, Wrench, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAddonServices, type AddonService } from '@/hooks/useAddons';
import type { Package } from '@/types/database';

const iconMap: Record<string, LucideIcon> = {
  sofa: Sofa,
  'bed-double': BedDouble,
  shirt: Shirt,
  zap: Zap,
  wrench: Wrench,
};

interface AddOnServicesFormProps {
  pkg: Package;
  onSubmit: (selectedAddOns: string[], totalAddonPrice: number) => void;
}

export function AddOnServicesForm({ pkg, onSubmit }: AddOnServicesFormProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data: addons, isLoading } = useAddonServices();

  const toggleAddon = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addonTotal = addons?.filter(a => selected.has(a.id)).reduce((sum, a) => sum + a.price, 0) ?? 0;
  const grandTotal = pkg.price + addonTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Array.from(selected), addonTotal);
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Wrench;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="bg-brand-light-blue rounded-xl p-4">
        <h3 className="font-semibold text-brand-navy">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground">{pkg.category?.name}</p>
        <p className="text-lg font-bold text-brand-teal mt-1">Base: ₹{pkg.price.toLocaleString()}</p>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-4">Select Add-on Services</h4>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {addons?.map((addon, index) => (
              <motion.label
                key={addon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                htmlFor={addon.id}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  selected.has(addon.id)
                    ? 'border-secondary bg-secondary/5 shadow-soft'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <Checkbox
                  id={addon.id}
                  checked={selected.has(addon.id)}
                  onCheckedChange={() => toggleAddon(addon.id)}
                />
                <span className="text-muted-foreground">{getIcon(addon.icon)}</span>
                <div className="flex-1">
                  <span className="font-medium text-foreground">{addon.name}</span>
                  {addon.description && (
                    <p className="text-xs text-muted-foreground">{addon.description}</p>
                  )}
                </div>
                <span className="font-semibold text-brand-teal">₹{addon.price}</span>
              </motion.label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Base Package</span>
          <span>₹{pkg.price.toLocaleString()}</span>
        </div>
        {addonTotal > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Add-ons ({selected.size})</span>
            <span>₹{addonTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-brand-teal">₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <Button type="submit" variant="hero" size="xl" className="w-full">
        Continue to Booking
      </Button>
    </motion.form>
  );
}
