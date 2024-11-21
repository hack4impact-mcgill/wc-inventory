import { Shirt, ShoppingBag, Tag } from 'lucide-react';

// Enums for ContentSize and Gender
export enum ContentSize {
    ExtraSmall = "XS",
    Small = "S",
    Medium = "M",
    Large = "L",
    ExtraLarge = "XL"
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    Unisex = "Unisex"
}

// Sample data - replace with your actual data
export const categories = [
    { value: "jackets", label: "Jackets", icon: Shirt },
    { value: "tshirts", label: "T-Shirts", icon: Shirt },
    { value: "bags", label: "Bags", icon: ShoppingBag },
    { value: "accessories", label: "Accessories", icon: Tag },
];

export const sizes = Object.values(ContentSize);
export const genders = Object.values(Gender);

// Sample items data - replace with your actual data
export const items = [
    { box_content_id: 1, box: "Box A", size: ContentSize.Small, categories: "jackets", gender: Gender.Male, quantity: 10 },
    { box_content_id: 2, box: "Box B", size: ContentSize.Medium, categories: "jackets", gender: Gender.Female, quantity: 5 },
    { box_content_id: 3, box: "Box C", size: ContentSize.Small, categories: "tshirts", gender: Gender.Unisex, quantity: 20 },
    { box_content_id: 4, box: "Box D", size: ContentSize.Large, categories: "bags", gender: Gender.Female, quantity: 15 },
    { box_content_id: 5, box: "Box E", size: ContentSize.Medium, categories: "accessories", gender: Gender.Male, quantity: 8 },
];