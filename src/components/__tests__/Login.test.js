describe('Test de connexion via l\'API', () => {
  it('Devrait permettre à l\'utilisateur de se connecter avec succès', async () => {
    // Envoyer une requête POST pour se connecter avec les identifiants d'un utilisateur existant
    const response = await fetch("http://localhost:5000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: 'nouvel_utilisateur@example.com', // Email de l'utilisateur
                  password: 'password_secure' // Mot de passe de l'utilisateur
                })
            });

    // Attendre que la promesse se résolve
    const responseData = await response.json();

    // Vérifier le code de statut de la réponse
    expect(response.status).toBe(200);
    
    // Vérifier le corps de la réponse
    expect(responseData.message).toBe('Authentification réussie');
    expect(responseData.token).toBeDefined(); // Vérifiez si un jeton JWT est renvoyé
    expect(responseData.userId).toBeDefined(); // Vérifiez si un ID d'utilisateur est renvoyé
    expect(responseData.username).toBeDefined(); // Vérifiez si le nom d'utilisateur est renvoyé
  });

  // Ajoutez d'autres tests pour gérer les scénarios d'erreur ou les cas limites
});

