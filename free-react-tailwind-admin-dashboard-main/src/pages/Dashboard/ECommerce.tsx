import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import MapOne from '../../components/Maps/MapOne';
import TableOne from '../../components/Tables/TableOne';
import axios from 'axios';

interface Statistics {
  totalComments: number;
  totalCategories: number;
  positiveComments: number;
  negativeComments: number;
}

const ECommerce: React.FC = () => {
  const [stats, setStats] = useState<Statistics>({
    totalComments: 0,
    totalCategories: 0,
    positiveComments: 0,
    negativeComments: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/comments/statistics');
        const data = response.data;

        setStats({
          totalComments: data.total_comments || 0,
          totalCategories: data.total_categories || 0,
          positiveComments: data.positive_comments || 0,
          negativeComments: data.negative_comments || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics. Please try again later.');
      }
    };

    fetchStatistics();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Total Comments */}
        <CardDataStats
          title="Total Comments"
          total={stats.totalComments.toString()}
          rate="0.43%"
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#007bff"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M8 12h8v2H8zm0-4h8v2H8z" />
          </svg>
        </CardDataStats>

        {/* Total Categories */}
        <CardDataStats
          title="Total Categories"
          total={stats.totalCategories.toString()}
          rate="4.35%"
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#28a745"
            className="w-6 h-6"
          >
            <path d="M3 13h8v-2H3v2zm10 0h8v-2h-8v2zM3 17h8v-2H3v2zm10 0h8v-2h-8v2zM3 9h18V7H3v2zm0-4h18V3H3v2z" />
          </svg>
        </CardDataStats>

        {/* Positive Comments */}
        <CardDataStats
          title="Positive Comments"
          total={stats.positiveComments.toString()}
          rate="2.59%"
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(0, 128, 0, 0.5)"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zM12 17.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
          </svg>
        </CardDataStats>

        {/* Negative Comments */}
        <CardDataStats
          title="Negative Comments"
          total={stats.negativeComments.toString()}
          rate="5.88%"
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(255, 0, 0, 0.5)"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zM12 15.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
          </svg>
        </CardDataStats>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
