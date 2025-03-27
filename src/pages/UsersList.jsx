import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, X, Edit, Trash2, Loader2 } from 'lucide-react';

function UsersList({ setIsAuthenticated }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://reqres.in/api/users?page=${currentPage}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        setUsers(data.data || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
    setActionMessage({ type: '', text: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setActionMessage({ type: '', text: '' });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`https://reqres.in/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
     
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData } 
          : user
      ));
      
      setActionMessage({ 
        type: 'success', 
        text: `User ${formData.first_name} ${formData.last_name} updated successfully!` 
      });
      
      setTimeout(() => {
        setEditingUser(null);
        setActionMessage({ type: '', text: '' });
      }, 1000);
      
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (user) => {
    setShowConfirmDelete(user);
  };

  const handleDeleteCancel = () => {
    setShowConfirmDelete(null);
  };

  const handleDeleteClick = async (user) => {
    setShowConfirmDelete(null);
    setLoading(true);
    
    try {
      const response = await fetch(`https://reqres.in/api/users/${user.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete user');
      }
      
      // Remove user from local state
      setUsers(users.filter(u => u.id !== user.id));
      
      setActionMessage({ 
        type: 'success', 
        text: `User ${user.first_name} ${user.last_name} deleted successfully!` 
      });
      
      setTimeout(() => {
        setActionMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-xl text-gray-600 font-medium">Loading users...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center text-red-500 mb-6">
            <AlertCircle className="h-8 w-8 mr-3" />
            <h2 className="text-xl font-bold">An error occurred</h2>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition duration-200"
          >
            Go back to login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
            <p className="text-gray-500 mt-1">Manage your team members</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-sm flex items-center gap-2 transition duration-200"
            >
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {actionMessage.text && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 px-4 py-3 rounded-lg shadow-sm flex items-center justify-between ${
                actionMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center">
                {actionMessage.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <span>{actionMessage.text}</span>
              </div>
              <button 
                onClick={() => setActionMessage({ type: '', text: '' })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingUser && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={handleCancelEdit}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                  <button 
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {actionMessage.text && actionMessage.type === 'error' && (
                  <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{actionMessage.text}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmitEdit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 font-medium flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showConfirmDelete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={handleDeleteCancel}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete {showConfirmDelete.first_name} {showConfirmDelete.last_name}? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteClick(showConfirmDelete)}
                    className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 font-medium"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users List Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          {/* Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                   
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <motion.tr 
                        key={user.id} 
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                src={user.avatar} 
                                alt={`${user.first_name} ${user.last_name}`} 
                                className="h-10 w-10 rounded-full object-cover shadow"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditClick(user)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteConfirm(user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm">Try adjusting your search query</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card View for Mobile */}
          <div className="md:hidden">
            {filteredUsers.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.div 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.avatar} 
                          alt={`${user.first_name} ${user.last_name}`} 
                          className="h-12 w-12 rounded-full object-cover shadow"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                          <div className="mt-1">
                            <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditClick(user)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full"
                        >
                          <Edit className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteConfirm(user)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <Search className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-sm">Try adjusting your search query</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {loading && users.length > 0 && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center text-gray-600 px-4 py-2 bg-white rounded-lg shadow-sm">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              <span>Loading...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-700 text-center sm:text-left">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
          
          <div className="flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-lg border text-sm font-medium ${
                  currentPage <= 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-lg border text-sm font-medium ${
                  currentPage >= totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList; 