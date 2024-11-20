import { Box } from '@/types/box'
import { Shirt } from 'lucide-react';

export const mockBoxes: Box[] = [
  {
    box_id: 'a1b2c3d4',
    name: 'BOX001',
    description: 'Winter clothing collection',
    location_id: 'loc-1',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
    content: [
      { box_content_id: 'e5f6g7h8', box_id: 'a1b2c3d4', size: 'M', category_id: '1', gender: 'U', quantity: 5, icon: Shirt },  // T-shirts
      { box_content_id: 'i9j0k1l2', box_id: 'a1b2c3d4', size: 'L', category_id: '2', gender: 'M', quantity: 2, icon: Shirt },  // Jackets
      { box_content_id: 'c9d0e1f2', box_id: 'a1b2c3d4', size: 'ONESIZE', category_id: '3', gender: 'U', quantity: 6, icon: Shirt },  // Socks
    ],
    movement: 'mock movement 1',
    tags: [1, 3]
  },
  {
    box_id: 'm3n4o5p6',
    name: 'BOX002',
    description: 'Summer clothing collection',
    location_id: 'loc-2',
    created_at: new Date('2024-01-16'),
    updated_at: new Date('2024-01-17'),
    content: [
      { box_content_id: 'q7r8s9t0', box_id: 'm3n4o5p6', size: 'S', category_id: '3', gender: 'F', quantity: 3, icon: Shirt },  // T-shirts
      { box_content_id: 'u1v2w3x4', box_id: 'm3n4o5p6', size: 'M', category_id: '4', gender: 'F', quantity: 4, icon: Shirt },  // Shorts
      { box_content_id: 'q7r8s9t0', box_id: 'm3n4o5p6', size: 'S', category_id: '5', gender: 'F', quantity: 3, icon: Shirt },  // T-shirts
      { box_content_id: 'u1v2w3x4', box_id: 'm3n4o5p6', size: 'M', category_id: '6', gender: 'F', quantity: 4, icon: Shirt },  // Shorts
    ],
    movement: 'mock movement 2',
    tags: [2, 3]
  },
  {
    box_id: 'y5z6a7b8',
    name: 'BOX003',
    description: 'Mixed accessories',
    location_id: 'loc-3',
    created_at: new Date('2024-01-17'),
    updated_at: new Date('2024-01-18'),
    content: [
      { box_content_id: 'c9d0e1f2', box_id: 'y5z6a7b8', size: 'ONESIZE', category_id: '5', gender: 'U', quantity: 7, icon: Shirt },  // Belts
      { box_content_id: 'g3h4i5j6', box_id: 'y5z6a7b8', size: 'ONESIZE', category_id: '6', gender: 'U', quantity: 8, icon: Shirt },  // Hats
    ],
    movement: 'mock movement 3',
    tags: [4]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'BOX004',
    description: 'Denim collection',
    location_id: 'loc-4',
    created_at: new Date('2024-01-18'),
    updated_at: new Date('2024-01-18'),
    content: [
      { box_content_id: 'h8i9j0k1', box_id: '123e4567-e89b-12d3-a456-426614174003', size: 'ONESIZE', category_id: '7', gender: 'U', quantity: 9, icon: Shirt },  // Jeans
      { box_content_id: 'l2m3n4o5', box_id: '123e4567-e89b-12d3-a456-426614174003', size: 'ONESIZE', category_id: '8', gender: 'U', quantity: 10, icon: Shirt },  // Shirts
    ],
    movement: 'mock movement 4',
    tags: [3, 5]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174004',
    name: 'BOX005',
    description: 'Children\'s toys',
    location_id: 'loc-5',
    created_at: new Date('2024-01-19'),
    updated_at: new Date('2024-01-19'),
    content: [
      { box_content_id: 'p6q7r8s9', box_id: '123e4567-e89b-12d3-a456-426614174004', size: 'ONESIZE', category_id: '9', gender: 'U', quantity: 11, icon: Shirt },  // Toys
      { box_content_id: 't0u1v2w3', box_id: '123e4567-e89b-12d3-a456-426614174004', size: 'ONESIZE', category_id: '10', gender: 'U', quantity: 12, icon: Shirt },  // Books
    ],
    movement: 'mock movement 5',
    tags: [5]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174005',
    name: 'BOX006',
    description: 'Electronics storage',
    location_id: 'loc-6',
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20'),
    content: [
      { box_content_id: 'x4y5z6a7', box_id: '123e4567-e89b-12d3-a456-426614174005', size: 'ONESIZE', category_id: '11', gender: 'U', quantity: 13, icon: Shirt },  // Smartphones
      { box_content_id: 'b8c9d0e1', box_id: '123e4567-e89b-12d3-a456-426614174005', size: 'ONESIZE', category_id: '12', gender: 'U', quantity: 14, icon: Shirt },  // Tablets
    ],
    movement: 'mock movement 6',
    tags: [4, 5]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174006',
    name: 'BOX007',
    description: 'Office supplies',
    location_id: 'loc-7',
    created_at: new Date('2024-01-21'),
    updated_at: new Date('2024-01-21'),
    content: [
      { box_content_id: 'f2g3h4i5', box_id: '123e4567-e89b-12d3-a456-426614174006', size: 'ONESIZE', category_id: '13', gender: 'U', quantity: 15, icon: Shirt },  // Pens
      { box_content_id: 'j6k7l8m9', box_id: '123e4567-e89b-12d3-a456-426614174006', size: 'ONESIZE', category_id: '14', gender: 'U', quantity: 16, icon: Shirt },  // Notebooks
    ],
    movement: 'mock movement 7',
    tags: [3]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174007',
    name: 'BOX008',
    description: 'Kitchen equipment',
    location_id: 'loc-8',
    created_at: new Date('2024-01-22'),
    updated_at: new Date('2024-01-22'),
    content: [
      { box_content_id: 'n4o5p6q7', box_id: '123e4567-e89b-12d3-a456-426614174007', size: 'ONESIZE', category_id: '15', gender: 'U', quantity: 17, icon: Shirt },  // Knives
      { box_content_id: 'r8s9t0u1', box_id: '123e4567-e89b-12d3-a456-426614174007', size: 'ONESIZE', category_id: '16', gender: 'U', quantity: 18, icon: Shirt },  // Pots
    ],
    movement: 'mock movement 8',
    tags: [5]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174008',
    name: 'BOX009',
    description: 'Sports gear',
    location_id: 'loc-9',
    created_at: new Date('2024-01-23'),
    updated_at: new Date('2024-01-23'),
    content: [
      { box_content_id: 'v2w3x4y5', box_id: '123e4567-e89b-12d3-a456-426614174008', size: 'ONESIZE', category_id: '17', gender: 'U', quantity: 19, icon: Shirt },  // Bats
      { box_content_id: 'a7b8c9d0', box_id: '123e4567-e89b-12d3-a456-426614174008', size: 'ONESIZE', category_id: '18', gender: 'U', quantity: 20, icon: Shirt },  // Balls
    ],
    movement: 'mock movement 9',
    tags: [2]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174009',
    name: 'BOX010',
    description: 'Books and magazines',
    location_id: 'loc-10',
    created_at: new Date('2024-01-24'),
    updated_at: new Date('2024-01-24'),
    content: [
      { box_content_id: 'h8i9j0k1', box_id: '123e4567-e89b-12d3-a456-426614174009', size: 'ONESIZE', category_id: '19', gender: 'U', quantity: 21, icon: Shirt },  // Novels
      { box_content_id: 'l2m3n4o5', box_id: '123e4567-e89b-12d3-a456-426614174009', size: 'ONESIZE', category_id: '20', gender: 'U', quantity: 22, icon: Shirt },  // Magazines
    ],
    movement: 'mock movement 10',
    tags: [4]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174010',
    name: 'BOX011',
    description: 'Art supplies',
    location_id: 'loc-11',
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25'),
    content: [
      { box_content_id: 'p6q7r8s9', box_id: '123e4567-e89b-12d3-a456-426614174010', size: 'ONESIZE', category_id: '21', gender: 'U', quantity: 23, icon: Shirt },  // Paints
      { box_content_id: 't0u1v2w3', box_id: '123e4567-e89b-12d3-a456-426614174010', size: 'ONESIZE', category_id: '22', gender: 'U', quantity: 24, icon: Shirt },  // Brushes
    ],
    movement: 'mock movement 11',
    tags: [3, 5]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174011',
    name: 'BOX012',
    description: 'Winter sports equipment',
    location_id: 'loc-12',
    created_at: new Date('2024-01-26'),
    updated_at: new Date('2024-01-26'),
    content: [
      { box_content_id: 'x4y5z6a7', box_id: '123e4567-e89b-12d3-a456-426614174011', size: 'ONESIZE', category_id: '23', gender: 'U', quantity: 25, icon: Shirt },  // Skis
      { box_content_id: 'b8c9d0e1', box_id: '123e4567-e89b-12d3-a456-426614174011', size: 'ONESIZE', category_id: '24', gender: 'U', quantity: 26, icon: Shirt },  // Snowboards
    ],
    movement: 'mock movement 12',
    tags: [1]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174012',
    name: 'BOX013',
    description: 'Gardening tools',
    location_id: 'loc-13',
    created_at: new Date('2024-01-27'),
    updated_at: new Date('2024-01-27'),
    content: [
      { box_content_id: 'n4o5p6q7', box_id: '123e4567-e89b-12d3-a456-426614174012', size: 'ONESIZE', category_id: '25', gender: 'U', quantity: 27, icon: Shirt },  // Shovels
      { box_content_id: 'r8s9t0u1', box_id: '123e4567-e89b-12d3-a456-426614174012', size: 'ONESIZE', category_id: '26', gender: 'U', quantity: 28, icon: Shirt },  // Rakes
    ],
    movement: 'mock movement 13',
    tags: [2, 4]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174013',
    name: 'BOX014',
    description: 'Holiday decorations',
    location_id: 'loc-14',
    created_at: new Date('2024-01-28'),
    updated_at: new Date('2024-01-28'),
    content: [
      { box_content_id: 'h8i9j0k1', box_id: '123e4567-e89b-12d3-a456-426614174013', size: 'ONESIZE', category_id: '27', gender: 'U', quantity: 29, icon: Shirt },  // Christmas trees
      { box_content_id: 'l2m3n4o5', box_id: '123e4567-e89b-12d3-a456-426614174013', size: 'ONESIZE', category_id: '28', gender: 'U', quantity: 30, icon: Shirt },  // Holiday lights
    ],
    movement: 'mock movement 14',
    tags: [1, 5]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174014',
    name: 'BOX015',
    description: 'Camping gear',
    location_id: 'loc-15',
    created_at: new Date('2024-01-29'),
    updated_at: new Date('2024-01-29'),
    content: [
      { box_content_id: 'p6q7r8s9', box_id: '123e4567-e89b-12d3-a456-426614174014', size: 'ONESIZE', category_id: '29', gender: 'U', quantity: 31, icon: Shirt },  // Tents
      { box_content_id: 't0u1v2w3', box_id: '123e4567-e89b-12d3-a456-426614174014', size: 'ONESIZE', category_id: '30', gender: 'U', quantity: 32, icon: Shirt },  // Sleeping bags
    ],
    movement: 'mock movement 15',
    tags: [2]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174015',
    name: 'BOX016',
    description: 'Musical instruments',
    location_id: 'loc-16',
    created_at: new Date('2024-01-30'),
    updated_at: new Date('2024-01-30'),
    content: [
      { box_content_id: 'x4y5z6a7', box_id: '123e4567-e89b-12d3-a456-426614174015', size: 'ONESIZE', category_id: '31', gender: 'U', quantity: 33, icon: Shirt },  // Guitars
      { box_content_id: 'b8c9d0e1', box_id: '123e4567-e89b-12d3-a456-426614174015', size: 'ONESIZE', category_id: '32', gender: 'U', quantity: 34, icon: Shirt },  // Drums
    ],
    movement: 'mock movement 16',
    tags: [5]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174016',
    name: 'BOX017',
    description: 'Pet supplies',
    location_id: 'loc-17',
    created_at: new Date('2024-01-31'),
    updated_at: new Date('2024-01-31'),
    content: [
      { box_content_id: 'n4o5p6q7', box_id: '123e4567-e89b-12d3-a456-426614174016', size: 'ONESIZE', category_id: '33', gender: 'U', quantity: 35, icon: Shirt },  // Dog toys
      { box_content_id: 'r8s9t0u1', box_id: '123e4567-e89b-12d3-a456-426614174016', size: 'ONESIZE', category_id: '34', gender: 'U', quantity: 36, icon: Shirt },  // Cat toys
    ],
    movement: 'mock movement 17',
    tags: [3, 4]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174017',
    name: 'BOX018',
    description: 'Bathroom accessories',
    location_id: 'loc-18',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01'),
    content: [
      { box_content_id: 'h8i9j0k1', box_id: '123e4567-e89b-12d3-a456-426614174017', size: 'ONESIZE', category_id: '35', gender: 'U', quantity: 37, icon: Shirt },  // Towels
      { box_content_id: 'l2m3n4o5', box_id: '123e4567-e89b-12d3-a456-426614174017', size: 'ONESIZE', category_id: '36', gender: 'U', quantity: 38, icon: Shirt },  // Shower curtains
    ],
    movement: 'mock movement 18',
    tags: [3]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174018',
    name: 'BOX019',
    description: 'Home maintenance tools',
    location_id: 'loc-19',
    created_at: new Date('2024-02-02'),
    updated_at: new Date('2024-02-02'),
    content: [
      { box_content_id: 'p6q7r8s9', box_id: '123e4567-e89b-12d3-a456-426614174018', size: 'ONESIZE', category_id: '37', gender: 'U', quantity: 39, icon: Shirt },  // Screwdrivers
      { box_content_id: 't0u1v2w3', box_id: '123e4567-e89b-12d3-a456-426614174018', size: 'ONESIZE', category_id: '38', gender: 'U', quantity: 40, icon: Shirt },  // Wrenches
    ],
    movement: 'mock movement 19',
    tags: [4]
  },
  {
    box_id: '123e4567-e89b-12d3-a456-426614174019',
    name: 'BOX020',
    description: 'Vintage collection',
    location_id: 'loc-20',
    created_at: new Date('2024-02-03'),
    updated_at: new Date('2024-02-03'),
    content: [
      { box_content_id: 'x4y5z6a7', box_id: '123e4567-e89b-12d3-a456-426614174019', size: 'ONESIZE', category_id: '39', gender: 'U', quantity: 41, icon: Shirt },  // Vintage watches
      { box_content_id: 'b8c9d0e1', box_id: '123e4567-e89b-12d3-a456-426614174019', size: 'ONESIZE', category_id: '40', gender: 'U', quantity: 42, icon: Shirt },  // Antique clocks
    ],
    movement: 'mock movement 20',
    tags: [3, 5]
  }
];

export const CATEGORIES: Record<string, string> = {
  '1': 'T-Shirts',
  '2': 'Jackets',
  '3': 'Socks',
  '4': 'Shorts',
  // ... etc
} as const;
