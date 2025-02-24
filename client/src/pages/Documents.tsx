import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { FileUpload } from '../components/FileUpload';

interface Document {
  id: string;
  name: string;
  url: string;
  created_at: string;
  type: string;
  size: number;
}

export function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = async (url: string) => {
    try {
      const { error } = await supabase.from('documents').insert([
        {
          url,
          user_id: user?.id,
          name: url.split('/').pop(),
          type: url.split('.').pop(),
        },
      ]);

      if (error) throw error;
      fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const document = documents.find((doc) => doc.id === id);
      if (!document) return;

      const fileName = document.url.split('/').pop();
      if (!fileName) return;

      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([fileName]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setDocuments((current) => current.filter((doc) => doc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
        <FileUpload onUploadComplete={handleUploadComplete} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Documents</h2>
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        {documents.length === 0 ? (
          <p className="text-muted-foreground">No documents found. Upload your first document above.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-card rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium truncate" title={doc.name}>
                      {doc.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-sm text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="uppercase">{doc.type}</span>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 