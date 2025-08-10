"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Plus, ChevronDown, ChevronRight, Trash } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

export interface PackagingComponentDraft {
   name: string;
   format: string;
   weight: string;
   volume: string;
   ppwrCategory: string;
   ppwrLevel: string;
   quantity: number;
   supplier: string;
   manufacturingProcess: string;
   color: string;
   type?: "separat" | "integriert";
   materials?: MaterialLayer[];
}

export interface MaterialLayer {
   name: string;
   material: string;
   weight: string;
   thickness: string;
   percentage: string;
}

interface PackagingCreateComponentsFormProps {
   t: (key: string) => string;
   components: PackagingComponentDraft[];
   onAdd: () => void;
   onRemove: (index: number) => void;
   onChange: (
      index: number,
      field: keyof PackagingComponentDraft,
      value: string | number
   ) => void;
   onMaterialChange?: (
      componentIndex: number,
      materialIndex: number,
      field: keyof MaterialLayer,
      value: string
   ) => void;
}

const emptyComponent: PackagingComponentDraft = {
   name: "",
   format: "",
   weight: "",
   volume: "",
   ppwrCategory: "",
   ppwrLevel: "",
   quantity: 1,
   supplier: "",
   manufacturingProcess: "",
   color: "",
   type: "separat",
   materials: [],
};

const emptyMaterial: MaterialLayer = {
   name: "",
   material: "",
   weight: "",
   thickness: "",
   percentage: "",
};

const PackagingCreateComponentsForm: React.FC<
   PackagingCreateComponentsFormProps
