import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

export interface PackagingCreateInfoValues {
   name: string;
   internalCode: string;
   gtin: string;
   weight: string;
   ppwrLevel: string;
   materialsInput: string;
   assemblyCountries: string[];
   salesCountries: string[];
}

interface PackagingCreateInfoFormProps {
   t: (key: string) => string;
   values: PackagingCreateInfoValues;
   onChange: (field: keyof PackagingCreateInfoValues, value: string) => void;
   onCountriesChange: (
      field: "assemblyCountries" | "salesCountries",
      countries: string[]
   ) => void;
}

const COUNTRIES = [
   { code: "DE", name: "Germany", flag: "bg-red-500" },
   { code: "FR", name: "France", flag: "bg-blue-500" },
   { code: "IT", name: "Italy", flag: "bg-green-500" },
   { code: "ES", name: "Spain", flag: "bg-yellow-500" },
   { code: "GB", name: "United Kingdom", flag: "bg-purple-500" },
   { code: "US", name: "United States", flag: "bg-orange-500" },
   // Add more countries as needed
];

const PackagingCreateInfoForm: React.FC<PackagingCreateInfoFormProps> = ({
   t,
   values,
   onChange,
   onCountriesChange,
}) => {
   const [assemblyCountrySearch, setAssemblyCountrySearch] = useState("");
   const [salesCountrySearch, setSalesCountrySearch] = useState("");

   const filteredAssemblyCountries = COUNTRIES.filter(
      (country) =>
         country.name
            .toLowerCase()
            .includes(assemblyCountrySearch.toLowerCase()) ||
         country.code
            .toLowerCase()
            .includes(assemblyCountrySearch.toLowerCase())
   );

   const filteredSalesCountries = COUNTRIES.filter(
      (country) =>
         country.name
            .toLowerCase()
            .includes(salesCountrySearch.toLowerCase()) ||
         country.code.toLowerCase().includes(salesCountrySearch.toLowerCase())
   );

   const removeCountry = (
      field: "assemblyCountries" | "salesCountries",
      countryToRemove: string
   ) => {
      const currentCountries = values[field];
      onCountriesChange(
         field,
         currentCountries.filter((country) => country !== countryToRemove)
      );
   };

   const addCountry = (
      field: "assemblyCountries" | "salesCountries",
      countryToAdd: string
   ) => {
      const currentCountries = values[field];
      if (!currentCountries.includes(countryToAdd)) {
         onCountriesChange(field, [...currentCountries, countryToAdd]);
      }
   };

   return (
      <Card className="border-none shadow-none">
         <CardHeader>
            <CardTitle>{t("information.basic")}</CardTitle>
         </CardHeader>
         <CardContent className="border-none">
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <Label htmlFor="designation">{t("information.name")}</Label>
                  <Input
                     id="designation"
                     value={values.name}
                     onChange={(e) => onChange("name", e.target.value)}
                     className="mt-1"
                     placeholder="z.B. Becher mit Siegel"
                  />
               </div>
               <div>
                  <Label htmlFor="internal-code">
                     {t("information.internalCode")}
                  </Label>
                  <Input
                     id="internal-code"
                     value={values.internalCode}
                     onChange={(e) => onChange("internalCode", e.target.value)}
                     className="mt-1"
                     placeholder="z.B. FL10232"
                  />
               </div>
               <div>
                  <Label htmlFor="gtin">{t("information.gtin")}</Label>
                  <Input
                     id="gtin"
                     value={values.gtin}
                     onChange={(e) => onChange("gtin", e.target.value)}
                     className="mt-1"
                     placeholder="FL10232"
                  />
               </div>
               <div>
                  <Label htmlFor="assembly">
                     {t("information.assemblyCountry")}
                  </Label>
                  <Popover>
                     <PopoverTrigger asChild>
                        <div className="relative mt-1">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                           <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2 pl-10 cursor-pointer">
                              {values.assemblyCountries.map((country) => {
                                 const countryData = COUNTRIES.find(
                                    (c) => c.name === country
                                 );
                                 return (
                                    <Badge
                                       key={country}
                                       variant="secondary"
                                       className="flex items-center gap-1"
                                    >
                                       <span
                                          className={`w-4 h-3 rounded-sm ${countryData?.flag}`}
                                       ></span>
                                       {country}
                                       <button
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             removeCountry(
                                                "assemblyCountries",
                                                country
                                             );
                                          }}
                                          className="ml-1 text-gray-500 hover:text-gray-700"
                                       >
                                          <X className="h-3 w-3" />
                                       </button>
                                    </Badge>
                                 );
                              })}
                           </div>
                        </div>
                     </PopoverTrigger>
                     <PopoverContent className="w-[calc(100%-2.5rem)] p-0">
                        <Command>
                           <CommandInput
                              placeholder="Search countries..."
                              value={assemblyCountrySearch}
                              onValueChange={setAssemblyCountrySearch}
                           />
                           <CommandList>
                              <CommandEmpty>No countries found.</CommandEmpty>
                              <CommandGroup>
                                 {filteredAssemblyCountries.map((country) => (
                                    <CommandItem
                                       key={country.code}
                                       value={country.name}
                                       onSelect={() =>
                                          addCountry(
                                             "assemblyCountries",
                                             country.name
                                          )
                                       }
                                    >
                                       <div className="flex items-center gap-2">
                                          <span
                                             className={`w-4 h-3 rounded-sm ${country.flag}`}
                                          ></span>
                                          {country.name} ({country.code})
                                       </div>
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
               </div>
               <div>
                  <Label htmlFor="sales-countries">
                     {t("information.salesCountries")}
                  </Label>
                  <Popover>
                     <PopoverTrigger asChild>
                        <div className="relative mt-1">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                           <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2 pl-10 cursor-pointer">
                              {values.salesCountries.map((country) => {
                                 const countryData = COUNTRIES.find(
                                    (c) => c.name === country
                                 );
                                 return (
                                    <Badge
                                       key={country}
                                       variant="secondary"
                                       className="flex items-center gap-1"
                                    >
                                       <span
                                          className={`w-4 h-3 rounded-sm ${countryData?.flag}`}
                                       ></span>
                                       {country}
                                       <button
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             removeCountry(
                                                "salesCountries",
                                                country
                                             );
                                          }}
                                          className="ml-1 text-gray-500 hover:text-gray-700"
                                       >
                                          <X className="h-3 w-3" />
                                       </button>
                                    </Badge>
                                 );
                              })}
                           </div>
                        </div>
                     </PopoverTrigger>
                     <PopoverContent className="w-[calc(100%-2.5rem)] p-0">
                        <Command>
                           <CommandInput
                              placeholder="Search countries..."
                              value={salesCountrySearch}
                              onValueChange={setSalesCountrySearch}
                           />
                           <CommandList>
                              <CommandEmpty>No countries found.</CommandEmpty>
                              <CommandGroup>
                                 {filteredSalesCountries.map((country) => (
                                    <CommandItem
                                       key={country.code}
                                       value={country.name}
                                       onSelect={() =>
                                          addCountry(
                                             "salesCountries",
                                             country.name
                                          )
                                       }
                                    >
                                       <div className="flex items-center gap-2">
                                          <span
                                             className={`w-4 h-3 rounded-sm ${country.flag}`}
                                          ></span>
                                          {country.name} ({country.code})
                                       </div>
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};

export default PackagingCreateInfoForm;
