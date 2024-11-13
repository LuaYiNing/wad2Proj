import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from '../backend/firebase/firebase.js';

const userName = localStorage.getItem('userName') || 'User';
document.getElementById('userName').innerText = userName;
if (userName === 'User') {
    document.getElementById('logoutLink').style.display = 'none';
    document.getElementById('userName').style.display = 'none';
}

const app = Vue.createApp({
    data() {
        return {
            recipes: [] 
        };
    },
    methods: {
        async getSavedRecipeDetails() {
            const apiKey = '1e82a8d269304c3683a7624d3205ac76'; 
            const savedRecipesRef = collection(db, `users/${localStorage.getItem('userUID')}/savedRecipes`);

            try {
                // Get saved recipe IDs from Firestore
                const querySnapshot = await getDocs(savedRecipesRef);
                const recipeIDs = querySnapshot.docs.map(doc => doc.id);

                // Fetch details for each recipe ID
                for (let recipeId of recipeIDs) {
                    try {
                        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                            params: { apiKey: apiKey }
                        });
                        const details = response.data;

                        this.recipes.push({
                            id: recipeId,
                            title: details.title,
                            highResImage: details.image,
                            readyInMinutes: details.readyInMinutes,
                            servings: details.servings
                        });
                    } catch (error) {
                        console.error(`Error fetching details for recipe ID ${recipeId}:`, error);
                    }
                }
            } catch (error) {
                console.error("Error retrieving saved recipe IDs from Firestore:", error);
            }
        },
        viewRecipeDetails(recipeId) {
            window.location.href = `recipe-details.html?recipeId=${recipeId}`;
        }
    },
    mounted() {
        this.getSavedRecipeDetails();
    }
}).mount('#app');
