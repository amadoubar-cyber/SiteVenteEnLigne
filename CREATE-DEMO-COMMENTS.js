// Script pour créer des commentaires de démonstration
// Exécuter dans la console du navigateur

console.log('🎬 CRÉATION DE COMMENTAIRES DE DÉMONSTRATION');
console.log('==========================================');

// 1. Créer des commentaires de test
const demoComments = [
  {
    productId: 'demo-product-1',
    userId: 'user-1',
    userName: 'Fatou Camara',
    userEmail: 'fatou@example.com',
    text: 'Excellent ciment, très résistant. Je recommande vivement !',
    rating: 5
  },
  {
    productId: 'demo-product-1',
    userId: 'user-2',
    userName: 'Mamadou Diallo',
    userEmail: 'mamadou@example.com',
    text: 'Très bon rapport qualité-prix. Livraison rapide et soignée.',
    rating: 4
  },
  {
    productId: 'demo-product-2',
    userId: 'user-3',
    userName: 'Aminata Traoré',
    userEmail: 'aminata@example.com',
    text: 'Téléphone parfait, écran magnifique. Très satisfaite de mon achat !',
    rating: 5
  },
  {
    productId: 'demo-product-2',
    userId: 'user-4',
    userName: 'Ibrahima Sall',
    userEmail: 'ibrahima@example.com',
    text: 'Bon téléphone mais la batterie se décharge un peu vite.',
    rating: 3
  },
  {
    productId: 'demo-product-3',
    userId: 'user-5',
    userName: 'Mariama Ba',
    userEmail: 'mariama@example.com',
    text: 'Tuyau de qualité, parfait pour l\'irrigation de mon jardin.',
    rating: 5
  },
  {
    productId: 'demo-product-3',
    userId: 'user-6',
    userName: 'Ousmane Diop',
    userEmail: 'ousmane@example.com',
    text: 'Très satisfait, installation facile et résistant.',
    rating: 4
  }
];

// 2. Créer des réponses admin
const demoReplies = [
  {
    commentId: 'comment-1',
    productId: 'demo-product-1',
    userId: 'admin',
    userName: 'Administrateur',
    userEmail: 'admin@example.com',
    text: 'Merci Fatou ! Nous sommes ravis que vous soyez satisfaite de notre ciment.',
    isAdminReply: true
  },
  {
    commentId: 'comment-2',
    productId: 'demo-product-1',
    userId: 'admin',
    userName: 'Administrateur',
    userEmail: 'admin@example.com',
    text: 'Merci Mamadou ! Nous nous efforçons de maintenir la qualité et la rapidité de livraison.',
    isAdminReply: true
  },
  {
    commentId: 'comment-4',
    productId: 'demo-product-2',
    userId: 'admin',
    userName: 'Administrateur',
    userEmail: 'admin@example.com',
    text: 'Merci pour votre retour Ibrahima. Nous avons noté votre remarque sur la batterie.',
    isAdminReply: true
  }
];

// 3. Fonction pour créer un commentaire
function createComment(commentData, index) {
  const comment = {
    id: `comment-${index + 1}`,
    ...commentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: [],
    likes: Math.floor(Math.random() * 10),
    dislikes: Math.floor(Math.random() * 3),
    isEdited: false,
    isAdminReply: false
  };
  return comment;
}

// 4. Fonction pour créer une réponse
function createReply(replyData, index) {
  const reply = {
    id: `reply-${index + 1}`,
    parentId: replyData.commentId,
    userId: replyData.userId,
    userName: replyData.userName,
    userEmail: replyData.userEmail,
    text: replyData.text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    isEdited: false,
    isAdminReply: replyData.isAdminReply
  };
  return reply;
}

// 5. Créer et sauvegarder les données
console.log('\n1️⃣ Création des commentaires de démonstration...');

try {
  // Initialiser la structure
  const storedComments = {};
  
  // Créer les commentaires
  demoComments.forEach((commentData, index) => {
    const comment = createComment(commentData, index);
    
    if (!storedComments[comment.productId]) {
      storedComments[comment.productId] = [];
    }
    
    storedComments[comment.productId].push(comment);
  });
  
  // Ajouter les réponses
  demoReplies.forEach((replyData, index) => {
    const reply = createReply(replyData, index);
    const productComments = storedComments[replyData.productId];
    
    if (productComments) {
      const comment = productComments.find(c => c.id === replyData.commentId);
      if (comment) {
        comment.replies.push(reply);
      }
    }
  });
  
  // Sauvegarder dans localStorage
  localStorage.setItem('productComments', JSON.stringify(storedComments));
  
  console.log('✅ Commentaires de démonstration créés avec succès !');
  
} catch (error) {
  console.error('❌ Erreur lors de la création des commentaires:', error);
}

// 6. Afficher les statistiques
console.log('\n2️⃣ Statistiques des commentaires créés...');

