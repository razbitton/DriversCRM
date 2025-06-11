import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "אישור פעולה", 
  message = "האם אתה בטוח שברצונך לבצע פעולה זו?",
  confirmText = "אישור",
  cancelText = "ביטול",
  type = "warning"
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info";
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0" dir="rtl">
        <style>{`
          .confirmation-modal-header {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 1px solid hsl(220, 13%, 91%);
          }
          .confirmation-modal-body {
            padding: 1rem 1.5rem 1.5rem 1.5rem;
          }
          .confirmation-modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .btn-confirm {
            background-color: hsl(0, 84%, 60%);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
          }
          .btn-confirm:hover {
            background-color: hsl(0, 84%, 55%);
          }
          .btn-cancel {
            background-color: hsl(220, 14%, 96%);
            color: hsl(220, 9%, 29%);
            border: 1px solid hsl(220, 13%, 91%);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
          }
          .btn-cancel:hover {
            background-color: hsl(220, 14%, 93%);
          }
          .warning-icon {
            color: hsl(38, 92%, 50%);
          }
        `}</style>
        
        <div className="confirmation-modal-header">
          <AlertTriangle size={20} className="warning-icon" />
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
        </div>
        
        <div className="confirmation-modal-body">
          <p className="text-gray-700 leading-relaxed">{message}</p>
          
          <div className="confirmation-modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
            <button className="btn-confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
