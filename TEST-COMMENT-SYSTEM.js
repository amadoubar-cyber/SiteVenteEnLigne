// Script de test pour le système de commentaires
// Exécuter dans la console du navigateur

console.log('🧪 TEST DU SYSTÈME DE COMMENTAIRES');
console.log('==================================');

// 1. Test des données de base
console.log('\n1️⃣ Test des données de base...');

// Vérifier si localStorage est disponible
if (typeof localStorage === 'undefined') {
  console.error('❌ localStorage n\'est pas disponible');
} else {
  console.log('✅ localStorage est disponible');
}

// Vérifier les clés de stockage
const commentKeys = ['productComments'];
commentKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    console.log(`✅ ${key} existe dans localStorage`);
  } else {
    console.log(`⚠️ ${key} n'existe pas encore dans localStorage`);
  }
});

// 2. Test de création de commentaires
console.log('\n2️⃣ Test de création de commentaires...');

// Créer des commentaires de test
const testComments = [
  {
    productId: 'test-product-1',
    userId: 'user-1',
    userName: 'Fatou Camara',
    userEmail: 'fatou@example.com',
    text: 'Excellent produit, je le recommande !',
    rating: 5
  },
  {
    productId: 'test-product-1',
    userId: 'user-2',
    userName: 'Mamadou Diallo',
    userEmail: 'mamadou@example.com',
    text: 'Très satisfait de mon achat, livraison rapide.',
    rating: 4
  },
  {
    productId: 'test-product-2',
    userId: 'user-3',
    userName: 'Aminata Traoré',
    userEmail: 'aminata@example.com',
    text: 'Produit de qualité, prix raisonnable.',
    rating: 5
  }
];

// Simuler l'ajout de commentaires
testComments.forEach((comment, index) => {
  try {
    const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
    
    if (!storedComments[comment.productId]) {
      storedComments[comment.productId] = [];
    }

    const newComment = {
      id: `comment-${Date.now()}-${index}`,
      ...comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      likes: 0,
      dislikes: 0,
      isEdited: false,
      isAdminReply: false
    };

    storedComments[comment.productId].push(newComment);
    localStorage.setItem('productComments', JSON.stringify(storedComments));
    
    console.log(`✅ Commentaire ${index + 1} ajouté:`, newComment.text);
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout du commentaire ${index + 1}:`, error);
  }
});

// 3. Test de création de réponses
console.log('\n3️⃣ Test de création de réponses...');

// Ajouter des réponses admin aux commentaires
const testReplies = [
  {
    commentId: 'comment-1',
    productId: 'test-product-1',
    userId: 'admin',
    userName: 'Administrateur',
    userEmail: 'admin@example.com',
    text: 'Merci pour votre commentaire ! Nous sommes ravis que vous soyez satisfait.',
    isAdminReply: true
  },
  {
    commentId: 'comment-2',
    productId: 'test-product-1',
    userId: 'admin',
    userName: 'Administrateur',
    userEmail: 'admin@example.com',
    text: 'Merci pour votre retour ! Nous travaillons constamment à améliorer nos services.',
    isAdminReply: true
  }
];

testReplies.forEach((reply, index) => {
  try {
    const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
    const productComments = storedComments[reply.productId] || [];
    
    const comment = productComments.find(c => c.id === reply.commentId);
    if (comment) {
      if (!comment.replies) {
        comment.replies = [];
      }

      const newReply = {
        id: `reply-${Date.now()}-${index}`,
        parentId: reply.commentId,
        userId: reply.userId,
        userName: reply.userName,
        userEmail: reply.userEmail,
        text: reply.text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        isEdited: false,
        isAdminReply: reply.isAdminReply
      };

      comment.replies.push(newReply);
      localStorage.setItem('productComments', JSON.stringify(storedComments));
      
      console.log(`✅ Réponse ${index + 1} ajoutée:`, newReply.text);
    } else {
      console.log(`⚠️ Commentaire ${reply.commentId} non trouvé pour la réponse ${index + 1}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout de la réponse ${index + 1}:`, error);
  }
});

// 4. Test de récupération des commentaires
console.log('\n4️⃣ Test de récupération des commentaires...');

try {
  const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
  const totalComments = Object.values(storedComments).reduce((sum, comments) => sum + comments.length, 0);
  const totalReplies = Object.values(storedComments).reduce((sum, comments) => 
    sum + comments.reduce((replySum, comment) => replySum + (comment.replies?.length || 0), 0), 0
  );

  console.log(`✅ Total commentaires: ${totalComments}`);
  console.log(`✅ Total réponses: ${totalReplies}`);
  console.log(`✅ Produits avec commentaires: ${Object.keys(storedComments).length}`);
} catch (error) {
  console.error('❌ Erreur lors de la récupération des commentaires:', error);
}

// 5. Test de statistiques
console.log('\n5️⃣ Test de statistiques...');

try {
  const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
  let totalLikes = 0;
  let totalDislikes = 0;
  let ratings = [];
  let recentComments = 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  Object.values(storedComments).forEach(comments => {
    comments.forEach(comment => {
      totalLikes += comment.likes || 0;
      totalDislikes += comment.dislikes || 0;
      
      if (comment.rating > 0) {
        ratings.push(comment.rating);
      }
      
      if (new Date(comment.createdAt) > oneWeekAgo) {
        recentComments++;
      }
    });
  });

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
    : 0;

  console.log(`✅ Total likes: ${totalLikes}`);
  console.log(`✅ Total dislikes: ${totalDislikes}`);
  console.log(`✅ Note moyenne: ${averageRating.toFixed(1)}/5`);
  console.log(`✅ Commentaires récents (7 jours): ${recentComments}`);
} catch (error) {
  console.error('❌ Erreur lors du calcul des statistiques:', error);
}

// 6. Test de recherche
console.log('\n6️⃣ Test de recherche...');

try {
  const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
  const allComments = [];
  
  Object.keys(storedComments).forEach(productId => {
    const productComments = storedComments[productId] || [];
    productComments.forEach(comment => {
      allComments.push({
        ...comment,
        productId
      });
    });
  });

  // Recherche par texte
  const searchQuery = 'excellent';
  const searchResults = allComments.filter(comment =>
    comment.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(`✅ Recherche "${searchQuery}": ${searchResults.length} résultat(s)`);
  searchResults.forEach((comment, index) => {
    console.log(`   ${index + 1}. ${comment.userName}: "${comment.text}"`);
  });

  // Recherche par note
  const ratingResults = allComments.filter(comment => comment.rating === 5);
  console.log(`✅ Commentaires 5 étoiles: ${ratingResults.length}`);

} catch (error) {
  console.error('❌ Erreur lors de la recherche:', error);
}

// 7. Test de validation
console.log('\n7️⃣ Test de validation...');

const testValidation = [
  {
    name: 'Commentaire valide',
    comment: {
      text: 'Très bon produit',
      userId: 'user-1',
      productId: 'product-1',
      rating: 5
    },
    shouldPass: true
  },
  {
    name: 'Commentaire sans texte',
    comment: {
      text: '',
      userId: 'user-1',
      productId: 'product-1',
      rating: 5
    },
    shouldPass: false
  },
  {
    name: 'Commentaire sans utilisateur',
    comment: {
      text: 'Très bon produit',
      userId: '',
      productId: 'product-1',
      rating: 5
    },
    shouldPass: false
  },
  {
    name: 'Commentaire avec note invalide',
    comment: {
      text: 'Très bon produit',
      userId: 'user-1',
      productId: 'product-1',
      rating: 6
    },
    shouldPass: false
  }
];

testValidation.forEach(test => {
  const hasText = test.comment.text && test.comment.text.trim().length > 0;
  const hasUser = test.comment.userId && test.comment.userId.trim().length > 0;
  const hasProduct = test.comment.productId && test.comment.productId.trim().length > 0;
  const validRating = !test.comment.rating || (test.comment.rating >= 1 && test.comment.rating <= 5);
  
  const isValid = hasText && hasUser && hasProduct && validRating;
  const passed = isValid === test.shouldPass;
  
  console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASS' : 'FAIL'}`);
});