try {
  const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
  
  let totalComments = 0;
  let totalReplies = 0;
  let totalLikes = 0;
  let totalDislikes = 0;
  let ratings = [];
  
  Object.values(storedComments).forEach(comments => {
    totalComments += comments.length;
    
    comments.forEach(comment => {
      totalLikes += comment.likes || 0;
      totalDislikes += comment.dislikes || 0;
      
      if (comment.rating > 0) {
        ratings.push(comment.rating);
      }
      
      totalReplies += comment.replies ? comment.replies.length : 0;
    });
  });
  
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
    : 0;
  
  console.log('📊 STATISTIQUES:');
  console.log(`   • Total commentaires: ${totalComments}`);
  console.log(`   • Total réponses: ${totalReplies}`);
  console.log(`   • Total likes: ${totalLikes}`);
  console.log(`   • Total dislikes: ${totalDislikes}`);
  console.log(`   • Note moyenne: ${averageRating.toFixed(1)}/5`);
  console.log(`   • Produits avec commentaires: ${Object.keys(storedComments).length}`);
  
} catch (error) {
  console.error('❌ Erreur lors du calcul des statistiques:', error);
}

// 7. Afficher les commentaires par produit
console.log('\n3️⃣ Commentaires créés par produit...');

try {
  const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
  
  Object.keys(storedComments).forEach(productId => {
    const comments = storedComments[productId];
    
    console.log(`\n📦 Produit ${productId}:`);
    console.log(`   • ${comments.length} commentaire(s)`);
    
    comments.forEach((comment, index) => {
      console.log(`   ${index + 1}. ${comment.userName} (${comment.rating}/5): "${comment.text}"`);
      
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply, replyIndex) => {
          const prefix = reply.isAdminReply ? '   👨‍💼 Admin:' : '   👤 Client:';
          console.log(`   ${prefix} "${reply.text}"`);
        });
      }
    });
  });
  
} catch (error) {
  console.error('❌ Erreur lors de l\'affichage des commentaires:', error);
}

// 8. Instructions pour tester
console.log('\n4️⃣ Instructions pour tester...');

console.log('🎯 POUR VOIR LES COMMENTAIRES DANS L\'ADMIN:');
console.log('');
console.log('1️⃣ RÉFRÉCHIR LA PAGE:');
console.log('   • Actualisez la page admin');
console.log('   • Vous devriez voir "Commentaires" dans le menu');
console.log('');
console.log('2️⃣ CLIQUER SUR "COMMENTAIRES":');
console.log('   • Cliquez sur "Commentaires" dans le menu de gauche');
console.log('   • Vous verrez l\'interface de gestion des commentaires');
console.log('');
console.log('3️⃣ VOIR LES STATISTIQUES:');
console.log('   • Total commentaires: 6');
console.log('   • Total réponses: 3');
console.log('   • Note moyenne: 4.3/5');
console.log('');
console.log('4️⃣ TESTER LES FONCTIONNALITÉS:');
console.log('   • Voir tous les commentaires');
console.log('   • Répondre aux commentaires');
console.log('   • Utiliser les filtres');
console.log('   • Rechercher des commentaires');
console.log('');
console.log('5️⃣ TESTER CÔTÉ CLIENT:');
console.log('   • Allez sur une page produit');
console.log('   • Voir la section commentaires');
console.log('   • Ajouter un nouveau commentaire');

// 9. Message final
console.log('\n🎉 COMMENTAIRES DE DÉMONSTRATION CRÉÉS !');
console.log('=====================================');
console.log('');
console.log('✅ Les commentaires sont maintenant disponibles dans l\'admin');
console.log('✅ Vous pouvez les voir en cliquant sur "Commentaires"');
console.log('✅ Vous pouvez répondre aux commentaires des clients');
console.log('✅ Vous pouvez gérer tous les commentaires');
console.log('');
console.log('🚀 Le système de commentaires est prêt à être utilisé !');

// 10. Afficher un résumé visuel
console.log('\n📋 RÉSUMÉ VISUEL:');
console.log('┌─────────────────────────────────────┐');
console.log('│  💬 COMMENTAIRES DE DÉMONSTRATION   │');
console.log('├─────────────────────────────────────┤');
console.log('│  ✅ 6 commentaires créés            │');
console.log('│  ✅ 3 réponses admin                │');
console.log('│  ✅ 3 produits avec commentaires    │');
console.log('│  ✅ Notes de 3 à 5 étoiles          │');
console.log('│  ✅ Likes et dislikes aléatoires    │');
console.log('│  ✅ Prêts pour l\'interface admin    │');
console.log('└─────────────────────────────────────┘');

console.log('\n🎯 MAINTENANT VOUS POUVEZ:');
console.log('1. Aller dans l\'admin > Commentaires');
console.log('2. Voir tous les commentaires');
console.log('3. Répondre aux commentaires');
console.log('4. Gérer les commentaires');
console.log('5. Tester les filtres et recherche');

console.log('\n🎉 SYSTÈME PRÊT !');
