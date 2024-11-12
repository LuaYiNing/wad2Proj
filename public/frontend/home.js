
const apiKey = ''; // Replace with your actual API key

axios.get("https://api.thenewsapi.com/v1/news/all?language=en&search=food+wastage|food+insecurity&api_token=" + apiKey)
    .then(response => {
        console.log(response.data);
        let newsArr = response.data.data;

        let news1 = newsArr[0];
        console.log(news1);
        let title1 = news1.title;
        let url1 = news1.url;
        let a1 = document.createElement('a');
        a1.setAttribute('href', url1);
        a1.innerText = title1;
        document.getElementById('news1Title').appendChild(a1);
        let desc1 = news1.description;
        document.getElementById('news1Desc').innerText = desc1;
        let pic1URL = news1.image_url;
        document.getElementById('news1Img').src = pic1URL;

        let news2 = newsArr[1];
        let title2 = news2.title;
        let url2 = news2.url;
        let a2 = document.createElement('a');
        a2.setAttribute('href', url2);
        a2.innerText = title2;
        document.getElementById('news2Title').appendChild(a2);
        let desc2 = news2.description;
        document.getElementById('news2Desc').innerText = desc2;
        let pic2URL = news2.image_url;
        document.getElementById('news2Img').src = pic2URL;

        let news3 = newsArr[2];
        let title3 = news3.title;
        let url3 = news3.url;
        let a3 = document.createElement('a');
        a3.setAttribute('href', url3);
        a3.innerText = title3;
        document.getElementById('news3Title').appendChild(a3);
        let desc3 = news3.description;
        document.getElementById('news3Desc').innerText = desc3;
        let pic3URL = news3.image_url;
        document.getElementById('news3Img').src = pic3URL;
    })
    .catch(error => {
        console.log(error.message);
    });