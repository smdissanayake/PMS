import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Search, Download } from 'lucide-react';
import XLSX from 'xlsx-js-style';

interface Patient {
  id: number;
  clinicRefNo: string;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  address: string;
  nic: string;
  uhid: string;
  category: string;
}

const PAGE_SIZE = 10;

const PetiantReport: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/patients');
      setPatients(response.data);
      setError(null);
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(response.data.map((p: Patient) => p.category))).filter(Boolean) as string[];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to fetch patients. Please try again later.');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      (category === '' || p.category === category) &&
      (
        p.clinicRefNo.toLowerCase().includes(search.toLowerCase()) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        p.nic.toLowerCase().includes(search.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    // Title: CategoryName + Date
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    const title = `${category || "All Categories"} - ${dateStr}`;

    // Prepare data
    const exportData = filteredPatients.map((p) => ({
      'Clinic Ref No': p.clinicRefNo,
      'Name': `${p.firstName} ${p.lastName}`,
      'NIC': p.nic,
      'Birthday': p.birthday,
      'Gender': p.gender,
      'Category': p.category,
      'Address': p.address,
    }));

    // Create worksheet and add title row
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: "A1" });
    XLSX.utils.sheet_add_json(ws, exportData, { origin: "A3", skipHeader: false });

    // Auto-fit columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...exportData.map((row) => (row[key] ? row[key].toString().length : 0))
      ) + 2 // add some padding
    }));
    ws['!cols'] = colWidths;

    // Draw table borders (using xlsx-js-style)
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;
        ws[cell_ref].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          font: R === 0 ? { bold: true, sz: 14 } : undefined // Make title bold and larger
        };
      }
    }

    // Style the title row
    const titleCell = ws['A1'];
    if (titleCell) {
      titleCell.s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
    // Merge title row across all columns
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(exportData[0] || {}).length - 1 } }
    ];

    // Create workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Patients');
    XLSX.writeFile(wb, 'patients_report.xlsx');
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-6xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">All Patients</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto items-stretch md:items-center">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Download className="mr-2 h-4 w-4" /> Export as Excel
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Ref No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.clinicRefNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${patient.firstName} ${patient.lastName}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.nic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.birthday}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PetiantReport;
