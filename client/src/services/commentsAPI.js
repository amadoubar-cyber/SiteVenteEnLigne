// Service API pour la gestion des commentaires
// Utilise localStorage pour la persistance des données

const COMMENTS_STORAGE_KEY = 'productComments';

// Fonction utilitaire pour récupérer les commentaires depuis localStorage
const getStoredComments = () => {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || '{}');
  } catch (error) {
    console.error('Erreur lors de la lecture des commentaires:', error);
    return {};
  }
};

// Fonction utilitaire pour sauvegarder les commentaires dans localStorage
const saveStoredComments = (comments) => {
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des commentaires:', error);
    return false;
  }
};

// Fonction utilitaire pour générer un ID unique
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Fonction utilitaire pour formater la date
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// Fonction utilitaire pour valider un commentaire
const validateComment = (comment) => {
  const errors = [];
  
  if (!comment.text || comment.text.trim().length === 0) {
    errors.push('Le texte du commentaire est requis');
  }
  
  if (comment.text && comment.text.trim().length > 1000) {
    errors.push('Le commentaire ne peut pas dépasser 1000 caractères');
  }
  
  if (!comment.userId) {
    errors.push('L\'ID utilisateur est requis');
  }
  
  if (!comment.productId) {
    errors.push('L\'ID produit est requis');
  }
  
  if (comment.rating && (comment.rating < 1 || comment.rating > 5)) {
    errors.push('La note doit être entre 1 et 5');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Fonction utilitaire pour valider une réponse
const validateReply = (reply) => {
  const errors = [];
  
  if (!reply.text || reply.text.trim().length === 0) {
    errors.push('Le texte de la réponse est requis');
  }
  
  if (reply.text && reply.text.trim().length > 1000) {
    errors.push('La réponse ne peut pas dépasser 1000 caractères');
  }
  
  if (!reply.userId) {
    errors.push('L\'ID utilisateur est requis');
  }
  
  if (!reply.parentId) {
    errors.push('L\'ID du commentaire parent est requis');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// API des commentaires
export const commentsAPI = {
  // Récupérer tous les commentaires d'un produit
  getCommentsByProduct: async (productId) => {
    try {
      const comments = getStoredComments();
      const productComments = comments[productId] || [];
      
      return {
        success: true,
        data: {
          comments: productComments,
          total: productComments.length
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des commentaires',
        data: { comments: [], total: 0 }
      };
    }
  },

  // Récupérer tous les commentaires de tous les produits
  getAllComments: async () => {
    try {
      const comments = getStoredComments();
      const allComments = [];
      
      Object.keys(comments).forEach(productId => {
        const productComments = comments[productId] || [];
        productComments.forEach(comment => {
          allComments.push({
            ...comment,
            productId
          });
        });
      });
      
      return {
        success: true,
        data: {
          comments: allComments,
          total: allComments.length
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les commentaires:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des commentaires',
        data: { comments: [], total: 0 }
      };
    }
  },

  // Ajouter un commentaire
  addComment: async (commentData) => {
    try {
      const validation = validateComment(commentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Données invalides',
          errors: validation.errors
        };
      }

      const comments = getStoredComments();
      const productId = commentData.productId;
      
      if (!comments[productId]) {
        comments[productId] = [];
      }

      const newComment = {
        id: generateId(),
        productId: commentData.productId,
        userId: commentData.userId,
        userName: commentData.userName || 'Utilisateur',
        userEmail: commentData.userEmail || '',
        text: commentData.text.trim(),
        rating: commentData.rating || 0,
        createdAt: formatDate(new Date()),
        updatedAt: formatDate(new Date()),
        replies: [],
        likes: 0,
        dislikes: 0,
        isEdited: false,
        isAdminReply: false
      };

      comments[productId].push(newComment);
      
      if (saveStoredComments(comments)) {
        return {
          success: true,
          data: newComment
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la sauvegarde du commentaire'
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'ajout du commentaire'
      };
    }
  },

  // Ajouter une réponse à un commentaire
  addReply: async (replyData) => {
    try {
      const validation = validateReply(replyData);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Données invalides',
          errors: validation.errors
        };
      }

      const comments = getStoredComments();
      const productId = replyData.productId;
      
      if (!comments[productId]) {
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }

      const productComments = comments[productId];
      const parentComment = productComments.find(c => c.id === replyData.parentId);
      
      if (!parentComment) {
        return {
          success: false,
          error: 'Commentaire parent non trouvé'
        };
      }

      const newReply = {
        id: generateId(),
        parentId: replyData.parentId,
        userId: replyData.userId,
        userName: replyData.userName || 'Utilisateur',
        userEmail: replyData.userEmail || '',
        text: replyData.text.trim(),
        createdAt: formatDate(new Date()),
        updatedAt: formatDate(new Date()),
        likes: 0,
        dislikes: 0,
        isEdited: false,
        isAdminReply: replyData.isAdminReply || false
      };

      parentComment.replies = parentComment.replies || [];
      parentComment.replies.push(newReply);
      
      if (saveStoredComments(comments)) {
        return {
          success: true,
          data: newReply
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la sauvegarde de la réponse'
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'ajout de la réponse'
      };
    }
  },

  // Modifier un commentaire
  updateComment: async (commentId, productId, updateData) => {
    try {
      const comments = getStoredComments();
      
      if (!comments[productId]) {
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }

      const productComments = comments[productId];
      const commentIndex = productComments.findIndex(c => c.id === commentId);
      
      if (commentIndex === -1) {
        return {
          success: false,
          error: 'Commentaire non trouvé'
        };
      }

      const updatedComment = {
        ...productComments[commentIndex],
        ...updateData,
        updatedAt: formatDate(new Date()),
        isEdited: true
      };

      productComments[commentIndex] = updatedComment;
      
      if (saveStoredComments(comments)) {
        return {
          success: true,
          data: updatedComment
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la sauvegarde du commentaire'
        };
      }
    } catch (error) {
      console.error('Erreur lors de la modification du commentaire:', error);
      return {
        success: false,
        error: 'Erreur lors de la modification du commentaire'
      };
    }
  },

  // Supprimer un commentaire
  deleteComment: async (commentId, productId) => {
    try {
      const comments = getStoredComments();
      
      if (!comments[productId]) {
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }

      const productComments = comments[productId];
      const commentIndex = productComments.findIndex(c => c.id === commentId);
      
      if (commentIndex === -1) {
        return {
          success: false,
          error: 'Commentaire non trouvé'
        };
      }

      productComments.splice(commentIndex, 1);
      
      if (saveStoredComments(comments)) {
        return {
          success: true,
          message: 'Commentaire supprimé avec succès'
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la sauvegarde'
        };
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression du commentaire'
      };
    }
  },

  // Supprimer une réponse
  deleteReply: async (commentId, replyId, productId) => {
    try {
      const comments = getStoredComments();
      
      if (!comments[productId]) {
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }

      const productComments = comments[productId];
      const comment = productComments.find(c => c.id === commentId);
      
      if (!comment) {
        return {
          success: false,
          error: 'Commentaire non trouvé'
        };
      }

      if (!comment.replies) {
        return {
          success: false,
          error: 'Aucune réponse trouvée'
        };
      }

      const replyIndex = comment.replies.findIndex(r => r.id === replyId);
      
      if (replyIndex === -1) {
        return {
          success: false,
          error: 'Réponse non trouvée'
        };
      }

      comment.replies.splice(replyIndex, 1);
      
      if (saveStoredComments(comments)) {
        return {
          success: true,
          message: 'Réponse supprimée avec succès'
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la sauvegarde'
        };
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la réponse:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression de la réponse'
      };
    }
  },

  // Liker un commentaire
  likeComment: async (commentId, productId) => {
    try {
      const comments = getStoredComments();
      
      if (!comments[productId]) {
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }

      const productComments = comments[productId];
      const comment = productComments.find(c => c.id === commentId);
      
      if (!comment) {
        return {
          success: false,
          error: 'Commentaire non trouvé'
        };
      }

      comment.likes = (comment.likes || 0) + 1;
      
      if (saveStoredComments(comments)) {
        return {
          success: true,
          data: { likes: comment.likes }
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la sauvegarde'
        };
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      return {
        success: false,
        error: 'Erreur lors du like'
      };
    }
  },

  // Disliker un commentaire
  dislikeComment: async (commentId, productId) => {
    try {
      const comments = getStoredComments();
      
      if (!comments[productId]) {
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }

      const productComments = comments[productId];
      const comment = productComments.find(c => c.id === commentId);
      
      if (!comment) {
        return {
          success: false,
          error: 'Commentaire non trouvé'
        };
      }

      comment.dislikes = (comment.dislikes || 0) + 1;
      
      if (saveStoredComments(comments)) {
        return {
          success: true,
          data: { dislikes: comment.dislikes }
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la sauvegarde'
        };
      }
    } catch (error) {
      console.error('Erreur lors du dislike:', error);
      return {
        success: false,
        error: 'Erreur lors du dislike'
      };
    }
  },

  // Récupérer les statistiques des commentaires
  getCommentStats: async () => {
    try {
      const comments = getStoredComments();
      let totalComments = 0;
      let totalReplies = 0;
      let totalLikes = 0;
      let totalDislikes = 0;
      let ratings = [];
      let recentComments = 0;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      Object.keys(comments).forEach(productId => {
        const productComments = comments[productId] || [];
        totalComments += productComments.length;
        
        productComments.forEach(comment => {
          totalLikes += comment.likes || 0;
          totalDislikes += comment.dislikes || 0;
          
          if (comment.rating > 0) {
            ratings.push(comment.rating);
          }
          
          if (new Date(comment.createdAt) > oneWeekAgo) {
            recentComments++;
          }
          
          totalReplies += comment.replies ? comment.replies.length : 0;
        });
      });

      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;

      return {
        success: true,
        data: {
          totalComments,
          totalReplies,
          totalLikes,
          totalDislikes,
          averageRating: Math.round(averageRating * 10) / 10,
          recentComments,
          totalProducts: Object.keys(comments).length
        }
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        success: false,
        error: 'Erreur lors du calcul des statistiques',
        data: {
          totalComments: 0,
          totalReplies: 0,
          totalLikes: 0,
          totalDislikes: 0,
          averageRating: 0,
          recentComments: 0,
          totalProducts: 0
        }
      };
    }
  },

  // Rechercher des commentaires
  searchComments: async (query, filters = {}) => {
    try {
      const comments = getStoredComments();
      const allComments = [];
      
      Object.keys(comments).forEach(productId => {
        const productComments = comments[productId] || [];
        productComments.forEach(comment => {
          allComments.push({
            ...comment,
            productId
          });
        });
      });

      let filteredComments = allComments;

      // Filtre par recherche textuelle
      if (query) {
        const searchQuery = query.toLowerCase();
        filteredComments = filteredComments.filter(comment =>
          comment.text.toLowerCase().includes(searchQuery) ||
          comment.userName.toLowerCase().includes(searchQuery) ||
          (comment.userEmail && comment.userEmail.toLowerCase().includes(searchQuery))
        );
      }

      // Filtre par produit
      if (filters.productId) {
        filteredComments = filteredComments.filter(comment => 
          comment.productId === filters.productId
        );
      }

      // Filtre par note
      if (filters.rating) {
        filteredComments = filteredComments.filter(comment => 
          comment.rating === filters.rating
        );
      }

      // Filtre par date
      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        filteredComments = filteredComments.filter(comment => 
          new Date(comment.createdAt) >= dateFrom
        );
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        filteredComments = filteredComments.filter(comment => 
          new Date(comment.createdAt) <= dateTo
        );
      }

      // Filtre par statut
      if (filters.hasReplies) {
        filteredComments = filteredComments.filter(comment => 
          comment.replies && comment.replies.length > 0
        );
      }

      if (filters.isAdminReply) {
        filteredComments = filteredComments.filter(comment => 
          comment.replies && comment.replies.some(reply => reply.isAdminReply)
        );
      }

      return {
        success: true,
        data: {
          comments: filteredComments,
          total: filteredComments.length
        }
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return {
        success: false,
        error: 'Erreur lors de la recherche',
        data: { comments: [], total: 0 }
      };
    }
  }
};

export default commentsAPI;
