import { useState, useEffect } from 'react';
import { MapPin, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { doualaNeighborhoods } from '@/lib/delivery-data';

const cities = [
  { id: 'douala', name: 'Douala' },
  { id: 'yaounde', name: 'Yaoundé' },
];

const neighborhoods: Record<string, { id: string; name: string; price: number }[]> = {
  douala: doualaNeighborhoods.map(name => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: name,
    price: 1100
  })),
  yaounde: [
    { id: 'bastos', name: 'Bastos', price: 1000 },
    { id: 'mendong', name: 'Mendong', price: 1500 },
    { id: 'mvan', name: 'Mvan', price: 1200 },
  ],
};

interface DeliverySectionProps {
  onPriceChange: (price: number) => void;
  onDataChange: (data: { phone: string; landmark: string; city: string; quarter: string }) => void;
}

export default function DeliverySection({ onPriceChange, onDataChange }: DeliverySectionProps) {
  const [selectedCity, setSelectedCity] = useState('douala');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [phone, setPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  useEffect(() => {
    onDataChange({ phone, landmark, city: selectedCity, quarter: selectedQuarter });
  }, [phone, landmark, selectedCity, selectedQuarter]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedQuarter('');
    setDeliveryPrice(0);
    onPriceChange(0);
  };

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quarterId = e.target.value;
    setSelectedQuarter(quarterId);
    
    const quarter = neighborhoods[selectedCity]?.find(q => q.id === quarterId);
    const price = quarter?.price || 0;
    setDeliveryPrice(price);
    onPriceChange(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-forest/10 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-forest" />
          <h3 className="font-display text-lg uppercase tracking-wider text-forest font-bold">
            DÉTAILS DE LA LIVRAISON
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-[10px] uppercase tracking-widest text-midgray font-bold px-1 block mb-1">Ville</label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full appearance-none bg-white border border-forest/10 rounded-lg px-4 py-3 font-body text-charcoal focus:outline-none focus:border-terracotta transition-colors pr-10"
              >
                <option value="" disabled>Choisir une ville</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-charcoal/50">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] uppercase tracking-widest text-midgray font-bold px-1 block mb-1">Quartier</label>
            <div className="relative">
              <select
                value={selectedQuarter}
                onChange={handleQuarterChange}
                disabled={!selectedCity}
                className={`w-full appearance-none bg-white border border-forest/10 rounded-lg px-4 py-3 font-body text-charcoal focus:outline-none focus:border-forest transition-colors pr-10 ${!selectedCity ? 'bg-midgray/5 cursor-not-allowed' : ''}`}
              >
                <option value="" disabled>Choisir un quartier</option>
                {selectedCity && neighborhoods[selectedCity].map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-charcoal/50">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-midgray font-bold px-1">Téléphone *</label>
            <input
              type="tel"
              placeholder="Ex: 677 00 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-forest/10 rounded-lg px-4 py-3 font-body text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-midgray font-bold px-1">Point de repère</label>
            <input
              type="text"
              placeholder="Ex: En face de la boulangerie"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full bg-white border border-forest/10 rounded-lg px-4 py-3 font-body text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Truck className="w-5 h-5 text-terracotta" />
          <p className="font-body text-xl font-medium text-charcoal">
            Coût : <span className="text-terracotta font-bold">{deliveryPrice.toLocaleString()} FCFA</span>
          </p>
        </div>
      </div>

      <div className="bg-cream/50 p-6 flex items-center justify-between border-t border-forest/5">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full border border-forest/10 shadow-sm">
            <RotateCcw className="w-5 h-5 text-forest" />
          </div>
          <span className="font-display text-sm uppercase tracking-wider text-forest font-bold">
            POLITIQUE DE RETOUR
          </span>
        </div>
        <Link 
          to="/politique-de-retour" 
          className="bg-white px-4 py-2 rounded-lg text-sm font-body text-charcoal hover:bg-forest hover:text-white transition-all shadow-sm"
        >
          Tout lire
        </Link>
      </div>
    </div>
  );
}