> = ({ t, components, onAdd, onRemove, onChange, onMaterialChange }) => {
   const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

   const toggleRowExpansion = (index: number) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(index)) {
         newExpanded.delete(index);
      } else {
         newExpanded.add(index);
      }
      setExpandedRows(newExpanded);
   };

   const addMaterial = (componentIndex: number) => {
      const updatedComponents = [...components];
      const currentMaterials =
         updatedComponents[componentIndex].materials || [];
      updatedComponents[componentIndex].materials = [
         ...currentMaterials,
         { ...emptyMaterial },
      ];
      // Assuming you have a way to update the components state in the parent component
      onChange(
         componentIndex,
         "materials",
         updatedComponents[componentIndex].materials
      );
   };

   const removeMaterial = (componentIndex: number, materialIndex: number) => {
      const updatedComponents = [...components];
      const currentMaterials =
         updatedComponents[componentIndex].materials || [];
      updatedComponents[componentIndex].materials = currentMaterials.filter(
         (_, idx) => idx !== materialIndex
      );
      onChange(
         componentIndex,
         "materials",
         updatedComponents[componentIndex].materials
      );
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAdd()}
               >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("components.addNew")}
               </Button>
               <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
               >
                  ✕ {t("filters.removeAll")}
               </Button>
            </div>
         </div>

         <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
               <TableHeader className="bg-gray-50">
                  <TableRow>
                     <TableHead className="w-8"></TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.name")}
                     </TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.format")}
                     </TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.weight")}
                     </TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.volume")}
                     </TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.quantity")}
                     </TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.supplier")}
                     </TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.manufacturingProcess")}
                     </TableHead>
                     <TableHead className="text-xs font-medium">
                        {t("components.color")}
                     </TableHead>
                     <TableHead className="w-10"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {components.map((component, idx) => (
                     <React.Fragment key={idx}>
                        <TableRow className="hover:bg-gray-50">
                           <TableCell className="py-2">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-6 w-6 p-0"
                                 onClick={() => toggleRowExpansion(idx)}
                              >
                                 {expandedRows.has(idx) ? (
                                    <ChevronDown className="h-4 w-4" />
                                 ) : (
                                    <ChevronRight className="h-4 w-4" />
                                 )}
                              </Button>
                           </TableCell>
                           <TableCell className="py-2">
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                 <Input
                                    value={component.name}
                                    onChange={(e) =>
                                       onChange(idx, "name", e.target.value)
                                    }
                                    placeholder={t(
                                       "placeholders.componentName"
                                    )}
                                    className="border-0 p-0 focus-visible:ring-0"
                                 />
                                 <Select
                                    value={component.type}
                                    onValueChange={(value) =>
                                       onChange(idx, "type", value)
                                    }
                                 >
                                    <SelectTrigger className="w-[100px] h-8 text-xs">
                                       <SelectValue
                                          placeholder={t("components.type")}
                                       />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="separat">
                                          {t("components.typeOptions.separat")}
                                       </SelectItem>
                                       <SelectItem value="integriert">
                                          {t(
                                             "components.typeOptions.integriert"
                                          )}
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </TableCell>
                           <TableCell className="py-2">
                              <Input
                                 value={component.format}
                                 onChange={(e) =>
                                    onChange(idx, "format", e.target.value)
                                 }
                                 placeholder={t("placeholders.format")}
                                 className="border-0 p-0 focus-visible:ring-0"
                              />
                           </TableCell>
                           <TableCell className="py-2">
                              <Input
                                 value={component.weight}
                                 onChange={(e) =>
                                    onChange(idx, "weight", e.target.value)
                                 }
                                 placeholder={t("placeholders.weight")}
                                 className="border-0 p-0 focus-visible:ring-0"
                              />
                           </TableCell>
                           <TableCell className="py-2">
                              <Input
                                 value={component.volume}
                                 onChange={(e) =>
                                    onChange(idx, "volume", e.target.value)
                                 }
                                 placeholder={t("placeholders.volume")}
                                 className="border-0 p-0 focus-visible:ring-0"
                              />
                           </TableCell>
                           <TableCell className="py-2">
                              <Input
                                 type="number"
                                 value={component.quantity}
                                 min={1}
                                 onChange={(e) =>
                                    onChange(
                                       idx,
                                       "quantity",
                                       Number(e.target.value)
                                    )
                                 }
                                 className="border-0 p-0 focus-visible:ring-0 w-16"
                              />
                           </TableCell>
                           <TableCell className="py-2">
                              <Input
                                 value={component.supplier}
                                 onChange={(e) =>
                                    onChange(idx, "supplier", e.target.value)
                                 }
                                 placeholder={t("placeholders.supplier")}
                                 className="border-0 p-0 focus-visible:ring-0"
                              />
                           </TableCell>
                           <TableCell className="py-2">
                              <Input
                                 value={component.manufacturingProcess}
                                 onChange={(e) =>
                                    onChange(
                                       idx,
                                       "manufacturingProcess",
                                       e.target.value
                                    )
                                 }
                                 placeholder={t(
                                    "placeholders.manufacturingProcess"
                                 )}
                                 className="border-0 p-0 focus-visible:ring-0"
                              />
                           </TableCell>
                           <TableCell className="py-2">
                              <Input
                                 value={component.color}
                                 onChange={(e) =>
                                    onChange(idx, "color", e.target.value)
                                 }
                                 placeholder={t("placeholders.color")}
                                 className="border-0 p-0 focus-visible:ring-0"
                              />
                           </TableCell>
                           <TableCell className="py-2">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                 onClick={() => onRemove(idx)}
                              >
                                 <Trash className="h-4 w-4" />
                              </Button>
                           </TableCell>
                        </TableRow>

                        {expandedRows.has(idx) && (
                           <TableRow>
                              <TableCell
                                 colSpan={10}
                                 className="p-0 bg-gray-50"
                              >
                                 <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                       <h4 className="font-medium text-sm">
                                          {t("materials.layers")}
                                       </h4>
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-xs"
                                          onClick={() => addMaterial(idx)}
                                       >
                                          <Plus className="h-4 w-4 mr-2" />
                                          {t("materials.addLayer")}
                                       </Button>
                                    </div>

                                    <div className="bg-white border rounded-lg">
                                       <Table>
                                          <TableHeader>
                                             <TableRow className="bg-gray-50">
                                                <TableHead className="text-xs font-medium">
                                                   {t("materials.function")}
                                                </TableHead>
                                                <TableHead className="text-xs font-medium">
                                                   {t("materials.material")}
                                                </TableHead>
                                                <TableHead className="text-xs font-medium">
                                                   {t("materials.weight")}
                                                </TableHead>
                                                <TableHead className="text-xs font-medium">
                                                   {t("materials.thickness")}
                                                </TableHead>
                                                <TableHead className="text-xs font-medium">
                                                   {t("materials.percentage")}
                                                </TableHead>
                                                <TableHead className="w-10"></TableHead>
                                             </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                             {(component.materials || []).map(
                                                (material, midx) => (
                                                   <TableRow key={midx}>
                                                      <TableCell>
                                                         <Input
                                                            value={
                                                               material.name
                                                            }
                                                            onChange={(e) =>
                                                               onMaterialChange?.(
                                                                  idx,
                                                                  midx,
                                                                  "name",
                                                                  e.target.value
                                                               )
                                                            }
                                                            placeholder={t(
                                                               "placeholders.materialName"
                                                            )}
                                                            className="border-0 p-0 text-xs focus-visible:ring-0"
                                                         />
                                                      </TableCell>
                                                      <TableCell>
                                                         <Input
                                                            value={
                                                               material.material
                                                            }
                                                            onChange={(e) =>
                                                               onMaterialChange?.(
                                                                  idx,
                                                                  midx,
                                                                  "material",
                                                                  e.target.value
                                                               )
                                                            }
                                                            placeholder={t(
                                                               "placeholders.materialType"
                                                            )}
                                                            className="border-0 p-0 text-xs focus-visible:ring-0"
                                                         />
                                                      </TableCell>
                                                      <TableCell>
                                                         <Input
                                                            value={
                                                               material.weight
                                                            }
                                                            onChange={(e) =>
                                                               onMaterialChange?.(
                                                                  idx,
                                                                  midx,
                                                                  "weight",
                                                                  e.target.value
                                                               )
                                                            }
                                                            placeholder={t(
                                                               "placeholders.materialWeight"
                                                            )}
                                                            className="border-0 p-0 text-xs focus-visible:ring-0"
                                                         />
                                                      </TableCell>
                                                      <TableCell>
                                                         <Input
                                                            value={
                                                               material.thickness
                                                            }
                                                            onChange={(e) =>
                                                               onMaterialChange?.(
                                                                  idx,
                                                                  midx,
                                                                  "thickness",
                                                                  e.target.value
                                                               )
                                                            }
                                                            placeholder={t(
                                                               "placeholders.materialThickness"
                                                            )}
                                                            className="border-0 p-0 text-xs focus-visible:ring-0"
                                                         />
                                                      </TableCell>
                                                      <TableCell>
                                                         <Input
                                                            value={
                                                               material.percentage
                                                            }
                                                            onChange={(e) =>
                                                               onMaterialChange?.(
                                                                  idx,
                                                                  midx,
                                                                  "percentage",
                                                                  e.target.value
                                                               )
                                                            }
                                                            placeholder={t(
                                                               "placeholders.materialPercentage"
                                                            )}
                                                            className="border-0 p-0 text-xs focus-visible:ring-0"
                                                         />
                                                      </TableCell>
                                                      <TableCell>
                                                         <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                            onClick={() =>
                                                               removeMaterial(
                                                                  idx,
                                                                  midx
                                                               )
                                                            }
                                                         >
                                                            <Trash className="h-4 w-4" />
                                                         </Button>
                                                      </TableCell>
                                                   </TableRow>
                                                )
                                             )}
                                          </TableBody>
                                       </Table>
                                    </div>
                                 </div>
                              </TableCell>
                           </TableRow>
                        )}
                     </React.Fragment>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
};

export default PackagingCreateComponentsForm;
