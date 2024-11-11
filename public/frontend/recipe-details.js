document.addEventListener("DOMContentLoaded", async () => {
    const apiKey = ''; // replace with your api key
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipeId');

    if (!recipeId) {
        alert("Invalid recipe ID.");
        return;
    }

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
            params: { apiKey: apiKey }
        });
        const recipe = response.data;

        // Set Image, Title, Servings, and Time
        const imageUrl = recipe.image.replace('312x231', '636x393');
        document.getElementById('recipe-image').src = imageUrl;
        document.getElementById('recipe-title').innerText = recipe.title;
        document.getElementById('recipe-servings').innerText = recipe.servings;
        document.getElementById('recipe-time').innerText = recipe.readyInMinutes;

        // Display Ingredients
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        recipe.extendedIngredients.forEach(ingredient => {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.innerHTML = `
                <img src="https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}" alt="${ingredient.name}" class="icon-img">
                <span>${ingredient.original}</span>
            `;
            ingredientsList.appendChild(item);
        });

        // Display Equipment
        const equipmentList = document.getElementById('equipment-list');
        const equipmentResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/equipmentWidget.json`, {
            params: { apiKey: apiKey }
        });
        const equipmentData = equipmentResponse.data.equipment;
        equipmentList.innerHTML = '';
        equipmentData.forEach(equipment => {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.innerHTML = `
                <img src="https://spoonacular.com/cdn/equipment_100x100/${equipment.image}" alt="${equipment.name}" class="icon-img">
                <span>${equipment.name}</span>
            `;
            equipmentList.appendChild(item);
        });

        // Display Instructions
        const instructionsList = document.getElementById('instructions-list');
        recipe.analyzedInstructions[0]?.steps.forEach(step => {
            const stepDiv = document.createElement('div');
            stepDiv.classList.add('instruction-step');
            stepDiv.innerHTML = `<strong>Step ${step.number}:</strong> ${step.step}`;
            instructionsList.appendChild(stepDiv);
        });

        // Save Recipe Button
        const saveButton = document.getElementById('save-recipe-btn');
        saveButton.addEventListener('click', () => {
            alert("Recipe saved!");
        });
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        alert("Failed to fetch recipe details. Please try again later.");
    }
});
