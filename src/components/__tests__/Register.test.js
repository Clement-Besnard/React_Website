import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from '../Register';


describe('Test de création de compte via l\'API', () => {
  it('Devrait créer un nouveau compte avec succès', async () => {
    // Envoyer une requête POST pour créer un nouveau compte
    const response = await fetch("http://localhost:5000/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username: 'nouvel_utilisateur',
                  email: 'nouvel_utilisateur@example.com',
                  password: 'password_secure'
                })
            });

    // Attendre que la promesse se résolve
    const responseData = await response.json();

    // Vérifier le code de statut de la réponse
    expect(response.status).toBe(201);
    
    // Vérifier le corps de la réponse
    expect(responseData.message).toBe('Utilisateur enregistré avec succès');
    expect(responseData.userId).toBeDefined(); // Vérifiez si un ID d'utilisateur est renvoyé
  });

  // Ajoutez d'autres tests pour gérer les scénarios d'erreur ou les cas limites
});

it('renders the registration form', () => {
  render(
    <Router>
      <Register />
    </Router>
  );
  const formElement = screen.getByTestId('logincardform');
  expect(formElement).toBeInTheDocument();
});

it('renders the submit button', () => {
  render(
    <Router>
      <Register />
    </Router>
  );

  // Vérifie si le bouton de soumission est présent dans le document
  const submitButton = screen.getByRole('button', { name: /register/i });
  expect(submitButton).toBeInTheDocument();
});

// Les autres tests restent inchangés
