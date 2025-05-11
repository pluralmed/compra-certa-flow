
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (justification: string) => void;
  requestId: string;
}

const RejectionModal = ({ isOpen, onClose, onConfirm, requestId }: RejectionModalProps) => {
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');

  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJustification(e.target.value);
    if (e.target.value.trim()) {
      setError('');
    }
  };

  const handleConfirm = () => {
    if (!justification.trim()) {
      setError('Por favor, informe o motivo da rejeição');
      return;
    }
    
    onConfirm(justification);
    setJustification('');
    setError('');
  };

  const handleClose = () => {
    setJustification('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejeitar solicitação #{requestId}</DialogTitle>
          <DialogDescription>
            Por favor, informe o motivo da rejeição desta solicitação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <label htmlFor="rejection-reason" className="text-sm font-medium">
            Justificativa
          </label>
          <Textarea
            id="rejection-reason"
            placeholder="Informe o motivo da rejeição..."
            value={justification}
            onChange={handleJustificationChange}
            className={error ? 'border-red-500' : ''}
            rows={4}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirmar rejeição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionModal;
