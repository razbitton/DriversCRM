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
  type = "warning" // warning, danger, info
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
            border-bottom: 1px solid #e5e7eb;
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
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
          }
          .btn-confirm:hover {
            background-color: #c82333;
          }
          .btn-cancel {
            background-color: #f8f9fa;
            color: #495057;
            border: 1px solid #dee2e6;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
          }
          .btn-cancel:hover {
            background-color: #e9ecef;
          }
          .warning-icon {
            color: #f59e0b;
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