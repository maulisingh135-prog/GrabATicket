import odysseyPoster from "../assets/odyssey-poster.jpg";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import banner4 from "../assets/banner4.avif";
import m1 from "../assets/poster-black-panther.jpg";
import m2 from "../assets/poster-sheep-detectives.jpg";
import m3 from "../assets/poster-bhoot-bangla.jpg";
import m4 from "../assets/poster-homebound.jpg";
import m5 from "../assets/poster-the-drama.jpg";
import m6 from "../assets/poster-hail-mary.jpg";
import m7 from "../assets/poster-cocktail-2.jpg";
import m8 from "../assets/poster-spiderman-bnd.jpg";
import e1 from "../assets/e1.avif";
import e2 from "../assets/e2.avif";
import e3 from "../assets/e3.avif";
import e4 from "../assets/e4.avif";
import e5 from "../assets/e5.avif";
import inox from "../assets/inox.avif";
import pvr from "../assets/pvr.avif";
import cinepolis from "../assets/cinepolis.avif";

export const languages = [
  "Hindi",
  "English",
  "English 7D",
  "Bengali",
  "Punjabi",
  "Tamil",
  "Japanese",
  "Telugu",
];

export const banners = [odysseyPoster, banner2, banner3, banner4];

export const movies = [
  {
    id: 1,
    title: "Black Panther",
    genre: "Action/Adventure/Sci-Fi",
    rating: 8.7,
    votes: "612K",
    img: m1,
  },
  {
    id: 2,
    title: "The Sheep Detectives",
    genre: "Comedy/Family/Mystery",
    rating: 7.3,
    votes: "8.4K",
    img: m2,
  },
  {
    id: 3,
    title: "Bhoot Bangla",
    genre: "Horror/Comedy",
    rating: 6.8,
    votes: "14.2K",
    img: m3,
  },
  {
    id: 4,
    title: "Homebound",
    genre: "Drama",
    rating: 8.9,
    votes: "3.1K",
    img: m4,
  },
  {
    id: 5,
    title: "The Drama",
    genre: "Comedy/Drama",
    rating: 7.1,
    votes: "5.6K",
    img: m5,
  },
  {
    id: 6,
    title: "Project Hail Mary",
    genre: "Sci-Fi/Adventure",
    rating: 8.6,
    votes: "22.7K",
    img: m6,
  },
  {
    id: 7,
    title: "Cocktail 2",
    genre: "Romance/Comedy/Drama",
    rating: 6.5,
    votes: "9.8K",
    img: m7,
  },
  {
    id: 8,
    title: "Spider-Man: Brand New Day",
    genre: "Action/Adventure/Sci-Fi",
    rating: 8.3,
    votes: "18.9K",
    img: m8,
  },
];

export const allMovies = [
  {
    id: 1,
    title: "Black Panther",
    genre: "Action/Adventure/Sci-Fi",
    rating: 8.7,
    votes: "612K",
    img: m1,
    languages: "English",
    age: "UA13+",
  },
  {
    id: 2,
    title: "The Sheep Detectives",
    genre: "Comedy/Family/Mystery",
    rating: 7.3,
    votes: "8.4K",
    img: m2,
    languages: "English",
    age: "U",
  },
  {
    id: 3,
    title: "Bhoot Bangla",
    genre: "Horror/Comedy",
    rating: 6.8,
    votes: "14.2K",
    img: m3,
    languages: "Hindi",
    age: "UA13+",
  },
  {
    id: 4,
    title: "Homebound",
    genre: "Drama",
    rating: 8.9,
    votes: "3.1K",
    img: m4,
    languages: "Hindi",
    age: "UA13+",
  },
  {
    id: 5,
    title: "The Drama",
    genre: "Comedy/Drama",
    rating: 7.1,
    votes: "5.6K",
    img: m5,
    languages: "English",
    age: "UA16+",
  },
  {
    id: 6,
    title: "Project Hail Mary",
    genre: "Sci-Fi/Adventure",
    rating: 8.6,
    votes: "22.7K",
    img: m6,
    languages: "English",
    age: "UA13+",
  },
  {
    id: 7,
    title: "Cocktail 2",
    genre: "Romance/Comedy/Drama",
    rating: 6.5,
    votes: "9.8K",
    img: m7,
    languages: "Hindi",
    age: "UA16+",
  },
  {
    id: 8,
    title: "Spider-Man: Brand New Day",
    genre: "Action/Adventure/Sci-Fi",
    rating: 8.3,
    votes: "18.9K",
    img: m8,
    languages: "English",
    age: "UA13+",
  },
  {
    id: 9,
    title: "The Odyssey",
    genre: "Adventure/Fantasy",
    rating: 8.9,
    votes: "1.2K",
    img: odysseyPoster,
    languages: "English",
    age: "UA13+",
  },
];

