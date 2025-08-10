import React, { useCallback, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash, FileText, RefreshCw } from "lucide-react";

export type DocumentType = "CONFORMITY_DECLARATION" | "TECHNICAL_DOCUMENTATION";

interface PackagingCreateDocumentsProps {
   onChange?: (type: DocumentType, files: File[]) => void;
   initialConformity?: File[];
   initialTechnical?: File[];
}

const MAX_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPT = "application/pdf";

const PackagingCreateDocuments: React.FC<PackagingCreateDocumentsProps> = ({
   onChange,
   initialConformity = [],
   initialTechnical = [],
}) => {
   const [conformityFiles, setConformityFiles] =
      useState<File[]>(initialConformity);
   const [technicalFiles, setTechnicalFiles] =
      useState<File[]>(initialTechnical);
   const [error, setError] = useState<string>("");

   const confInputRef = useRef<HTMLInputElement | null>(null);
   const techInputRef = useRef<HTMLInputElement | null>(null);

   const validateAndAdd = useCallback(
      (type: DocumentType, fileList: FileList | null) => {
         if (!fileList || fileList.length === 0) return;
         setError("");
         const next: File[] = [];
         for (const f of Array.from(fileList)) {
            if (f.type !== ACCEPT) {
               setError("Nur PDF-Dateien sind erlaubt.");
               continue;
            }
            if (f.size > MAX_SIZE) {
               setError("Datei überschreitet 3 MB.");
               continue;
            }
            next.push(f);
         }
         if (next.length === 0) return;

         if (type === "CONFORMITY_DECLARATION") {
            const files = [...conformityFiles, ...next];
            setConformityFiles(files);
            onChange?.(type, files);
         } else {
            const files = [...technicalFiles, ...next];
            setTechnicalFiles(files);
            onChange?.(type, files);
         }
      },
      [conformityFiles, technicalFiles, onChange]
   );

   const removeAt = (type: DocumentType, idx: number) => {
      if (type === "CONFORMITY_DECLARATION") {
         const files = conformityFiles.filter((_, i) => i !== idx);
         setConformityFiles(files);
         onChange?.(type, files);
      } else {
         const files = technicalFiles.filter((_, i) => i !== idx);
         setTechnicalFiles(files);
         onChange?.(type, files);
      }
   };

   const Dropzone: React.FC<{
      title: string;
      type: DocumentType;
      files: File[];
      inputRef: React.RefObject<HTMLInputElement | null>;
   }> = ({ title, type, files, inputRef }) => {
      const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
         e.preventDefault();
         validateAndAdd(type, e.dataTransfer.files);
      };

      return (
         <Card>
            <CardHeader>
               <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
               <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
               >
                  <div className="flex flex-col items-center space-y-4">
                     <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-400" />
                     </div>
                     <div className="space-y-2">
                        <Button
                           variant="link"
                           className="px-0 text-blue-600"
                           onClick={() => inputRef.current?.click()}
                        >
                           Dateien durchsuchen
                        </Button>
                        <span className="text-sm text-muted-foreground">
                           oder drag & drop
                        </span>
                        <div className="text-xs text-muted-foreground">
                           PDF mit maximal 3 MB
                        </div>
                     </div>
                  </div>
                  <input
                     ref={inputRef}
                     type="file"
                     accept={ACCEPT}
                     multiple
                     hidden
                     onChange={(e) => {
                        validateAndAdd(type, e.target.files);
                        if (inputRef.current) inputRef.current.value = "";
                     }}
                  />
               </div>

               {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                     {files.map((f, i) => (
                        <div
                           key={`${f.name}-${i}`}
                           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                                 <FileText className="h-4 w-4 text-red-600" />
                              </div>
                              <div className="flex-1">
                                 <div className="font-medium text-sm truncate max-w-[200px]">
                                    {f.name}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{Math.round(f.size / 1024)} KB</span>
                                    <span className="flex items-center gap-1">
                                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                       100%
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                              onClick={() => removeAt(type, i)}
                           >
                              <Trash className="h-4 w-4" />
                           </Button>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>
      );
   };

   return (
      <div className="space-y-6">
         {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
               <div
                  className="text-sm text-red-600"
                  role="alert"
               >
                  {error}
               </div>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Dropzone
               title="Konformitätserklärung"
               type="CONFORMITY_DECLARATION"
               files={conformityFiles}
               inputRef={confInputRef}
            />
            <Dropzone
               title="Technische Dokumentation"
               type="TECHNICAL_DOCUMENTATION"
               files={technicalFiles}
               inputRef={techInputRef}
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
               >
                  <RefreshCw className="h-4 w-4" />
                  Automatisch generieren
               </Button>
            </div>
            <div></div>
         </div>
      </div>
   );
};

export default PackagingCreateDocuments;
