import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Business } from './businessService';
import food1 from '@/assets/food-1.jpg';
import food2 from '@/assets/food-2.jpg';

const sampleBusinesses: Omit<Business, 'id'>[] = [
  { name: "Mama Thandi's Shisa Nyama", image: food1, cuisine: "Braai & Grill", location: "Soweto, Johannesburg", rating: 4.8, priceRange: "R", distance: "1.2km" },
  { name: "Kota King", image: food2, cuisine: "Street Food", location: "Alexandra, Johannesburg", rating: 4.6, priceRange: "R", distance: "0.8km" },
  { name: "Bunny Chow Palace", image: food1, cuisine: "Durban Curry", location: "Umlazi, Durban", rating: 4.9, priceRange: "R", distance: "2.1km" },
  { name: "Boerewors & Pap Spot", image: food2, cuisine: "Traditional", location: "Mamelodi, Pretoria", rating: 4.7, priceRange: "R", distance: "1.5km" },
  { name: "Smiley's Place", image: food1, cuisine: "Sheep Head & Offal", location: "Khayelitsha, Cape Town", rating: 4.5, priceRange: "RR", distance: "3.2km" },
];

export const seedDatabase = async (): Promise<void> => {
  try {
    const snapshot = await getDocs(collection(db, 'businesses'));
    
    if (snapshot.empty) {
      console.log('Database empty, adding sample data...');
      
      for (const business of sampleBusinesses) {
        await addDoc(collection(db, 'businesses'), business);
      }
      
      console.log('Sample data added successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};