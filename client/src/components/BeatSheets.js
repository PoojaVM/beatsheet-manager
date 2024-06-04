import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import beatSheetApi from "../api";
import EditFormModal from "./EditModal";
import Pagination from "./Pagination";
import { CloseIcon, SearchIcon } from "../assets";
import useDebouncedInput from "../hooks/useDebouncedInput";
import ConfirmationModal from "./ConfirmationModal";
import Notify from "./Notify";

const DropdownForm = React.memo(({ onSearch }) => {
  const {
    inputValue: search,
    setInputValue: setSearch,
    debouncedValue: debouncedSearch,
  } = useDebouncedInput();

  const mounted = React.useRef(false);

  const onClear = () => {
    setSearch("");
  };

  React.useEffect(() => {
    if (mounted.current) {
      onSearch(debouncedSearch);
    }
  }, [onSearch, debouncedSearch]);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    // <div>
    <>
      <label for="table-search" class="sr-only">
        Search
      </label>
      <div class="relative mt-1">
        <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          id="table-search"
          class="block py-2 ps-10 pe-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={(e) => {
            setSearch(e?.target?.value?.trim());
          }}
        />
        <div
          class="absolute inset-y-0 rtl:inset-l-0 end-0 flex items-center ps-3"
          onClick={onClear}
        >
          <CloseIcon />
        </div>
      </div>
    </>
    // </div>
  );
});

const BeatSheets = () => {
  const navigate = useNavigate();
  const [beatSheets, setBeatSheets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [beatSheetToDelete, setBeatSheetToDelete] = useState(null);
  const [notification, setNotification] = useState({ message: null, type: null });

  const [search, setSearch] = useState("");

  const [selectedBeatSheet, setSelectedBeatSheet] = useState(null);

  const fetchBeatSheets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await beatSheetApi.getBeatSheets({
        search,
        page,
        sort: "updatedAt",
        sortDir: "DESC",
      });
      setTotalCount(data.totalCount);
      setBeatSheets(data.beatSheets);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchBeatSheets();
  }, [fetchBeatSheets]);

  const deleteBeatSheet = async () => {
    try {
      await beatSheetApi.deleteBeatSheet(beatSheetToDelete.id);
      setBeatSheetToDelete(null);
      fetchBeatSheets();
    } catch (error) {
      console.error("Error deleting beat sheet: ", error);
    }
  };

  const onSearch = React.useCallback((val) => {
    setSearch(val);
    setPage(0);
  }, []);


  const handleCloseNotification = () => {
    setNotification({ message: null, type: null });
  };

  const afterSave = () => {
    fetchBeatSheets();
    setNotification({ message: 'BeatSheet saved successfully', type: 'success' });
  }
    

  return (
    <div>
      {notification.message && (
        <Notify 
          message={notification.message} 
          type={notification.type} 
          onClose={handleCloseNotification} 
        />
      )}
      {selectedBeatSheet && (
        <EditFormModal
          name="BeatSheet"
          entity={selectedBeatSheet}
          afterSave={afterSave}
          onClose={() => setSelectedBeatSheet(null)}
        />
      )}
      {beatSheetToDelete && (
        <ConfirmationModal
          isOpen={!!beatSheetToDelete}
          onCancel={() => setBeatSheetToDelete(null)}
          onConfirm={deleteBeatSheet}
          message={`Delete BeetSheet - '${beatSheetToDelete.title}'?`}
        />
      )}
      <div className="relative overflow-x-auto shadow-md shadow-primary-900 sm:rounded-lg">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <h1 className="text-2xl font-semibold text-white">Beat Sheets</h1>
          <div className="flex flex-column items-center gap-3">
            <DropdownForm onSearch={onSearch} />
            <button
              className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0 underline"
              onClick={() => setSelectedBeatSheet({})}
            >
              + Add
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 sm:rounded-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Last Updated At
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody role="status" className={loading ? "animate-pulse" : ""}>
            {loading ? (
              <>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan="4">
                      <div className="h-4 bg-primary-200 rounded-full dark:bg-gray-700 m-4"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : error ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : beatSheets.length ? (
              beatSheets.map((beatSheet) => (
                <tr
                  key={beatSheet.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {beatSheet.title}
                  </th>
                  <td className="px-6 py-4 w-3/4 text-ellipsis whitespace-nowrap overflow-hidden inline-block">{beatSheet.description}</td>
                  <td className="px-6 py-4 w-1/6">
                    {new Intl.DateTimeFormat(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    ).format(new Date(beatSheet.createdAt))
                    }
                    </td>
                  <td className="px-6 py-4 w-1/6">
                    {
                      new Intl.DateTimeFormat(
                        "en-US",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      ).format(new Date(beatSheet.updatedAt))
                    }
                  </td>
                  <td className="px-6 py-4 text-right flex">
                    <button
                      className="font-medium text-primary-600 dark:text-primary-500 hover:underline mr-2"
                      onClick={() => {
                        navigate(`/beatsheets/${beatSheet.id}`);
                      }}
                    >
                      View Acts
                    </button>
                    <button
                      className="font-medium text-primary-600 dark:text-primary-500 hover:underline mr-2"
                      onClick={() => setSelectedBeatSheet(beatSheet)}
                    >
                      Edit BeatSheet
                    </button>
                    <button
                      className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
                      onClick={() => setBeatSheetToDelete(beatSheet)}
                    >
                      Delete BeatSheet
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center dark:text-gray-400"
                >
                  No beat sheets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalCount={totalCount}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
      />
    </div>
  );
};

export default BeatSheets;