export const events = [
  {
    title: "COMEDY SHOWS",
    subtitle: "205+ Events",
    img: e1,
  },
  {
    title: "AMUSEMENT PARK",
    subtitle: "20+ Events",
    img: e2,
  },
  {
    title: "THEATRE SHOWS",
    subtitle: "80+ Events",
    img: e3,
  },
  {
    title: "KIDS",
    subtitle: "25+ Events",
    img: e4,
  },
  {
    title: "ADVENTURE & FUN",
    subtitle: "10+ Events",
    img: e5,
  },
];

export const theatres = [
  {
    name: "INOX Riverside Mall, Hazratganj, Lucknow",
    distance: "2.0 km",
    cancellation: "Allows cancellation",
    img: inox,
    timings: [
      { time: "10:15 AM", label: "RECLINERS" },
      { time: "2:00 PM", label: "RECLINERS" },
      { time: "6:45 PM", label: "RECLINERS", highlight: true },
      { time: "11:35 PM", label: "RECLINERS" },
      { time: "7:45 PM", label: "RECLINERS" },
      { time: "12:35 PM", label: "RECLINERS" }
    ],
  },
  {
    name: "PVR Phoenix Palassio, Vibhuti Khand, Lucknow",
    distance: "3.3 km",
    cancellation: "Non-cancellable",
    img: inox,
    timings: [
      { time: "1:15 PM", label: "RECLINERS" },
      { time: "4:30 PM", label: "RECLINERS" },
    ],
  },
  {
    name: "Cinepolis Fun Republic, Gomti Nagar, Lucknow",
    distance: "1.5 km",
    cancellation: "Allows cancellation",
    img: pvr,
    timings: [
      { time: "10:30 AM", label: "PVR PXL" },
      { time: "1:45 PM", label: "PVR PXL" },
      { time: "5:15 PM", label: "PVR PXL" },
      { time: "11:25 PM", label: "PVR PXL", highlight: true },
    ],
  },
  {
    name: "INOX Wave Mall, Alambagh, Lucknow",
    distance: "4.1 km",
    cancellation: "Allows cancellation",
    img: inox,
    timings: [
      { time: "12:00 PM", label: "LASER" },
      { time: "3:30 PM", label: "LASER" },
      { time: "6:50 PM", label: "LASER", highlight: true },
      { time: "11:25 PM", label: "LASER" },
    ],
  },
  {
    name: "Miraj Cinemas Gomti Nagar, Vipin Khand, Lucknow",
    distance: "3.8 km",
    cancellation: "Non-cancellable",
    img: cinepolis,
    timings: [
      { time: "08:10 PM", label: "DOLBY 7.1" },
      { time: "11:30 PM", label: "DOLBY 7.1" },
    ],
  },
];

export const ordersData = [];


export const filters = ["2D", "3D", "Wheelchair Friendly", "Premium Seats", "Recliners", "IMAX", "PVR PXL", "4DX", "Laser", "Dolby Atmos"];

export const tabs = ["Profile", "Your Orders"];

export const countryCodes = [
  { name: "India", code: "IN", dial_code: "+91" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
  { name: "Australia", code: "AU", dial_code: "+61" },
  { name: "Canada", code: "CA", dial_code: "+1" },
  { name: "Germany", code: "DE", dial_code: "+49" },
  { name: "France", code: "FR", dial_code: "+33" },
  { name: "Japan", code: "JP", dial_code: "+81" },
  { name: "China", code: "CN", dial_code: "+86" },
  { name: "Brazil", code: "BR", dial_code: "+55" },
  { name: "United Arab Emirates", code: "AE", dial_code: "+971" },
  { name: "Bangladesh", code: "BD", dial_code: "+880" },
  { name: "Nepal", code: "NP", dial_code: "+977" },
  { name: "Pakistan", code: "PK", dial_code: "+92" },
  { name: "Russia", code: "RU", dial_code: "+7" },
  { name: "South Africa", code: "ZA", dial_code: "+27" },
  { name: "Sri Lanka", code: "LK", dial_code: "+94" },
  { name: "Thailand", code: "TH", dial_code: "+66" },
  { name: "Indonesia", code: "ID", dial_code: "+62" },
  { name: "Malaysia", code: "MY", dial_code: "+60" },
  // Add more if needed
];
