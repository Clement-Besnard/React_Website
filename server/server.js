const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017';

let client = null;

async function connectToMongoDB() {
    client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connecté à la base de données MongoDB');
    } catch (error) {
        console.error('Erreur de connexion à la base de données MongoDB:', error);
    }
}

connectToMongoDB();

app.use(bodyParser.json());

// Middleware pour autoriser les requêtes CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.send('Le serveur fonctionne correctement');
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usersCollection = client.db('React_app').collection('Users');
        await usersCollection.insertOne({ email, password });
        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Vérifier les informations d'authentification dans la base de données
    const usersCollection = client.db('React_app').collection('Users');
    const user = await usersCollection.findOne({ email, password });
  
    if (user) {
      // Authentification réussie
      const token = jwt.sign({ email: user.email, userId: user._id }, 'votre_clé_secrète', { expiresIn: '1h' });
      res.status(200).json({ message: 'Authentification réussie', token });
      
    } else {
      // Échec de l'authentification
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
});


app.get('/products', (req, res) => {
    // Récupérer le token JWT depuis l'en-tête de la requête
    const token = req.headers.authorization;

    if (token) {
        // Vérifier et décoder le token JWT
        jwt.verify(token, 'votre_clé_secrète', (err, decoded) => {
            if (err) {
                // Le token est invalide
                return res.status(401).json({ message: 'Token JWT invalide' });
            } else {
                // Le token est valide, autoriser l'accès à la page "Products"
                res.status(200).json({ message: 'Accès autorisé à la page Products' });
            }
        });
    } else {
        // Le token JWT est manquant dans l'en-tête de la requête
        res.status(401).json({ message: 'Token JWT manquant dans l\'en-tête de la requête' });
    }
});

// Middleware pour gérer les requêtes OPTIONS
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.send();
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
