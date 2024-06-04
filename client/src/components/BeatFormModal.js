import React, { useEffect, useState } from "react";
import CustomInput from "./CustomInput";
import { CloseIcon } from "../assets";
import beatSheetApi from "../api";
import DismissableAlert from "./DismissableAlert";
import Loader from "./Loader";

const BeatFormModal = ({ actId, beat, afterSave, onClose }) => {
  const [title, setTitle] = useState({
    value: beat?.title || "",
    error: null,
  });
  const [description, setDescription] = useState({
    value: beat?.description || "",
    error: null,
  });
  const [duration, setDuration] = useState({
    value: beat?.duration || "",
    error: null,
  });
  const [cameraAngle, setCameraAngle] = useState({
    value: beat?.camera_angle || "",
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle({
      value: beat?.title || "",
      error: null,
    });
    setDescription({
      value: beat?.description || "",
      error: null,
    });
    setDuration({
      value: beat?.duration || "",
      error: null,
    });
    setCameraAngle({
      value: beat?.camera_angle || "",
      error: null,
    });
  }, [beat]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (!title.value.trim()) {
        setTitle({ ...title, error: "Title is required" });
        return;
      }

      if (!description.value.trim()) {
        setDescription({ ...description, error: "Description is required" });
        return;
      }

      if (!duration.value) {
        setDuration({ ...duration, error: "Duration is required" });
        return;
      }

      const data = {
        title: title.value,
        description: description.value,
        duration: Number(duration.value),
        camera_angle: cameraAngle.value,
      };

      setLoading(true);
      setError(null);

      if (beat?.id) {
        await beatSheetApi.updateBeat(actId, beat.id, data);
      } else {
        await beatSheetApi.createBeat(actId, data);
      }

      await afterSave();
      setLoading(false);
      onClose();
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
      setLoading(false);
    }
  };

  return (
    <div
      id="beatModal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed inset-0 z-50 overflow-y-auto ${!beat && "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className={
            "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          }
          aria-hidden="true"
          onClick={loading ? null : onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8"
          >
            {loading && <Loader />}
            <div class="flex items-start justify-between py-4 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900">
                {beat?.id ? "Edit" : "Create"} Beat
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                <CloseIcon />
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <CustomInput
              label="Title"
              placeholder="Enter title"
              value={title.value}
              error={title.error}
              onChange={(e) => setTitle({ value: e.target.value, error: "" })}
              onBlur={(e) => {
                const value = e.target.value.trim();
                setTitle({
                  value,
                  error: !value ? "Title is required" : "",
                });
              }}
            />
            <CustomInput
              label="Description"
              placeholder="Enter description"
              inputType="textarea"
              labelClass="mb-4"
              value={description.value}
              error={description.error}
              onChange={(e) =>
                setDescription({ value: e.target.value, error: "" })
              }
              onBlur={(e) => {
                const value = e.target.value.trim();
                setDescription({
                  value,
                  error: !value ? "Description is required" : "",
                });
              }}
            />
            <CustomInput
              label="Duration"
              placeholder="Enter duration(in seconds)"
              value={duration.value}
              error={duration.error}
              onChange={(e) => {
                // Only allow numbers
                setDuration({
                  value: e.target.value.replace(/\D/g, ""),
                  error: "",
                });
              }}
              onBlur={(e) => {
                const value = e.target.value.trim().replace(/\D/g, "");
                setDuration({
                  value,
                  error: !value ? "Duration is required" : "",
                });
              }}
            />
            <CustomInput
              label="Camera Angle"
              placeholder="Enter camera angle details"
              value={cameraAngle.value}
              error={cameraAngle.error}
              onChange={(e) =>
                setCameraAngle({ value: e.target.value, error: "" })
              }
              onBlur={(e) => {
                const value = e.target.value.trim();
                setCameraAngle({
                  value,
                  error: "",
                });
              }}
              required={false}
            />
            {error && (
              <DismissableAlert
                message={error}
                type="error"
                onDismiss={() => setError(null)}
              />
            )}
            <div className="flex items-center justify-between">
              <button
                className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BeatFormModal;
