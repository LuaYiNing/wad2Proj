const app = Vue.createApp({
  data() {
      return {
          inputIngredients: '',
          recipes: [],
          selectedRecipe: {}
      };
  },
  methods: {
      async findRecipes() {
          const ingredients = this.inputIngredients.split(',').map(ingredient => ingredient.trim());
          
          // Check for empty input
          if (this.inputIngredients.trim() === '') {
              const emptyInputModal = new bootstrap.Modal(document.getElementById('emptyInputModal'));
              emptyInputModal.show();
              return;
          }

          // If there are no ingredients after trimming, show modal
          
          if (ingredients.length === 0) {
              const emptyInputModal = new bootstrap.Modal(document.getElementById('emptyInputModal'));
              emptyInputModal.show();
              return;
          }

          const apiKey = ''; // Replace with your actual API key
          try {
              const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
                  params: {
                      ingredients: ingredients.join(','),
                      apiKey: apiKey
                  }
              });
              this.recipes = response.data;

              // Show the modal if no recipes are found
              if (this.recipes.length === 0) {
                  const noRecipesModal = new bootstrap.Modal(document.getElementById('noRecipesModal'));
                  noRecipesModal.show();
              }
          } catch (error) {
              console.error("Error fetching recipes:", error);
              alert("Failed to fetch recipes. Please try again later.");
          }
      },
      async getRecipeDetails(recipeId) {
          const apiKey = ''; // Replace with your actual API key
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
              alert("Failed to fetch recipe details. Please try again later.");
          }
      }
  }
});

app.mount('#app');
