import mobiles      from './../assets/mobiles.png';
import car          from './../assets/car.png';
import motorcycle   from './../assets/motorcycle.png';
import home         from './../assets/home.png';
import clothing     from './../assets/clothing.png';
import book         from './../assets/book.png';
import animal       from './../assets/animal.png';

const categories = [
  { key: 'mobile-phones', name: 'Mobile Phones', img: mobiles, href: '/category/mobile-phones' },
  { key: 'cars', name: 'Cars', img: car, href: '/category/cars' },
  { key: 'motorcycles', name: 'Motorcycles', img: motorcycle, href: '/category/motorcycles' },
  { key: 'houses', name: 'Houses', img: home, href: '/category/houses' },
  { key: 'clothing', name: 'Clothing', img: clothing, href: '/category/clothing' },
  { key: 'books', name: 'Books', img: book, href: '/category/books' },
  { key: 'animals', name: 'Animals', img: animal, href: '/category/animals' },
];

export default categories;
