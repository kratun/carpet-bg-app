// src/components/ui/Icon.jsx

import {
  Edit,
  Trash,
  Plus,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  CheckCircle,
  MoveRight,
  RotateCcw,
  PlayCircle,
} from "lucide-react";

const icons = {
  edit: Edit,
  delete: Trash,
  add: Plus,
  view: Eye,
  close: X,
  prev: ChevronLeft,
  next: ChevronRight,
  microphoneOn: Mic,
  microphoneOff: MicOff,
  checkCircle: CheckCircle,
  moveRight: MoveRight,
  rotate: RotateCcw,
  playCircle: PlayCircle,
};

export const ICONS = {
  edit: "edit",
  delete: "delete",
  add: "add",
  view: "view",
  close: "close",
  prev: "prev",
  next: "next",
  microphoneOn: "microphoneOn",
  microphoneOff: "microphoneOff",
  checkCircle: "checkCircle",
  moveRight: "moveRight",
  rotate: "rotate",
  playCircle: "playCircle",
};

export default function Icon({
  name,
  size = 20,
  color = "currentColor",
  ...props
}) {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <LucideIcon size={size} color={color} {...props} />;
}
