import { useState, useEffect } from 'react';
import axios from 'axios';

const CommentsTable = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/comments/details');
        setComments(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Commentaires des utilisateurs
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Commentaire
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Utilisateur
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Localisation
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Catégorie
            </h5>
          </div>
        </div>

        {/* Ajout du défilement ici */}
        <div className="overflow-y-auto max-h-96">  {/* max-h-96 limite la hauteur du conteneur */}
          {comments.map((comment, index) => (
            <div
              className={`grid grid-cols-4 sm:grid-cols-5 ${
                index === comments.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={index}
            >
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{comment.reviews_text}</p>
              </div>

              <div className="p-2.5 text-center xl:p-5">
                <p className="text-black dark:text-white">{comment.reviews_username}</p>
              </div>

              <div className="p-2.5 text-center xl:p-5">
                <p className="text-black dark:text-white">{comment.reviews_user_city}</p>
              </div>

              <div className="p-2.5 text-center xl:p-5">
                <p className="text-black dark:text-white">{comment.categories}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsTable;
