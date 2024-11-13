import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFunctions, httpsCallable } from '../backend/firebase/functions/index.js';

const firebaseConfig = {
    apiKey: "AIzaSyBU748EuZFpFfCDiSyAE_xUxjyUKpj-FC4",
    authDomain: "wad2project-db.firebaseapp.com",
    projectId: "wad2project-db",
    storageBucket: "wad2project-db.appspot.com",
    messagingSenderId: "837532266674",
    appId: "1:837532266674:web:27dd5c3d29c8592bd499ab",
    measurementId: "G-4D4QFGPX67"
};

// Initialize Firebase app and functions
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Define the callable function to get API keys
const getDataFromMultipleApis = httpsCallable(functions, 'getDatafromAPIs');

// Function to fetch news data using the API key retrieved from Firebase
async function fetchNewsData() {
  try {
    const response = await getDataFromMultipleApis();
    const apiKey = response.data.data1; // Adjust this if `dataFromApi1` is not the API key

    const newsResponse = await axios.get(
      `https://api.thenewsapi.com/v1/news/all?language=en&search=food+wastage|food+insecurity&api_token=${apiKey}`
    );

    const newsArr = newsResponse.data.data;

    const newsElements = [
      { title: 'news1Title', desc: 'news1Desc', img: 'news1Img', news: newsArr[0] },
      { title: 'news2Title', desc: 'news2Desc', img: 'news2Img', news: newsArr[1] },
      { title: 'news3Title', desc: 'news3Desc', img: 'news3Img', news: newsArr[2] },
    ];

    newsElements.forEach((element) => {
      const newsItem = element.news;
      if (newsItem) {
        const a = document.createElement('a');
        a.setAttribute('href', newsItem.url);
        a.innerText = newsItem.title;
        document.getElementById(element.title).appendChild(a);

        document.getElementById(element.desc).innerText = newsItem.description;
        document.getElementById(element.img).src = newsItem.image_url;
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

fetchNewsData();
