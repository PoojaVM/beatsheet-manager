import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ViewBeatSheet() {
  const [acts, setActs] = useState([
    { id: 'act-1', title: 'Act 1', beats: [{ id: 'beat-1-1', content: 'Beat 1', completed_at: null }], completed_at: null, position: 0 },
    { id: 'act-2', title: 'Act 2', beats: [{ id: 'beat-2-1', content: 'Beat 2', completed_at: null }], completed_at: null, position: 1 }
  ]);

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

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Nothing happens if dropped outside a droppable area
    if (!destination) {
      return;
    }

    if (result.type === 'act') {
      // Call an API when an act is reordered
      if (source.index !== destination.index) {
        console.log(`Call API to reorder act from position ${source.index} to ${destination.index}`);
        // API call to reorder acts
        // Example: updateActPosition({ actId: draggedAct.id, newPosition: destination.index });
      }
    } else if (result.type === 'beat') {
      const sourceAct = acts.find(act => act.id === source.droppableId);
      const destAct = acts.find(act => act.id === destination.droppableId);

      if (source.droppableId === destination.droppableId && source.index !== destination.index) {
        // Call an API when a beat is reordered within the same act
        console.log(`Call API to reorder beat within the same act from position ${source.index} to ${destination.index}`);
        // API call to reorder beats within an act
        // Example: updateBeatPosition({ actId: sourceAct.id, beatId: draggedBeat.id, newPosition: destination.index });
      } else if (source.droppableId !== destination.droppableId) {
        // Call an API when a beat is moved to a different act
        console.log(`Call API to move beat from act ${source.droppableId} to act ${destination.droppableId} into position ${destination.index}`);
        // API call to move beat to another act
        // Example: moveBeatToAnotherAct({ sourceActId: sourceAct.id, destActId: destAct.id, beatId: draggedBeat.id, newPosition: destination.index });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-acts" direction="vertical" type="act">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {acts.map((act, index) => (
              <Draggable key={act.id} draggableId={act.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className="act-card max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{act.title}</h5>
                      </a>
                      <button onClick={() => handleEdit(act.id, null)}>Edit Act</button>
                      <Droppable droppableId={act.id} type="beat">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="beat-container">
                            {act.beats.map((beat, index) => (
                              <Draggable key={beat.id} draggableId={beat.id} index={index}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => handleEdit(act.id, beat.id)}>
                                    <div className="beat-card p-3 bg-white rounded shadow cursor-pointer">
                                      <p className="text-gray-700 dark:text-gray-400">{beat.content}</p>
                                      <span onClick={() => handleComplete(act.id, beat.id)} className="complete-checkmark">✔️</span>
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
  );
}

export default ViewBeatSheet;
