import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserOne from '../../images/user/user-01.png';
import UserTwo from '../../images/user/user-02.png';
import UserThree from '../../images/user/user-03.png';
import UserFour from '../../images/user/user-04.png';
import UserFive from '../../images/user/user-05.png';

const ChatCard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Récupération des données depuis le backend
    axios.get('http://localhost:5003/api/top-users')
      .then(response => setUsers(response.data.slice(0, 5))) // Limiter aux 5 premiers utilisateurs
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Top Users
      </h4>

      {/* Utilisateur 1 */}
      {users[0] && (
        <div className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="relative h-14 w-14 rounded-full">
            <img src={UserOne} alt="User 1" className="rounded-full" />
          </div>
          <div>
            <h5 className="font-medium text-black dark:text-white">
              {users[0].username}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {users[0].title}
            </p>
          </div>
        </div>
      )}

      {/* Utilisateur 2 */}
      {users[1] && (
        <div className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="relative h-14 w-14 rounded-full">
            <img src={UserTwo} alt="User 2" className="rounded-full" />
          </div>
          <div>
            <h5 className="font-medium text-black dark:text-white">
              {users[1].username}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {users[1].title}
            </p>
          </div>
        </div>
      )}

      {/* Utilisateur 3 */}
      {users[2] && (
        <div className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="relative h-14 w-14 rounded-full">
            <img src={UserThree} alt="User 3" className="rounded-full" />
          </div>
          <div>
            <h5 className="font-medium text-black dark:text-white">
              {users[2].username}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {users[2].title}
            </p>
          </div>
        </div>
      )}

      {/* Utilisateur 4 */}
      {users[3] && (
        <div className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="relative h-14 w-14 rounded-full">
            <img src={UserFour} alt="User 4" className="rounded-full" />
          </div>
          <div>
            <h5 className="font-medium text-black dark:text-white">
              {users[3].username}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {users[3].title}
            </p>
          </div>
        </div>
      )}

      {/* Utilisateur 5 */}
      {users[4] && (
        <div className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="relative h-14 w-14 rounded-full">
            <img src={UserFive} alt="User 5" className="rounded-full" />
          </div>
          <div>
            <h5 className="font-medium text-black dark:text-white">
              {users[4].username}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {users[4].title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatCard;
