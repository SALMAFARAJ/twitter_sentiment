import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';

// Définition des options pour le graphique
const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [], // Catégories mises à jour dynamiquement
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

const ChartTwo: React.FC = () => {
  const [state, setState] = useState({
    series: [
      { name: 'Positive Comments', data: [] },
      { name: 'Negative Comments', data: [] },
    ],
    categories: [], // Initialisation correcte des catégories
  });

  useEffect(() => {
    axios.get('http://localhost:5003/api/comments/count-categories')
      .then(response => {
        const data = response.data;
        console.log('Données récupérées de l\'API:', data);

        if (!Array.isArray(data) || data.length === 0) {
          console.warn('Aucune donnée disponible pour afficher le graphique.');
          return;
        }

        const categories = data.map(item => item.category || 'Non spécifié');
        const positiveComments = data.map(item => item.positive_comments || 0);
        const negativeComments = data.map(item => item.negative_comments || 0);

        setState({
          series: [
            { name: 'Positive Comments', data: positiveComments },
            { name: 'Negative Comments', data: negativeComments },
          ],
          categories: categories,
        });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des statistiques:', error.response?.data || error.message);
      });
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Commentaires positifs et négatifs cette semaine
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={{ 
              ...options, 
              xaxis: { categories: state.categories || [] } // Mise à jour des catégories dynamiques
            }}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
