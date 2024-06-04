import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import beatSheetApi from "../api";
import Loader from "./Loader";
import EditFormModal from "./EditModal";
import { attachStartAndEndTimesToBeats } from "../utils";

function ViewBeatSheet() {
  const { id: beatSheetId } = useParams();
  const [beatSheet, setBeatSheet] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAct, setSelectedAct] = useState(null);

  const fetchBeatSheet = useCallback(async () => {
    try {
      const response = await beatSheetApi.getBeatSheet(beatSheetId);
      setBeatSheet(attachStartAndEndTimesToBeats(response.beatSheet));
      setLoading(false);
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
      setLoading(false);
    }
  }, [beatSheetId]);

  useEffect(() => {
    fetchBeatSheet();
  }, [fetchBeatSheet]);

  const handleComplete = (actId, beatId) => {
    // API call to mark as completed
    console.log(`Complete API Call for Act: ${actId}, Beat: ${beatId}`);
    // Simulate API call
  };

  const handleEdit = (actId, beatId) => {
    // Edit functionality here
    console.log(`Edit Mode for Act: ${actId}, Beat: ${beatId}`);
    // Trigger edit mode
  };

  const onDragEnd = async (result, ...rest) => {
    const { source, destination } = result;

    // Nothing happens if dropped outside a droppable area
    if (!destination) {
      return;
    }

    if (result.type === "act") {
      // Call an API when an act is reordered
      if (source.index !== destination.index) {
        console.log(
          `Call API to reorder act from position ${source.index} to ${destination.index}`
        );
        // API call to reorder acts
        // Example: updateActPosition({ actId: draggedAct.id, newPosition: destination.index });
      }
    } else if (result.type === "beat") {
      if (
        source.droppableId === destination.droppableId &&
        source.index !== destination.index
      ) {
        const actId = Number(source.droppableId.split("-")[1]);
        const newActId = null;
        const newPosition = destination.index;
        const beatId = beatSheet.acts
          .find((act) => act.id === actId)
          .beats.find((beat) => beat.position === source.index).id;
        console.log(
          `Beat is moving within the same act ${actId} from position ${source.index} to ${destination.index}`
        );

        await beatSheetApi.reorderBeat(beatId, actId, newPosition, newActId);
        await fetchBeatSheet();
      } else if (source.droppableId !== destination.droppableId) {
        const actId = Number(source.droppableId.split("-")[1]);
        const newActId = Number(destination.droppableId.split("-")[1]);
        const newPosition = destination.index;
        const beatId = beatSheet.acts
          .find((act) => act.id === actId)
          .beats.find((beat) => beat.position === source.index).id;

        console.log(
          `Beat is moving from act ${actId} to act ${newActId} at position ${destination.index}`
        );

        await beatSheetApi.reorderBeat(beatId, actId, newPosition, newActId);
        await fetchBeatSheet();
      }
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <div className="text-red-500">{error}</div>
  ) : (
    <>
    {
      selectedAct && (
        <EditFormModal
          name="Act"
          entity={{...selectedAct, beatSheetId}}
          afterSave={() => {}}
          onClose={() => setSelectedAct(null)}
        />
      )
    }
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-acts" direction="vertical" type="act">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-row gap-4"
          >
            {beatSheet.acts.map((act, index) => (
              <Draggable
                key={act.id}
                draggableId={`act-${act.id}`}
                index={act.position}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="relative act-card max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <button
                          className="absolute right-2 top-1 font-small dark:text-primary-500 hover:underline"
                          onClick={() => setSelectedAct(act)}
                        >
                          Edit Act
                        </button>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {act.title}
                        </h5>
                        <span className="mb-2 text-l tracking-tight text-gray-900 dark:text-white">
                          {act.description || "No Description"}
                        </span>
                      <Droppable droppableId={`act-${act.id}`} type="beat">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="beat-container"
                          >
                            {act.beats.map((beat, index) => (
                              <Draggable
                                key={beat.id}
                                draggableId={`beat-${beat.id}`}
                                index={beat.position}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => handleEdit(act.id, beat.id)}
                                  >
                                    <div className="beat-card p-3 bg-white rounded shadow cursor-pointer">
                                      <p className="text-gray-700 dark:text-gray-400">
                                        {beat.title}({beat.startTime} -{" "}
                                        {beat.endTime})
                                      </p>
                                      <span
                                        onClick={() =>
                                          handleComplete(act.id, beat.id)
                                        }
                                        className="complete-checkmark"
                                      >
                                        ✔️
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </>
  );
}

export default ViewBeatSheet;
