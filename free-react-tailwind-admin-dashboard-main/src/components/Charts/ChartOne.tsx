import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { ApexOptions } from 'apexcharts';

const options: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 350,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ['#3C50E0'],
  xaxis: {
    type: 'category',
    categories: [], // categories seront mises à jour dynamiquement
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
  },
  dataLabels: {
    enabled: false,
  },
};

interface CommentData {
  date: string;
  count: number;
}

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: 'Comments',
      data: [],
    },
  ]);
  
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Ajouter un état de chargement
  const [error, setError] = useState<string | null>(null); // Ajouter un état d'erreur

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Démarrer le chargement
        const response = await axios.get('http://localhost:5003/api/comments');
        
        // Vérifiez la réponse
        console.log('Données de l\'API:', response.data);

        const data = response.data;

        // Assurez-vous que la structure de données est correcte
        if (!Array.isArray(data) || data.length === 0) {
          setError('Aucune donnée disponible');
          setLoading(false);
          return;
        }

        const sortedDates = data.map((item: CommentData) => item.date);
        const commentCounts = data.map((item: CommentData) => item.count);

        setDates(sortedDates);
        setSeries([{
          name: 'Comments',
          data: commentCounts,
        }]);

        setLoading(false); // Fin du chargement
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div>
        <ReactApexChart
          options={{ ...options, xaxis: { ...options.xaxis, categories: dates } }}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOne;
