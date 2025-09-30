import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Eye, 
  Reply, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Star,
  User,
  Clock,
  Package,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const AdminCommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    product: 'all',
    rating: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ 
    isOpen: false, 
    type: '', // 'comment' ou 'reply'
    commentId: null, 
    replyId: null,
    productId: null,
    text: ''
  });
  const [stats, setStats] = useState({
    totalComments: 0,
    totalReplies: 0,
    averageRating: 0,
    recentComments: 0,
    pendingReplies: 0
  });

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [comments, filters]);

  const loadComments = () => {
    try {
      const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
      const allComments = [];
      
      // Récupérer tous les commentaires de tous les produits
      Object.keys(storedComments).forEach(productId => {
        const productComments = storedComments[productId] || [];
        productComments.forEach(comment => {
          allComments.push({
            ...comment,
            productId,
            productName: getProductName(productId)
          });
        });
      });

      setComments(allComments);
      calculateStats(allComments);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    try {
      const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const product = products.find(p => p._id === productId || p.id === productId);
      return product ? product.name : `Produit ${productId}`;
    } catch (error) {
      return `Produit ${productId}`;
    }
  };

  const calculateStats = (commentsData) => {
    const totalComments = commentsData.length;
    const totalReplies = commentsData.reduce((sum, comment) => sum + (comment.replies?.length || 0), 0);
    const ratings = commentsData.filter(c => c.rating > 0).map(c => c.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentComments = commentsData.filter(c => new Date(c.createdAt) > oneWeekAgo).length;
    
    const pendingReplies = commentsData.filter(c => !c.isAdminReply && (!c.replies || c.replies.length === 0)).length;

    setStats({
      totalComments,
      totalReplies,
      averageRating: Math.round(averageRating * 10) / 10,
      recentComments,
      pendingReplies
    });
  };

  const applyFilters = () => {
    let filtered = [...comments];

    // Filtre par recherche
    if (filters.search) {
      filtered = filtered.filter(comment =>
        comment.text.toLowerCase().includes(filters.search.toLowerCase()) ||
        comment.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        comment.productName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtre par produit
    if (filters.product !== 'all') {
      filtered = filtered.filter(comment => comment.productId === filters.product);
    }

    // Filtre par note
    if (filters.rating !== 'all') {
      const ratingValue = parseInt(filters.rating);
      filtered = filtered.filter(comment => comment.rating === ratingValue);
    }

    // Filtre par statut
    if (filters.status === 'with_replies') {
      filtered = filtered.filter(comment => comment.replies && comment.replies.length > 0);
    } else if (filters.status === 'without_replies') {
      filtered = filtered.filter(comment => !comment.replies || comment.replies.length === 0);
    } else if (filters.status === 'admin_replies') {
      filtered = filtered.filter(comment => comment.replies && comment.replies.some(reply => reply.isAdminReply));
    }

    // Filtre par date
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        filtered = filtered.filter(comment => new Date(comment.createdAt) >= cutoffDate);
      }
    }

    setFilteredComments(filtered);
  };

  const handleReply = (commentId, productId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now().toString(),
      parentId: commentId,
      userId: 'admin',
      userName: 'Administrateur',
      userEmail: 'admin@example.com',
      text: replyText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      isEdited: false,
      isAdminReply: true
    };

    // Mettre à jour les commentaires
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    });

    setComments(updatedComments);
    
    // Sauvegarder dans localStorage
    const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
    const productComments = storedComments[productId] || [];
    const updatedProductComments = productComments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    });
    storedComments[productId] = updatedProductComments;
    localStorage.setItem('productComments', JSON.stringify(storedComments));

    setReplyText('');
    setSelectedComment(null);
    calculateStats(updatedComments);
    
    console.log('✅ Réponse admin ajoutée avec succès');
  };

  const handleDeleteComment = (commentId, productId) => {
    const comment = comments.find(c => c.id === commentId);
    setDeleteConfirm({
      isOpen: true,
      type: 'comment',
      commentId,
      replyId: null,
      productId,
      text: comment?.text || 'ce commentaire'
    });
  };

  const confirmDeleteComment = () => {
    const { commentId, productId } = deleteConfirm;
    
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    
    // Sauvegarder dans localStorage
    const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
    const productComments = storedComments[productId] || [];
    const updatedProductComments = productComments.filter(comment => comment.id !== commentId);
    storedComments[productId] = updatedProductComments;
    localStorage.setItem('productComments', JSON.stringify(storedComments));

    calculateStats(updatedComments);
    setDeleteConfirm({ isOpen: false, type: '', commentId: null, replyId: null, productId: null, text: '' });
    console.log('✅ Commentaire supprimé avec succès');
  };

  const handleDeleteReply = (commentId, replyId, productId) => {
    const comment = comments.find(c => c.id === commentId);
    const reply = comment?.replies?.find(r => r.id === replyId);
    
    setDeleteConfirm({
      isOpen: true,
      type: 'reply',
      commentId,
      replyId,
      productId,
      text: reply?.text || 'cette réponse'
    });
  };

  const confirmDeleteReply = () => {
    const { commentId, replyId, productId } = deleteConfirm;
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.filter(reply => reply.id !== replyId)
        };
      }
      return comment;
    });

    setComments(updatedComments);
    
    // Sauvegarder dans localStorage
    const storedComments = JSON.parse(localStorage.getItem('productComments') || '{}');
    const productComments = storedComments[productId] || [];
    const updatedProductComments = productComments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.filter(reply => reply.id !== replyId)
        };
      }
      return comment;
    });
    storedComments[productId] = updatedProductComments;
    localStorage.setItem('productComments', JSON.stringify(storedComments));

    calculateStats(updatedComments);
    setDeleteConfirm({ isOpen: false, type: '', commentId: null, replyId: null, productId: null, text: '' });
    console.log('✅ Réponse supprimée avec succès');
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

  const getUniqueProducts = () => {
    const products = [...new Set(comments.map(c => c.productId))];
    return products.map(productId => ({
      id: productId,
      name: getProductName(productId)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des Commentaires
              </h1>
              <p className="text-gray-600">
                Gérez les commentaires et réponses des clients
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredComments.length} commentaire(s)
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Commentaires</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Reply className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Réponses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReplies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Cette Semaine</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentComments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReplies}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rechercher..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produit
            </label>
            <select
              value={filters.product}
              onChange={(e) => setFilters({...filters, product: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les produits</option>
              {getUniqueProducts().map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="with_replies">Avec réponses</option>
              <option value="without_replies">Sans réponses</option>
              <option value="admin_replies">Avec réponses admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des commentaires */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Commentaires ({filteredComments.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredComments.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun commentaire trouvé</p>
            </div>
          ) : (
            filteredComments.map(comment => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.userName}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {comment.productName}
                        </span>
                        {comment.rating > 0 && (
                          <>
                            <span className="text-sm text-gray-500">•</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(comment.rating)}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(comment.createdAt)}</span>
                        {comment.isEdited && (
                          <span className="text-xs text-gray-400">(modifié)</span>
                        )}
                      </div>
                      
                      <p className="text-gray-800 mb-4">{comment.text}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{comment.dislikes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedComment(comment.id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Répondre</span>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id, comment.productId)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>

                {/* Réponses */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-14 mt-4 space-y-3">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className={`p-4 rounded-lg ${
                        reply.isAdminReply ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              reply.isAdminReply ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <User className={`h-4 w-4 ${
                                reply.isAdminReply ? 'text-blue-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {reply.userName}
                                </span>
                                {reply.isAdminReply && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-gray-800">{reply.text}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteReply(comment.id, reply.id, comment.productId)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulaire de réponse */}
                {selectedComment === comment.id && (
                  <div className="ml-14 mt-4 p-4 bg-gray-50 rounded-lg">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleReply(comment.id, comment.productId);
                    }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Écrire une réponse en tant qu'administrateur..."
                        required
                      />
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedComment(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Répondre
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: '', commentId: null, replyId: null, productId: null, text: '' })}
        onConfirm={deleteConfirm.type === 'comment' ? confirmDeleteComment : confirmDeleteReply}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer ${deleteConfirm.text} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
};

export default AdminCommentManagement;
