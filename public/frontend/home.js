async function fetchNewsData() {
  const apiKey = 'm4BloEFuNj1BwjjqNzYmOUm0iIHUPyh5ztuZJcLc'; 

  try {
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
