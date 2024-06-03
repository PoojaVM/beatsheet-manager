import React, { useState, useEffect } from 'react';
import beatSheetApi from '../api';

const BeatSheets = () => {
  const [beatSheets, setBeatSheets] = useState([]);

  useEffect(() => {
    const fetchBeatSheets = async () => {
      try {
        const data = await beatSheetApi.getBeatSheets();
        setBeatSheets(data.beatSheets);
        console.log('Beat sheets: ', data);
      } catch (error) {
        console.error('Error fetching beat sheets: ', error);
      }
    };

    fetchBeatSheets();
  }, []);

  return (
    <div>
      <h1>Beat Sheets</h1>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" class="px-6 py-3">
                      Name
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Description
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Completed
                  </th>
                  <th scope="col" class="px-6 py-3 text-right">
                      Actions
                  </th>
              </tr>
          </thead>
          <tbody>
        {beatSheets.map((beatSheet) => (
          <tr key={beatSheet.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {beatSheet.title}
            </th>
            <td className="px-6 py-4">
              {beatSheet.description}
            </td>
            <td className="px-6 py-4">
              {beatSheet.completed_at ? 'Yes' : 'No'}
            </td>
            <td className="px-6 py-4 text-right">
              <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2">View</button>
              <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
        </table>
      </div>
    </div>

  );
}

export default BeatSheets;