document.addEventListener("DOMContentLoaded", () => {
    const infoButton = document.getElementById('info-button');
    const instructionsModal = new bootstrap.Modal(document.getElementById('instructionsModal'));

    // Initialize Bootstrap tooltip
    const tooltip = new bootstrap.Tooltip(infoButton, {
        trigger: 'hover focus',
        placement: 'top',
        title: 'Click to view instructions on how to use Recipe Finder!'
    });

    // Show the instructions modal on first page load
    instructionsModal.show();

    // Show the instructions modal again when the info button is clicked
    infoButton.addEventListener('click', () => {
        tooltip.hide(); // Hide the tooltip before showing the modal
        setTimeout(() => {
            instructionsModal.show();
        }, 100); // Small delay for smoother transition
    });
});

// Set the username from localStorage or default to 'User'
const userName = localStorage.getItem('userName') || 'User';
document.getElementById('userName').innerText = userName;

const app = Vue.createApp({
    data() {
        return {
            inputIngredients: '',
            recipes: [],
            selectedRecipe: {}
        };
    },
    mounted() {
        // Enable dragging for ingredients
        document.querySelectorAll('.ingredient').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.getAttribute('data-name'));
            });
        });
    },
    methods: {
        handleDrop(event) {
            const ingredient = event.dataTransfer.getData('text/plain');
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

            const apiKey = ''; // Replace with your API key
            try {
                // Fetch recipes based on input ingredients
                const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
                    params: {
                        ingredients: ingredients,
                        apiKey: apiKey,
                    }
                });

                // Fetch additional recipe details
                const detailedRecipes = await Promise.all(
                    response.data.map(async (recipe) => {
                        const detailsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
                            params: { apiKey: apiKey }
                        });
                        const details = detailsResponse.data;

                        return {
                            id: recipe.id,
                            title: recipe.title,
                            highResImage: recipe.image.replace('312x231', '636x393'),
                            readyInMinutes: details.readyInMinutes,
                            servings: details.servings
                        };
                    })
                );

                this.recipes = detailedRecipes;

                // Show "No Recipes Found" modal if no recipes are returned
                if (this.recipes.length === 0) {
                    const noRecipesModal = new bootstrap.Modal(document.getElementById('noRecipesModal'));
                    noRecipesModal.show();
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
                const responseElement = document.getElementById("Response");
                if (responseElement) {
                    responseElement.innerText = "Failed to fetch recipes. Please try again later.";
                }
            }
        },
        viewRecipeDetails(recipeId) {
            // Navigate to the recipe-details.html with recipe ID as a query parameter
            window.location.href = `recipe-details.html?recipeId=${recipeId}`;
        },
        async getRecipeDetails(recipeId) {
            const apiKey = ''; // Replace with actual API key
            try {
                const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                    params: { apiKey: apiKey }
                });
                this.selectedRecipe = response.data;

                const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
                recipeModal.show();
            } catch (error) {
                console.error("Error fetching recipe details:", error);
                const responseElement = document.getElementById("Response");
                if (responseElement) {
                    responseElement.innerText = "Failed to fetch recipe details. Please try again later.";
                }
            }
        }
    }
});

// Mount the Vue app
app.mount('#app');
