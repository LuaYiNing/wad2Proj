import { auth, db } from '../backend/firebase/firebase.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

export async function saveRecipe(recipeId, recipeData) {
    const user = auth.currentUser; 
    console.log(user);

    if (!user) {
        alert("You need to be signed in to save a recipe");
        return;
    }

    try {
        const recipeRef = doc(db, `users/${user.uid}/savedRecipes`, recipeId);

        await setDoc(recipeRef, {
            id: recipeId,
            ...recipeData,
            savedAt: new Date().toISOString(),
        });

        console.log(`Recipe ID ${recipeId} saved to the user's profile in Firestore!`);

    } catch (error) {
        console.error("Error saving recipe to Firestore:", error);
        alert("Failed to save recipe. Please try again.");
    }
}
