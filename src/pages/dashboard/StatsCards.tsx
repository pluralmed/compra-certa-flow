import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock } from 'lucide-react';
import { Request } from '@/context/data/types';

interface StatsCardsProps {
  filteredRequests: Request[];
}

const StatsCards = ({ filteredRequests }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Requests */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Package size={16} className="text-teal" />
            Total de Solicitações
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-3xl font-bold">
            {filteredRequests.length}
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Requests */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            Aguardando Liberação
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-3xl font-bold">
            {filteredRequests.filter(r => r.status === 'Aguardando liberação').length}
          </div>
        </CardContent>
      </Card>
      
      {/* In Progress */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Package size={16} className="text-blue" />
            Em Processamento
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-3xl font-bold">
            {filteredRequests.filter(r => 
              ['Em cotação', 'Aguardando pagamento', 'Pagamento realizado', 'Aguardando entrega'].includes(r.status)
            ).length}
          </div>
        </CardContent>
      </Card>
      
      {/* Completed */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Package size={16} className="text-emerald-600" />
            Entregues
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-3xl font-bold">
            {filteredRequests.filter(r => r.status === 'Entregue').length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards; 