// src/components/AuthDebug.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const AuthDebug = () => {
  const { user, token } = useContext(AuthContext);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-6">
      <h3 className="font-bold mb-2">Authentication Debug</h3>
      <div>
        <p><strong>Logged in:</strong> {user ? 'Yes' : 'No'}</p>
        {user && (
          <div>
            <p><strong>User ID:</strong> {user.userId}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Token exists:</strong> {token ? 'Yes' : 'No'}</p>
            <p><strong>Token prefix:</strong> {token && token.substring(0, 20)}...</p>
          </div>
        )}
      </div>
    </div>
  );
};