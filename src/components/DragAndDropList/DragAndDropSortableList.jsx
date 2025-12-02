import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  // autoScroll,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";

export function DndSortableList({ items, onChange, renderItem, getItemId }) {
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = (event) => {
    setIsDragging(false);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
    const newIndex = items.findIndex((item) => getItemId(item) === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    onChange(reordered);
  };

  useEffect(() => {
    // Prevent scrolling while dragging (especially on mobile)
    document.body.style.touchAction = isDragging ? "none" : "auto";
    return () => {
      document.body.style.touchAction = "auto";
    };
  }, [isDragging]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // modifiers={[autoScroll]} // Enable auto-scroll
    >
      <SortableContext
        items={items.map(getItemId)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItem
            key={getItemId(item)}
            id={getItemId(item)}
            item={item}
            index={item.orderby ?? index}
            renderItem={renderItem}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, item, renderItem, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none", // mobile fix
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {renderItem(item, index)}
    </div>
  );
}
