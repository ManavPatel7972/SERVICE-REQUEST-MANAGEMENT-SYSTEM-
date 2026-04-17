import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ show, title, message, onConfirm, onCancel, loading }) {
  return (
    <Modal show={show} title={title || "Confirm Action"} onClose={onCancel} size="sm">
      <div className="modal-body flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-600" />
        </div>
        <p className="text-gray-600 text-sm">{message || "Are you sure you want to proceed?"}</p>
      </div>
      <div className="modal-footer">
        <button className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </Modal>
  );
}
