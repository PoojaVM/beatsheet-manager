import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import beatSheetApi from "../api";
import Loader from "./Loader";
import EditFormModal from "./EditModal";
import BeatFormModal from "./BeatFormModal";
import { Divider } from "@aws-amplify/ui-react";
import { attachStartAndEndTimesToBeats } from "../utils";
import ConfirmationModal from "./ConfirmationModal";

function ViewBeatSheet() {
  const { id: beatSheetId } = useParams();
  const [beatSheet, setBeatSheet] = useState();
  const [loading, setLoading] = useState(true);
  const [inlineLoading, setInlineLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedAct, setSelectedAct] = useState(null);
  const [selectedBeat, setSelectedBeat] = useState(null);

  const [actToDelete, setActToDelete] = useState(null);
  const [beatToDelete, setBeatToDelete] = useState(null);

  const fetchBeatSheet = useCallback(async () => {
    try {
      setInlineLoading(true);
      const response = await beatSheetApi.getBeatSheet(beatSheetId);
      setBeatSheet(attachStartAndEndTimesToBeats(response.beatSheet));
      setLoading(false);
      setInlineLoading(false);
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
      setLoading(false);
      setInlineLoading(false);
    }
  }, [beatSheetId]);

  useEffect(() => {
    fetchBeatSheet();
  }, [fetchBeatSheet]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // Nothing happens if dropped outside a droppable area
    if (!destination) {
      return;
    }

    source.index = source.index + 1;
    destination.index = destination.index + 1;

    if (result.type === "act") {
      // Call an API when an act is reordered
      if (source.index !== destination.index) {
        const actId = beatSheet.acts.find(
          (act) => act.position === source.index
        ).id;
        const newPosition = destination.index;

        console.log(
          `Act is moving from position ${source.index} to ${destination.index}`
        );

        await beatSheetApi.reorderAct(beatSheetId, actId, newPosition);
        await fetchBeatSheet();
      }
    } else if (result.type === "beat") {
      if (
        source.droppableId === destination.droppableId &&
        source.index !== destination.index
      ) {
        const actId = Number(source.droppableId.split("-")[1]);
        const newActId = actId;
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

  const deleteAct = async () => {
    try {
      if (!actToDelete) return;

      setInlineLoading(true);
      await beatSheetApi.deleteAct(beatSheetId, actToDelete.id);
      setActToDelete(null);
      await fetchBeatSheet();
    } catch (error) {
      console.error("Error deleting act: ", error);
    } finally {
      setInlineLoading(false);
    }
  };

  const deleteBeat = async () => {
    try {
      if (!beatToDelete) return;

      setInlineLoading(true);
      await beatSheetApi.deleteBeat(beatToDelete.actId, beatToDelete.id);
      setBeatToDelete(null);
      await fetchBeatSheet();
    } catch (error) {
      console.error("Error deleting beat: ", error);
    } finally {
      setInlineLoading(false);
    }
  };

  const onRefreshClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    fetchBeatSheet();
  }, [fetchBeatSheet]);
  
  const onCreateActClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAct({ beatSheetId });
  }, [beatSheetId]);

  const actFunctionFactory = (act, action) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === "delete") {
      setActToDelete(act);
    } else if (action === "edit") {
      setSelectedAct(act);
    }
  }

  const onCreateBeatClickFactory = (act) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBeat({ actId: act.id });
  }

  const beatFunctionFactory = (beat, action) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === "delete") {
      setBeatToDelete(beat);
    } else if (action === "edit") {
      setSelectedBeat(beat);
    }
  }

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
            afterSave={fetchBeatSheet}
            onClose={() => setSelectedAct(null)}
          />
        )
      }
      {selectedBeat ? (
        <BeatFormModal
          actId={selectedBeat.actId}
          beat={selectedBeat?.id ? selectedBeat : {}}
          afterSave={fetchBeatSheet}
          onClose={() => setSelectedBeat(null)}
        />
      ) : null}
      {actToDelete && (
        <ConfirmationModal
          isOpen={!!actToDelete}
          onCancel={() => setActToDelete(null)}
          onConfirm={deleteAct}
          message={`Delete Act - '${actToDelete.title}'?`}
        />
      )}

      {beatToDelete && (
        <ConfirmationModal
          isOpen={!!beatToDelete}
          onCancel={() => setBeatToDelete(null)}
          onConfirm={deleteBeat}
          message={`Delete Beat - '${beatToDelete.title}'?`}
        />
      )}

      {inlineLoading && <Loader />}
      <div className="flex flex-col items-baseline pb-4">
        <div className="flex flex-row items-baseline gap-4">
          <h1 className="text-3xl font-bold text-white">{beatSheet.title}</h1>
          <div className="flex flex-row gap-2 mt-auto">
            <button className="text-primary-500 hover:underline" onClick={onRefreshClick}>
              Refresh
            </button>
            <Divider orientation="vertical" />
            <button className="text-primary-500 hover:underline" onClick={onCreateActClick}>
              + Create Act
            </button>
          </div>
        </div>
        <p className="text-gray-200">{beatSheet.description}</p>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-acts" direction="horizontal" type="act">
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
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={actFunctionFactory(act, "edit")}
                      // style={{ height: "fit-content" }}
                    >
                      <div className="act-card relative w-80 p-6 border rounded-lg shadow bg-gray-800 border-gray-700">
                        <div className="absolute right-2 top-1 flex flex-row gap-2">
                          <button
                            className="font-small text-primary-500 hover:underline"
                            onClick={actFunctionFactory(act, "edit")}
                          >
                            Edit
                          </button>
                          <Divider orientation="vertical" />
                          <button
                            className="font-small text-primary-500 hover:underline"
                            onClick={actFunctionFactory(act, "delete")}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="mb-4">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                            {act.title}
                          </h5>
                          <span className="block text-l tracking-tight text-white w-full text-ellipsis whitespace-nowrap overflow-hidden">
                            {act.description || "No Description"}
                          </span>
                        </div>
                        <Divider />
                        <button
                          className="text-primary-500 hover:underline mt-4 text-center w-full"
                          onClick={onCreateBeatClickFactory(act)}
                        >
                          + Create Beat
                        </button>
                        <Droppable droppableId={`act-${act.id}`} type="beat">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="flex flex-col gap-4 mt-4"
                            >
                              {act.beats.map((beat, index) => (
                                <Draggable
                                  key={beat.id}
                                  draggableId={`beat-${beat.id}`}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={beatFunctionFactory(beat, "edit")}
                                    >
                                      <div className="beat-card p-3 bg-white rounded shadow cursor-pointer">
                                        <p className="text-gray-700 dark:text-gray-400">
                                          {beat.title}
                                        </p>
                                        <p className="text-gray-500">
                                          {beat.startTime} - {beat.endTime}
                                        </p>
                                        <div className="flex flex-row mt-4 gap-2 end">
                                          <button
                                            className="text-primary-500 hover:underline"
                                            onClick={beatFunctionFactory(beat, "edit")}
                                          >
                                            Edit
                                          </button>
                                          <Divider orientation="vertical" />
                                          <button
                                            className="text-primary-500 hover:underline"
                                            onClick={beatFunctionFactory(beat, "delete")}
                                          >
                                            Delete
                                          </button>
                                        </div>
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
