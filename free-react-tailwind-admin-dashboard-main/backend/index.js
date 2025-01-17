const express = require('express');
const bodyParser = require('body-parser');
const cassandra = require('cassandra-driver');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();

// Configuration CORS pour autoriser les connexions depuis votre frontend
app.use(cors({
  origin: 'http://localhost:5173', // Remplacez par l'URL exacte de votre frontend
}));

app.use(bodyParser.json());

// Configuration de Cassandra
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], // Adresse Cassandra
  localDataCenter: 'datacenter1',
  keyspace: 'my_keyspace',
  authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra'), // Identifiants par défaut
});

// Connexion à Cassandra
client.connect()
  .then(() => console.log('Connecté à Cassandra'))
  .catch((err) => {
    console.error('Erreur Cassandra:', err);
    process.exit(1); // Arrête le serveur en cas d'erreur critique
  });

  app.get('/api/comments/statistics', async (req, res) => {
    try {
      // Total des commentaires
      const totalCommentsQuery = 'SELECT COUNT(*) AS total_comments FROM messages_kafka';
      const totalCommentsResult = await client.execute(totalCommentsQuery);
  
      // Prédictions positives (avec ALLOW FILTERING si pas d'index)
      const positiveCommentsQuery = "SELECT COUNT(*) AS positive_comments FROM messages_kafka WHERE prediction = 'Positive' ALLOW FILTERING";
      const positiveCommentsResult = await client.execute(positiveCommentsQuery);
  
      // Prédictions négatives (avec ALLOW FILTERING si pas d'index)
      const negativeCommentsQuery = "SELECT COUNT(*) AS negative_comments FROM messages_kafka WHERE prediction = 'Negative' ALLOW FILTERING";
      const negativeCommentsResult = await client.execute(negativeCommentsQuery);
  
      // Récupérer toutes les catégories et extraire celles distinctes en mémoire
      const categoriesQuery = 'SELECT categories FROM messages_kafka';
      const categoriesResult = await client.execute(categoriesQuery);
      const categoriesSet = new Set();
      categoriesResult.rows.forEach(row => {
        if (row.categories) {
          categoriesSet.add(row.categories);
        }
      });
      const totalCategories = categoriesSet.size;
  
      // Compilation des statistiques
      const statistics = {
        total_comments: totalCommentsResult.rows[0].total_comments,
        total_categories: totalCategories,
        positive_comments: positiveCommentsResult.rows[0].positive_comments,
        negative_comments: negativeCommentsResult.rows[0].negative_comments,
      };
  
      console.log('Statistics:', statistics);
      res.json(statistics);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques :', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

// Exemple pour tester l'accès à votre backend avec Axios
const apiUrl = 'http://localhost:5003/api/comments/statistics';
axios.get(apiUrl)
  .then(response => {
    console.log('Statistiques des commentaires :', response.data);
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des statistiques :', error.message);
  });


// Route API pour récupérer les commentaires par date
app.get('/api/comments', async (req, res) => {
  try {
    const commentsQuery = 'SELECT reviewdate FROM messages_kafka';
    const result = await client.execute(commentsQuery);
    
    // Agréger les commentaires par date
    const dateCounts = {};

    result.rows.forEach(row => {
      // Vérifier si reviews_date est un objet Date ou une chaîne
      let reviewDate;
      
      if (row.reviewsdate instanceof Date) {
        // Si c'est un objet Date, on le convertit en format 'YYYY-MM-DD'
        reviewDate = row.reviewdate.toISOString().split('T')[0];
      } else {
        // Si c'est déjà une chaîne, on utilise la méthode split pour extraire la date
        reviewDate = row.reviewdate.split(' ')[0];
      }

      // Incrémenter le nombre de commentaires pour cette date
      dateCounts[reviewDate] = (dateCounts[reviewDate] || 0) + 1;
    });

    // Tri des dates
    const sortedDates = Object.keys(dateCounts).sort();

    // Réponse formatée : Liste des dates et des comptes correspondants
    const formattedData = sortedDates.map(date => ({
      date,
      count: dateCounts[date],
    }));

    // Renvoie la réponse avec le comptage par date
    res.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



app.get('/comments-by-category', async (req, res) => {
  try {
    const query = 'SELECT categories FROM messages_kafka';
    const result = await client.execute(query);

    const categoryCounts = result.rows.reduce((acc, row) => {
      const category = row.categories;
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {});

    const formattedResults = Object.keys(categoryCounts).map(category => ({
      category,
      count: categoryCounts[category],
    }));

    console.log(formattedResults); // Ajoutez ceci pour vérifier les données avant de les renvoyer
    res.json(formattedResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



// Route API pour récupérer les commentaires avec nom, localisation et catégorie
app.get('/api/comments/details', async (req, res) => {
  try {
    const commentsQuery = 'SELECT text, username, usercity, categories FROM messages_kafka';
    const result = await client.execute(commentsQuery);
    
    // Formatage des résultats
    const formattedData = result.rows.map(row => ({
      reviews_text: row.text,
      reviews_username: row.username,
      reviews_user_city: row.usercity,
      categories: row.categories
    }));

    // Renvoie la réponse formatée
    res.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires détaillés :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


app.get('/api/comments/count-categories', async (req, res) => {
  try {
    console.log('Début de la récupération des catégories...');
    
    // Requête pour récupérer les catégories (sans DISTINCT dans la requête)
    const categoriesQuery = 'SELECT categories FROM messages_kafka LIMIT 5';
    const categoriesResult = await client.execute(categoriesQuery);

    if (!categoriesResult || categoriesResult.rows.length === 0) {
      console.log('Aucune catégorie trouvée.');
      return res.json([]);
    }

    // Extraction des catégories et filtrage des doublons
    const categoriesSet = new Set(categoriesResult.rows.map(row => row.categories));
    const uniqueCategories = Array.from(categoriesSet).filter(category => category); // Exclure les catégories nulles ou indéfinies
    console.log('Catégories uniques trouvées:', uniqueCategories);

    const categoryStatistics = [];
    for (const category of uniqueCategories) {
      // Requête pour les commentaires positifs
      const positiveCommentsQuery = `
        SELECT COUNT(*) AS positive_comments 
        FROM messages_kafka
        WHERE categories = ? AND prediction = 'Positive' ALLOW FILTERING
      `;
      const positiveCommentsResult = await client.execute(positiveCommentsQuery, [category]);

      // Requête pour les commentaires négatifs
      const negativeCommentsQuery = `
        SELECT COUNT(*) AS negative_comments 
        FROM messages_kafka
        WHERE categories = ? AND prediction = 'Negative' ALLOW FILTERING
      `;
      const negativeCommentsResult = await client.execute(negativeCommentsQuery, [category]);

      categoryStatistics.push({
        category: category || 'Non spécifié',
        positive_comments: positiveCommentsResult.rows[0]?.positive_comments || 0,
        negative_comments: negativeCommentsResult.rows[0]?.negative_comments || 0,
      });
    }

    console.log('Statistiques des catégories générées:', categoryStatistics);
    res.json(categoryStatistics);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});




app.get('/api/comments/count-by-region', async (req, res) => {
  try {
    console.log('Début de la récupération des données par région...');
    
    // Requête pour récupérer les données des villes et des commentaires
    const regionCommentsQuery = 'SELECT usercity FROM messages_kafka';
    
    const result = await client.execute(regionCommentsQuery);
    
    if (!result || result.rows.length === 0) {
      return res.json([]);
    }

    // Regrouper les commentaires par ville en utilisant JavaScript
    const cityCounts = result.rows.reduce((acc, row) => {
      const city = row.usercity || 'Non spécifiée';  // Gérer les valeurs nulles
      if (acc[city]) {
        acc[city]++;
      } else {
        acc[city] = 1;
      }
      return acc;
    }, {});

    // Convertir l'objet en tableau pour le renvoyer dans la réponse
    const regionData = Object.keys(cityCounts).map(city => ({
      city: city,
      comment_count: cityCounts[city],
    }));

    console.log('Données des commentaires par ville:', regionData);
    res.json(regionData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});







app.get('/api/top-users', async (req, res) => {
  try {
    const query = 'SELECT username, title FROM messages_kafka LIMIT 5';
    const result = await client.execute(query);

    const formattedData = result.rows.map(row => ({
      username: row.username,
      title: row.title,
      
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


// Lancer le serveur
const PORT = 5003;
app.listen(PORT, () => console.log(`Backend démarré sur http://localhost:${PORT}`));
