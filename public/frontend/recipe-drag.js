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
        tooltip.hide();
        setTimeout(() => {
            instructionsModal.show();
        }, 100);
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
        document.querySelectorAll('.ingredient').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.getAttribute('data-name'));
            });
        });

        // Listen for Enter key press on the input field to trigger search
        document.getElementById('searchBox').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.findRecipes();
            }
        });
    },
    methods: {
        handleDrop(event) {
            const ingredient = event.dataTransfer.getData('text/plain').trim();
        
            // Check if the ingredient is already in the list
            if (this.inputIngredients.toLowerCase().includes(ingredient.toLowerCase())) {
                this.showSoftAlert(`${ingredient} is already added.`);
            } else {
                // Add the ingredient, with a comma if it's not the first one
                this.inputIngredients += this.inputIngredients ? `, ${ingredient}` : ingredient;
            }
        },
        
        // Function to show a soft alert
        showSoftAlert(message) {
            const alertElement = document.getElementById('softAlert');
            alertElement.innerText = message;
            alertElement.classList.add('show');
            setTimeout(() => {
                alertElement.classList.remove('show');
            }, 2000); // Hide alert after 2 seconds
        },
        
        
        handleDragOver(event) {
            event.preventDefault();
        },
        async findRecipes() {
            if (this.inputIngredients.trim() === '') {
                const emptyInputModal = new bootstrap.Modal(document.getElementById('emptyInputModal'));
                emptyInputModal.show();
                return;
            }

            const apiKey = ''; // Replace with your actual API key
            try {
                const ingredients = this.inputIngredients.split(',').map(ingredient => ingredient.trim()).join(',');
                const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
                    params: {
                        ingredients: ingredients,
                        apiKey: apiKey,
                    }
                });

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

                if (this.recipes.length === 0) {
                    const noRecipesModal = new bootstrap.Modal(document.getElementById('noRecipesModal'));
                    noRecipesModal.show();
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        },
        viewRecipeDetails(recipeId) {
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
            }
        }
    }
});

// Mount the Vue app
app.mount('#app');

