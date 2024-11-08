// For instruction modal
document.addEventListener("DOMContentLoaded", function () {
    const instructionsModal = new bootstrap.Modal(document.getElementById('instructionsModal'));
    instructionsModal.show();
});

// For recipe search
const app = Vue.createApp({
    data() {
        return {
            inputIngredients: '',
            recipes: [],
            selectedRecipe: {}
        };
    },
    mounted() {
        // Enable drag-and-drop for ingredients
        document.querySelectorAll('.ingredient').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.getAttribute('data-name'));
            });
        });
    },
    methods: {
        handleDrop(event) {
            const ingredient = event.dataTransfer.getData('text/plain');

            // Check if ingredient is already in the input field
            if (!this.inputIngredients.includes(ingredient)) {
                this.inputIngredients += (this.inputIngredients ? ', ' : '') + ingredient;
            }
        },
        handleDragOver(event) {
            event.preventDefault();
        },
        async findRecipes() {
            const ingredients = this.inputIngredients.split(',').map(ingredient => ingredient.trim()).join(',');

            if (this.inputIngredients.trim() === '') {
                const emptyInputModal = new bootstrap.Modal(document.getElementById('emptyInputModal'));
                emptyInputModal.show();
                return;
            }

            const apiKey = ''; // Replace with API key
            try {
                const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
                    params: {
                        ingredients: ingredients,
                        apiKey: apiKey
                    }
                });
                this.recipes = response.data;

                if (this.recipes.length === 0) {
                    const noRecipesModal = new bootstrap.Modal(document.getElementById('noRecipesModal'));
                    noRecipesModal.show();
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
                document.getElementById("Response").innerText= "Failed to fetch recipes. Please try again later."
            }
        },
        async getRecipeDetails(recipeId) {
            const apiKey = ''; // Replace with API key
            try {
                const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                    params: {
                        apiKey: apiKey
                    }
                });
                this.selectedRecipe = response.data;

                const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
                modal.show();
            } catch (error) {
                console.error("Error fetching recipe details:", error.response ? error.response.data : error.message);
                document.getElementById("Response").innerText= "Failed to fetch recipes. Please try again later."
            }
        }
    }
});

app.mount('#app');
