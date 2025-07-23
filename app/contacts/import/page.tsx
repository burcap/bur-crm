
'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';

export default function ImportContacts() {
  const [rows, setRows] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    Papa.parse(f, {
      header: true,
      complete: (res) => setRows(res.data as any[])
    });
  }

  async function upload() {
    setUploading(true);
    const res = await fetch('/api/contacts/import', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rows })});
    setUploading(false);
    if (res.ok) alert('Imported!');
  }

  return (
    <div className="space-y-4 p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Import Contacts</h1>
      <input type="file" accept=".csv" onChange={handleFile} />
      {rows.length>0 && <p className="text-sm text-gray-500">{rows.length} rows parsed</p>}
      <Button disabled={!rows.length || uploading} onClick={upload}>{uploading? 'Uploading...':'Import'}</Button>
    </div>
  );
}
