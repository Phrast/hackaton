"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/shared/GlassCard";
import { sitesApi } from "@/lib/api/sites";
import { materialsApi } from "@/lib/api/materials";
import type { Material, Site } from "@/types/site";

// Helper: optional number fields — accepts "" from empty HTML inputs without failing validation
const optNum = z.any().transform((v) => {
  if (v === "" || v === undefined || v === null) return undefined;
  const n = Number(v);
  return isNaN(n) ? undefined : n;
});

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default("France"),
  surfaceM2: optNum,
  parkingSpaces: optNum,
  employeesCount: optNum,
  workstationsCount: optNum,
  annualEnergyKwh: optNum,
  buildingYear: optNum,
  buildingLifetime: z.any().transform((v) => {
    if (v === "" || v === undefined || v === null) return 50;
    const n = Number(v);
    return isNaN(n) || n < 1 ? 50 : n;
  }),
  materials: z.array(z.object({
    materialId: z.coerce.number().min(1, "Sélectionnez un matériau"),
    quantityKg: z.coerce.number().positive("Quantité positive requise"),
  })).optional(),
});

type FormData = z.infer<typeof schema>;

const STEPS = ["Informations", "Énergie & RH", "Matériaux"];

interface SiteFormProps {
  site?: Site;
}

export function SiteForm({ site }: SiteFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: site ? {
      name: site.name,
      address: site.address ?? "",
      city: site.city ?? "",
      country: site.country,
      surfaceM2: site.surfaceM2 ?? undefined,
      parkingSpaces: site.parkingSpaces ?? undefined,
      employeesCount: site.employeesCount ?? undefined,
      workstationsCount: site.workstationsCount ?? undefined,
      annualEnergyKwh: site.annualEnergyKwh ?? undefined,
      buildingYear: site.buildingYear ?? undefined,
      buildingLifetime: site.buildingLifetime,
      materials: site.materials?.map((m) => ({ materialId: m.materialId, quantityKg: m.quantityKg })),
    } : { buildingLifetime: 50, country: "France" },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "materials" });

  useEffect(() => {
    materialsApi.findAll().then(setMaterials).catch(console.error);
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        materials: data.materials?.filter((m) => m.materialId > 0),
      };
      if (site) {
        await sitesApi.update(site.id, payload);
        toast.success("Site mis à jour !");
      } else {
        const created = await sitesApi.create(payload);
        toast.success("Site créé !");
        router.push(`/sites/${created.id}`);
        return;
      }
      router.push(`/sites/${site.id}`);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const groupedMaterials = materials.reduce<Record<string, Material[]>>((acc, m) => {
    acc[m.category] = [...(acc[m.category] ?? []), m];
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit(onSubmit, (errs) => { console.error("Validation errors:", errs); toast.error("Veuillez corriger les champs invalides"); })} className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                i === step ? "text-primary" : i < step ? "text-accent cursor-pointer" : "text-muted-foreground"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                i < step ? "bg-accent border-accent text-accent-foreground" :
                i === step ? "border-primary text-primary" :
                "border-muted-foreground/30 text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              {s}
            </button>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <GlassCard>
        {/* Step 1 — General info */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Nom du site *</Label>
                <Input placeholder="Capgemini Rennes" className="glass border-border" {...register("name")} />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input placeholder="2 Rue de Châtillon" className="glass border-border" {...register("address")} />
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input placeholder="Rennes" className="glass border-border" {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label>Surface (m²)</Label>
                <Input type="number" placeholder="11771" className="glass border-border" {...register("surfaceM2")} />
                {errors.surfaceM2 && <p className="text-destructive text-xs">{errors.surfaceM2.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Année de construction</Label>
                <Input type="number" placeholder="2000" className="glass border-border" {...register("buildingYear")} />
              </div>
              <div className="space-y-2">
                <Label>Durée de vie du bâtiment (ans)</Label>
                <Input type="number" placeholder="50" className="glass border-border" {...register("buildingLifetime")} />
              </div>
              <div className="space-y-2">
                <Label>Places de parking</Label>
                <Input type="number" placeholder="308" className="glass border-border" {...register("parkingSpaces")} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Energy & HR */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Énergie & Ressources Humaines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Consommation énergétique annuelle (kWh)</Label>
                <Input type="number" placeholder="1840000" className="glass border-border" {...register("annualEnergyKwh")} />
                <p className="text-xs text-muted-foreground">Facteur ADEME : 0.0567 kgCO₂e/kWh</p>
                {errors.annualEnergyKwh && <p className="text-destructive text-xs">{errors.annualEnergyKwh.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Nombre d&apos;employés</Label>
                <Input type="number" placeholder="1800" className="glass border-border" {...register("employeesCount")} />
              </div>
              <div className="space-y-2">
                <Label>Postes de travail</Label>
                <Input type="number" placeholder="1037" className="glass border-border" {...register("workstationsCount")} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Materials */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Matériaux de construction</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ materialId: 0, quantityKg: 0 })}
                className="border-border hover:bg-muted"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Ajoutez les matériaux utilisés pour calculer l&apos;empreinte de construction.
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name={`materials.${index}.materialId`}
                      render={({ field: f }) => (
                        <Select onValueChange={(v) => f.onChange(Number(v))} value={String(f.value || "")}>
                          <SelectTrigger className="glass border-border">
                            <SelectValue placeholder="Sélectionner un matériau" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-border">
                            {Object.entries(groupedMaterials).map(([cat, mats]) => (
                              <div key={cat}>
                                <p className="text-xs text-muted-foreground px-2 py-1 font-semibold">{cat}</p>
                                {mats.map((m) => (
                                  <SelectItem key={m.id} value={String(m.id)}>
                                    {m.name} — {m.emissionFactor} kgCO₂e/{m.unit}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="w-36">
                    <Input
                      type="number"
                      placeholder="Quantité (kg)"
                      className="glass border-border"
                      {...register(`materials.${index}.quantityKg`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => step === 0 ? router.back() : setStep(step - 1)}
          className="border-border hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {step === 0 ? "Annuler" : "Précédent"}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={() => setStep(step + 1)}
            className="bg-primary hover:bg-primary/90"
          >
            Suivant <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {site ? "Mettre à jour" : "Créer le site"}
          </Button>
        )}
      </div>
    </form>
  );
}