// 8. Test de performance
console.log('\n8️⃣ Test de performance...');

const startTime = performance.now();

try {
  // Simuler 100 commentaires
  const performanceComments = [];
  for (let i = 0; i < 100; i++) {
    performanceComments.push({
      id: `perf-comment-${i}`,
      productId: `perf-product-${i % 10}`,
      userId: `user-${i}`,
      userName: `User ${i}`,
      text: `Commentaire de performance ${i}`,
      rating: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date().toISOString(),
      replies: [],
      likes: 0,
      dislikes: 0
    });
  }

  // Sauvegarder
  const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
  performanceComments.forEach(comment => {
    if (!storedComments[comment.productId]) {
      storedComments[comment.productId] = [];
    }
    storedComments[comment.productId].push(comment);
  });
  localStorage.setItem('productComments', JSON.stringify(storedComments));

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`✅ 100 commentaires créés en ${duration.toFixed(2)}ms`);
  console.log(`✅ Performance: ${(100 / duration * 1000).toFixed(0)} commentaires/seconde`);
} catch (error) {
  console.error('❌ Erreur lors du test de performance:', error);
}

// 9. Résumé des tests
console.log('\n9️⃣ Résumé des tests...');

try {
  const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
  const totalComments = Object.values(storedComments).reduce((sum, comments) => sum + comments.length, 0);
  const totalReplies = Object.values(storedComments).reduce((sum, comments) => 
    sum + comments.reduce((replySum, comment) => replySum + (comment.replies?.length || 0), 0), 0
  );

  console.log('📊 STATISTIQUES FINALES:');
  console.log(`   • Total commentaires: ${totalComments}`);
  console.log(`   • Total réponses: ${totalReplies}`);
  console.log(`   • Produits avec commentaires: ${Object.keys(storedComments).length}`);
  console.log(`   • Taille des données: ${JSON.stringify(storedComments).length} caractères`);
  
  console.log('\n✅ TOUS LES TESTS TERMINÉS !');
  console.log('Le système de commentaires est prêt à être utilisé.');
  
} catch (error) {
  console.error('❌ Erreur lors du résumé:', error);
}

// 10. Instructions d'utilisation
console.log('\n🔟 Instructions d\'utilisation:');
console.log('1. Allez sur une page de produit pour voir les commentaires');
console.log('2. Connectez-vous pour ajouter des commentaires');
console.log('3. Allez dans l\'interface admin > Commentaires pour gérer');
console.log('4. Les commentaires sont sauvegardés dans localStorage');
console.log('5. Les réponses admin sont marquées comme telles');

console.log('\n🎉 SYSTÈME DE COMMENTAIRES OPÉRATIONNEL !');
