import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Edit, 
  Trash2,
  Star,
  User,
  Clock,
  CheckCircle
} from 'lucide-react';

const CommentSection = ({ productId, productName }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Charger les commentaires depuis localStorage
  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = () => {
    try {
      const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
      const productComments = storedComments[productId] || [];
      setComments(productComments);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      setComments([]);
    }
  };

  const saveComments = (updatedComments) => {
    try {
      const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
      storedComments[productId] = updatedComments;
      localStorage.setItem('productComments', JSON.stringify(storedComments));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des commentaires:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const comment = {
        id: Date.now().toString(),
        productId,
        userId: user.id || user._id,
        userName: user.firstName || user.name || 'Utilisateur',
        userEmail: user.email,
        text: newComment.trim(),
        rating: rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        replies: [],
        likes: 0,
        dislikes: 0,
        isEdited: false,
        isAdminReply: false
      };

      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      saveComments(updatedComments);
      setNewComment('');
      setRating(0);
      
      console.log('✅ Commentaire ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId, replyText) => {
    if (!replyText.trim() || !user) return;

    const reply = {
      id: Date.now().toString(),
      parentId,
      userId: user.id || user._id,
      userName: user.firstName || user.name || 'Utilisateur',
      userEmail: user.email,
      text: replyText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      isEdited: false,
      isAdminReply: user.role === 'admin'
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply]
        };
      }
      return comment;
    });

    setComments(updatedComments);
    saveComments(updatedComments);
    setReplyTo(null);
    
    console.log('✅ Réponse ajoutée avec succès');
  };

  const handleEditComment = (commentId, newText) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          text: newText,
          updatedAt: new Date().toISOString(),
          isEdited: true
        };
      }
      return comment;
    });

    setComments(updatedComments);
    saveComments(updatedComments);
    setEditingComment(null);
    setEditText('');
    
    console.log('✅ Commentaire modifié avec succès');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      saveComments(updatedComments);
      
      console.log('✅ Commentaire supprimé avec succès');
    }
  };

  const handleLike = (commentId) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likes + 1
        };
      }
      return comment;
    });

    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const handleDislike = (commentId) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          dislikes: comment.dislikes + 1
        };
      }
      return comment;
    });

    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderComment = (comment, isReply = false) => {
    const isOwner = user && (user.id === comment.userId || user._id === comment.userId);
    const isAdmin = user && user.role === 'admin';

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
        <div className={`bg-white rounded-lg p-4 shadow-sm border ${
          comment.isAdminReply ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {comment.userName}
                    {comment.isAdminReply && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                  {comment.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      {renderStars(comment.rating)}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-400">(modifié)</span>
                  )}
                </div>
              </div>
            </div>
            
            {(isOwner || isAdmin) && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditText(comment.text);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {editingComment === comment.id ? (
            <div className="mt-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Modifier votre commentaire..."
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditText('');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleEditComment(comment.id, editText)}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-gray-800">{comment.text}</p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(comment.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm">{comment.dislikes}</span>
                  </button>
                </div>
                
                {!isReply && (
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    <span className="text-sm">Répondre</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Réponses */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}

          {/* Formulaire de réponse */}
          {replyTo === comment.id && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <form onSubmit={(e) => {
                e.preventDefault();
                const replyText = e.target.replyText.value;
                if (replyText.trim()) {
                  handleReply(comment.id, replyText);
                }
              }}>
                <textarea
                  name="replyText"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Écrire une réponse..."
                  required
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Répondre
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connectez-vous pour commenter
          </h3>
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour laisser un commentaire sur ce produit.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Commentaires et Avis
        </h3>
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
          {comments.length}
        </span>
      </div>

      {/* Formulaire de nouveau commentaire */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre avis sur {productName}
          </label>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-600">Note :</span>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className={`h-6 w-6 ${
                    i < rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  <Star className="h-full w-full fill-current" />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating > 0 ? `${rating}/5` : 'Aucune note'}
            </span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Partagez votre expérience avec ce produit..."
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? 'Envoi...' : 'Publier'}</span>
          </button>
        </div>
      </form>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Aucun commentaire pour ce produit. Soyez le premier à donner votre avis !
            </p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
