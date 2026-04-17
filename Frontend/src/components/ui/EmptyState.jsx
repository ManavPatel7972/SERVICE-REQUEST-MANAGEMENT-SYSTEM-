import { Inbox } from "lucide-react";

export default function EmptyState({ title = "No data found", message, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <p className="text-base font-semibold text-gray-600">{title}</p>
      {message && <p className="text-sm text-gray-400 mt-1 max-w-xs">{message}</p>}
    </div>
  );
}
