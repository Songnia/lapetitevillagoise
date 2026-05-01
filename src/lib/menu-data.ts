export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
}

export const menuItems: MenuItem[] = [
  {
    name: 'Porc DG',
    description: 'Porc DG, servi avec ses accompagnements de viande et poisson.',
    price: '4 500 FCFA',
    image: '/assets/porc-dg.webp',
    category: 'Plats Signature'
  },
  {
    name: 'Poulet DG',
    description: 'Poulet braisé, servi avec ses accompagnements de viande et poisson.',
    price: '4 500 FCFA',
    image: '/assets/poulet-dg.webp',
    category: 'Plats Signature'
  },
  {
    name: 'Poisson braisé',
    description: "Poisson braisé, servi avec ses accompagnements de viande et poisson.",
    price: '5 500 FCFA',
    image: '/assets/poisson-braise.webp',
    category: 'Grillades'
  },
  {
    name: 'Taro',
    description: 'Taro, servi avec ses accompagnements de viande et poisson.',
    price: '4 000 FCFA',
    image: '/assets/taro.webp',
    category: 'Traditionnel'
  },
  {
    name: 'Sallade',
    description: "Sallade, servi avec ses accompagnements de viande et poisson.",
    price: '5 000 FCFA',
    image: '/assets/salade.webp',
    category: 'Entrées'
  },
  {
    name: 'Ndolé',
    description: "Le plat de fête par excellence. Épinards amers mijotés avec des crevettes, du bœuf et des arachides fraîches.",
    price: '6 000 FCFA',
    image: '/assets/ndole.webp',
    category: 'Traditionnel'
  },
  {
    name: 'Soupe Egussi',
    description: 'Notre soupe épaisse aux graines de melon, garnie de viande de bœuf, de poisson fumé et épices traditionnelles.',
    price: '5 500 FCFA',
    image: '/assets/dish-egussi.webp',
    category: 'Traditionnel'
  },
];
