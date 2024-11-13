Name: Food Hero

Description:
Food Hero is a web application designed to tackle global food waste and food insecurity by raising awareness, promoting sustainable habits, and providing practical solutions. It features educational resources, a Recipe Finder tool to help users make the most of excess ingredients, and an interactive Donation Locator — a Google Maps-based feature that allows users to easily find nearby food banks, community fridges, and food boxes.

The app also includes educational content such as global food waste statistics and up-to-date news on the topic, along with engaging interactive games and quizzes to help users learn about sustainable food practices in a fun and impactful way. By empowering individuals with these tools, Food Hero aims to reduce waste, support food donation efforts, and encourage responsible consumption.

Deployed URL to Food Hero: https://wad2project-db.web.app/frontend/login.html

Step by step instructions of: 

1. How to setup our Food Hero web application based on submitted file(s)
- To run our application locally, save the files in the root directory of your WAMP/MAMP server. 
- Open the browser and navigate to http://localhost/wad2Proj/public/frontend/login.html to access the login page.
- Alternatively, use the deployed URL stated above to directly access the web application.

2. How to run Food Hero web application:
2.1 - Login details: 
Username: bob@gmail.com
Password: bob@gmail.com 

The above login details is just for our testing purposes. 
You may also create your own account using our registration link using the "Register here" button or login with Google.

2.2 - After logging in, you can now explore our web application:
- On the Home Page, you can explore interactive charts displaying global food waste statistics and  and stay up-to-date with the latest news on food waste.

- Head over to our Recipe Finder page and click on "Start Searching for Recipes" located beside the "Ready to Unleash your Inner Chef" section. This will bring you to our search page where a pop-up instruction will appear. After closing the pop-up instruction, you can either drag and drop the commonly found ingredients or manually key in the ingredients you have on hand. Then, press Enter or click on the search icon to view a list of recommended recipes including the estimated cooking time and servings. 
- Click the "View Full Recipe" button to view the list of ingredients (with images), equipments (with images) and step-by-step cooking instructions, making it easy for you to follow along and create your dish. 
- You can also click the "Save Recipe" button to save the recipe to your profile. To access your saved recipes, click on your name in the top right corner of the navigation bar. This will take you to your profile page, where you can view your list of saved recipes.

- Navigate to our "Play" page to enjoy an interactive car game. Use the arrow keys (up, down, left, right) on your computer to navigate the car, or swipe if you're using a tablet or iPad.

- Projects Section: Use the arrow keys and explore to our "Projects" page, which is divided into three sections:
-   The Hidden Cost of the Food We Throw Out
-   How to Turn the Tables on Food Waste
-   Food Expiration Dates Don’t Mean What You Think
Each section includes YouTube videos that provide insights into food insecurity and food waste. You can watch these educational videos to gain a deeper understanding of these important topics.

- Quiz Section: Move the car to the end of the page near directory section, you’ll find the "Quiz" option. Click on it to access four different quizzes related to food waste and sustainability. Select a quiz title to start. For each correct answer, points are awarded; incorrect answers receive no points. After completing a quiz, you can view your results. If you want to try again, simply click the "Try Again" button, or choose "Back to Categories" to explore other quizzes.

- Visit our Donation Drives page, where you can explore a comprehensive list of food banks in Singapore, dynamically sourced using the Google API. You’ll also find information on local community fridges and food boxes.
You can also use the "Nearby Me" button to quickly locate food banks, food boxes, and community fridges near your current location. 
- The interactive Google Map allows you to zoom in and out using the + and - buttons for easier navigation. You can also filter the map to display specific donation sites, such as food banks, food boxes, or community fridges.
For easier identification, the filters and map markers are color-coded according to the type of donation drive.

- To logout, simply click on the ‘Logout’ button at the top right corner of the navigation bar


As we are using the free version of Spoonacular API to list out the recipes, there's a limit of 150 requests per day thus we have provided additional API keys for you to test which can be found in the .env file
Do note that you will need to update these pages if you change the API Key:
1. recipe-drag.js (Lines 87, 128)
2. profile.js (Line 19)
3. recipe-details.js (Line 69)
4. recipe-finder.js (Lines 28, 49)