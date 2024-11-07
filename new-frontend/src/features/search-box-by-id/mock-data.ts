import { Box, BoxContent } from '@/types/box'

export const mockBoxes: Box[] = [
  {
    box_id: 1,
    name: 'BOX001',
    description: 'Winter clothing collection',
    location_id: 4,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
    contents: [
      { box_content_id: 1, size: 'M', category_id: 1, gender: 'U', quantity: 5 },  // T-shirts
      { box_content_id: 2, size: 'L', category_id: 2, gender: 'M', quantity: 2 },  // Jackets
      { box_content_id: 3, size: 'ONESIZE', category_id: 3, gender: 'U', quantity: 6 },  // Socks
    ],
    movement: 'mock movement 1',
    tags: [1, 3]
  },
  {
    box_id: 2,
    name: 'BOX002',
    description: 'Summer clothing collection',
    location_id: 5,
    created_at: new Date('2024-01-16'),
    updated_at: new Date('2024-01-17'),
    contents: [
      { box_content_id: 4, size: 'S', category_id: 1, gender: 'F', quantity: 3 },  // T-shirts
      { box_content_id: 5, size: 'M', category_id: 4, gender: 'F', quantity: 4 },  // Shorts
    ],
    movement: 'mock movement 2',
    tags: [2, 3]
  },
  {
    box_id: 3,
    name: 'BOX003',
    description: 'Mixed accessories',
    location_id: 6,
    created_at: new Date('2024-01-17'),
    updated_at: new Date('2024-01-18'),
    contents: [
      { box_content_id: 6, size: 'ONESIZE', category_id: 5, gender: 'U', quantity: 7 },  // Belts
      { box_content_id: 7, size: 'ONESIZE', category_id: 6, gender: 'U', quantity: 8 },  // Hats
    ],
    movement: 'mock movement 3',
    tags: [4]
  },
  {
    box_id: 4,
    name: 'BOX004',
    description: 'Denim collection',
    location_id: 4,
    created_at: new Date('2024-01-18'),
    updated_at: new Date('2024-01-18'),
    contents: [
      { box_content_id: 8, size: 'ONESIZE', category_id: 7, gender: 'U', quantity: 9 },  // Jeans
      { box_content_id: 9, size: 'ONESIZE', category_id: 8, gender: 'U', quantity: 10 },  // Shirts
    ],
    movement: 'mock movement 4',
    tags: [3, 5]
  },
  {
    box_id: 5,
    name: 'BOX005',
    description: 'Children\'s toys',
    location_id: 7,
    created_at: new Date('2024-01-19'),
    updated_at: new Date('2024-01-19'),
    contents: [
      { box_content_id: 10, size: 'ONESIZE', category_id: 9, gender: 'U', quantity: 11 },  // Toys
      { box_content_id: 11, size: 'ONESIZE', category_id: 10, gender: 'U', quantity: 12 },  // Books
    ],
    movement: 'mock movement 5',
    tags: [5]
  },
  {
    box_id: 6,
    name: 'BOX006',
    description: 'Electronics storage',
    location_id: 8,
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20'),
    contents: [
      { box_content_id: 12, size: 'ONESIZE', category_id: 11, gender: 'U', quantity: 13 },  // Smartphones
      { box_content_id: 13, size: 'ONESIZE', category_id: 12, gender: 'U', quantity: 14 },  // Tablets
    ],
    movement: 'mock movement 6',
    tags: [4, 5]
  },
  {
    box_id: 7,
    name: 'BOX007',
    description: 'Office supplies',
    location_id: 4,
    created_at: new Date('2024-01-21'),
    updated_at: new Date('2024-01-21'),
    contents: [
      { box_content_id: 14, size: 'ONESIZE', category_id: 13, gender: 'U', quantity: 15 },  // Pens
      { box_content_id: 15, size: 'ONESIZE', category_id: 14, gender: 'U', quantity: 16 },  // Notebooks
    ],
    movement: 'mock movement 7',
    tags: [3]
  },
  {
    box_id: 8,
    name: 'BOX008',
    description: 'Kitchen equipment',
    location_id: 5,
    created_at: new Date('2024-01-22'),
    updated_at: new Date('2024-01-22'),
    contents: [
      { box_content_id: 16, size: 'ONESIZE', category_id: 15, gender: 'U', quantity: 17 },  // Knives
      { box_content_id: 17, size: 'ONESIZE', category_id: 16, gender: 'U', quantity: 18 },  // Pots
    ],
    movement: 'mock movement 8',
    tags: [5]
  },
  {
    box_id: 9,
    name: 'BOX009',
    description: 'Sports gear',
    location_id: 6,
    created_at: new Date('2024-01-23'),
    updated_at: new Date('2024-01-23'),
    contents: [
      { box_content_id: 18, size: 'ONESIZE', category_id: 17, gender: 'U', quantity: 19 },  // Bats
      { box_content_id: 19, size: 'ONESIZE', category_id: 18, gender: 'U', quantity: 20 },  // Balls
    ],
    movement: 'mock movement 9',
    tags: [2]
  },
  {
    box_id: 10,
    name: 'BOX010',
    description: 'Books and magazines',
    location_id: 7,
    created_at: new Date('2024-01-24'),
    updated_at: new Date('2024-01-24'),
    contents: [
      { box_content_id: 20, size: 'ONESIZE', category_id: 19, gender: 'U', quantity: 21 },  // Novels
      { box_content_id: 21, size: 'ONESIZE', category_id: 20, gender: 'U', quantity: 22 },  // Magazines
    ],
    movement: 'mock movement 10',
    tags: [4]
  },
  {
    box_id: 11,
    name: 'BOX011',
    description: 'Art supplies',
    location_id: 8,
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25'),
    contents: [
      { box_content_id: 22, size: 'ONESIZE', category_id: 21, gender: 'U', quantity: 23 },  // Paints
      { box_content_id: 23, size: 'ONESIZE', category_id: 22, gender: 'U', quantity: 24 },  // Brushes
    ],
    movement: 'mock movement 11',
    tags: [3, 5]
  },
  {
    box_id: 12,
    name: 'BOX012',
    description: 'Winter sports equipment',
    location_id: 4,
    created_at: new Date('2024-01-26'),
    updated_at: new Date('2024-01-26'),
    contents: [
      { box_content_id: 24, size: 'ONESIZE', category_id: 23, gender: 'U', quantity: 25 },  // Skis
      { box_content_id: 25, size: 'ONESIZE', category_id: 24, gender: 'U', quantity: 26 },  // Snowboards
    ],
    movement: 'mock movement 12',
    tags: [1]
  },
  {
    box_id: 13,
    name: 'BOX013',
    description: 'Gardening tools',
    location_id: 5,
    created_at: new Date('2024-01-27'),
    updated_at: new Date('2024-01-27'),
    contents: [
      { box_content_id: 26, size: 'ONESIZE', category_id: 25, gender: 'U', quantity: 27 },  // Shovels
      { box_content_id: 27, size: 'ONESIZE', category_id: 26, gender: 'U', quantity: 28 },  // Rakes
    ],
    movement: 'mock movement 13',
    tags: [2, 4]
  },
  {
    box_id: 14,
    name: 'BOX014',
    description: 'Holiday decorations',
    location_id: 6,
    created_at: new Date('2024-01-28'),
    updated_at: new Date('2024-01-28'),
    contents: [
      { box_content_id: 28, size: 'ONESIZE', category_id: 27, gender: 'U', quantity: 29 },  // Christmas trees
      { box_content_id: 29, size: 'ONESIZE', category_id: 28, gender: 'U', quantity: 30 },  // Holiday lights
    ],
    movement: 'mock movement 14',
    tags: [1, 5]
  },
  {
    box_id: 15,
    name: 'BOX015',
    description: 'Camping gear',
    location_id: 7,
    created_at: new Date('2024-01-29'),
    updated_at: new Date('2024-01-29'),
    contents: [
      { box_content_id: 30, size: 'ONESIZE', category_id: 29, gender: 'U', quantity: 31 },  // Tents
      { box_content_id: 31, size: 'ONESIZE', category_id: 30, gender: 'U', quantity: 32 },  // Sleeping bags
    ],
    movement: 'mock movement 15',
    tags: [2]
  },
  {
    box_id: 16,
    name: 'BOX016',
    description: 'Musical instruments',
    location_id: 8,
    created_at: new Date('2024-01-30'),
    updated_at: new Date('2024-01-30'),
    contents: [
      { box_content_id: 32, size: 'ONESIZE', category_id: 31, gender: 'U', quantity: 33 },  // Guitars
      { box_content_id: 33, size: 'ONESIZE', category_id: 32, gender: 'U', quantity: 34 },  // Drums
    ],
    movement: 'mock movement 16',
    tags: [5]
  },
  {
    box_id: 17,
    name: 'BOX017',
    description: 'Pet supplies',
    location_id: 4,
    created_at: new Date('2024-01-31'),
    updated_at: new Date('2024-01-31'),
    contents: [
      { box_content_id: 34, size: 'ONESIZE', category_id: 33, gender: 'U', quantity: 35 },  // Dog toys
      { box_content_id: 35, size: 'ONESIZE', category_id: 34, gender: 'U', quantity: 36 },  // Cat toys
    ],
    movement: 'mock movement 17',
    tags: [3, 4]
  },
  {
    box_id: 18,
    name: 'BOX018',
    description: 'Bathroom accessories',
    location_id: 5,
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01'),
    contents: [
      { box_content_id: 36, size: 'ONESIZE', category_id: 35, gender: 'U', quantity: 37 },  // Towels
      { box_content_id: 37, size: 'ONESIZE', category_id: 36, gender: 'U', quantity: 38 },  // Shower curtains
    ],
    movement: 'mock movement 18',
    tags: [3]
  },
  {
    box_id: 19,
    name: 'BOX019',
    description: 'Home maintenance tools',
    location_id: 6,
    created_at: new Date('2024-02-02'),
    updated_at: new Date('2024-02-02'),
    contents: [
      { box_content_id: 38, size: 'ONESIZE', category_id: 37, gender: 'U', quantity: 39 },  // Screwdrivers
      { box_content_id: 39, size: 'ONESIZE', category_id: 38, gender: 'U', quantity: 40 },  // Wrenches
    ],
    movement: 'mock movement 19',
    tags: [4]
  },
  {
    box_id: 20,
    name: 'BOX020',
    description: 'Vintage collection',
    location_id: 7,
    created_at: new Date('2024-02-03'),
    updated_at: new Date('2024-02-03'),
    contents: [
      { box_content_id: 40, size: 'ONESIZE', category_id: 39, gender: 'U', quantity: 41 },  // Vintage watches
      { box_content_id: 41, size: 'ONESIZE', category_id: 40, gender: 'U', quantity: 42 },  // Antique clocks
    ],
    movement: 'mock movement 20',
    tags: [3, 5]
  }
];

export const CATEGORIES = {
  1: 'T-Shirts',
  2: 'Jackets',
  3: 'Socks',
  4: 'Shorts',
  // ... etc
} as const;
