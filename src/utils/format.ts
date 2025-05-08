
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 3) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else if (digits.length <= 7) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 3)} ${digits.substring(3)}`;
  } else if (digits.length <= 11) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 3)} ${digits.substring(3, 7)}-${digits.substring(7)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 3)} ${digits.substring(3, 7)}-${digits.substring(7, 11)}`;
  }
};

export const getStatusEmoji = (status: string): string => {
  switch(status) {
    case 'Aguardando liberação': return '⏳';
    case 'Em cotação': return '🚀';
    case 'Aguardando pagamento': return '💸';
    case 'Pagamento realizado': return '✅';
    case 'Aguardando entrega': return '📦';
    case 'Solicitação rejeitada': return '❌';
    default: return '⏳';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch(priority) {
    case 'Moderada': return 'bg-blue-500';
    case 'Urgente': return 'bg-yellow-500';
    case 'Emergencial': return 'bg-red-500';
    default: return 'bg-blue-500';
  }
};

export const getStatusColor = (status: string): string => {
  switch(status) {
    case 'Aguardando liberação': return 'bg-amber-400';
    case 'Em cotação': return 'bg-blue';
    case 'Aguardando pagamento': return 'bg-violet-500';
    case 'Pagamento realizado': return 'bg-green-500';
    case 'Aguardando entrega': return 'bg-orange-500';
    case 'Solicitação rejeitada': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};
