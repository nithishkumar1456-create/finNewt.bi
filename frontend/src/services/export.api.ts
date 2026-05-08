import api from '../lib/axios';

export const exportApi = {
  downloadCSV: async () => {
    try {
      const response = await api.get('/export/csv', { responseType: 'blob' });
      // response.data is already a Blob because of responseType: 'blob'
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  },
  downloadPDF: async () => {
    // In our backend mock, this returns JSON right now, but typically it would be a blob.
    const response = await api.get('/export/pdf');
    return response.data;
  },
};