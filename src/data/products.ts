export interface ProductSpecs {
  ram: string;
  almacenamiento: string;
  procesador: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  specs: ProductSpecs;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'ASUS VivoBook 15',
    brand: 'ASUS',
    price: 2199,
    specs: {
      ram: '8 GB DDR4',
      almacenamiento: '512 GB SSD NVMe',
      procesador: 'Intel Core i5-1235U',
    },
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    name: 'HP Pavilion 15',
    brand: 'HP',
    price: 2499,
    specs: {
      ram: '16 GB DDR4',
      almacenamiento: '512 GB SSD',
      procesador: 'AMD Ryzen 5 5500U',
    },
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    name: 'Lenovo IdeaPad 3',
    brand: 'Lenovo',
    price: 1899,
    specs: {
      ram: '8 GB DDR4',
      almacenamiento: '256 GB SSD',
      procesador: 'Intel Core i3-1215U',
    },
    image:
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    name: 'Acer Aspire 5',
    brand: 'Acer',
    price: 2099,
    specs: {
      ram: '12 GB DDR4',
      almacenamiento: '512 GB SSD',
      procesador: 'Intel Core i5-1240P',
    },
    image:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    name: 'Dell Inspiron 15',
    brand: 'Dell',
    price: 2799,
    specs: {
      ram: '16 GB DDR4',
      almacenamiento: '1 TB SSD NVMe',
      procesador: 'Intel Core i7-1255U',
    },
    image:
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    name: 'MacBook Air M2',
    brand: 'Apple',
    price: 5999,
    specs: {
      ram: '8 GB Unificada',
      almacenamiento: '256 GB SSD',
      procesador: 'Apple M2 (8 núcleos)',
    },
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  },
];

export const getProductById = (id: number): Product | undefined =>
  products.find((p) => p.id === id);

export const formatPrice = (price: number): string =>
  `S/ ${price.toLocaleString('es-PE')}`;
