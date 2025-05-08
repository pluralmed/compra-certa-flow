
import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <span className="text-3xl">🛒</span>
    <div>
      <h1 className="text-lg font-bold leading-tight">Compra Certa</h1>
      <p className="text-xs opacity-70">Sistema de Solicitações</p>
    </div>
  </div>
);
