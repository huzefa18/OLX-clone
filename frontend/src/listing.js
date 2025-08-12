
import mobilesImg from './assets/mobiles.png';
import carImg from './assets/car.png';
import motorcycleImg from './assets/motorcycle.png';
import homeImg from './assets/home.png';
import clothingImg from './assets/clothing.png';
import bookImg from './assets/book.png';
import animalImg from './assets/animal.png';

function generateItems(categorySlug, categoryName, img) {
  const locations = [
    "DHA, Karachi",
    "Gulshan-e-Iqbal, Karachi",
    "Model Town, Lahore",
    "Johar Town, Lahore",
    "G-11, Islamabad",
  ];

  return Array.from({ length: 20 }, (_, i) => ({
    id: `${categorySlug}-${i + 1}`,
    title: `${categoryName} Item ${i + 1}`,
    price: `Rs ${Math.floor(5000 + Math.random() * 100000)}`,
    location: locations[i % locations.length],
    timeAgo: `${(i % 5) + 1} days ago`,
    img: img, 
    href: `/category/${categorySlug}`,
  }));
}

const listings = {
  'mobile-phones': generateItems('mobile-phones', 'Mobile Phone', mobilesImg),
  cars: generateItems('cars', 'Car', carImg),
  motorcycles: generateItems('motorcycles', 'Motorcycle', motorcycleImg),
  houses: generateItems('houses', 'House', homeImg),
  clothing: generateItems('clothing', 'Clothing', clothingImg),
  books: generateItems('books', 'Book', bookImg),
  animals: generateItems('animals', 'Animal', animalImg),
};

console.log(listings)
export default listings;