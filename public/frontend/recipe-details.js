import { collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
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
            isSaved: false,
            recipeId: null,
        };
    },
    async mounted() {
        // Get recipeId from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.recipeId = urlParams.get('recipeId');

        if (!this.recipeId) {
            alert("Invalid recipe ID.");
            return;
        }

        // Check if recipe is already saved
        await this.checkIfRecipeIsSaved();
    },
    methods: {
        async checkIfRecipeIsSaved() {
            try {
                const savedRecipesRef = collection(db, `users/${localStorage.getItem('userUID')}/savedRecipes`);
                const querySnapshot = await getDocs(savedRecipesRef);
                const recipeIDs = querySnapshot.docs.map(doc => doc.id);

                // Check if the current recipeId is in the saved recipe list
                this.isSaved = recipeIDs.includes(this.recipeId);
            } catch (error) {
                console.error("Error checking if recipe is saved:", error);
            }
        },
        async saveRecipe() {
            if (this.isSaved) {
                console.log("Recipe is already saved.");
                return;
            }

            try { // save to firebase
                const recipeRef = doc(db, `users/${localStorage.getItem('userUID')}/savedRecipes`, this.recipeId);
                await setDoc(recipeRef, {
                    id: this.recipeId,
                    savedAt: new Date().toISOString(),
                });

                this.isSaved = true;

            } catch (error) {
                console.error("Error saving recipe:", error);
                alert("Failed to save recipe. Please try again later.");
            }
        }
    }
}).mount('#app');


document.addEventListener("DOMContentLoaded", async () => {
    const apiKey = '4ae32a1cd7b348968c58f3b0d9cf8ada';
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipeId');

    if (!recipeId) {
        alert("Invalid recipe ID.");
        return;
    }

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
            params: { apiKey }
        });
        const recipe = response.data;

        // Set the background image and thumbnail
        const imageUrl = recipe.image.replace('312x231', '636x393');
        document.getElementById('recipe-image').src = imageUrl;
        document.getElementById('blurred-background').style.backgroundImage = `url(${imageUrl})`;

        // Set title, servings, and time
        document.getElementById('recipe-title').innerText = recipe.title;
        document.getElementById('recipe-servings').innerText = recipe.servings;
        document.getElementById('recipe-time').innerText = recipe.readyInMinutes;

        // Ingredients
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = ''; // Clear existing content
        recipe.extendedIngredients.forEach(ingredient => {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.innerHTML = `<img src="https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}" class="icon-img"> ${ingredient.original}`;
            ingredientsList.appendChild(item);
        });

        // Equipment
        const equipmentList = document.getElementById('equipment-list');
        equipmentList.innerHTML = ''; // Clear existing content
        const equipmentResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/equipmentWidget.json`, {
            params: { apiKey }
        });

        const equipmentData = equipmentResponse.data.equipment;
        if (equipmentData.length === 0) {
            const noEquipmentItem = document.createElement('li');
            noEquipmentItem.classList.add('list-group-item');
            noEquipmentItem.innerText = "No equipment found.";
            equipmentList.appendChild(noEquipmentItem);
        } else {
            equipmentData.forEach(equipment => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.innerHTML = `<img src="https://spoonacular.com/cdn/equipment_100x100/${equipment.image}" class="icon-img"> ${equipment.name}`;
                equipmentList.appendChild(item);
            });
        }

        // Instructions
        const instructionsList = document.getElementById('instructions-list');
        instructionsList.innerHTML = ''; // Clear existing content
        if (recipe.analyzedInstructions.length === 0 || !recipe.analyzedInstructions[0]?.steps) {
            const noInstructionsDiv = document.createElement('div');
            noInstructionsDiv.classList.add('instruction-step');
            noInstructionsDiv.innerText = "No instructions available.";
            instructionsList.appendChild(noInstructionsDiv);
        } else {
            recipe.analyzedInstructions[0].steps.forEach(step => {
                const stepDiv = document.createElement('div');
                stepDiv.classList.add('instruction-step');
                stepDiv.innerHTML = `<strong>Step ${step.number}:</strong> ${step.step}`;
                instructionsList.appendChild(stepDiv);
            });

        }
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        alert("Failed to fetch recipe details. Please try again later.");
    }


});

